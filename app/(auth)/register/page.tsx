"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { validateEmail, validatePassword, validateUsername } from "@/lib/validation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    displayName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    username?: string;
    displayName?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: typeof errors = {};
    if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!validateUsername(formData.username)) {
      newErrors.username = "Username must be 3-20 characters (letters, numbers, underscore)";
    }
    if (!formData.displayName || formData.displayName.trim().length === 0) {
      newErrors.displayName = "Display name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/7d00b7e7-12c8-44ec-ac26-295d2b890d65', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': '7d56e5',
      },
      body: JSON.stringify({
        sessionId: '7d56e5',
        runId: 'signup-run-1',
        hypothesisId: 'H1',
        location: 'app/(auth)/register/page.tsx:handleSubmit:beforeSignIn',
        message: 'Register submit passed client validation',
        data: {
          hasEmail: !!formData.email,
          hasPassword: !!formData.password,
          hasUsername: !!formData.username,
          hasDisplayName: !!formData.displayName,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        username: formData.username,
        isSignUp: true,
        redirect: false,
      });

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/7d00b7e7-12c8-44ec-ac26-295d2b890d65', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': '7d56e5',
        },
        body: JSON.stringify({
          sessionId: '7d56e5',
          runId: 'signup-run-1',
          hypothesisId: 'H2',
          location: 'app/(auth)/register/page.tsx:handleSubmit:afterSignIn',
          message: 'Result from credentials signIn',
          data: {
            hasResult: !!result,
            hasError: !!result?.error,
            ok: (result as any)?.ok ?? null,
            status: (result as any)?.status ?? null,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion agent log

      if (result?.error) {
        const raw = result.error;
        let message = raw || "Failed to create account";

        if (raw?.includes("EMAIL_EXISTS")) {
          message =
            "An account with this email already exists. Please sign in instead.";
          setErrors((prev) => ({
            ...prev,
            email: "This email is already registered. Try signing in instead.",
          }));
        } else if (raw?.includes("USERNAME_TAKEN")) {
          message = "This username is already taken. Please choose another.";
          setErrors((prev) => ({
            ...prev,
            username: "This username is already taken.",
          }));
        } else if (raw?.includes("WEAK_PASSWORD")) {
          message = "Password is too weak. Please choose a stronger password.";
          setErrors((prev) => ({
            ...prev,
            password: "Password is too weak.",
          }));
        }

        toast.error(message);
      } else {
        toast.success("Account created successfully!");
        router.push("/home");
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/home" });
    } catch (error) {
      toast.error("Failed to sign in with Google");
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="glass rounded-2xl p-8 shadow-glass">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Flockr</h1>
          <p className="text-foreground-muted">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Display Name"
            name="displayName"
            type="text"
            placeholder="Enter your display name"
            value={formData.displayName}
            onChange={handleChange}
            error={errors.displayName}
            required
          />

          <Input
            label="Username"
            name="username"
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full"
          >
            Sign Up
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-background text-foreground-muted">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handleGoogleSignIn}
          className="w-full"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign up with Google
        </Button>

        <div className="mt-6 text-center">
          <p className="text-foreground-muted text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:text-accent-hover font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

