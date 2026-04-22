import React, { useState, useEffect } from "react";
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
import {
  User,
  Image,
  ImagePlus,
  Upload,
  Pencil,
  ScissorsSquareDashedBottom,
} from "lucide-react";
import { useGlobal } from "../../ContentApi/GlobalContext";
import { useSetting } from "../../ContentApi/SettingContext";
import { useToast } from "../../ContentApi/ToastContext";

const ProfileTab = () => {
  const { showToast } = useToast();
  const { user } = useGlobal();
  const { updateUser, updateAvatar, updateCoverImage } = useSetting();

  // Profile form state (no functionality)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarFileSizeError, setAvatarFileSizeError] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImageFileSizeError, setCoverImageFileSizeError] = useState(false);
  // Edit mode states
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isEditingCover, setIsEditingCover] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setAvatarPreview(user.avatar || null);
      setCoverImagePreview(user.coverImage || null);
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 8MB)
      const maxSize = 8 * 1024 * 1024; // 8MB in bytes
      if (file.size >= maxSize) {
        setAvatarFileSizeError(true);
        setAvatarFile(null);
        return;
      }

      setAvatarFileSizeError(false);
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 8 * 1024 * 1024;
      if (file.size > maxSize) {
        setCoverImageFileSizeError(true);
        return;
      }
      setCoverImageFileSizeError(false);
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAccountDetailsSubmit = (e) => {
    e.preventDefault();
    updateUser({ fullName, email });
  };

  const handleAvatarSubmit = async (e) => {
    e.preventDefault();

    if (!avatarFile) {
      showToast("No avatar file selected", "error");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      await updateAvatar(formData);
      // Clear the file state after successful upload
      setAvatarFile(null);
      setIsEditingAvatar(false);
    } catch (error) {
      console.error("Failed to update avatar:", error);
    }
  };

  const handleCoverImageSubmit = async (e) => {
    e.preventDefault();

    if (!coverImageFile) {
      showToast("No cover image file selected", "error");
      return;
    }

    const formData = new FormData();
    formData.append("coverImage", coverImageFile);

    try {
      await updateCoverImage(formData);
      // Clear the file state after successful upload
      setCoverImageFile(null);
      setIsEditingCover(false);
    } catch (error) {
      console.error("Failed to update cover image:", error);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Profile Picture and Account Details - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
        {/* Update Avatar Card - Square on Left */}
        <Card className="border-border dark:border-white/5 bg-background/50 backdrop-blur-sm shadow-sm overflow-hidden">
          <CardHeader className="relative overflow-hidden border-b border-border dark:border-white/5 p-6">
            <div className="absolute inset-0 bg-muted/20 dark:bg-neutral-900/40" />
            <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[140%] bg-primary/10 dark:bg-primary/5 blur-[40px] rotate-12 rounded-full" />
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }} />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-2.5 rounded-2xl bg-background dark:bg-black border border-border dark:border-white/10 shadow-sm shadow-primary/5">
                <Image className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-black font-satoshi uppercase tracking-tight text-foreground">Identity</CardTitle>
                <div className="h-0.5 w-8 bg-primary mt-1 rounded-full opacity-50" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="flex flex-col items-center gap-6">
              {/* Avatar Preview */}
              <div className="w-40 h-40 rounded-full bg-muted/50 dark:bg-white/5 flex items-center justify-center overflow-hidden border-2 border-border dark:border-white/10 shrink-0 shadow-inner group/avatar relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
                  />
                ) : (
                  <User className="w-20 h-20 text-muted-foreground/30" />
                )}
              </div>

              {!isEditingAvatar ? (
                <div className="flex flex-col gap-3 w-full">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-center">
                    Public Avatar
                  </p>
                  <Button
                    onClick={() => setIsEditingAvatar(true)}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 rounded-full border-border dark:border-white/10 hover:bg-muted/50 dark:hover:bg-white/5 transition-all"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Change Photo</span>
                  </Button>
                </div>
              ) : (
                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="avatar" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Source</FieldLabel>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="cursor-pointer file:bg-primary file:text-primary-foreground file:font-bold file:px-3 file:py-1 file:rounded file:mr-3 rounded-xl border-border dark:border-white/10 h-12"
                    />
                    <p className="text-[10px] text-muted-foreground/60 italic">
                      Optimal: Square, 800x800px+
                    </p>
                    {avatarFileSizeError && (
                      <p className="text-xs text-destructive mt-1 font-bold">
                        Limit: 8MB exceeded
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setIsEditingAvatar(false);
                        setAvatarFileSizeError(false);
                      }}
                      className="flex-1 rounded-full text-xs font-bold"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={(e) => handleAvatarSubmit(e)}
                      disabled={!avatarFile || avatarFileSizeError}
                      className="flex-1 rounded-full text-xs font-black font-satoshi uppercase tracking-widest shadow-lg shadow-primary/20"
                    >
                      <Upload className="w-3 h-3 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Update Account Details Card - Takes Remaining Width */}
        <Card className="border-border dark:border-white/5 bg-background/50 backdrop-blur-sm shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="relative overflow-hidden border-b border-border dark:border-white/5 p-6">
            <div className="absolute inset-0 bg-muted/20 dark:bg-neutral-900/40" />
            <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[140%] bg-primary/10 dark:bg-primary/5 blur-[40px] -rotate-12 rounded-full" />
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }} />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-2.5 rounded-2xl bg-background dark:bg-black border border-border dark:border-white/10 shadow-sm shadow-primary/5">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-black font-satoshi uppercase tracking-tight text-foreground">Account Parameters</CardTitle>
                <CardDescription className="text-[10px] font-black font-satoshi uppercase tracking-[0.2em] text-muted-foreground/60 mt-1">
                  Core identification architecture.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 flex-1">
            <form onSubmit={handleAccountDetailsSubmit} className="space-y-8 h-full flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Full Name Field */}
                <div className="space-y-3">
                  <FieldLabel htmlFor="fullName" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Real Name</FieldLabel>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="h-12 rounded-xl border-border dark:border-white/10 bg-muted/20 dark:bg-white/5 focus-visible:ring-primary focus-visible:bg-background font-inter font-medium"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-3">
                  <FieldLabel htmlFor="email" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Contact Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="h-12 rounded-xl border-border dark:border-white/10 bg-muted/20 dark:bg-white/5 focus-visible:ring-primary focus-visible:bg-background font-inter font-medium"
                  />
                </div>
              </div>

              {/* Common Save Button */}
              <div className="mt-auto pt-8 flex justify-end">
                <Button type="submit" className="rounded-full px-8 h-12 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">
                  Update Registry
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Update Cover Image Card */}
      <Card className="border-border dark:border-white/5 bg-background/50 backdrop-blur-sm shadow-sm overflow-hidden">
        <CardHeader className="relative overflow-hidden border-b border-border dark:border-white/5 p-6">
          <div className="absolute inset-0 bg-muted/20 dark:bg-neutral-900/40" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[140%] bg-primary/10 dark:bg-primary/5 blur-[40px] rotate-[30deg] rounded-full" />
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px' }} />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-2.5 rounded-2xl bg-background dark:bg-black border border-border dark:border-white/10 shadow-sm shadow-primary/5">
              <ImagePlus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-black font-satoshi uppercase tracking-tight text-foreground">Channel Canvas</CardTitle>
              <CardDescription className="text-[10px] font-black font-satoshi uppercase tracking-[0.2em] text-muted-foreground/60 mt-1">
                Global header visual architecture.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="space-y-6">
            {/* Cover Image Preview */}
            <div className="w-full h-48 rounded-2xl bg-muted/50 dark:bg-white/5 flex items-center justify-center overflow-hidden border-2 border-border dark:border-white/10 group/cover relative shadow-inner">
              {coverImagePreview ? (
                <img
                  src={coverImagePreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/cover:scale-105"
                />
              ) : (
                <div className="text-center p-10 border-2 border-dashed border-border dark:border-white/10 rounded-xl">
                  <ImagePlus className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                    Background Undefined
                  </p>
                </div>
              )}
            </div>

            {!isEditingCover ? (
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Dimensions</p>
                  <p className="text-xs font-medium text-muted-foreground/60 italic">
                    Resolution: 1920x1080px (16:9)
                  </p>
                </div>
                <Button
                  onClick={() => setIsEditingCover(true)}
                  variant="outline"
                  className="flex items-center gap-2 rounded-full border-border dark:border-white/10 px-6"
                >
                  <Pencil className="w-3 h-3" />
                  <span className="text-xs font-black font-satoshi uppercase tracking-widest">Edit Banner</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                  <div className="space-y-3">
                    <FieldLabel htmlFor="coverImage" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Source</FieldLabel>
                    <Input
                      id="coverImage"
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="cursor-pointer h-12 rounded-xl border-border dark:border-white/10"
                    />
                  </div>
                  <div className="flex justify-end gap-3 h-12">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsEditingCover(false)}
                      className="rounded-full px-6 text-xs font-bold"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={(e) => handleCoverImageSubmit(e)}
                      className="rounded-full px-8 text-xs font-bold shadow-lg shadow-primary/20"
                    >
                      <Upload className="w-3 h-3 mr-2" />
                      Apply Banner
                    </Button>
                  </div>
                </div>
                {coverImageFileSizeError && (
                  <p className="text-xs text-destructive font-bold text-right">
                    Limit: 8MB exceeded
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
