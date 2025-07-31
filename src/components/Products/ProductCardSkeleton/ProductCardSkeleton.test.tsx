import { render, screen } from "@testing-library/react";

import { ProductCardSkeleton } from "./ProductCardSkeleton";

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  Skeleton: () => <div>Skeleton</div>,
}));

describe("ProductCardSkeleton", () => {
  it("renders card skeleton", () => {
    render(<ProductCardSkeleton />);
    expect(screen.getAllByText(/Skeleton/).length).toBeGreaterThan(0);
  });
});
