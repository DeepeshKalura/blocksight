import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { LoginModal } from "@/components/auth/LoginModal";
import { IndexingRequestForm } from "@/components/indexing/IndexingRequestForm";
import { IndexingStatus } from "@/components/indexing/IndexingStatus";
import { db } from "@/lib/db";
import { indexingRequests } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { DaoCard } from "./_components/DaoCard";
import { mockDapps } from "./mock-dapp-data";

export default async function DappPage() {
  const session = await auth();

  // If user is not authenticated, show login modal
  if (!session?.user?.id) {
    return (
      <main className="min-h-screen w-full bg-black text-white p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-7xl">
          <header className="flex items-center justify-between py-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Image
                src="/project-logo-nobg.png"
                alt="BlockSight Logo"
                width={40}
                height={40}
              />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Welcome to BlockSight
                </h1>
                <p className="text-sm text-gray-400">
                  Sign in to access dApp analytics
                </p>
              </div>
            </div>
          </header>

          <div className="mt-12 flex flex-col items-center justify-center">
            <div className="w-full max-w-md mb-8">
              <LoginModal />
            </div>

            <div className="mt-12 w-full max-w-4xl">
              <h2 className="text-xl font-semibold mb-4 text-center text-gray-300">
                Demo Preview
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-6 text-center">
                This demo showcases our ability to parse raw blockchain data.
                The following sample dApps have been analyzed.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 opacity-50">
                {mockDapps.slice(0, 2).map((dao) => (
                  <DaoCard key={dao.id} dao={dao} previewMode />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // User is authenticated - check if they have any dApps
  const userDapps = await db
    .select()
    .from(indexingRequests)
    .where(eq(indexingRequests.userId, session.user.id))
    .orderBy(desc(indexingRequests.createdAt));

  // If user has no dApps, show "Add your first dApp" view
  if (userDapps.length === 0) {
    return (
      <main className="min-h-screen w-full bg-black text-white p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-7xl">
          <header className="flex items-center justify-between py-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Image
                src="/project-logo-nobg.png"
                alt="BlockSight Logo"
                width={40}
                height={40}
              />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Welcome, {session.user.name || "User"}!
                </h1>
                <p className="text-sm text-gray-400">
                  Add your first dApp to get started
                </p>
              </div>
            </div>
          </header>

          <div className="mt-12 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl text-center">
              <h2 className="text-2xl font-bold mb-4">No dApps yet</h2>
              <p className="text-gray-400 mb-8">
                You haven't added any dApps for indexing. Add your first dApp
                contract address to start analyzing.
              </p>

              <div className="w-full max-w-2xl mt-6">
                <IndexingRequestForm />
              </div>
            </div>
          </div>

          {/* Show demo dApps below */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-300">
              Demo dApps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockDapps.map((dao) => (
                <DaoCard key={dao.id} dao={dao} />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // User has dApps - show their dApps
  return (
    <main className="min-h-screen w-full bg-black text-white p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-7xl">
        <header className="flex items-center justify-between py-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Image
              src="/project-logo-nobg.png"
              alt="BlockSight Logo"
              width={40}
              height={40}
            />
            <div>
              <h1 className="text-2xl font-bold text-white">Your dApps</h1>
              <p className="text-sm text-gray-400">
                Welcome back, {session.user.name || "User"}!
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            {userDapps.length} dApp{userDapps.length !== 1 ? "s" : ""} tracked
          </div>
        </header>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-6">Your Indexed dApps</h2>
          {userDapps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userDapps.map((dapp) => (
                <div
                  key={dapp.id}
                  className="bg-gray-900 border border-accent/30 rounded-lg p-6"
                >
                  <h3 className="font-medium mb-2 truncate">
                    {dapp.contractAddress}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Status: {dapp.status}
                  </p>
                  <p className="text-xs text-gray-500">
                    Added: {new Date(dapp.createdAt!).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 border border-accent/30 rounded-lg p-8 text-center">
              <p className="text-gray-300 mb-4">
                You haven't indexed any dApps yet
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Use the form below to start indexing a dApp contract
              </p>
              <div className="max-w-md mx-auto">
                <IndexingRequestForm />
              </div>
            </div>
          )}
        </div>

        {/* Show indexing status for all requests */}
        <div className="mt-8">
          <IndexingStatus />
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4 text-center text-gray-300">
            Demo dApps
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6 text-center">
            Explore these sample dApps to see BlockSight's analytics
            capabilities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockDapps.map((dao) => (
              <DaoCard key={dao.id} dao={dao} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
