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

const ProfileTab = () => {
  const { user } = useGlobal();

  // Profile form state (no functionality)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAccountDetailsSubmit = (e) => {
    e.preventDefault();
    // TODO: Add update account details functionality
    console.log("Update account details");
  };

  const handleAvatarSubmit = (e) => {
    e.preventDefault();
    // TODO: Add update avatar functionality
    console.log("Update avatar");
  };

  const handleCoverImageSubmit = (e) => {
    e.preventDefault();
    // TODO: Add update cover image functionality
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
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditingAvatar(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => console.log("Upload avatar")}
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
            <div className="space-y-6">
              {/* Full Name Field */}
              <div className="space-y-3">
                <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                <div className="flex gap-3">
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="flex-1"
                  />
                  <Button
                    onClick={() => console.log("Save full name")}
                    className="shrink-0 rounded-full"
                  >
                    Save
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Email Field */}
              <div className="space-y-3">
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <div className="flex gap-3">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1"
                  />
                  <Button
                    onClick={() => console.log("Save email")}
                    className="shrink-0 rounded-full"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
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
