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
import { User, Image, ImagePlus, Upload, Pencil } from "lucide-react";
import { useGlobal } from "../../ContentApi/GlobalContext";
import { useSetting } from "../../ContentApi/SettingContext";

const ProfileTab = () => {
  const { user } = useGlobal();
  const { updateUser, updateAvatar } = useSetting();

  // Profile form state (no functionality)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarFileSizeError, setAvatarFileSizeError] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  
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
      console.error("No avatar file selected");
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

  const handleCoverImageSubmit = (e) => {
    e.preventDefault();
    console.log("Update cover image");
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture and Account Details - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Update Avatar Card - Square on Left */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Image className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Profile Picture</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              {/* Avatar Preview */}
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border shrink-0">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-muted-foreground" />
                )}
              </div>

              {!isEditingAvatar ? (
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-xs text-muted-foreground text-center">
                    Your profile picture is visible to everyone
                  </p>
                  <Button
                    onClick={() => setIsEditingAvatar(true)}
                    variant="outline"
                    className="group relative overflow-hidden transition-all duration-300 w-full flex items-center justify-center gap-2 hover:gap-2 rounded-2xl"
                  >
                    <Pencil className="w-4 h-4" />
                    <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300">
                      Edit
                    </span>
                  </Button>
                </div>
              ) : (
                <div className="w-full space-y-3">
                  <div>
                    <FieldLabel htmlFor="avatar">Choose Image</FieldLabel>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Square image, 400x400px+
                    </p>
                    {avatarFileSizeError && (
                      <p className="text-xs text-red-500 mt-1 font-medium">
                        File size must be less than 8MB
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditingAvatar(false);
                        setAvatarFileSizeError(false);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={(e) => handleAvatarSubmit(e)}
                      disabled={!avatarFile || avatarFileSizeError}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Update Account Details Card - Takes Remaining Width */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>
                  Update your name and email address
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAccountDetailsSubmit} className="space-y-6">
              {/* Full Name Field */}
              <div className="space-y-3">
                <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              {/* Common Save Button */}
              <div className="flex justify-end">
                <Button type="submit" className="rounded-full">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Update Cover Image Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ImagePlus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Cover Image</CardTitle>
              <CardDescription>
                Upload a cover image for your channel
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Cover Image Preview */}
            <div className="w-full h-36 rounded-lg bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
              {coverImagePreview ? (
                <img
                  src={coverImagePreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <ImagePlus className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    No cover image
                  </p>
                </div>
              )}
            </div>

            {!isEditingCover ? (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Recommended: 1920x1080px or 16:9 aspect ratio
                </p>
                <Button
                  onClick={() => setIsEditingCover(true)}
                  variant="outline"
                  className="group relative overflow-hidden transition-all duration-300 hover:pr-12 rounded-2xl"
                >
                  <Pencil className="w-4 h-4" />
                  <span className="absolute right-3 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Edit
                  </span>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <FieldLabel htmlFor="coverImage">Choose Image</FieldLabel>
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended: 1920x1080px or 16:9 aspect ratio
                  </p>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditingCover(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => console.log("Upload cover")}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Cover
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
