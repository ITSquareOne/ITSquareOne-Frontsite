"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "../components/CartContext";

export default function PcBuildSummary() {
  const { cart, removeFromCart } = useCart();
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  return (
    <div 
    
    className="min-h-screen flex flex-col text-white overflow-hidden pt-[5vh]">
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-32 px-8  flex-grow justify-center">
        {/* Left Section: Your Computer */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold">YOUR COMPUTER</h2>
          <div className="flex gap-4 mt-4">
            <Image src="/monitor.svg" alt="Monitor" width={100} height={100} />
            <Image src="/cpu_full.svg" alt="PC Case" width={100} height={100} />
          </div>
          <a href="/main-cate" className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold">
            Build a PC
          </a>
        </div>

        {/* Right Section: Cart Summary */}
        <div className="w-full max-w-lg bg-white text-black rounded-lg shadow-lg flex flex-col">
          {/* SPECS Header */}
          <h3 className="bg-yellow-400 text-center text-lg font-semibold py-2 rounded-t-lg">SPECS</h3>

          {/* SPECS Scrollable Section */}
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {cart.map((item) => (
                <div key={item.id} className="flex flex-row">
                    <Image src={`${item.image}`} alt="PC Case" width={150} height={100} className="mr-4"/>
                    <div> 
                        <p>{item.name}</p>
                        <p className="mt-2 text-xl text-blue-500">{item.price} บาท</p>
                        <button className="bg-red-500 hover:bg-red-600 text-white transition p-1 px-2 shadow-md rounded-lg mt-2" onClick={() => removeFromCart(item.id)}>ลบสินค้า</button>
                    </div>
                </div>
            ))}
            <p>รวมทั้งหมด: {totalPrice} บาท</p>
          </div>

          {/* Total Price & Checkout (Stays Fixed at Bottom) */}
          <div className="flex justify-between items-center bg-gray-200 p-4 rounded-b-lg">
            <p className="text-lg font-semibold">Total: {totalPrice} THB</p>
            <button  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                <a href="/checkingout">ชำระเงิน</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
