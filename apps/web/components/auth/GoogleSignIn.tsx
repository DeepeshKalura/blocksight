"use client";

// import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function GoogleSignIn() {
  // Authentication disabled for demo
  // const { data: session } = useSession();

  // if (session) {
  //     return (
  //         <div className="flex items-center gap-4">
  //             <span className="text-sm text-muted-foreground hidden md:inline-block">
  //                 {session.user?.name}
  //             </span>
  //             <Button variant="outline" onClick={() => signOut()}>
  //                 Sign Out
  //             </Button>
  //         </div>
  //     );
  // }

  return (
    <Button onClick={() => alert("Authentication disabled for demo version")}>
      Sign in with Google (Demo)
    </Button>
  );
}
