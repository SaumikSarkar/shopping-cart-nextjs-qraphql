"use client";

import { Box, Typography, Button, Container } from "@mui/material";
import { AiOutlineWarning } from "react-icons/ai";
import { useRouter } from "next/navigation";
import "./unauthorized.css";
import { useCallback } from "react";

export default function UnauthorizedPage() {
  const router = useRouter();

  const redirectToLogin = useCallback(() => {
    router.push("/login");
  }, []);

  return (
    <Container maxWidth="sm" className="unauthorized-container">
      <Box
        className="unauthorized-box"
        role="alert"
        aria-label="Unauthorized access warning"
      >
        <AiOutlineWarning className="unauthorized-icon" />
        <Typography variant="h4" className="unauthorized-heading" gutterBottom>
          Access Denied
        </Typography>
        <Typography
          variant="body1"
          className="unauthorized-message"
          gutterBottom
        >
          You do not have permission to view this page.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className="unauthorized-button"
          onClick={redirectToLogin}
        >
          Go to Login
        </Button>
      </Box>
    </Container>
  );
}
