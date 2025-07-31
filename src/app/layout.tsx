"use client";

import "@/styles/globals.css";
import { CssBaseline } from "@mui/material";

import AppProvider from "./app-provider";

import Header from "@/components/common/Header/Header";

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <CssBaseline />
          <Header />
          <main>{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
