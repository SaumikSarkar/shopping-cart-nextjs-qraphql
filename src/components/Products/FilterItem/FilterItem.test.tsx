import { render, screen, fireEvent } from "@testing-library/react";

import { FilterItem } from "./FilterItem";

jest.mock("@mui/material", () => ({
  Checkbox: (props: { checked?: boolean; onChange?: () => void }) => (
    <input
      type="checkbox"
      data-testid="mui-checkbox"
      checked={props.checked}
      onChange={props.onChange}
    />
  ),
  FormControlLabel: (props: { control: React.ReactNode; label: string }) => (
    <label data-testid="mui-form-control-label">
      {props.control}
      <span>{props.label}</span>
    </label>
  ),
}));

describe("FilterItem", () => {
  it("renders with label", () => {
    render(
      <FilterItem
        category="color"
        label="Red Color"
        onValueChange={jest.fn()}
      />
    );

    expect(screen.getByText("Red Color")).toBeInTheDocument();
  });

  it("checkbox reflects checked prop", () => {
    const { rerender } = render(
      <FilterItem
        category="color"
        label="Red Color"
        checked={false}
        onValueChange={jest.fn()}
      />
    );

    expect(screen.getByTestId("mui-checkbox")).not.toBeChecked();

    rerender(
      <FilterItem
        category="color"
        label="Red Color"
        checked={true}
        onValueChange={jest.fn()}
      />
    );

    expect(screen.getByTestId("mui-checkbox")).toBeChecked();
  });

  it("calls onValueChange with kebab-cased label when clicked", () => {
    const onValueChange = jest.fn();
    render(
      <FilterItem
        category="color"
        label="Red Color"
        onValueChange={onValueChange}
      />
    );

    fireEvent.click(screen.getByTestId("mui-checkbox"));

    expect(onValueChange).toHaveBeenCalledWith("color", "red-color");
  });
});
