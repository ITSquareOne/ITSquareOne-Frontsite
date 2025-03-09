"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  type: string | number;
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
        if (cart !== null) {  
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart]);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setCart([]);
                localStorage.removeItem("cart");
            }
        };
    
        checkAuth(); 
        window.addEventListener("storage", checkAuth); 

        return () => {
            window.removeEventListener("storage", checkAuth); 
        };
    }, []);

    const addToCart = (product: CartItem) => {
        setCart((prevCart) => {
            const cartArray = prevCart ?? [];
            if (!cartArray.some((item) => item.id === product.id)) {
                return [...cartArray, product];
            }
            return cartArray; 
        });
    };
    
    const removeFromCart = (productId: number) => {
        setCart((prevCart) => (prevCart ?? []).filter((item) => item.id !== productId));
    };

    if (cart === null) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <svg className="animate-spin h-8 w-8 text-gray-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span className="text-lg font-semibold text-gray-700">Loading...</span>
            </div>
        );
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
