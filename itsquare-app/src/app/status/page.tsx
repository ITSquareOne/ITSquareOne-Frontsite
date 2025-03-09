"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getStatusForUser, canceledByUser } from "../utils/api";
import { Dialog } from "@headlessui/react";

export default function OrderHistory() {
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const statusTranslations = {
    "all": "ทั้งหมด",
    "in-progress": "กำลังดำเนินการ",
    "completed": "เสร็จสิ้น",
    "canceled": "ยกเลิกแล้ว"
  };

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


  const handleCancelOrder = async (orderId: number) => {
    if (!token || !orderId) return;
    try {
      await canceledByUser(token, orderId);
      fetchOrders(token);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการยกเลิกคำสั่งซื้อ", error);
      setIsDelModalOpen(false);
    } finally {
      setIsDelModalOpen(false);
      alert("ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว")
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 🏷 Filter Tabs */}
      <div className="flex justify-center pt-6 space-x-4">
        {["all", "in-progress", "completed", "canceled"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-6 py-2 rounded-full font-semibold ${filter === type ? "bg-yellow-400 text-black" : "bg-white text-black"}`}
          >
            {statusTranslations[type as keyof typeof statusTranslations]}
          </button>
        ))}
      </div>
      {/* Order List */}
      <div className="flex flex-col items-center mt-6 space-y-6">
        <p className="text-gray-400">หากสถานะของรายการอยู่ระหว่างการตรวจสอบ กรุณารอเจ้าหน้าที่สักครู่..</p>
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
                      ? "อยู่ระหว่างการตรวจสอบ"
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
                                  ? "ถูกยกเลิกโดยช่างเทคนิค"
                                  : "ไม่ทราบสถานะ"}
                  </span>
                  <span></span>


                </div>

                <div className="grid grid-cols-5 gap-4 items-center">
                  {/* Left - Order Image */}
                  <div className="flex justify-center">
                    <Image src={order.image || "/cpu_full.png"} alt="Product" width={80} height={80} className="mt-4 object-contain w-24 h-24" />
                  </div>

                  {/* Middle - Order Date */}
                  <div className="text-gray-600 text-center">{order.order_at.split("T")[0]}</div>

                  {/* Middle - Total Price */}
                  <div className="text-md font-bold text-black text-center">
                    {order.total_price} บาท
                  </div>

                  {/* Right - Status & Button */}
                  <div className="text-lg font-light text-black text-center flex flex-col space-y-4">
                    <a href={`/orders/${order.order_id}`} className="text-black underline">
                      ดูรายละเอียด
                    </a>

                    {order.status === "to_pay" && (
                      <a
                        href={`/qrcode?totalPrice=${order.total_price}&orderId=${order.order_id}`}
                        className="bg-green-500 w-1/2 mx-auto text-center text-white px-4 py-2 font-normal rounded-lg hover:bg-green-600 transition"
                      >
                        ชำระเงิน
                      </a>
                    )}
                  </div>

                  <div className="text-md font-light text-black text-center flex flex-col space-y-4">
                    <button
                      onClick={() => {
                        if (order.status === "inspection" || order.status === "to_pay") {
                          setIsDelModalOpen(true);
                          setSelectedItem(order.order_id);
                        }
                      }}
                      disabled={!(order.status === "inspection" || order.status === "to_pay")}
                      className={`w-1/2 mx-auto text-center text-white px-4 py-2 rounded-lg transition ${(order.status === "inspection" || order.status === "to_pay")
                        ? "bg-red-500 hover:bg-red-600 cursor-pointer"
                        : "bg-gray-400 cursor-not-allowed opacity-50"
                        }`}
                    >
                      ยกเลิกคำสั่งซื้อ
                    </button>
                  </div>

                  {order.status === "canceled_by_tech" && (
                    <div className="text-md font-light text-black text-center flex flex-col space-y-4">
                      กรุณาติดต่อที่เบอร์<br />02-723-4900
                    </div>
                  )}
                </div>
              </div>
            ))
        )}
        <Dialog open={isDelModalOpen} onClose={() => setIsDelModalOpen(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 md:w-1/4 w-3/4 text-center justify-center text-black">
            <div className="flex justify-center mb-4">
              <svg className="items-center flex " width="64" height="64" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24 7H20.9C20.4216 4.67358 18.3751 3.003 16 3H14C11.6249 3.003 9.57843 4.67358 9.1 7H6C5.44772 7 5 7.44772 5 8C5 8.55228 5.44772 9 6 9H7V22C7.00331 24.7601 9.23995 26.9967 12 27H18C20.7601 26.9967 22.9967 24.7601 23 22V9H24C24.5523 9 25 8.55228 25 8C25 7.44772 24.5523 7 24 7ZM14 5H16C17.271 5.00155 18.4036 5.8023 18.829 7H11.171C11.5964 5.8023 12.729 5.00155 14 5ZM21 22C21 23.6569 19.6569 25 18 25H12C10.3431 25 9 23.6569 9 22V9H21V22ZM13 21C13.5523 21 14 20.5523 14 20V14C14 13.4477 13.5523 13 13 13C12.4477 13 12 13.4477 12 14V20C12 20.5523 12.4477 21 13 21ZM18 20C18 20.5523 17.5523 21 17 21C16.4477 21 16 20.5523 16 20V14C16 13.4477 16.4477 13 17 13C17.5523 13 18 13.4477 18 14V20Z" fill="rgba(227, 31, 38, 1)"></path></svg>
            </div>
            <h1 className="text-2xl font-bold mb-4">คุณแน่ใจที่จะยกเลิกคำสั่งซื้อนี้ใช่หรือไม่?</h1>
            <div className="space-y-3">
              <button
                onClick={() => handleCancelOrder(selectedItem)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg mr-4 hover:bg-red-600 transition"
              >
                ยืนยัน
              </button>
              <button
                onClick={() => setIsDelModalOpen(false)}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    </div >
  );
}
