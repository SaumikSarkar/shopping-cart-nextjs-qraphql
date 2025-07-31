import { Box, Container, Skeleton, Typography } from "@mui/material";

export function CheckoutSkeleton() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Shipping & Billing Address
        </Typography>
        <Box display="grid" gap={2} gridTemplateColumns="1fr 1fr">
          <Skeleton height={56} />
          <Skeleton height={56} />
        </Box>
        <Skeleton height={56} sx={{ mt: 2 }} />
        <Box display="grid" gap={2} gridTemplateColumns="1fr 1fr" mt={2}>
          <Skeleton height={56} />
          <Skeleton height={56} />
        </Box>
        <Skeleton height={56} sx={{ mt: 2 }} />
        <Skeleton
          variant="rectangular"
          height={40}
          width={150}
          sx={{ mt: 2, borderRadius: 1 }}
        />
      </Box>

      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Shipping Method
        </Typography>
        <Skeleton height={56} />
        <Skeleton
          variant="rectangular"
          height={40}
          width={180}
          sx={{ mt: 2, borderRadius: 1 }}
        />
      </Box>

      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        {[1, 2].map((i) => (
          <Box key={i} display="flex" justifyContent="space-between" mb={1}>
            <Skeleton width="60%" height={24} />
            <Skeleton width="20%" height={24} />
          </Box>
        ))}
        <Skeleton width="40%" height={24} />
        <Skeleton width="40%" height={24} />
        <Skeleton width="50%" height={28} />
      </Box>

      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Payment
        </Typography>
        <Skeleton
          variant="rectangular"
          height={40}
          width={160}
          sx={{ borderRadius: 1 }}
        />
      </Box>

      <Skeleton
        variant="rectangular"
        height={48}
        width="100%"
        sx={{ mt: 3, borderRadius: 2 }}
      />
    </Container>
  );
}
