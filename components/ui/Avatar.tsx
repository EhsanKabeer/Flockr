"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
}

export default function Avatar({
  src,
  alt = "Avatar",
  size = "md",
  className,
  onClick,
}: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-20 h-20",
  };

  const placeholder = (
    <div
      className={cn(
        "rounded-full bg-background-card border border-border",
        "flex items-center justify-center",
        "text-foreground-muted font-medium",
        sizes[size],
        onClick && "cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
      onClick={onClick}
    >
      {alt?.[0]?.toUpperCase() || "?"}
    </div>
  );

  if (!src) {
    return placeholder;
  }

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden",
        sizes[size],
        onClick && "cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
      onClick={onClick}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={size === "sm" ? "32px" : size === "md" ? "40px" : size === "lg" ? "48px" : "80px"}
      />
    </div>
  );
}

