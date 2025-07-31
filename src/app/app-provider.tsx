"use client";

import { ApolloProvider } from "@apollo/client";

import client from "@/lib/apollo-client";
import { AuthProvider } from "@/context/AuthContext/AuthContext";
import { CartProvider } from "@/context/CartContext/CartContext";

type AppProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
