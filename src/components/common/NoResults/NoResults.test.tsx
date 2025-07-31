import { render, screen } from "@testing-library/react";

import { NoResults } from "./NoResults";

describe("NoResults", () => {
  it("renders the main heading", () => {
    render(<NoResults />);
    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });

  it("renders the secondary suggestion text", () => {
    render(<NoResults />);
    expect(
      screen.getByText(/try adjusting filters or search terms/i)
    ).toBeInTheDocument();
  });
});
