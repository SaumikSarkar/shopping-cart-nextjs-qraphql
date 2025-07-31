import { useMutation, useQuery } from "@apollo/client";
import { useCallback } from "react";

import { REMOVE_CART_LINE, UPDATE_CART_LINE } from "@/graphql/mutations/cart";
import { GET_CHECKOUT } from "@/graphql/queries/cart";
import type { GetCheckoutResponse } from "@/types/cart.type";
import { useCart as useCartContext } from "@/context/CartContext/CartContext";

export function useCart() {
  const { checkoutToken } = useCartContext();

  const { data, loading, error, refetch } = useQuery<GetCheckoutResponse>(
    GET_CHECKOUT,
    {
      variables: { token: checkoutToken },
      skip: !checkoutToken,
      fetchPolicy: "cache-and-network",
    }
  );

  const [updateCartLine] = useMutation(UPDATE_CART_LINE);
  const [removeCartLine] = useMutation(REMOVE_CART_LINE);

  const handleUpdateQuantity = useCallback(
    async (variantId: string, newQty: number) => {
      if (newQty < 1) return;
      await updateCartLine({
        variables: {
          token: checkoutToken,
          lines: [{ variantId, quantity: newQty }],
        },
      });
      refetch();
    },
    [checkoutToken, refetch, updateCartLine]
  );

  const handleRemove = useCallback(
    async (lineId: string) => {
      await removeCartLine({
        variables: {
          token: checkoutToken,
          linesIds: [lineId],
        },
      });
      refetch();
    },
    [checkoutToken, refetch, removeCartLine]
  );

  return {
    checkoutToken,
    checkout: data?.checkout,
    loading,
    error,
    handleUpdateQuantity,
    handleRemove,
  };
}
