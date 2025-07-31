import { Box, Card, CardContent, Skeleton } from "@mui/material";

export function ProductCardSkeleton() {
  return (
    <Card sx={{ display: "flex", flexDirection: "column", maxHeight: 400 }}>
      <Skeleton variant="rectangular" height={180} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Skeleton width="80%" />
        <Skeleton width="60%" />
      </CardContent>
      <Box px={2} pb={2}>
        <Skeleton variant="rectangular" width={80} height={36} />
      </Box>
    </Card>
  );
}
