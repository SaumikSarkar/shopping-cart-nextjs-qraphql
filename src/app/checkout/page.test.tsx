import { render, screen } from "@testing-library/react";

import CheckoutPage from "./page";

jest.mock("@/components/Checkout/CheckoutForm/CheckoutForm", () => ({
  CheckoutForm: () => (
    <div data-testid="mock-checkout-form">Mock CheckoutForm</div>
  ),
}));

describe("CheckoutPage", () => {
  it("renders the CheckoutForm component", () => {
    render(<CheckoutPage />);
    expect(screen.getByTestId("mock-checkout-form")).toBeInTheDocument();
  });
});
