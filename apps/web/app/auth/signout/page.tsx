import { redirect } from "next/navigation";

export default async function SignOutPage() {
  // Authentication disabled for demo
  // await signOut({ redirectTo: "/" });
  redirect("/");
}
