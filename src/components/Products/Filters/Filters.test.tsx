import { render, screen, fireEvent } from "@testing-library/react";

import { Filters } from "./Filters";

jest.mock("../FilterItem/FilterItem", () => ({
  FilterItem: ({
    category,
    label,
    checked,
    onValueChange,
  }: {
    category: string;
    label: string;
    checked?: boolean;
    onValueChange: (category: string, value: string) => void;
  }) => (
    <div data-testid={`filter-item-${label}`}>
      <input
        type="checkbox"
        data-testid={`checkbox-${label}`}
        checked={checked}
        onChange={() => onValueChange(category, label)}
      />
      <span>{label}</span>
    </div>
  ),
}));

describe("Filters", () => {
  const handleFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders heading and all categories", () => {
    render(
      <Filters selectedFilters={{}} handleFilterChange={handleFilterChange} />
    );

    expect(screen.getByText(/filters/i)).toBeInTheDocument();

    ["color", "metal", "carat", "gender", "size", "shape"].forEach((cat) => {
      expect(screen.getByText(new RegExp(cat, "i"))).toBeInTheDocument();
    });
  });

  it("renders filter values for each category", () => {
    render(
      <Filters selectedFilters={{}} handleFilterChange={handleFilterChange} />
    );

    expect(screen.getByText("White Gold")).toBeInTheDocument();
    expect(screen.getByText("Gold")).toBeInTheDocument();
    expect(screen.getByText("14K")).toBeInTheDocument();
    expect(screen.getByText("Male")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Round")).toBeInTheDocument();
  });

  it("marks filters as checked if selected", () => {
    render(
      <Filters
        selectedFilters={{
          color: ["white-gold"],
          size: ["3"],
        }}
        handleFilterChange={handleFilterChange}
      />
    );

    expect(screen.getByTestId("checkbox-White Gold")).toBeChecked();
    expect(screen.getByTestId("checkbox-3")).toBeChecked();
    expect(screen.getByTestId("checkbox-Gold")).not.toBeChecked();
  });

  it("calls handleFilterChange when a filter is clicked", () => {
    render(
      <Filters selectedFilters={{}} handleFilterChange={handleFilterChange} />
    );

    fireEvent.click(screen.getByTestId("checkbox-Gold"));

    expect(handleFilterChange).toHaveBeenCalledWith("metal", "Gold");
  });
});
