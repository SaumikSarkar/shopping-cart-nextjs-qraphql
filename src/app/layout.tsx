import "@/styles/globals.css";
import { CssBaseline } from "@mui/material";
import { Metadata } from "next";

import AppProvider from "./app-provider";

import Header from "@/components/common/Header/Header";

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export const metadata: Metadata = {
  title: "Shop Your Jewel",
  description: "Next.js + GraphQL shopping cart",
  icons: {
    icon: "/assets/logo.png",
    shortcut: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
};

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
