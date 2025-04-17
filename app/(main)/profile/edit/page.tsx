"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { updateUser, getUsers } from "@/lib/firebase/firestore";
import { where } from "firebase/firestore";
import { uploadAvatar } from "@/lib/firebase/storage";
import { validateDisplayName, validateBio, validateUsername } from "@/lib/validation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Avatar from "@/components/ui/Avatar";
import Loading from "@/components/ui/Loading";
import toast from "react-hot-toast";
import { Image as ImageIcon, X } from "lucide-react";

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    bio: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    displayName?: string;
    username?: string;
    bio?: string;
  }>({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        username: user.username || "",
        bio: user.bio || "",
      });
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    const newErrors: typeof errors = {};
    if (!validateDisplayName(formData.displayName)) {
      newErrors.displayName = "Display name must be 1-50 characters";
    }
    if (!validateUsername(formData.username)) {
      newErrors.username = "Username must be 3-20 characters (letters, numbers, underscore)";
    }
    if (formData.bio && !validateBio(formData.bio)) {
      newErrors.bio = "Bio must be 160 characters or less";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const trimmedUsername = formData.username.trim();
    const existingWithUsername = await getUsers([where("username", "==", trimmedUsername)]);
    const takenByOther = existingWithUsername.some((u) => u.id !== user.id);
    if (takenByOther) {
      setErrors((prev) => ({
        ...prev,
        username: "This username is already taken.",
      }));
      toast.error("This username is already taken. Please choose another.");
      return;
    }

    setIsLoading(true);
    try {
      let avatarUrl = user.avatar;
      if (avatarFile) {
        avatarUrl = await uploadAvatar(user.id, avatarFile);
      }

      await updateUser(user.id, {
        displayName: formData.displayName.trim(),
        username: trimmedUsername,
        bio: formData.bio.trim(),
        avatar: avatarUrl,
      });

      toast.success("Profile updated successfully!");
      router.push(`/profile/${user.id}`);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading size="lg" text="Loading..." />
      </div>
    );
  }

  if (!session || !user) {
    return null;
  }

  return (
    <div className="min-h-screen max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar
              src={avatarPreview || user.avatar}
              alt={formData.displayName || "User"}
              size="xl"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 p-2 bg-accent rounded-full cursor-pointer hover:bg-accent-hover transition-colors"
            >
              <ImageIcon className="w-5 h-5 text-white" />
            </label>
          </div>
          {avatarPreview && avatarPreview !== user.avatar && (
            <button
              type="button"
              onClick={() => {
                setAvatarFile(null);
                setAvatarPreview(user.avatar || null);
              }}
              className="p-2 rounded-full hover:bg-background-hover transition-colors"
            >
              <X className="w-5 h-5 text-foreground-muted" />
            </button>
          )}
        </div>

        <Input
          label="Display Name"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          error={errors.displayName}
          required
        />

        <Input
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          required
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            maxLength={160}
            className="w-full px-4 py-3 bg-background-card border border-border rounded-lg text-foreground placeholder:text-foreground-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
            placeholder="Tell us about yourself"
          />
          {errors.bio && <p className="mt-1 text-sm text-error">{errors.bio}</p>}
          <p className="mt-1 text-sm text-foreground-muted">
            {formData.bio.length}/160
          </p>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}

