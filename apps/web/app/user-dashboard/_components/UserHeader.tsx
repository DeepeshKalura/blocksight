import { User } from "next-auth";
import { SignOutButton } from "./SignOutButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface UserHeaderProps {
  user: User;
}

export function UserHeader({ user }: UserHeaderProps) {
  return (
    <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-bold">
            BlockSight
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/user-dashboard"
              className="hover:text-gray-300 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/dapp"
              className="hover:text-gray-300 transition-colors"
            >
              Explore dApps
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {user.image && (
              <img
                src={user.image}
                alt={user.name || "User avatar"}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-sm">{user.name || user.email}</span>
          </div>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
