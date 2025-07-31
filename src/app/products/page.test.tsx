import { render, screen, fireEvent } from "@testing-library/react";

import ProductsPage from "./page";

const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

jest.mock("@/components/Products/ProductListing/ProductListing", () => ({
  ProductListing: ({
    onProductView,
  }: {
    onProductView: (id: string) => void;
  }) => (
    <div data-testid="product-listing">
      <button onClick={() => onProductView("123")}>Mock Product</button>
    </div>
  ),
}));

describe("ProductsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the ProductListing component", () => {
    render(<ProductsPage />);
    expect(screen.getByTestId("product-listing")).toBeInTheDocument();
  });

  it("navigates to product details when onProductView is triggered", () => {
    render(<ProductsPage />);

    fireEvent.click(screen.getByText("Mock Product"));

    expect(pushMock).toHaveBeenCalledWith("/products/123");
  });
});
