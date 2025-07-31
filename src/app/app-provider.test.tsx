import { render, screen } from "@testing-library/react";

import AppProvider from "./app-provider";

jest.mock("@/lib/apollo-client", () => ({
  __esModule: true,
  default: {},
}));

jest.mock("@apollo/client", () => ({
  ApolloProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="apollo-provider">{children}</div>
  ),
}));

describe("AppProvider", () => {
  it("renders ApolloProvider with children", () => {
    render(
      <AppProvider>
        <div data-testid="child">Test Child</div>
      </AppProvider>
    );

    expect(screen.getByTestId("apollo-provider")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
