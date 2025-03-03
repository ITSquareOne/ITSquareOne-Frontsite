"use client";
import { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "../components/Modal";
import { Dialog } from "@headlessui/react";
import axios from "axios"

interface User {
  user_id?: number;
  username?: string;
  firstNameEn?: string;
  lastNameEn?: string;
  firstNameTh?: string;
  lastNameTh?: string;
  profile: string | null;
  role?: string;
}

interface Address {
  address_id?: number;
  user_id?: number;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const menuItems = ["ข้อมูลส่วนตัว", "ที่อยู่จัดส่งสินค้า", "รายการคำสั่งซื้อ"];
  const [selected, setSelected] = useState("ข้อมูลส่วนตัว");
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [updateAddress, setUpdateAddress] = useState("");
  const [address, setAddress] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [orders, setOrders] = useState<{ order_id: number, status: string, total_price: number }[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (token === null) return;
    if (!token) {
      router.push("/sign-in");
    } else {
      getProfile();
      getAddress();
      fetchOrders(); // ✅ Fetch Orders when Profile loads
    }
  }, [token]);

  // Fetch Orders from API
  const fetchOrders = async () => {
    if (!token) return;
  
    try {
      const userId = profile?.user_id; // Get User ID from profile
      if (!userId) return;
  
      const response = await axios.get(`http://localhost:3000/orders/user/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
  
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  

  const getProfile = async () => {
    try {
      const results = await axios.get("http://localhost:3000/api/users/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      console.log(results.data);
      setProfile(results.data);
    } catch (err) {
      console.log(err);
    }
  }

  const getAddress = async () => {
    try {
      const results = await axios.get("http://localhost:3000/api/addresses/self", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      setAddresses(results.data);
    } catch (error) {
      console.log(error);
    }

  }

  const editProfile = async () => {
    if (profile) {
      try {
        const updatedProfile = {
          firstNameEn: profile.firstNameEn,
          lastNameEn: profile.lastNameEn,
          firstNameTh: profile.firstNameTh,
          lastNameTh: profile.lastNameTh,
          profile: profile.profile
        };

        const results = await axios.put("http://localhost:3000/api/users/profile", updatedProfile, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        }
        );
        setProfile(results.data);
        setModalContent(
          <div>
            <h2 className="text-xl font-semibold text-green-600">
              อัปเดตโปรไฟล์สำเร็จ ✅
            </h2>
          </div>
        );
        setIsModalOpen(true);

      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์", err);
        setModalContent(
          <div>
            <h2 className="text-xl font-semibold text-red-600">
              อัปเดตโปรไฟล์ไม่สำเร็จ ❌
            </h2>
          </div>
        );
        setIsModalOpen(true);
      }
    }
  }
  const createAddress = async () => {
    if (!address) return;

    try {
      const newAddress = {
        address: address,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const results = await axios.post(`http://localhost:3000/api/addresses/self`, newAddress, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      setAddresses([...addresses, results.data]);
      setIsAddressOpen(false);
    } catch (err) {
      console.log(err);
    }
  }

  const editAddress = async () => {
    if (!addresses || selectedAddressId === null) return;

    const selectedAddress = addresses.find(addr => addr.address_id === selectedAddressId);

    if (!selectedAddress) return;
    try {
      const updatedAddress = {
        ...selectedAddress,
        address: updateAddress,
        updated_at: new Date().toISOString()
      };
      console.log(updatedAddress);

      await axios.put(`http://localhost:3000/api/addresses/self/${selectedAddressId}`, updatedAddress, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      setAddresses(addresses.map(addr =>
        addr.address_id === selectedAddressId ? { ...addr, address: updateAddress } : addr
      ));
      setIsEditAddressModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  }

  const deleteAddress = async () => {
    if (!addresses || selectedAddressId === null) return;

    const selectedAddress = addresses.find(addr => addr.address_id === selectedAddressId);

    if (!selectedAddress) return;
    try {
      await axios.delete(`http://localhost:3000/api/addresses/self/${selectedAddressId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      setAddresses(addresses.filter(addr => addr.address_id !== selectedAddressId));
      setIsDelModalOpen(false);
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการลบที่อยู่", err);
    }
  };
  const handleAddressEditClick = (addr: Address) => {
    setUpdateAddress(addr.address ?? "");
    setSelectedAddressId(addr.address_id ?? null);
    setIsEditAddressModalOpen(true);
  };

  const handleDeleteAddress = (addr: Address) => {
    setSelectedAddressId(addr.address_id ?? null);
    setIsDelModalOpen(true);
  };


  const base64GameChanger = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        setProfile((prev) => ({
          ...prev,
          profile: result.split(",")[1],
        }));
      };
      reader.onerror = () => {
        console.error("เกิดข้อผิดพลาดในการอ่านไฟล์");
      };
    }
  };



  const handleLogout = async () => {
    localStorage.removeItem("token");
    setModalContent(
      <div>
        <h2 className="text-xl font-semibold text-green-600">ทำการออกจากระบบเรียบร้อย ✅</h2>
      </div>
    );
    setIsModalOpen(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);

    return;
  }

  return (
    <div className={isModalOpen ? ' bg-black opacity-50' : ''}>

      <div
        className="relative min-h-screen bg-cover bg-center flex justify-center items-center"
        style={{ backgroundImage: "url('/bg-main.png')" }}
      >
        <div className="bg-white w-4/5 min-h-[70vh] shadow-lg rounded-l text-black flex p-8 mx-12 -mt-20">
          <div className="w-1/4 min-h-[70vh] h-full bg-gray-100 rounded-l p-4 border shadow-md">
            <h2 className="text-lg font-semibold">สวัสดีคุณ {profile?.firstNameTh}!!</h2>
            <ul className="mt-4 space-y-2">
              {menuItems.map((item) => (
                <li
                  key={item}
                  className={`p-2 bg-gray-200 rounded-lg cursor-pointer border-2 border-gray-200
                ${selected === item ? "bg-yellow-400 text-black hover:bg-yellow-600 hover:text-white transition" : "bg-white text-black hover:bg-slate-400  hover:text-white transition"}`}
                  onClick={() => setSelected(item)}
                >
                  {item}
                </li>
              ))}
              <li className="p-2 bg-black text-white rounded-lg cursor-pointer hover:bg-red-500 transition hover:text-white" onClick={handleLogout}>ออกจากระบบ</li>
              
              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {modalContent}
              </Modal>
            </ul>
          </div>
          {selected === "ข้อมูลส่วนตัว" &&
            <div className="w-3/4 h-auto bg-white rounded-l p-6 border shadow-md ml-4">
              <h1 className="text-2xl font-bold">ข้อมูลส่วนตัว</h1>
              <p className="mt-2 text-gray-600">ยินดีต้อนรับเข้าสู่หน้าโปรไฟล์!</p>
              {profile ? (
                <div className="bg-white rounded-lg p-6 w-full">
                  <div className="flex justify-center items-center flex-col">
                    <img
                      src={`data:image/jpeg;base64,${profile.profile}`}
                      className="w-32 h-32 rounded-full border"
                    />
                    <input type="file" accept="image/*" onChange={base64GameChanger} className="p-1 mt-4 w-2/4 border rounded-md" />
                  </div>
                  <h2 className="text-lg font-semibold border-b pb-2 mb-4">โปรไฟล์ของฉัน</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">ชื่อ-นามสกุล</span>
                      <span className="text-black font-medium">{profile.firstNameTh} {profile.lastNameTh}</span>
                      <button className="text-blue-600 hover:underline"></button>
                    </div>

                    <div className="flex justify-between items-center border-t pt-3">
                      <span className="text-gray-600">ชื่อ-นามสกุล (EN)</span>
                      <span className="text-black font-medium">{profile.firstNameEn} {profile.lastNameEn}</span>
                      <button className="text-blue-600 hover:underline"></button>
                    </div>

                    <div className="flex justify-between items-center border-t pt-3">
                      <span className="text-gray-600">ชื่อผู้ใช้งาน</span>
                      <span className="text-black font-medium">{profile.username}</span>
                      <span className="text-black font-medium"></span>
                    </div>

                    <div className="flex justify-center items-center pt-5">
                      <button
                        onClick={editProfile}
                        className=" bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition mr-4"
                      >
                        บันทึก
                      </button>
                      <button onClick={() => setEditModalOpen(true)} className=" bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">แก้ไข</button>

                      <Dialog open={isEditModalOpen} onClose={() => setEditModalOpen(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-80 text-center text-black">
                          <h2 className="text-xl font-bold mb-4">Edit User</h2>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-left font-semibold">ชื่อผู้ใช้งาน</label>
                              <input
                                type="text"
                                className="w-full border p-2 rounded-md text-gray-400"
                                value={profile.username}
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-left font-semibold">ชื่อ (TH)</label>
                              <input
                                type="text"
                                className="w-full border p-2 rounded-md"
                                value={profile.firstNameTh}
                                onChange={(e) => setProfile({ ...profile, firstNameTh: e.target.value })}
                              />
                            </div>

                            <div>
                              <label className="block text-left font-semibold">นามสกุล (TH)</label>
                              <input
                                type="text"
                                className="w-full border p-2 rounded-md"
                                value={profile.lastNameTh}
                                onChange={(e) => setProfile({ ...profile, lastNameTh: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-left font-semibold">ชื่อ (EN)</label>
                              <input
                                type="text"
                                className="w-full border p-2 rounded-md"
                                value={profile.firstNameEn}
                                onChange={(e) => setProfile({ ...profile, firstNameEn: e.target.value })}
                              />
                            </div>

                            <div>
                              <label className="block text-left font-semibold">นามสกุล (EN)</label>
                              <input
                                type="text"
                                className="w-full border p-2 rounded-md "
                                value={profile.lastNameEn}
                                onChange={(e) => setProfile({ ...profile, lastNameEn: e.target.value })}
                              />
                            </div>

                            <div>
                              <label className="block text-left font-semibold">ประเภทของบัญชี</label>
                              <input
                                type="text"
                                className="w-full border p-2 rounded-md text-gray-400"
                                value={profile.role}
                                readOnly
                              />
                            </div>

                            <button
                              onClick={() => setEditModalOpen(false)}
                              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                            >
                              ปิด
                            </button>
                          </div>
                        </div>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ) : (
                <p>กำลังโหลดข้อมูล...</p>
              )}


            </div>
          }
          {/* ช่องรายการสั่งซื้อ */}
          {selected === "รายการคำสั่งซื้อ" &&
            <div className="w-3/4 h-auto bg-white rounded-xl p-6 border border-black ml-4">
              <h1 className="text-2xl font-bold">รายการคำสั่งซื้อ</h1>
              <p className="mt-2 text-gray-600">ดูคำสั่งซื้อของคุณที่นี่!</p>

              {/* Scrollable Order List */}
              <div className="mt-4 h-[400px] overflow-y-auto border rounded-lg p-4">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <div
                      key={order.order_id}
                      className="mt-2 w-full rounded-xl shadow-md border-gray-500 text-center flex items-center justify-between gap-2 px-5 py-5 cursor-pointer transition bg-gray-100 hover:bg-gray-300"
                    >
                      <div className="text-left">
                        <p className="font-semibold text-black">คำสั่งซื้อ #{order.order_id}</p>
                        <p className="text-sm text-gray-700">สถานะ: {order.status}</p>
                      </div>
                      <p className="text-lg font-bold text-blue-600">{order.total_price} บาท</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center mt-4 text-gray-500">ไม่มีรายการคำสั่งซื้อ</p>
                )}
              </div>
            </div>
          }


          {selected === "ที่อยู่จัดส่งสินค้า" &&
            <div className="w-3/4 h-auto bg-white rounded-xl p-6 border border-black ml-4">
              <h1 className="text-2xl font-bold">ที่อยู่จัดส่งสินค้า</h1>
              <p className="mt-2 text-gray-600">จัดการที่อยู่ของคุณ!</p>
              {addresses ? (
                addresses?.map((addr) => (
                  <div
                    key={addr.address_id}
                    className={`mt-2 w-full rounded-xl shadow-md border-gray-500 text-center flex items-center justify-between gap-2 px-5 py-5 cursor-pointer transition ${selectedAddressId === addr.address_id ? "bg-gray-400 text-white" : "bg-gray-100 hover:bg-gray-300"
                      }`}
                    onClick={() => setSelectedAddressId(addr.address_id ?? null)} // เปลี่ยนค่าเมื่อกด
                  >
                    <p>{addr.address}</p>
                    <div>
                      <button onClick={(e) => {
                        e.stopPropagation();
                        handleAddressEditClick(addr);
                      }} className="bg-blue-500 p-2 shadow-md rounded-xl text-white hover:bg-blue-600 transition mr-3">แก้ไข</button>
                      <button onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(addr)
                      }} className="bg-red-500 p-2 px-3 shadow-md rounded-xl text-white hover:bg-red-600 transition">ลบ</button>
                    </div>

                  </div>
                ))
              ) : (
                <p>กำลังโหลดข้อมูล...</p>
              )}
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
                      onClick={editAddress}
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
              <Dialog open={isDelModalOpen} onClose={() => setIsDelModalOpen(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 md:w-1/4 w-3/4 text-center justify-center text-black">
                  <div className="flex justify-center mb-4">
                    <svg className="items-center flex " width="64" height="64" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24 7H20.9C20.4216 4.67358 18.3751 3.003 16 3H14C11.6249 3.003 9.57843 4.67358 9.1 7H6C5.44772 7 5 7.44772 5 8C5 8.55228 5.44772 9 6 9H7V22C7.00331 24.7601 9.23995 26.9967 12 27H18C20.7601 26.9967 22.9967 24.7601 23 22V9H24C24.5523 9 25 8.55228 25 8C25 7.44772 24.5523 7 24 7ZM14 5H16C17.271 5.00155 18.4036 5.8023 18.829 7H11.171C11.5964 5.8023 12.729 5.00155 14 5ZM21 22C21 23.6569 19.6569 25 18 25H12C10.3431 25 9 23.6569 9 22V9H21V22ZM13 21C13.5523 21 14 20.5523 14 20V14C14 13.4477 13.5523 13 13 13C12.4477 13 12 13.4477 12 14V20C12 20.5523 12.4477 21 13 21ZM18 20C18 20.5523 17.5523 21 17 21C16.4477 21 16 20.5523 16 20V14C16 13.4477 16.4477 13 17 13C17.5523 13 18 13.4477 18 14V20Z" fill="rgba(227, 31, 38, 1)"></path></svg>
                  </div>
                  <h1 className="text-2xl font-bold mb-4">คุณแน่ใจที่จะลบที่อยู่นี้ใช่หรือไม่?</h1>
                  <div className="space-y-3">
                    <button
                      onClick={deleteAddress}
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
              <button onClick={() => setIsAddressOpen(true)} className="mt-10 w-full text-white bg-green-500 rounded-xl shadow-md border-green-600 text-center flex items-center justify-center gap-2 p-3 cursor-pointer hover:bg-green-600 transition">
                <svg width="24" height="24" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M7.00001 0.600098C5.73421 0.600098 4.49683 0.975451 3.44436 1.67869C2.39188 2.38193 1.57158 3.38148 1.08718 4.55092C0.602779 5.72037 0.476038 7.0072 0.722983 8.24867C0.969929 9.49015 1.57947 10.6305 2.47453 11.5256C3.36958 12.4206 4.50995 13.0302 5.75143 13.2771C6.99291 13.5241 8.27973 13.3973 9.44918 12.9129C10.6186 12.4285 11.6182 11.6082 12.3214 10.5557C13.0247 9.50327 13.4 8.2659 13.4 7.0001C13.3982 5.30327 12.7233 3.67648 11.5235 2.47664C10.3236 1.27681 8.69683 0.601933 7.00001 0.600098V0.600098ZM7.00001 12.3334C5.94517 12.3334 4.91403 12.0206 4.03697 11.4346C3.1599 10.8486 2.47632 10.0156 2.07265 9.04107C1.66898 8.06654 1.56337 6.99418 1.76915 5.95962C1.97494 4.92505 2.48289 3.97474 3.22877 3.22886C3.97465 2.48298 4.92496 1.97503 5.95953 1.76924C6.99409 1.56345 8.06645 1.66907 9.04099 2.07274C10.0155 2.47641 10.8485 3.15999 11.4345 4.03706C12.0205 4.91412 12.3333 5.94526 12.3333 7.0001C12.3318 8.41411 11.7694 9.76976 10.7695 10.7696C9.76967 11.7695 8.41402 12.3319 7.00001 12.3334ZM9.66667 7.0001C9.66667 7.14155 9.61048 7.2772 9.51046 7.37722C9.41044 7.47724 9.27479 7.53343 9.13334 7.53343H7.53334V9.13343C7.53334 9.27488 7.47715 9.41053 7.37713 9.51055C7.27711 9.61057 7.14146 9.66676 7.00001 9.66676C6.85856 9.66676 6.7229 9.61057 6.62288 9.51055C6.52286 9.41053 6.46667 9.27488 6.46667 9.13343V7.53343H4.86667C4.72523 7.53343 4.58957 7.47724 4.48955 7.37722C4.38953 7.2772 4.33334 7.14155 4.33334 7.0001C4.33334 6.85865 4.38953 6.72299 4.48955 6.62297C4.58957 6.52295 4.72523 6.46676 4.86667 6.46676H6.46667V4.86676C6.46667 4.72531 6.52286 4.58966 6.62288 4.48964C6.7229 4.38962 6.85856 4.33343 7.00001 4.33343C7.14146 4.33343 7.27711 4.38962 7.37713 4.48964C7.47715 4.58966 7.53334 4.72531 7.53334 4.86676V6.46676H9.13334C9.27479 6.46676 9.41044 6.52295 9.51046 6.62297C9.61048 6.72299 9.66667 6.85865 9.66667 7.0001Z"></path>
                </svg>
                <span>เพิ่มที่อยู่</span>
              </button>
              <Dialog open={isAddressOpen} onClose={() => setIsAddressOpen(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 w-2/4 text-center text-black">
                  <h2 className="text-xl font-bold mb-4">เพิ่มที่อยู่จัดส่งสินค้าของคุณ</h2>
                  <div className="space-y-3">
                    <label className="block text-left font-semibold">ที่อยู่ในการจัดส่ง</label>
                    <textarea
                      placeholder="กรุณากรอกที่อยู่ของคุณ"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full h-32 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    ></textarea>
                    <button
                      onClick={createAddress}
                      className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg mr-8 hover:bg-green-600 transition"
                    >
                      บันทึก
                    </button>
                    <button
                      onClick={() => setIsAddressOpen(false)}
                      className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              </Dialog>

            </div>
          }
        </div>
      </div>
    </div>
  );
}