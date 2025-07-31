/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";

import ProductDetailPage from "./page";

// --- Mock Product component ---
jest.mock("@/components/ProductDetail/Product/Product", () => ({
  Product: () => <div data-testid="mock-product">Mock Product Component</div>,
}));

describe("ProductDetailPage", () => {
  it("renders the Product component", () => {
    render(<ProductDetailPage />);
    expect(screen.getByTestId("mock-product")).toBeInTheDocument();
  });
});
