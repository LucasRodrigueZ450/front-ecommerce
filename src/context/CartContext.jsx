import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify"; // 🚀 IMPORTANDO TOAST

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Adicionar produto ao carrinho
  function addToCart(product) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);

      if (existing) {
        toast.info("Quantidade aumentada no carrinho!"); // 🔔 Notificação

        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      toast.success("Produto adicionado ao carrinho!"); // 🔔 Notificação

      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function updateQuantity(id, quantity) {
    if (quantity <= 0) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity } : item
      )
    );
  }

  function removeFromCart(id) {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  }

  function clearCart() {
    setCartItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
