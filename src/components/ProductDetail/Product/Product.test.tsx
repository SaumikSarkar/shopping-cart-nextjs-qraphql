import { render, screen } from "@testing-library/react";

import { Product } from "./Product";

jest.mock("@/hooks/ProductDetails/useProductDetails", () => ({
  useProductDetails: jest.fn(),
}));

jest.mock("../ProductCarousal/ProductCarousal", () => ({
  ProductCarousal: ({
    loading,
    name,
  }: {
    loading: boolean;
    media?: unknown;
    name?: string;
  }) => <div data-testid="carousal">{loading ? "loading" : name}</div>,
}));

jest.mock("../ProductInfo/ProductInfo", () => ({
  ProductInfo: ({
    loading,
    name,
    description,
    quantity,
    price,
  }: {
    loading: boolean;
    name?: string;
    description?: string;
    selectedVariant?: unknown;
    quantity: number;
    price?: number;
  }) => (
    <div data-testid="info">
      {loading
        ? "loading"
        : `${name} - ${description} - qty:${quantity} - price:${price}`}
    </div>
  ),
}));

import { useProductDetails } from "@/hooks/ProductDetails/useProductDetails";
const mockUseProductDetails = useProductDetails as jest.Mock;

describe("Product component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders product not found when error is true", () => {
    mockUseProductDetails.mockReturnValue({
      error: new Error("fail"),
      data: null,
      loading: false,
      cart: {},
      selectedVariant: null,
    });

    render(<Product />);
    expect(screen.getByText(/product not found/i)).toBeInTheDocument();
  });

  it("renders product not found when no data and not loading", () => {
    mockUseProductDetails.mockReturnValue({
      error: null,
      data: null,
      loading: false,
      cart: {},
      selectedVariant: null,
    });

    render(<Product />);
    expect(screen.getByText(/product not found/i)).toBeInTheDocument();
  });

  it("renders children with loading state", () => {
    mockUseProductDetails.mockReturnValue({
      error: null,
      data: {
        product: {
          name: "Ring",
          description: "Nice ring",
          media: [],
          variants: [],
        },
      },
      loading: true,
      cart: {},
      selectedVariant: null,
      handleIncrement: jest.fn(),
      handleDecrement: jest.fn(),
      updateSelectedVariant: jest.fn(),
    });

    render(<Product />);
    expect(screen.getByTestId("carousal")).toHaveTextContent("loading");
    expect(screen.getByTestId("info")).toHaveTextContent("loading");
  });

  it("renders ProductCarousal and ProductInfo with product data", () => {
    mockUseProductDetails.mockReturnValue({
      error: null,
      loading: false,
      data: {
        product: {
          name: "Diamond Ring",
          description: "Shiny diamond",
          media: [{ url: "img.jpg" }],
          variants: [
            {
              id: "v1",
              name: "Gold",
              pricing: { price: { gross: { amount: 5000 } } },
            },
          ],
        },
      },
      cart: { v1: { quantity: 2 } },
      selectedVariant: {
        id: "v1",
        name: "Gold",
        pricing: { price: { gross: { amount: 5000 } } },
      },
      handleIncrement: jest.fn(),
      handleDecrement: jest.fn(),
      updateSelectedVariant: jest.fn(),
    });

    render(<Product />);
    expect(screen.getByTestId("carousal")).toHaveTextContent("Diamond Ring");
    expect(screen.getByTestId("info")).toHaveTextContent(
      "Diamond Ring - Shiny diamond - qty:2 - price:5000"
    );
  });
});
