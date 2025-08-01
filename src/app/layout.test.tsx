import { render, screen } from "@testing-library/react";

import Layout from "./layout";

jest.mock("./app-provider", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-provider">{children}</div>
  ),
}));

jest.mock("@/components/common/Header/Header", () => ({
  __esModule: true,
  default: () => <div data-testid="header">Mock Header</div>,
}));

describe("Layout", () => {
  it("renders AppProvider wrapper", () => {
    render(
      <Layout>
        <div>Test Child</div>
      </Layout>
    );
    expect(screen.getByTestId("app-provider")).toBeInTheDocument();
  });

  it("renders Header", () => {
    render(
      <Layout>
        <div>Test Child</div>
      </Layout>
    );
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("renders children inside <main>", () => {
    render(
      <Layout>
        <div data-testid="child">Test Child</div>
      </Layout>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("applies HTML lang attribute", () => {
    const { container } = render(
      <Layout>
        <div>Lang Test</div>
      </Layout>
    );
    expect(container.querySelector("html")).toHaveAttribute("lang", "en");
  });
});
