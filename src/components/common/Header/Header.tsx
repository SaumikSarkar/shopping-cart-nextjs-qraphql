"use client";

import { AppBar, Toolbar, Box, Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { useAuth } from "@/context/AuthContext/AuthContext";

export default function Header() {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();
  const redirectToCart = useCallback(() => router.push("/cart"), []);

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Image
              src="/assets/logo.png"
              alt="Shop Your Jewel Logo"
              width={120}
              height={80}
              style={{ objectFit: "contain" }}
            />
          </Box>
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        {isLoggedIn && (
          <>
            <Button color="inherit" onClick={redirectToCart}>
              Cart
            </Button>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
