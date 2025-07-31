import { render, screen } from "@testing-library/react";

import { CartSkeleton } from "./CartSkeleton";

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  Skeleton: () => <div>Skeleton</div>,
}));

describe("CartSkeleton", () => {
  it("render the heading correctly", () => {
    render(<CartSkeleton />);
    expect(screen.getByText(/Shopping Cart/)).toBeInTheDocument();
  });

  it("renders the skeleton correctly", () => {
    render(<CartSkeleton />);
    expect(screen.getAllByText(/Skeleton/).length).toBeGreaterThan(0);
  });
});
