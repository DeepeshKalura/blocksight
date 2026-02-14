"use client";

// import { signOut } from "@/lib/auth";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        // Authentication disabled for demo
        // await signOut({ redirectTo: "/" });
        alert("Sign out disabled for demo version");
      }}
    >
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="text-gray-400 hover:text-white hover:bg-gray-800/50"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out (Demo)
      </Button>
    </form>
  );
}
