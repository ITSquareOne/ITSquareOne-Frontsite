"use client";
import Image from "next/image";
import { useState } from "react";

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
  const [paymentMethod, setPaymentMethod] = useState("");

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
              // New Address Form
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
                </div>
              </>
            ) : (
              // Existing Address List (Replace with real user addresses)
              <div className="text-gray-600">
                <p>ที่อยู่ที่บันทึกไว้:</p>
                <p className="mt-2 bg-gray-100 p-2 rounded-md">123/45 ถนนสาย IT, เขตบางนา, กรุงเทพฯ</p>
              </div>
            )}
          </div>
          {/* Payment Summary */}
          <div className="text-sm w-full flex justify-end">
            <div className="bg-white text-black px-4 mx-8 mb-10 mt-0 pt-0 max-w-4xl w-full">
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
    </div>
  );
}
