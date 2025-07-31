import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useCallback } from "react";

type ProductCardProps = Readonly<{
  id: string;
  name: string;
  imgUrl?: string;
  imgAlt?: string;
  defaultVariant?: string;
  onView: (id: string) => void;
}>;

export default function ProductCard({
  id,
  name,
  imgUrl = "/assets/fallback.png",
  imgAlt = "Product",
  defaultVariant = "",
  onView,
}: ProductCardProps) {
  const onImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.target as HTMLImageElement;
      target.onerror = null;
      target.src = "/assets/fallback.png";
    },
    []
  );

  const handleView = useCallback(() => onView(id), [id]);

  return (
    <Card sx={{ display: "flex", flexDirection: "column", maxHeight: 400 }}>
      <CardMedia
        component="img"
        height="180"
        image={imgUrl}
        alt={imgAlt}
        onError={onImageError}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {name}
        </Typography>
        <Typography color="text.secondary">{defaultVariant}</Typography>
      </CardContent>
      <Box px={2} pb={2} mt="auto">
        <Button variant="contained" size="small" onClick={handleView}>
          View
        </Button>
      </Box>
    </Card>
  );
}
