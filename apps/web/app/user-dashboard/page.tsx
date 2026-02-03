// DEPRECATED: User dashboard functionality has been moved to /app/dapp/
// Redirecting to the new dApp page with integrated authentication.

import { redirect } from "next/navigation";

export default async function UserDashboardPage() {
  redirect("/dapp");
}
