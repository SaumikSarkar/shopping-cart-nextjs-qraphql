import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";

import CartPage from "./page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components/Cart/CartLayout/CartLayout", () => ({
  CartLayout: ({ onCheckout }: { onCheckout: () => void }) => (
    <div data-testid="mock-cart-layout">
      <button onClick={onCheckout}>Proceed to Checkout</button>
    </div>
  ),
}));

describe("CartPage", () => {
  const push = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
    jest.clearAllMocks();
  });

  it("renders the CartLayout component", () => {
    render(<CartPage />);
    expect(screen.getByTestId("mock-cart-layout")).toBeInTheDocument();
  });

  it("navigates to /checkout when onCheckout is called", () => {
    render(<CartPage />);
    fireEvent.click(screen.getByText(/proceed to checkout/i));
    expect(push).toHaveBeenCalledWith("/checkout");
  });
});
