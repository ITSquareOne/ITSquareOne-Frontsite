"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[] | null>(null); // เริ่มต้นเป็น null

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
            setCart(storedCart);
        }
    }, []);

    useEffect(() => {
        if (cart !== null) {  // รอให้ `cart` โหลดค่าก่อนแล้วค่อยเซฟ
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart]);

    const addToCart = (product: CartItem) => {
        setCart((prevCart) => {
            const cartArray = prevCart ?? [];
            const existingItem = cartArray.find((item) => item.id === product.id);
            if (existingItem) {
                return cartArray.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...cartArray, { ...product, quantity: 1 }];
            }
        });
    };
    
    const removeFromCart = (productId: number) => {
        setCart((prevCart) => {
            const cartArray = prevCart ?? [];
            return cartArray.map((item) =>
                item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
            ).filter((item) => item.quantity > 0);
        });
    };

    if (cart === null) {
        return <div>Loading...</div>; // กัน Hydration Error
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
