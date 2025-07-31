import { render, screen, fireEvent } from "@testing-library/react";

import { CartLayout } from "./CartLayout";

import type { CheckoutLine } from "@/types/cart.type";

jest.mock("@/hooks/Cart/useCart", () => ({
  useCart: jest.fn(),
}));

jest.mock("../CartSkeleton/CartSkeleton", () => ({
  CartSkeleton: () => <div data-testid="cart-skeleton" />,
}));

jest.mock("../CartItem/CartItem", () => ({
  CartItem: ({
    line,
  }: {
    line: CheckoutLine;
    handleUpdateQuantity: (variantId: string, newQty: number) => void;
    handleRemove: (lineId: string) => void;
  }) => <div data-testid="cart-item">{line.variant.product.name}</div>,
}));

const mockUseCart = jest.requireMock("@/hooks/Cart/useCart")
  .useCart as jest.Mock;

describe("CartLayout", () => {
  const onCheckout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty cart message if no checkoutToken", () => {
    mockUseCart.mockReturnValue({ checkoutToken: null });

    render(<CartLayout onCheckout={onCheckout} />);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it("renders loading skeleton when loading", () => {
    mockUseCart.mockReturnValue({
      checkoutToken: "chk123",
      loading: true,
    });

    render(<CartLayout onCheckout={onCheckout} />);
    expect(screen.getByTestId("cart-skeleton")).toBeInTheDocument();
  });

  it("renders error message if error or no checkout", () => {
    mockUseCart.mockReturnValue({
      checkoutToken: "chk123",
      checkout: null,
      error: new Error("failed"),
    });

    render(<CartLayout onCheckout={onCheckout} />);
    expect(screen.getByText(/failed to load cart/i)).toBeInTheDocument();
  });

  it("renders empty cart message if checkout has no lines", () => {
    mockUseCart.mockReturnValue({
      checkoutToken: "chk123",
      checkout: { lines: [] },
      loading: false,
      error: null,
    });

    render(<CartLayout onCheckout={onCheckout} />);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it("renders cart items and totals", () => {
    mockUseCart.mockReturnValue({
      checkoutToken: "chk123",
      loading: false,
      error: null,
      handleUpdateQuantity: jest.fn(),
      handleRemove: jest.fn(),
      checkout: {
        lines: [
          {
            id: "line1",
            quantity: 2,
            variant: {
              id: "v1",
              name: "Gold",
              product: { name: "Ring" },
              pricing: { price: { gross: { amount: 1000 } } },
            },
          } as unknown as CheckoutLine,
        ],
        subtotalPrice: { gross: { amount: 2000 } },
        shippingPrice: { gross: { amount: 100 } },
        totalPrice: { gross: { amount: 2100 } },
      },
    });

    render(<CartLayout onCheckout={onCheckout} />);

    expect(screen.getByTestId("cart-item")).toHaveTextContent("Ring");
    expect(screen.getByText("₹2,000")).toBeInTheDocument();
    expect(screen.getByText("₹100")).toBeInTheDocument();
    expect(screen.getByText("₹2,100")).toBeInTheDocument();
  });

  it("calls onCheckout when checkout button is clicked", () => {
    mockUseCart.mockReturnValue({
      checkoutToken: "chk123",
      loading: false,
      error: null,
      handleUpdateQuantity: jest.fn(),
      handleRemove: jest.fn(),
      checkout: {
        lines: [
          {
            id: "line1",
            quantity: 1,
            variant: {
              id: "v1",
              name: "Gold",
              product: { name: "Ring" },
              pricing: { price: { gross: { amount: 1000 } } },
            },
          } as unknown as CheckoutLine,
        ],
        subtotalPrice: { gross: { amount: 1000 } },
        shippingPrice: { gross: { amount: 100 } },
        totalPrice: { gross: { amount: 1100 } },
      },
    });

    render(<CartLayout onCheckout={onCheckout} />);
    fireEvent.click(
      screen.getByRole("button", { name: /proceed to checkout/i })
    );
    expect(onCheckout).toHaveBeenCalled();
  });
});
