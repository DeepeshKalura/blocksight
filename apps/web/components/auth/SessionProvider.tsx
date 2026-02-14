"use client";

import { createContext, useContext } from "react";

const MockSessionContext = createContext({
  data: null,
  status: "unauthenticated",
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MockSessionContext.Provider
      value={{ data: null, status: "unauthenticated" }}
    >
      {children}
    </MockSessionContext.Provider>
  );
}

export function useSession() {
  return useContext(MockSessionContext);
}
