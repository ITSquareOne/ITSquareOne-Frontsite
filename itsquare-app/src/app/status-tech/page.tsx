"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getProfile, deleteUserOrder, getAllStatus, updateOrderStatus, User } from "../utils/api"; // 🔹 นำเข้า API
import { Dialog } from "@headlessui/react";

export default function OrderHistory() {
  const [filter, setFilter] = useState("all"); // Default: Show all orders
  const [orders, setOrders] = useState<any[]>([]); // 🔹 เก็บข้อมูลออเดอร์ที่ดึงมา
  const [token, setToken] = useState<string | null>(null);
  const [isDeletingOrder, setIsDeletingOrder] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
  const [techProfile, setTechProfile] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchOrders(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
        if (!token) return;
        const profileData = await getProfile(token);
        if (profileData) {
            setTechProfile(profileData); // ✅ อัปเดต state
        }
    };

    fetchProfile();
  }, [token]);

  const confirmDeleteOrder = (orderId : number) => {
    setOrderToDelete(orderId);
    setIsDeletingOrder(true);
  };


  const handleDeleteOrder = async (orderId: number) => {
    if (!token) {
        console.error("No token found!");
        return;
    }
    try {
        await deleteUserOrder(token, orderId);
        alert("ลบคำสั่งซื้อสำเร็จ!");
        setOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
        setIsDeletingOrder(false);
        await fetchOrders(token);
    } catch (error) {
        alert("เกิดข้อผิดพลาดในการลบคำสั่งซื้อ");
        }
    };
    const handleStatusChange = async (orderId: number, newStatus: string, totalPrice: number) => {
        if (!token) {
            console.error("No token found!");
            return;
        }
        try {
            if (techProfile && techProfile.user_id) {
                console.log(orderId, newStatus, techProfile.user_id, totalPrice);
                await updateOrderStatus(token, orderId, newStatus, techProfile.user_id, totalPrice);
                setOrders((prevOrders) => 
                    prevOrders.map(order => 
                        order.id === orderId ? { ...order, status: newStatus } : order
                    )
                );
                alert("อัปเดตสถานะสำเร็จ!");
                fetchOrders(token);
            }     
        } catch (error) {
            alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
        }
    };

  // 🔹 ดึงข้อมูลออเดอร์จาก API
  const fetchOrders = async (token: string) => {
    const data = await getAllStatus(token);
    setOrders(data);
  };

  return (
    <div className="min-h-screen bg-[#1A0C2F] text-white pb-24" style={{ backgroundImage: "url('/bg-main.png')" }}>

      {/* 🏷 Filter Tabs */}
      <div className="flex justify-center pt-6 space-x-4">
        {["all", "in-progress", "completed", "canceled_by_user"].map((type) => (
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
                    <span className={`text-md ${order.status === "canceled_by_user" ? "text-red-600" : "text-green-500"}`}>                        
                        {order.status}
                    </span>
                    </div>
            
                    <div className="grid grid-cols-4 gap-4 items-center">
                        {/* Left - Order Image */}
                        <div className="flex justify-center">
                            <Image src={order.image || "/cpu_full.png"} alt="Product" width={80} height={80} className="mt-4 object-contain w-24 h-24" />
                        </div>
                
                        {/* Middle - Order Date */}
                        <div className="text-gray-600 text-center">{order.order_at.split("T")[0]}</div>
                
                        {/* Middle - Total Price or "Canceled" */}
                        <div className="text-lg font-bold text-black text-center">
                            {order.status === "canceled_by_user" ? (
                            <span className="text-red-500">Canceled</span>
                            ) : (
                            `${order.total_price} บาท`
                            )}
                        </div>
                
                        {/* Right - Status & Button */}
                        <div className="text-lg font-bold text-black text-center">
                            <button className="text-black font-semibold underline mt-2">ดูรายละเอียด</button>
                        </div>
                    </div>
                    <div className="flex justify-end items-center gap-3 mr-12">
                        {/* Dropdown เลือกสถานะ */}
                        <select
                            className="border rounded-md px-2 py-1 text-sm"
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.order_id, e.target.value, order.total_price)}
                            disabled={order.status === "canceled_by_user"} 
                        >
                            <option value="inspection">กำลังตรวจสอบ</option>
                            <option value="to_pay">รอการชำระเงิน</option>
                            <option value="building">กำลังประกอบ</option>
                            <option value="shipping">กำลังจัดส่ง</option>
                            <option value="delivered">จัดส่งสำเร็จ</option>
                            <option value="canceled_by_tech">ยกเลิกคำสั่งซื้อ</option>
                        </select>

                        {/* ถังขยะลบคำสั่งซื้อ */}
                        <button
                            onClick={() => confirmDeleteOrder(order.order_id)}
                            className="text-gray-500 hover:text-red-600 cusor-pointer"
                        >
                            <div className="flex justify-center mb-2">
                                <svg className="items-center flex" width="40" height="40" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24 7H20.9C20.4216 4.67358 18.3751 3.003 16 3H14C11.6249 3.003 9.57843 4.67358 9.1 7H6C5.44772 7 5 7.44772 5 8C5 8.55228 5.44772 9 6 9H7V22C7.00331 24.7601 9.23995 26.9967 12 27H18C20.7601 26.9967 22.9967 24.7601 23 22V9H24C24.5523 9 25 8.55228 25 8C25 7.44772 24.5523 7 24 7ZM14 5H16C17.271 5.00155 18.4036 5.8023 18.829 7H11.171C11.5964 5.8023 12.729 5.00155 14 5ZM21 22C21 23.6569 19.6569 25 18 25H12C10.3431 25 9 23.6569 9 22V9H21V22ZM13 21C13.5523 21 14 20.5523 14 20V14C14 13.4477 13.5523 13 13 13C12.4477 13 12 13.4477 12 14V20C12 20.5523 12.4477 21 13 21ZM18 20C18 20.5523 17.5523 21 17 21C16.4477 21 16 20.5523 16 20V14C16 13.4477 16.4477 13 17 13C17.5523 13 18 13.4477 18 14V20Z" fill="rgba(227, 31, 38, 1)"></path></svg>
                            </div>
                        </button>
                    </div>
                </div>
                ))
            )}
            <Dialog open={isDeletingOrder} onClose={() => setIsDeletingOrder(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 md:w-1/4 w-3/4 text-center justify-center text-black">
                    <div className="flex justify-center mb-4">
                        <svg className="items-center flex " width="64" height="64" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24 7H20.9C20.4216 4.67358 18.3751 3.003 16 3H14C11.6249 3.003 9.57843 4.67358 9.1 7H6C5.44772 7 5 7.44772 5 8C5 8.55228 5.44772 9 6 9H7V22C7.00331 24.7601 9.23995 26.9967 12 27H18C20.7601 26.9967 22.9967 24.7601 23 22V9H24C24.5523 9 25 8.55228 25 8C25 7.44772 24.5523 7 24 7ZM14 5H16C17.271 5.00155 18.4036 5.8023 18.829 7H11.171C11.5964 5.8023 12.729 5.00155 14 5ZM21 22C21 23.6569 19.6569 25 18 25H12C10.3431 25 9 23.6569 9 22V9H21V22ZM13 21C13.5523 21 14 20.5523 14 20V14C14 13.4477 13.5523 13 13 13C12.4477 13 12 13.4477 12 14V20C12 20.5523 12.4477 21 13 21ZM18 20C18 20.5523 17.5523 21 17 21C16.4477 21 16 20.5523 16 20V14C16 13.4477 16.4477 13 17 13C17.5523 13 18 13.4477 18 14V20Z" fill="rgba(227, 31, 38, 1)"></path></svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-4">คุณแน่ใจที่จะลบคำสั่งซื้อนี้ใช่หรือไม่?</h1>
                    <div className="space-y-3">
                    <button
                        onClick={() => {
                            if (orderToDelete !== null) {
                            handleDeleteOrder(orderToDelete);
                            setIsDeletingOrder(false);
                            }
                        }}
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg mr-4 hover:bg-red-600 transition"
                    >
                        ยืนยัน
                    </button>
                    <button
                        onClick={() => setIsDeletingOrder(false)}
                        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                    >
                        ยกเลิก
                    </button>
                    </div>
                </div>
            </Dialog>
        </div>
    </div>
  );
}
