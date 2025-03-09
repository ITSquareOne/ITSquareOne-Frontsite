"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getProfile, deleteUserOrder, getAllStatus, updateOrderStatus, User, canceledByTech } from "../utils/api"; // 🔹 นำเข้า API
import { Dialog } from "@headlessui/react";

export default function OrderHistory() {
    const [filter, setFilter] = useState("all"); 
    const [orders, setOrders] = useState<any[]>([]); 
    const [token, setToken] = useState<string | null>(null);
    const [isDeletingOrder, setIsDeletingOrder] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
    const [techProfile, setTechProfile] = useState<User | null>(null);
    
    // เพิ่ม state สำหรับการอัพเดทสถานะ
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [statusUpdateInfo, setStatusUpdateInfo] = useState<{orderId: number, newStatus: string, totalPrice: number} | null>(null);

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
                setTechProfile(profileData);
            }
        };

        fetchProfile();
    }, [token]);

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                await fetchOrders(token);
            }
        };
        fetchData();

        const interval = setInterval(fetchData, 60000);

        return () => clearInterval(interval);
    }, [token]);

    // ฟังก์ชันสำหรับเปิด dialog ยืนยันการอัพเดทสถานะ
    const confirmStatusUpdate = (orderId: number, newStatus: string, totalPrice: number) => {
        setStatusUpdateInfo({ orderId, newStatus, totalPrice });
        setIsUpdatingStatus(true);
    };

    const confirmDeleteOrder = (orderId: number) => {
        setOrderToDelete(orderId);
        setIsDeletingOrder(true);
    };

    // ฟังก์ชันสำหรับทำการอัพเดทสถานะหลังจากยืนยันแล้ว
    const executeStatusUpdate = async () => {
        if (!statusUpdateInfo || !token) return;

        try {
            await handleStatusChange(
                statusUpdateInfo.orderId,
                statusUpdateInfo.newStatus,
                statusUpdateInfo.totalPrice
            );
            setIsUpdatingStatus(false);
            setStatusUpdateInfo(null);
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("เกิดข้อผิดพลาดในการอัพเดตสถานะ");
            setIsUpdatingStatus(false);
            setStatusUpdateInfo(null);
        }
    };

    const handleDeleteOrder = async (orderId: number) => {
        if (!token) {
            console.error("No token found!");
            return;
        }

        try {
            await handleStatusChange(orderId, "canceled_by_tech", 0);
            setIsDeletingOrder(false);
        } catch (error) {
            alert("เกิดข้อผิดพลาดในการยกเลิกคำสั่งซื้อ");
            setIsDeletingOrder(false);
        }
    };

    const handleStatusChange = async (orderId: number, newStatus: string, totalPrice: number) => {
        if (!token) {
            console.error("No token found!");
            return;
        }

        try {
            if (newStatus === "canceled_by_tech") {
                await canceledByTech(token, orderId);
                alert("คำสั่งซื้อถูกยกเลิกโดยช่างแล้ว!");
            } else if (techProfile && techProfile.user_id) {
                await updateOrderStatus(token, orderId, newStatus, techProfile.user_id, totalPrice);
                alert("อัปเดตสถานะสำเร็จ!");
            }

            setOrders((prevOrders) =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );

            fetchOrders(token); // โหลดรายการใหม่
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
        }
    };

    const fetchOrders = async (token: string) => {
        const data = await getAllStatus(token);
        setOrders(data);
    };

    return (
        <div className="min-h-screen text-white pb-24">
            {/* Filter Tabs */}
            <div className="flex justify-center pt-6 space-x-4">
                {["all", "in-progress", "completed", "canceled"].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilter(type)}
                        className={`px-6 py-2 rounded-full font-semibold ${filter === type ? "bg-yellow-400 text-black" : "bg-white text-black"}`}
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
                {orders.length === 0 ? (
                    <p className="text-gray-400">ไม่มีคำสั่งซื้อ</p>
                ) : (
                    orders
                        .filter((order) => {
                            if (filter === "all") return true;
                            if (filter === "in-progress")
                                return ["inspection", "to_pay", "building", "shipping"].includes(order.status);
                            if (filter === "completed") return order.status === "delivered";
                            if (filter === "canceled") return order.status === "canceled_by_user" || order.status === "canceled_by_tech";
                            return false;
                        })
                        .map((order, index) => (
                            <div key={index} className="bg-white text-black w-3/4 rounded-xl p-6 shadow-md">
                                {/* Order Info */}
                                <div className="grid grid-cols-5 gap-4 border-b pb-2 mb-2 text-center">
                                    <span className="text-gray-500">เลขสั่งซื้อ #{order.order_id}</span>
                                    <span className="text-gray-500">วันสั่งซื้อ</span>
                                    <span className="text-gray-500">ราคาสุทธิ</span>
                                    <span
                                        className={`text-md font-medium ${order.status === "inspection"
                                            ? "text-blue-600" // สีน้ำเงิน สำหรับอยู่ระหว่างการตรวจสอบ
                                            : order.status === "to_pay"
                                                ? "text-yellow-600" // สีเหลือง สำหรับรอการชำระเงิน
                                                : order.status === "building"
                                                    ? "text-purple-600" // สีม่วง สำหรับกำลังประกอบ
                                                    : order.status === "shipping"
                                                        ? "text-orange-600" // สีส้ม สำหรับกำลังจัดส่ง
                                                        : order.status === "delivered"
                                                            ? "text-green-600" // สีเขียวเข้ม สำหรับจัดส่งสำเร็จ
                                                            : order.status.includes("canceled")
                                                                ? "text-red-600" // สีแดง สำหรับยกเลิก
                                                                : "text-gray-600" // สีเทา สำหรับสถานะอื่นๆ
                                            }`}
                                    >
                                        {order.status === "inspection"
                                            ? "กำลังตรวจสอบสเปค"
                                            : order.status === "to_pay"
                                                ? "รอการชำระเงิน"
                                                : order.status === "building"
                                                    ? "กำลังประกอบ"
                                                    : order.status === "shipping"
                                                        ? "กำลังจัดส่ง"
                                                        : order.status === "delivered"
                                                            ? "จัดส่งสำเร็จ"
                                                            : order.status === "canceled_by_user"
                                                                ? "ผู้ใช้ยกเลิกคำสั่งซื้อ"
                                                                : order.status === "canceled_by_tech"
                                                                    ? "ช่างยกเลิกคำสั่งซื้อ"
                                                                    : "ไม่ทราบสถานะ"}
                                    </span>
                                    <span className="text-gray-500">ที่อยู่จัดส่ง</span>
                                </div>

                                <div className="grid grid-cols-5 gap-4 items-center mb-4">
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
                                    <div className="text-lg font-light text-black text-center flex flex-col space-y-4">
                                        <a href={`/orders/${order.order_id}`} className="text-black underline">
                                            ดูรายละเอียด
                                        </a>
                                    </div>
                                    <div className="text-md font-light text-gray-600 text-center flex flex-col space-y-4">
                                        <span>{order.address.address}</span>
                                    </div>
                                </div>
                                <div className="flex justify-end items-center gap-3 mr-12">
                                    {/* แสดงปุ่มตามสถานะต่างๆ */}
                                    {order.status === "inspection" && (
                                        <button
                                            onClick={() => confirmStatusUpdate(order.order_id, "to_pay", order.total_price)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                                            disabled={order.status === "canceled_by_user" || order.status === "canceled_by_tech"}
                                        >
                                            ตรวจสอบเสร็จสิ้น
                                        </button>
                                    )}
                                    
                                    {order.status === "to_pay" && (
                                        <span className="text-yellow-600 px-4 py-2">
                                            รอลูกค้าชำระเงิน
                                        </span>
                                    )}
                                    
                                    {order.status === "building" && (
                                        <button
                                            onClick={() => confirmStatusUpdate(order.order_id, "shipping", order.total_price)}
                                            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition"
                                            disabled={order.status === "canceled_by_user" || order.status === "canceled_by_tech"}
                                        >
                                            ประกอบเสร็จสิ้น
                                        </button>
                                    )}
                                    
                                    {order.status === "shipping" && (
                                        <button
                                            onClick={() => confirmStatusUpdate(order.order_id, "delivered", order.total_price)}
                                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
                                            disabled={order.status === "canceled_by_user" || order.status === "canceled_by_tech"}
                                        >
                                            จัดส่งเสร็จสิ้น
                                        </button>
                                    )}
                                    
                                    {!["canceled_by_user", "canceled_by_tech", "delivered"].includes(order.status) && (
                                        <button
                                            onClick={() => confirmDeleteOrder(order.order_id)}
                                            className="text-gray-500 hover:text-red-600 cursor-pointer"
                                        >
                                            <div className="flex justify-center mb-2">
                                                <svg className="items-center flex" width="40" height="40" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24 7H20.9C20.4216 4.67358 18.3751 3.003 16 3H14C11.6249 3.003 9.57843 4.67358 9.1 7H6C5.44772 7 5 7.44772 5 8C5 8.55228 5.44772 9 6 9H7V22C7.00331 24.7601 9.23995 26.9967 12 27H18C20.7601 26.9967 22.9967 24.7601 23 22V9H24C24.5523 9 25 8.55228 25 8C25 7.44772 24.5523 7 24 7ZM14 5H16C17.271 5.00155 18.4036 5.8023 18.829 7H11.171C11.5964 5.8023 12.729 5.00155 14 5ZM21 22C21 23.6569 19.6569 25 18 25H12C10.3431 25 9 23.6569 9 22V9H21V22ZM13 21C13.5523 21 14 20.5523 14 20V14C14 13.4477 13.5523 13 13 13C12.4477 13 12 13.4477 12 14V20C12 20.5523 12.4477 21 13 21ZM18 20C18 20.5523 17.5523 21 17 21C16.4477 21 16 20.5523 16 20V14C16 13.4477 16.4477 13 17 13C17.5523 13 18 13.4477 18 14V20Z" fill="rgba(227, 31, 38, 1)"></path></svg>
                                            </div>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                )}
            </div>

            {/* Dialog สำหรับการยืนยันการอัพเดทสถานะ */}
            <Dialog open={isUpdatingStatus} onClose={() => setIsUpdatingStatus(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 md:w-1/4 w-3/4 text-center justify-center text-black">
                    <div className="flex justify-center mb-4">
                        <svg className="items-center flex" width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#4CAF50" strokeWidth="2"/>
                            <path d="M9 12L11 14L15 10" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-4">ยืนยันการอัพเดทสถานะ</h1>
                    <p className="mb-4">
                        คุณต้องการเปลี่ยนสถานะเป็น{" "}
                        <span className="font-medium">
                            {statusUpdateInfo?.newStatus === "to_pay" && "รอการชำระเงิน"}
                            {statusUpdateInfo?.newStatus === "building" && "กำลังประกอบ"}
                            {statusUpdateInfo?.newStatus === "shipping" && "กำลังจัดส่ง"}
                            {statusUpdateInfo?.newStatus === "delivered" && "จัดส่งสำเร็จ"}
                        </span>{" "}
                        ใช่หรือไม่?
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={executeStatusUpdate}
                            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg mr-4 hover:bg-green-600 transition"
                        >
                            ยืนยัน
                        </button>
                        <button
                            onClick={() => setIsUpdatingStatus(false)}
                            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                        >
                            ยกเลิก
                        </button>
                    </div>
                </div>
            </Dialog>

            {/* Dialog สำหรับการยกเลิกคำสั่งซื้อ */}
            <Dialog open={isDeletingOrder} onClose={() => setIsDeletingOrder(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 md:w-1/4 w-3/4 text-center justify-center text-black">
                    <div className="flex justify-center mb-4">
                        <svg className="items-center flex " width="64" height="64" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24 7H20.9C20.4216 4.67358 18.3751 3.003 16 3H14C11.6249 3.003 9.57843 4.67358 9.1 7H6C5.44772 7 5 7.44772 5 8C5 8.55228 5.44772 9 6 9H7V22C7.00331 24.7601 9.23995 26.9967 12 27H18C20.7601 26.9967 22.9967 24.7601 23 22V9H24C24.5523 9 25 8.55228 25 8C25 7.44772 24.5523 7 24 7ZM14 5H16C17.271 5.00155 18.4036 5.8023 18.829 7H11.171C11.5964 5.8023 12.729 5.00155 14 5ZM21 22C21 23.6569 19.6569 25 18 25H12C10.3431 25 9 23.6569 9 22V9H21V22ZM13 21C13.5523 21 14 20.5523 14 20V14C14 13.4477 13.5523 13 13 13C12.4477 13 12 13.4477 12 14V20C12 20.5523 12.4477 21 13 21ZM18 20C18 20.5523 17.5523 21 17 21C16.4477 21 16 20.5523 16 20V14C16 13.4477 16.4477 13 17 13C17.5523 13 18 13.4477 18 14V20Z" fill="rgba(227, 31, 38, 1)"></path></svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-4">คุณแน่ใจที่จะยกเลิกคำสั่งซื้อนี้ใช่หรือไม่?</h1>
                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                if (orderToDelete !== null) {
                                    handleDeleteOrder(orderToDelete);
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
    );
}