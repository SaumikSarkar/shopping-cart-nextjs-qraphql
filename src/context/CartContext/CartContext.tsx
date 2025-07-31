"use client";

import Cookies from "js-cookie";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import type { CartState } from "@/types/cart.type";

type CartContextType = {
  checkoutToken: string;
  cart: CartState;
  updateCheckoutToken: (token: string) => void;
  updateCart: (cart: CartState) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartState>({});
  const [checkoutToken, setCheckoutToken] = useState<string | null>(
    Cookies.get("checkoutToken") || null
  );

  const updateCart = useCallback((newCart: CartState) => {
    Cookies.set("cart", JSON.stringify(newCart));
    setCart(newCart);
  }, []);

  const updateCheckoutToken = useCallback((newToken: string) => {
    Cookies.set("checkoutToken", newToken);
    setCheckoutToken(newToken);
  }, []);

  useEffect(() => {
    const cookieCart = Cookies.get("cart");
    if (cookieCart) {
      setCart(JSON.parse(cookieCart));
    }
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, checkoutToken, updateCart, updateCheckoutToken }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext<CartContextType>(CartContext);

  if (!context) {
    throw new Error("Component is not wrapped in CartProvider");
  }

  return context;
}
