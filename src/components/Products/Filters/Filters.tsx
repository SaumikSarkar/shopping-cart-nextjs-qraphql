import { Box, Divider, FormGroup, Typography } from "@mui/material";
import kebabCase from "lodash.kebabcase";

import { FilterItem } from "../FilterItem/FilterItem";

const filters = {
  color: ["White Gold", "Yellow Gold", "Rose Gold"],
  metal: ["Gold", "Silver"],
  carat: ["14K", "18K", "22K"],
  gender: ["Male", "Female"],
  size: ["2", "3", "4", "5"],
  shape: ["Round", "Oval"],
};

type FiltersProps = Readonly<{
  selectedFilters: Record<string, string[]>;
  handleFilterChange: (category: string, value: string) => void;
}>;

export function Filters({ selectedFilters, handleFilterChange }: FiltersProps) {
  console.log("selectedFilters[key]", selectedFilters);

  return (
    <Box width={{ xs: "100%", md: "250px" }} p={2}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      {Object.entries(filters).map(([category, values]) => (
        <Box key={category} mb={3}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            gutterBottom
            sx={{ textTransform: "capitalize" }}
          >
            {category}
          </Typography>
          <FormGroup>
            {values.map((val) => (
              <FilterItem
                key={val}
                category={category}
                label={val}
                checked={selectedFilters[category]?.includes(kebabCase(val))}
                onValueChange={handleFilterChange}
              />
            ))}
          </FormGroup>
          <Divider sx={{ mt: 2 }} />
        </Box>
      ))}
    </Box>
  );
}
