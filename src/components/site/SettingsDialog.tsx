import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/session";
import { apiUpdateProfile, apiDeleteAccount, apiLogout } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ isOpen, onOpenChange }: SettingsDialogProps) {
  const { user } = useSession();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const [editName, setEditName] = useState(user?.name || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    apiLogout();
    navigate({ to: "/auth", replace: true });
  };

  const handleUpdateProfile = async () => {
    try {
      setIsUpdatingProfile(true);
      await apiUpdateProfile(editName, user?.email || "");
      toast.success("Profile updated successfully");
      qc.invalidateQueries({ queryKey: ["profile"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
    try {
      setIsDeletingAccount(true);
      await apiDeleteAccount();
      toast.success("Account deleted successfully");
      signOut();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete account");
      setIsDeletingAccount(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass-strong border-glass-border">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your account settings and preferences.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="account" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-background/40 border-glass-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-background/40 border-glass-border opacity-50 cursor-not-allowed"
              />
            </div>
            <div className="pt-4 flex flex-col gap-4">
              <Button
                onClick={handleUpdateProfile}
                disabled={
                  isUpdatingProfile || editName === user?.name
                }
                className="w-full"
              >
                {isUpdatingProfile ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
              <div className="border-t border-glass-border pt-4">
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-danger mb-2">Danger Zone</h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={isDeletingAccount}
                    className="w-full"
                  >
                    {isDeletingAccount ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
