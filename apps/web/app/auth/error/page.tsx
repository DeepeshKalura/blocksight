import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams.error;

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You are not authorized to access this page.",
    Verification: "The verification token is invalid or has expired.",
    Default: "An authentication error occurred. Please try again.",
  };

  const errorMessage = errorMessages[error || ""] || errorMessages.Default;

  return (
    <main className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold tracking-tight text-red-500">
            Authentication Error
          </h1>
          <p className="mt-2 text-sm text-gray-400">{errorMessage}</p>
        </div>

        <div className="flex flex-col gap-4">
          <Button asChild className="w-full">
            <Link href="/auth/signin">Try Again</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
