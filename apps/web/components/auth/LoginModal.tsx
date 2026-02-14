"use client";

import { useState } from "react";
// import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, Chrome } from "lucide-react";

interface LoginModalProps {
  onClose?: () => void;
  redirectTo?: string;
}

export function LoginModal({ onClose, redirectTo = "/dapp" }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Authentication disabled for demo
      // await signIn("google", { callbackUrl: redirectTo });
      alert("Authentication disabled for demo version");
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // For now, just show demo with Google
    // In future, implement email magic link
    setTimeout(() => {
      setIsLoading(false);
      alert("Email login coming soon! Please use Google sign-in for now.");
    }, 333);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black border-accent/30">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center text-white">
          Welcome to BlockSight
        </CardTitle>
        <CardDescription className="text-center text-gray-400">
          Sign in to access your dApp analytics dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Google Sign In Button */}
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={handleGoogleSignIn}
          className="w-full bg-transparent hover:bg-accent/10 text-white border-accent/50 hover:border-accent"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Chrome className="mr-2 h-4 w-4" />
          )}
          Continue with Google
        </Button>

        <Separator className="my-4 bg-accent/30" />

        {/* Email Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-900 border-accent/30 text-white placeholder:text-gray-500"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground border-accent"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue with Email
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <p className="text-xs text-center text-gray-500 px-8">
          By clicking continue, you agree to our{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </a>
          .
        </p>
        <p className="text-xs text-center text-gray-500">
          Demo accounts have limited access to sample dApp data
        </p>
      </CardFooter>
    </Card>
  );
}
