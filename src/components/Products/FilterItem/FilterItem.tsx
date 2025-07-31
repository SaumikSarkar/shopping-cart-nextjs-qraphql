import { Checkbox, FormControlLabel } from "@mui/material";
import kebabCase from "lodash.kebabcase";
import { useCallback } from "react";

type FilterItemProps = Readonly<{
  category: string;
  label: string;
  checked?: boolean;
  onValueChange: (label: string, id: string) => void;
}>;

export function FilterItem({
  category,
  label,
  checked = false,
  onValueChange,
}: FilterItemProps) {
  const handleChange = useCallback(() => {
    onValueChange(category, kebabCase(label));
  }, [label]);

  return (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={handleChange} />}
      label={label}
    />
  );
}
