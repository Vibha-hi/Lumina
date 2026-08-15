import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2 } from "lucide-react";
import { apiFeedback } from "@/lib/api";
import { useSession } from "@/lib/session";

interface FeedbackDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackDialog({ isOpen, onOpenChange }: FeedbackDialogProps) {
  const { user } = useSession();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.length < 10) return;
    setStatus("sending");
    try {
      await apiFeedback(name || "Anonymous", email || "no-email@example.com", message);
      setStatus("sent");
      setMessage("");
      setTimeout(() => {
        setStatus("idle");
        onOpenChange(false);
      }, 2000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass-strong border-glass-border">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>Help us improve LUMINA.AI.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fb-name">Name</Label>
              <Input
                id="fb-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="bg-background/40 border-glass-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fb-email">Email</Label>
              <Input
                id="fb-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-background/40 border-glass-border"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              required
              minLength={10}
              maxLength={2000}
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What do you think about LUMINA.AI? Any features you'd love to see?"
              className="w-full resize-none rounded-xl bg-background/40 border border-glass-border p-4 text-sm outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 transition-all"
            />
            <div className="text-right text-xs text-muted-foreground mt-1">
              {message.length}/2000
            </div>
          </div>
          <Button
            type="submit"
            disabled={status === "sending" || status === "sent" || message.length < 10}
            className="w-full"
          >
            {status === "sending" && (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Sending...
              </>
            )}
            {status === "sent" && (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" /> Thank you!
              </>
            )}
            {status === "error" && "Something went wrong. Try again."}
            {status === "idle" && (
              <>
                <Send className="h-4 w-4 mr-2" /> Send Feedback
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
