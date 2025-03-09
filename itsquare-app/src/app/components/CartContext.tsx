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
  getTypeCount: (type: number) => number;
}

// Define component limit types
export interface ComponentLimit {
  min: number;
  max: number;
  name: string;
}

export type ComponentLimits = {
  [key: number]: ComponentLimit;
}

// Component limits configuration
export const componentLimits: ComponentLimits = {
  1: { min: 1, max: 1, name: "CPU" },          // CPU
  2: { min: 1, max: 1, name: "Mainboard" },    // Mainboard
  3: { min: 0, max: 1, name: "VGA Card" },     // VGA Card
  4: { min: 1, max: 4, name: "Memory" },       // RAM
  5: { min: 0, max: 2, name: "Harddisk" },     // Harddisk (max updated to 2)
  6: { min: 0, max: 2, name: "SSD" },          // SSD (max updated to 2)
  7: { min: 1, max: 1, name: "Power Supply" }, // Power Supply
  8: { min: 1, max: 1, name: "Case" },         // Case
};

// Special rule: Either Harddisk or SSD is required (combined min: 1)
export const requiredStorageTypes = [5, 6]; // Harddisk or SSD

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[] | null>(null); // Start as null

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

    const getTypeCount = (type: number) => {
        if (!cart) return 0;
        return cart.filter(item => Number(item.type) === type).length;
    };

    const addToCart = (product: CartItem) => {
        setCart((prevCart) => {
            const cartArray = prevCart ?? [];
            const productType = Number(product.type);
            
            // Check if this type has a limit
            const limit = componentLimits[productType];
            
            if (limit) {
                // For components with max=1, replace the existing item
                if (limit.max === 1) {
                    // Remove existing items of this type
                    const filteredCart = cartArray.filter(item => Number(item.type) !== productType);
                    // Add the new item
                    return [...filteredCart, product];
                } 
                // For components with max>1, check if we're below the limit
                else {
                    const typeCount = cartArray.filter(item => Number(item.type) === productType).length;
                    
                    if (typeCount < limit.max) {
                        // Below the limit, add normally
                        if (!cartArray.some((item) => item.id === product.id)) {
                            return [...cartArray, product];
                        }
                    } else {
                        // At the limit, remove the oldest item of this type and add the new one
                        const itemsOfType = cartArray.filter(item => Number(item.type) === productType);
                        const oldestItem = itemsOfType[0];
                        
                        // Filter out the oldest item of this type
                        const updatedCart = cartArray.filter(item => item.id !== oldestItem.id);
                        
                        // Add the new item
                        return [...updatedCart, product];
                    }
                }
            }
            
            // For other types without limits, add normally if not already in cart
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
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, getTypeCount }}>
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