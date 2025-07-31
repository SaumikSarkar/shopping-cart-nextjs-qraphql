import { render, screen, fireEvent } from "@testing-library/react";

import { ProductInfo } from "./ProductInfo";

import type { ProductVariant } from "@/types/productDetails.type";

jest.mock("html-react-parser", () => (html: string) => (
  <>{html.replace(/<\/?[^>]+(>|$)/g, "")}</>
));

const mockVariants: ProductVariant[] = [
  { id: "v1", name: "Small", sku: "sku1", pricing: null, attributes: [] },
  { id: "v2", name: "Large", sku: "sku2", pricing: null, attributes: [] },
];

describe("ProductInfo", () => {
  const baseProps = {
    loading: false,
    name: "Gold Ring",
    description: "<p>Beautiful gold ring</p>",
    selectedVariant: mockVariants[0],
    quantity: 0,
    variants: mockVariants,
    price: 1500,
    handleIncrement: jest.fn(),
    handleDecrement: jest.fn(),
    updateSelectedVariant: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders skeletons when loading", () => {
    render(<ProductInfo {...baseProps} loading={true} />);
    const skeletons = document.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders product details when not loading", () => {
    render(<ProductInfo {...baseProps} />);
    expect(screen.getByText("Gold Ring")).toBeInTheDocument();
    expect(screen.getByText("Beautiful gold ring")).toBeInTheDocument();
    expect(screen.getByText("₹1,500")).toBeInTheDocument();
  });

  it("renders 'No description' when description is missing", () => {
    render(<ProductInfo {...baseProps} description="" />);
    expect(screen.getByText(/no description/i)).toBeInTheDocument();
  });

  it("renders variant options and calls updateSelectedVariant", () => {
    render(<ProductInfo {...baseProps} />);
    const select = screen.getByRole("combobox");
    fireEvent.mouseDown(select);

    const option = screen.getByText("Large");
    fireEvent.click(option);

    expect(baseProps.updateSelectedVariant).toHaveBeenCalledWith(
      mockVariants[1]
    );
  });

  it("renders 'Add to Cart' when quantity is 0 and calls handleIncrement", () => {
    render(<ProductInfo {...baseProps} quantity={0} />);
    const btn = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(btn);
    expect(baseProps.handleIncrement).toHaveBeenCalled();
  });

  it("renders quantity controls when quantity > 0", () => {
    render(<ProductInfo {...baseProps} quantity={2} />);
    expect(screen.getByText("2")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "–" }));
    expect(baseProps.handleDecrement).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "+" }));
    expect(baseProps.handleIncrement).toHaveBeenCalled();
  });
});
