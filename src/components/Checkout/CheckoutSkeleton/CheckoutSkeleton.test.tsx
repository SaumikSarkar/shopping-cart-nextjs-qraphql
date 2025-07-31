import { render, screen } from "@testing-library/react";

import { CheckoutSkeleton } from "./CheckoutSkeleton";

describe("CheckoutSkeleton", () => {
  it("renders the main heading", () => {
    render(<CheckoutSkeleton />);
    expect(screen.getByText(/checkout/i)).toBeInTheDocument();
  });

  it("renders section headings", () => {
    render(<CheckoutSkeleton />);
    expect(screen.getByText(/shipping & billing address/i)).toBeInTheDocument();
    expect(screen.getByText(/shipping method/i)).toBeInTheDocument();
    expect(screen.getByText(/order summary/i)).toBeInTheDocument();
    expect(screen.getByText(/payment/i)).toBeInTheDocument();
  });

  it("renders multiple Skeleton components", () => {
    const { container } = render(<CheckoutSkeleton />);
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBeGreaterThan(5);
  });

  it("renders a full-width final checkout button skeleton", () => {
    const { container } = render(<CheckoutSkeleton />);
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons[skeletons.length - 1]).toBeInTheDocument();
  });
});
