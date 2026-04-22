import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Lock, Shield, Eye, EyeOff } from "lucide-react";
import { useSetting } from "../../ContentApi/SettingContext";
import { useToast } from "../../ContentApi/ToastContext";

const SecurityTab = () => {
  const { showToast } = useToast();

  const {
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    changePasswordMutation,
  } = useSetting();

  // State for password visibility
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (oldPassword && newPassword && confirmPassword) {
      if (newPassword === confirmPassword) {
        changePasswordMutation.mutate();
      } else {
        showToast("Passwords do not match", "error");
      }
    } else {
      showToast("All fields are required", "error");
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Change Password Card */}
      <Card className="border-border dark:border-white/5 bg-background/50 backdrop-blur-sm shadow-sm overflow-hidden">
        <CardHeader className="relative overflow-hidden border-b border-border dark:border-white/5 p-6">
          <div className="absolute inset-0 bg-muted/20 dark:bg-neutral-900/40" />
          <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[140%] bg-primary/10 dark:bg-primary/5 blur-[40px] -rotate-12 rounded-full" />
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }} />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-2.5 rounded-2xl bg-background dark:bg-black border border-border dark:border-white/10 shadow-sm shadow-primary/5">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-black font-satoshi uppercase tracking-tight text-foreground">Access Protocol</CardTitle>
              <CardDescription className="text-[10px] font-black font-satoshi uppercase tracking-[0.2em] text-muted-foreground/60 mt-1">
                Security architecture & encryption rotation.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit}>
            <FieldGroup className="space-y-8">
              {/* Old Password Field */}
              <Field className="space-y-3">
                <FieldLabel htmlFor="old-password" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Current Secret</FieldLabel>
                <div className="relative group/input">
                  <Input
                    id="old-password"
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="h-12 pr-12 rounded-xl border-border dark:border-white/10 bg-muted/20 dark:bg-white/5 focus-visible:ring-primary focus-visible:bg-background transition-all font-inter font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
                  >
                    {showOldPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </Field>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-border dark:border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 bg-transparent">
                  <span className="bg-background px-4">New Credentials</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* New Password Field */}
                <Field className="space-y-3">
                  <FieldLabel htmlFor="new-password" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">New Secret</FieldLabel>
                  <div className="relative group/input">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="h-12 pr-12 rounded-xl border-border dark:border-white/10 bg-muted/20 dark:bg-white/5 focus-visible:ring-primary focus-visible:bg-background transition-all font-inter font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </Field>

                {/* Confirm Password Field */}
                <Field className="space-y-3">
                  <FieldLabel htmlFor="confirm-password" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Verify New Secret</FieldLabel>
                  <div className="relative group/input">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="h-12 pr-12 rounded-xl border-border dark:border-white/10 bg-muted/20 dark:bg-white/5 focus-visible:ring-primary focus-visible:bg-background transition-all font-inter font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </Field>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 mt-6">
                <Button type="button" variant="ghost" className="rounded-full px-6 font-bold text-xs">
                  Discard
                </Button>
                <Button type="submit" className="rounded-full px-8 h-12 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">
                    Rotate Password
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {/* Security Info Card */}
      <Card className="border-primary/20 bg-primary/5 dark:bg-white/5 overflow-hidden relative group/tips">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/tips:opacity-10 transition-opacity">
            <Shield size={120} />
        </div>
        <CardContent className="pt-8">
          <div className="flex gap-6 relative z-10">
            <div className="p-3 rounded-2xl bg-primary/10 h-fit">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-black font-satoshi uppercase tracking-tight text-lg mb-4">Integrity Guidelines</h3>
              <ul className="text-xs font-medium text-muted-foreground/80 space-y-3 font-inter">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-black">•</span>
                  Construct a high-entropy secret using multi-character archetypes.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-black">•</span>
                  Avoid credential reuse across distinct platform nodes.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-black">•</span>
                  Periodic rotation ensures dynamic account defense.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-black">•</span>
                  Credentials should remain private and encrypted in transit.
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityTab;
