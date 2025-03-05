"use client";
import { useState } from "react";
import Image from "next/image";

export default function OrderHistory() {
  const [filter, setFilter] = useState("all"); // Default: Show all orders

  // Sample order data (Replace with actual API data)
  const orders = [
    {
      id: "#V124256",
      date: "15/2/2024",
      price: 999900.0,
      status: "รอการชำระเงิน",
      statusColor: "text-pink-500",
    },
    {
      id: "#V124256",
      date: "15/2/2024",
      price: 999900.0,
      status: "กำลังตรวจสอบ",
      statusColor: "text-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1A0C2F] text-white">

      {/* 🏷 Filter Tabs */}
      <div className=" flex justify-center pt-6 space-x-4">
        {["all", "in-progress", "completed", "canceled"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-6 py-2 rounded-full font-semibold ${
              filter === type ? "bg-yellow-400 text-black" : "bg-white text-black"
            }`}
          >
            {type === "all"
              ? "All"
              : type === "in-progress"
              ? "In Progress"
              : type === "completed"
              ? "Completed"
              : "Canceled"}
          </button>
        ))}
      </div>

      {/* Order List */}
      <div className="flex flex-col items-center mt-6 space-y-6">
        {orders.map((order, index) => (
          <div key={index} className="bg-white text-black w-3/4 rounded-xl p-6 shadow-md">
            {/* Order Info */}
            <div className="flex justify-between items-center border-b pb-2 mb-2">
              <span className="text-gray-500">เลขสั่งซื้อ</span>
              <span className="text-gray-500">วันสั่งซื้อ</span>
              <span className="text-gray-500">ราคาสุทธิ</span>
            </div>

            <div className="flex justify-between items-center">
              {/* Left - Order Image */}
              <div className="flex items-center">
                <Image src="/cpu_full.png" alt="Product" width={80} height={80} />
              </div>

              {/* Middle - Order Details */}
              <div className="text-gray-600">{order.date}</div>

              {/* Right - Price & Status */}
              <div className="text-right">
                <p className="text-lg font-bold text-black">{order.price.toFixed(2)} บาท</p>
                <p className={`${order.statusColor} text-sm`}>{order.status}</p>
              </div>
            </div>

            {/* Details Button */}
            <div className="text-right mt-4">
              <button className="text-black font-semibold underline">ดูรายละเอียด</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}