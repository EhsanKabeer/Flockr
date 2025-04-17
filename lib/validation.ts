export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateTweet = (content: string): { valid: boolean; error?: string } => {
  if (!content.trim()) {
    return { valid: false, error: "Tweet cannot be empty" };
  }
  if (content.length > 280) {
    return { valid: false, error: "Tweet cannot exceed 280 characters" };
  }
  return { valid: true };
};

export const validateDisplayName = (displayName: string): boolean => {
  return displayName.length >= 1 && displayName.length <= 50;
};

export const validateBio = (bio: string): boolean => {
  return bio.length <= 160;
};

