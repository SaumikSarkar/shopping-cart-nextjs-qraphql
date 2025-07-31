import { useRef } from "react";
import { Box, IconButton, Skeleton, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { NavigationOptions } from "swiper/types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { ProductMedia } from "@/types/productDetails.type";

import "swiper/css";
import "swiper/css/navigation";

type ProductCarousalProps = Readonly<{
  loading: boolean;
  media?: ProductMedia[];
  name: string;
}>;

export function ProductCarousal({
  loading,
  media,
  name,
}: ProductCarousalProps) {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Box flex={1} maxWidth={{ xs: "100%", md: "500px" }} position="relative">
      {loading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={400}
          sx={{ borderRadius: 2 }}
        />
      ) : (
        <Swiper
          modules={[Navigation]}
          navigation={
            {
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            } as NavigationOptions
          }
          onInit={(swiper) => {
            (swiper.params.navigation as NavigationOptions).prevEl =
              prevRef.current!;
            (swiper.params.navigation as NavigationOptions).nextEl =
              nextRef.current!;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          spaceBetween={10}
          slidesPerView={1}
          style={{
            width: "100%",
            height: "400px",
            background: "#f5f5f5",
            borderRadius: 8,
          }}
        >
          {media?.length > 0 ? (
            media.map((media) => (
              <SwiperSlide key={media.id}>
                <Box
                  component="img"
                  src={media.url}
                  alt={media.alt ?? name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: 2,
                    backgroundColor: "#fff",
                  }}
                />
              </SwiperSlide>
            ))
          ) : (
            <Box
              sx={{
                width: "100%",
                height: 300,
                background: "#eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography>No images</Typography>
            </Box>
          )}
        </Swiper>
      )}

      {!loading && (
        <>
          <IconButton
            ref={prevRef}
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              zIndex: 10,
              transform: "translateY(-50%)",
              color: "#333",
              background: "#fff",
              "&:hover": { background: "#eee" },
            }}
          >
            <FaChevronLeft />
          </IconButton>
          <IconButton
            ref={nextRef}
            sx={{
              position: "absolute",
              top: "50%",
              right: 0,
              zIndex: 10,
              transform: "translateY(-50%)",
              color: "#333",
              background: "#fff",
              "&:hover": { background: "#eee" },
            }}
          >
            <FaChevronRight />
          </IconButton>
        </>
      )}
    </Box>
  );
}
