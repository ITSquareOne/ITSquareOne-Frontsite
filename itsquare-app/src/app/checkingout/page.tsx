"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createOrder, createAddress, getAddress, editAddress, deleteAddress, Address } from "../utils/api";
import { Dialog } from "@headlessui/react";
import { useCart } from "../components/CartContext";

export default function CheckoutPage() {
  const { cart } = useCart();
  const [selectedTab, setSelectedTab] = useState<"old" | "new">("old");
  const [address, setAddress] = useState("");
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeleteItemOpen, setIsDeleteItemOpen] = useState(false);
  const [selectedAddressID, setSelectedAddressID] = useState<number | null>(null);
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);

  const [updateAddress, setUpdateAddress] = useState("");

  
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
    }
  }, []);
  useEffect(() => {
    if (token) {
      fetchAddresses();
    }
  }, [token]);


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
  const handleCreateAddress = async () => {
    if (!token) {
      console.error("No token found");
      return;
    }
  
    if (!address.trim()) {
      console.error("Address cannot be empty");
      return;
    }
  
    try {
      const newAddress = await createAddress(token, address);
      setSavedAddresses((prev) => [...prev, newAddress]); 
      setAddress(""); 
      setSelectedTab("old"); 
    } catch (error) {
      console.error("Failed to create address", error);
    }
  };
  const handleCreateOrder = async () => {
    if (!token || !selectedAddress) {
      alert("กรุณาเลือกที่อยู่ก่อนทำการสั่งซื้อ");
      return;
    }

    const partIds = cart.map(item => item.id);

    if (!Array.isArray(partIds) || partIds.length === 0) {
        console.error("No parts selected");
        alert("กรุณาเลือกสินค้าอย่างน้อย 1 รายการก่อนสั่งซื้อ");
        return;
    }
    try {
        if (selectedAddress.address_id && partIds.length > 0) {
          const order = await createOrder(token, selectedAddress.address_id, partIds);
          console.log("Order created:", order);
          setIsOrdering(true);
        } 
    } catch (error) {
        console.error("Failed to create order", error);
        alert("สินค้าดังกล่าวถูกสั่งซื้อไปแล้ว!!");
    }
};
  const handleDelete = async () => {
    if (!selectedAddressID) return;
    if (!token) {
        console.error("No token found");
        return;
    }
    try {
        await deleteAddress(token, selectedAddressID); 
        setSavedAddresses((prev) => prev.filter((addr) => addr.address_id !== selectedAddressID));
    } catch (error) {
        console.error("Failed to delete address", error);
    } finally {
        setIsDeleteItemOpen(false);
    }
    
};
  const handleEditAddress = async () => {
      if (!token || !editingAddressId || !updateAddress.trim()) return;
  
      try {
      await editAddress(token, editingAddressId, updateAddress);
  
      // อัปเดตที่อยู่ใหม่ใน State
      setSavedAddresses((prev) =>
          prev.map((addr) =>
          addr.address_id === editingAddressId ? { ...addr, address: updateAddress } : addr
          )
      );
  
      setIsEditAddressModalOpen(false); // ปิด Modal
      } catch (error) {
      console.error("Failed to update address", error);
      }
  };
const handleDeleteItemClick = (add_id: number) => {
    setSelectedAddressID(add_id);
    setIsDeleteItemOpen(true);
};

const handleEditClick = (addr: Address) => {
    setEditingAddressId(addr.address_id ?? null);
    setUpdateAddress(addr.address || ""); 
    setIsEditAddressModalOpen(true);
  };
  
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);
  const finalPrice = totalPrice;

  return (
    <div className="min-h-screen flex flex-col text-white">
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
              {cart.map((item) => (
                  <div key={item.id} className="flex flex-row">
                      <Image src={item.image && item.image.startsWith("data:image/jpeg;base64,") && !item.image.includes("undefined") ? item.image : "/sorry.jpg"} width={70} height={70} alt={item.name}/>
                      <div> 
                          <p>{item.name}</p>
                          <p className="text-xl text-blue-500">{item.price} บาท</p>
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
                <span>FREE!</span>
              </div>
              <div className="flex justify-between font-normal text-lg mt-2">
                <span>ยอดชำระทั้งหมด</span>
                <span>{finalPrice} บาท</span>
              </div>
              <button onClick={handleCreateOrder} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-normal transition">
                สั่งสินค้า
              </button>
            </div>
          </div>
          </div>
        </div>
        {/* Right Section: Shipping Details with Tabs */}
        <div className="w-full lg:flex-1 bg-white text-black rounded-lg shadow-lg flex flex-col min-h-[33vh] md:mb-0 mb-10">
          <h3 className="bg-yellow-400 text-center text-lg font-semibold py-2 rounded-t-lg">ที่อยู่จัดส่ง</h3>
          {/* Address Tabs */}
          <div className="flex border-b bg-gray-200">
            <button
              className={`flex-1 py-2 text-center ${selectedTab === "old" ? "bg-white text-black font-semibold" : "text-gray-500"}`}
              onClick={() => setSelectedTab("old")}
            >
                ที่อยู่เดิม
            </button>
            <button
              className={`flex-1 py-2 text-center ${selectedTab === "new" ? "bg-white text-black font-semibold" : "text-gray-500"}`}
              onClick={() => setSelectedTab("new")}
            >
              เพิ่มที่อยู่
            </button>
          </div>
          {/* Address Content */}
          <div className="p-4 pb-0 ">
          {selectedTab === "new" ? (
              <>
                <div className="mb-4">
                  <label className="block text-gray-600 text-sm font-medium">ที่อยู่</label>
                  <textarea
                    placeholder="ที่อยู่"
                    className="border border-gray-300 rounded-md px-3 py-2 w-full h-20"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                    <button onClick={handleCreateAddress} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-normal">
                        เพิ่มที่อยู่ใหม่
                    </button>
                </div>
               
              </>
            ) : loading ? (
              <p className="text-center text-gray-600">กำลังโหลด...</p>
            ) : savedAddresses.length > 0 ? (
              savedAddresses.map((addr, index) => (
                <div key={index} className="bg-gray-100 p-4 mb-3 rounded-md my-2 flex justify-between items-center shadow-md">
                    <p className="text-sm">{addr.address}</p>
                    <div className="flex space-x-2">
                    <button className="bg-green-500 hover:bg-green-600 text-white p-1 px-2 shadow-sm rounded-md transition" onClick={() => setSelectedAddress(addr)}>
                        เลือก
                        </button>
                        <button onClick={() => handleEditClick(addr)} className="bg-blue-500 hover:bg-blue-600 text-white p-1 px-2 shadow-sm rounded-md transition">✏️</button>
                        <button onClick={() => handleDeleteItemClick(addr.address_id as number)} className="bg-red-500 hover:bg-red-600 text-white p-1 px-2 shadow-sm rounded-md transition">
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
              <p className="text-gray-600 mb-4">ไม่มีที่อยู่ที่บันทึกไว้</p>
            )}
            {selectedTab !== "new" &&  (
                <div className="mt-4 mb-4 p-4 bg-gray-200 rounded-md shadow-md">
                    <h1 className="text-lg font-medium">ที่อยู่ที่เลือก</h1>
                    <h1 className="text-gray-700">{selectedAddress?.address ?? "ยังไม่ได้เลือกที่อยู่"}</h1>
                </div>
                )}
            <Dialog open={isDeleteItemOpen} onClose={() => setIsDeleteItemOpen(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 md:w-1/4 w-3/4 text-center justify-center text-black">
                    <div className="flex justify-center mb-4">
                        <svg className="items-center flex " width="64" height="64" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24 7H20.9C20.4216 4.67358 18.3751 3.003 16 3H14C11.6249 3.003 9.57843 4.67358 9.1 7H6C5.44772 7 5 7.44772 5 8C5 8.55228 5.44772 9 6 9H7V22C7.00331 24.7601 9.23995 26.9967 12 27H18C20.7601 26.9967 22.9967 24.7601 23 22V9H24C24.5523 9 25 8.55228 25 8C25 7.44772 24.5523 7 24 7ZM14 5H16C17.271 5.00155 18.4036 5.8023 18.829 7H11.171C11.5964 5.8023 12.729 5.00155 14 5ZM21 22C21 23.6569 19.6569 25 18 25H12C10.3431 25 9 23.6569 9 22V9H21V22ZM13 21C13.5523 21 14 20.5523 14 20V14C14 13.4477 13.5523 13 13 13C12.4477 13 12 13.4477 12 14V20C12 20.5523 12.4477 21 13 21ZM18 20C18 20.5523 17.5523 21 17 21C16.4477 21 16 20.5523 16 20V14C16 13.4477 16.4477 13 17 13C17.5523 13 18 13.4477 18 14V20Z" fill="rgba(227, 31, 38, 1)"></path></svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-4">คุณแน่ใจที่จะลบที่อยู่นี้ใช่หรือไม่?</h1>
                    <div className="space-y-3">
                        <button
                        onClick={handleDelete}
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg mr-4 hover:bg-red-600 transition"
                        >
                        ยืนยัน
                        </button>
                        <button
                        onClick={() => setIsDeleteItemOpen(false)}
                        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                        >
                        ยกเลิก
                        </button>
                    </div>
                    </div>
            </Dialog>
            <Dialog open={isOrdering} onClose={() => setIsOrdering(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 md:w-1/4 w-3/4 text-center text-black">
                  <div>
                    <h2 className="text-xl font-semibold text-green-600">ทำการสั่งซื้อสินค้าเรียบร้อย ✅</h2>
                    <p className="text-xl mb-4 font-semibold text-gray-600">กรุณาทำการชำระเงินในลำดับถัดไป</p>
                    <a
                      href="/status"
                      onClick={() => {
                        localStorage.removeItem("cart"); 
                        setIsOrdering(false);
                      }}
                      className=" bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                    >
                      ตกลง
                    </a>
                  </div>
                </div>
            </Dialog>
            <Dialog open={isEditAddressModalOpen} onClose={() => setIsEditAddressModalOpen(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 w-2/4 text-center text-black">
                    <h2 className="text-xl font-bold mb-4">แก้ไขที่อยู่ของคุณ</h2>
                    <div className="space-y-3">
                    <label className="block text-left font-semibold">ที่อยู่ในการจัดส่ง</label>
                    <textarea 
                        placeholder="กรุณากรอกที่อยู่ของคุณ"
                        value={updateAddress}
                        onChange={(e) => setUpdateAddress(e.target.value)}
                        className="w-full h-32 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                        ></textarea>
                        <button
                        onClick={handleEditAddress}
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg mr-8 hover:bg-green-600 transition"
                        >
                        บันทึก
                        </button>
                        <button
                        onClick={() => setIsEditAddressModalOpen(false)}
                        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                        >
                        ยกเลิก
                        </button>
                    </div>
                </div>
            </Dialog>
          </div>
          {/* Payment Summary */}
        </div>
      </div>
    </div>
  );
}
