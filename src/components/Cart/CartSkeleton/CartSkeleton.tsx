import { Box, Container, Divider, Skeleton, Typography } from "@mui/material";

export function CartSkeleton() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      {[1, 2].map((i) => (
        <Box
          key={i}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p={2}
          borderRadius={2}
          mb={2}
          sx={{ background: "#fafafa", boxShadow: 1 }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Box>
              <Skeleton variant="text" width={160} height={24} />
              <Skeleton variant="text" width={100} height={18} />
              <Skeleton variant="text" width={80} height={22} sx={{ mt: 1 }} />
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="text" width={20} height={24} />
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
        </Box>
      ))}

      <Divider sx={{ my: 3 }} />

      <Box display="flex" justifyContent="space-between" mb={1}>
        <Skeleton variant="text" width={100} height={24} />
        <Skeleton variant="text" width={80} height={24} />
      </Box>
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Skeleton variant="text" width={100} height={24} />
        <Skeleton variant="text" width={80} height={24} />
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Skeleton variant="text" width={120} height={28} />
        <Skeleton variant="text" width={100} height={28} />
      </Box>

      <Skeleton
        variant="rectangular"
        height={48}
        sx={{ borderRadius: 2, mt: 3 }}
      />
    </Container>
  );
}
