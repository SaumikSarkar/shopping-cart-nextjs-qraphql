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

jest.mock("@/context/AuthContext/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}));

jest.mock("@/context/CartContext/CartContext", () => ({
  CartProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cart-provider">{children}</div>
  ),
}));

describe("AppProvider", () => {
  it("renders ApolloProvider, AuthProvider, CartProvider with children", () => {
    render(
      <AppProvider>
        <div data-testid="child">Test Child</div>
      </AppProvider>
    );

    expect(screen.getByTestId("apollo-provider")).toBeInTheDocument();
    expect(screen.getByTestId("auth-provider")).toBeInTheDocument();
    expect(screen.getByTestId("cart-provider")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("wraps children inside all providers in order", () => {
    render(
      <AppProvider>
        <span>Nested Child</span>
      </AppProvider>
    );

    const apollo = screen.getByTestId("apollo-provider");
    const auth = screen.getByTestId("auth-provider");
    const cart = screen.getByTestId("cart-provider");

    expect(apollo).toContainElement(auth);
    expect(auth).toContainElement(cart);
    expect(cart).toContainHTML("Nested Child");
  });
});
