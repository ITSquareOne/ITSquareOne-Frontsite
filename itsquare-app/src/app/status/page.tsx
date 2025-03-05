"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getStatusForUser } from "../utils/api"; // 🔹 นำเข้า API

export default function OrderHistory() {
  const [filter, setFilter] = useState("all"); // Default: Show all orders
  const [orders, setOrders] = useState<any[]>([]); // 🔹 เก็บข้อมูลออเดอร์ที่ดึงมา
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchOrders(storedToken);
    }
  }, []);

  const fetchOrders = async (token: string) => {
    const data = await getStatusForUser(token);
    setOrders(data);
  };

  return (
    <div className="min-h-screen bg-[#1A0C2F] text-white" style={{ backgroundImage: "url('/bg-main.png')" }}>

      {/* 🏷 Filter Tabs */}
      <div className="flex justify-center pt-6 space-x-4">
        {["all", "in-progress", "completed", "canceled"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-6 py-2 rounded-full font-semibold ${filter === type ? "bg-yellow-400 text-black" : "bg-white text-black"}`}
          >
            {type === "all" ? "All" : type === "in-progress" ? "In Progress" : type === "completed" ? "Completed" : "Canceled"}
          </button>
        ))}
      </div>

      {/* Order List */}
      <div className="flex flex-col items-center mt-6 space-y-6">
        {orders.length === 0 ? (
          <p className="text-gray-400">ไม่มีคำสั่งซื้อ</p>
        ) : (
          orders
            .filter(order => filter === "all" || order.status === filter) // 🔹 กรองออเดอร์ตามสถานะ
            .map((order, index) => (
              <div key={index} className="bg-white text-black w-3/4 rounded-xl p-6 shadow-md">
                {/* Order Info */}
                <div className="grid grid-cols-4 gap-4 border-b pb-2 mb-2 text-center">
                    <span className="text-gray-500">เลขสั่งซื้อ #{order.order_id}</span>
                    <span className="text-gray-500">วันสั่งซื้อ</span>
                    <span className="text-gray-500">ราคาสุทธิ</span>
                    <span className={`text-md ${order.status === "รอการชำระเงิน" ? "text-pink-500" : "text-green-500"}`}>                        
                        {order.status}
                    </span>
                </div>
                
                <div className="grid grid-cols-4 gap-4 items-center">
                    {/* Left - Order Image */}
                    <div className="flex justify-center">
                        <Image src={order.image || "/cpu_full.png"} alt="Product" width={80} height={80} />
                    </div>

                    {/* Middle - Order Date */}
                    <div className="text-gray-600 text-center">{order.order_at.split("T")[0]}</div>

                    {/* Middle - Total Price */}
                    <div className="text-lg font-bold text-black text-center">
                        {order.total_price} บาท
                    </div>

                    {/* Right - Status & Button */}
                    <div className="text-lg font-bold text-black text-center">
                        <button className="text-black font-semibold underline mt-2">ดูรายละเอียด</button>
                    </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
