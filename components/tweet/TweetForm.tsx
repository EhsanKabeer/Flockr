"use client";

import { useState, useRef } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { useCreateTweet } from "@/hooks/useTweets";
import { useAuth } from "@/hooks/useAuth";
import { validateTweet } from "@/lib/validation";
import { uploadTweetImage } from "@/lib/firebase/storage";
import toast from "react-hot-toast";

export default function TweetForm() {
  const { user } = useAuth();
  const { create, isLoading } = useCreateTweet();
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateTweet(content);
    if (!validation.valid) {
      toast.error(validation.error || "Invalid tweet");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to tweet");
      return;
    }

    let imageUrl: string | undefined;
    if (imageFile) {
      try {
        imageUrl = await uploadTweetImage(user.id, imageFile);
      } catch (error) {
        toast.error("Failed to upload image");
        return;
      }
    }

    await create(content, user.id, imageUrl);
    setContent("");
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const characterCount = content.length;
  const remainingChars = 280 - characterCount;

  return (
    <div className="border-b border-border p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <Avatar
            src={user?.avatar}
            alt={user?.displayName || "User"}
            size="md"
          />
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              className="w-full bg-transparent text-foreground placeholder:text-foreground-muted resize-none focus:outline-none text-xl min-h-[120px]"
              maxLength={280}
            />
            {imagePreview && (
              <div className="relative mt-4 rounded-2xl overflow-hidden border border-border">
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors z-10"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            )}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full hover:bg-background-hover transition-colors text-accent"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-sm ${
                    remainingChars < 20 ? "text-error" : "text-foreground-muted"
                  }`}
                >
                  {characterCount}/280
                </span>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                  disabled={!content.trim() || isLoading}
                >
                  Tweet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

