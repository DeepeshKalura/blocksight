"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addDapp(prevState: {}, formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be signed in to add a dApp" };
  }

  const contractAddress = formData.get("contractAddress") as string;
  const chain = (formData.get("chain") as string) || "ethereum";

  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3001";
    const response = await fetch(`${baseUrl}/api/indexing/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contractAddress, chain }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Failed to add dApp" };
    }

    revalidatePath("/user-dashboard");
    return { success: "dApp added successfully! Indexing will begin shortly." };
  } catch (error) {
    console.error("Error adding dApp:", error);
    return { error: "Failed to add dApp. Please try again." };
  }
}
