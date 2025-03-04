"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAddress, Address } from "../utils/api";


interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function CheckoutPage() {
  const cartItems: CartItem[] = [
    { id: 1, name: "RAM DDR2(800) BLACKBERRY", price: 3350, image: "/ram.png" },
    { id: 2, name: "RAM DDR2(800) BLACKBERRY", price: 3350, image: "/ram.png" },
    { id: 3, name: "RAM DDR2(800) BLACKBERRY", price: 3350, image: "/ram.png" },
    { id: 4, name: "RAM DDR2(800) BLACKBERRY", price: 3350, image: "/ram.png" },
    { id: 5, name: "RAM DDR2(800) BLACKBERRY", price: 3350, image: "/ram.png" },
    { id: 6, name: "RAM DDR2(800) BLACKBERRY", price: 3350, image: "/ram.png" }
  ];

  // Address Selection State
  const [selectedTab, setSelectedTab] = useState<"old" | "new">("new");

  // Address Fields State
  const [recipient, setRecipient] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (selectedTab === "old") {
      fetchAddresses();
    }
  }, [selectedTab]);

  const fetchAddresses = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const addresses = await getAddress(token);
      setSavedAddresses(addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);
  const shippingCost = 25;
  const finalPrice = totalPrice + shippingCost;

  return (
    <div className="min-h-screen flex flex-col bg-[#1B1038] text-white">
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row justify-center items-start px-8 py-6 gap-8">
        {/* Left Section: Product List */}
        <div className="w-full lg:flex-1 bg-white text-black rounded-lg shadow-lg flex flex-col">
          {/* Scrollable Cart with Fixed Header */}
          <div className="w-full lg:flex-1 bg-white text-black rounded-lg shadow-lg flex flex-col">
            {/* 🟡 Fixed Header */}
            <h3 className="bg-yellow-400 text-center text-lg font-semibold py-2 rounded-t-lg">รายการสินค้า</h3>
            {/* 🔥 Scrollable List (Height-Controlled) */}
            <div className="p-4 space-y-4 overflow-y-auto" style={{ maxHeight: "400px" }}>
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center bg-gray-100 p-2 rounded-lg shadow-md">
                  <Image src={item.image} alt={item.name} width={60} height={60} className="rounded-md" />
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-blue-600 font-bold">THB {item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-sm w-full flex justify-end">
            <div className="bg-white text-black px-4 mx-8 mb-10 mt-4 pt-0 max-w-4xl w-full">
              <h3 className="text-xl font-normal mb-2">ข้อมูลการชำระเงิน</h3>
              <div className="flex justify-between text-gray-600">
                <span>รวมการสั่งซื้อ</span>
                <span>{totalPrice} บาท</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>การจัดส่ง</span>
                <span>{shippingCost} บาท</span>
              </div>
              <div className="flex justify-between font-normal text-lg mt-2">
                <span>ยอดชำระทั้งหมด</span>
                <span>{finalPrice} บาท</span>
              </div>
              <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-normal">
                สั่งสินค้า
              </button>
            </div>
          </div>
          </div>
        </div>
        {/* Right Section: Shipping Details with Tabs */}
        <div className="w-full lg:flex-1 bg-white text-black rounded-lg shadow-lg flex flex-col">
          <h3 className="bg-yellow-400 text-center text-lg font-semibold py-2 rounded-t-lg">ที่อยู่จัดส่ง</h3>
          {/* Address Tabs */}
          <div className="flex border-b bg-gray-200">
            <button
              className={`flex-1 py-2 text-center ${selectedTab === "new" ? "bg-white text-black font-semibold" : "text-gray-500"}`}
              onClick={() => setSelectedTab("new")}
            >
              เพิ่มที่อยู่ใหม่
            </button>
            <button
              className={`flex-1 py-2 text-center ${selectedTab === "old" ? "bg-white text-black font-semibold" : "text-gray-500"}`}
              onClick={() => setSelectedTab("old")}
            >
              ที่อยู่เดิม
            </button>
          </div>
          {/* Address Content */}
          <div className="p-4 pb-0">
          {selectedTab === "new" ? (
              <>
                <div className="mb-4">
                  <label className="block text-gray-600 text-sm font-medium">ชื่อผู้รับ</label>
                  <input
                    type="text"
                    placeholder="ชื่อผู้รับ"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 text-sm font-medium">ที่อยู่</label>
                  <textarea
                    placeholder="ที่อยู่"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full h-20"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                   <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-normal">
                        เพิ่มที่อยู่ใหม่
                    </button>
                </div>
               
              </>
            ) : loading ? (
              <p className="text-center text-gray-600">กำลังโหลด...</p>
            ) : savedAddresses.length > 0 ? (
              savedAddresses.map((addr, index) => (
                <div key={index} className="bg-gray-100 p-2 mb-3 rounded-md my-2 flex justify-between items-center">
                    <p className="text-sm">{addr.address}</p>
                    <div className="flex space-x-2">
                    <button className="bg-green-500 hover:bg-green-600 text-white p-1 px-2 shadow-sm rounded-md transition" onClick={() => setSelectedAddress(addr)}>
                        เลือก
                        </button>

                        <button className="bg-blue-500 hover:bg-blue-600 text-white p-1 px-2 shadow-sm rounded-md transition">✏️</button>
                        <button className="bg-red-500 hover:bg-red-600 text-white p-1 px-2 shadow-sm rounded-md transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                                <path d="M10 11v6"></path>
                                <path d="M14 11v6"></path>
                                <path d="M9 6V3h6v3"></path>
                            </svg>
                        </button>
                    </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">ไม่มีที่อยู่ที่บันทึกไว้</p>
            )}
            {selectedAddress && (
            <div className="mt-4 mb-4 p-4 bg-gray-200 rounded-md shadow-md">
                <h1 className="text-lg font-medium">ที่อยู่ที่เลือก</h1>
                <h1 className="text-gray-700">{selectedAddress.address}</h1>
            </div>
            )}
          </div>
          {/* Payment Summary */}
        </div>
      </div>
    </div>
  );
}
