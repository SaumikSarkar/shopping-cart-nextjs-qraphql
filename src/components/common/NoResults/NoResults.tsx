import { Box, Typography } from "@mui/material";

export function NoResults() {
  return (
    <Box gridColumn="1 / -1" textAlign="center" py={10}>
      <Typography variant="h6">No products found</Typography>
      <Typography variant="body2" color="text.secondary">
        Try adjusting filters or search terms
      </Typography>
    </Box>
  );
}
