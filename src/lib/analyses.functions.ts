import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const AnalyzeInput = z.object({
  text: z.string().min(4).max(4000),
  platform: z.string().max(40).default("General"),
});

export const analyzePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => AnalyzeInput.parse(input))
  .handler(async ({ data, context }) => {
    const { analyzeWithLumina } = await import("./lumina-ai.server");
    const analysis = await analyzeWithLumina(data.text, data.platform);

    const { data: row, error } = await context.supabase
      .from("analyses")
      .insert({
        user_id: context.userId,
        platform: data.platform,
        input_text: data.text,
        overall_risk: analysis.overall_risk,
        privacy_risk: analysis.privacy_risk,
        professional_risk: analysis.professional_risk,
        misunderstanding_risk: analysis.misunderstanding_risk,
        legal_risk: analysis.legal_risk,
        reach_potential: analysis.reach_potential,
        emotions: analysis.emotions,
        personas: analysis.personas,
        risky_phrases: analysis.risky_phrases,
        rewrite: analysis.rewrite,
        summary: analysis.summary,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { analysis, id: row.id as string };
  });

export const listAnalyses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("analyses")
      .select("id, platform, input_text, overall_risk, summary, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data;
  });

export const deleteAnalysis = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("analyses").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url")
      .eq("id", context.userId)
      .maybeSingle();
    return data;
  });
