import { ApolloProvider } from "@apollo/client";

import client from "@/lib/apollo-client";

type AppProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );
}
