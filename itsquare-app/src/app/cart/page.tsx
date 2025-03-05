"use client";
import Image from "next/image";
import { useState } from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function PcBuildSummary() {
  // Sample cart items (Replace with real cart state)
  const [cart, setCart] = useState<CartItem[]>([
    { id: 1, name: "RAM DDR2(800) BLACKBERRY", price: 3350, image: "/ram.png" },
    { id: 2, name: "RAM DDR2(800) BLACKBERRY", price: 3350, image: "/ram.png" },
    { id: 3, name: "RAM DDR2(800) BLACKBERRY", price: 3350, image: "/ram.png" },
    { id: 4, name: "RAM DDR2(800) BLACKBERRY", price: 3350, image: "/ram.png" },
    { id: 5, name: "RAM DDR2(800) BLACKBERRY", price: 3350, image: "/ram.png" },
  ]);

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  // Remove item from cart
  const removeItem = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1B1038] text-white overflow-hidden">
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-60 px-8 py-6 flex-grow justify-center">
        {/* Left Section: Your Computer */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold">YOUR COMPUTER</h2>
          <div className="flex gap-4 mt-4">
            <Image src="/monitor.svg" alt="Monitor" width={100} height={100} />
            <Image src="/cpu_full.svg" alt="PC Case" width={100} height={100} />
          </div>
          <button className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold">
            Build a PC
          </button>
        </div>

        {/* Right Section: Cart Summary */}
        <div className="w-full max-w-lg bg-white text-black mt-6 lg:mt-0 rounded-lg shadow-lg flex flex-col">
          {/* SPECS Header */}
          <h3 className="bg-yellow-400 text-center text-lg font-semibold py-2 rounded-t-lg">SPECS</h3>

          {/* SPECS Scrollable Section */}
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center bg-gray-100 p-2 rounded-lg shadow-md">
                <Image src={item.image} alt={item.name} width={60} height={60} className="rounded-md" />
                <div className="ml-4 flex-1">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-blue-600 font-bold">THB {item.price}</p>
                </div>
                <button onClick={() => removeItem(item.id)}>
                  <Image src="/trash-icon.png" alt="Remove" width={20} height={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Total Price & Checkout (Stays Fixed at Bottom) */}
          <div className="flex justify-between items-center bg-gray-200 p-4 rounded-b-lg">
            <p className="text-lg font-semibold">Total: {totalPrice} THB</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              ชำระเงิน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
