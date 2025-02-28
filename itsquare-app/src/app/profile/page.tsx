"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "../components/Modal";

export default function ProfilePage() {
    const router = useRouter();
    const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/sign-in");
    }
  }, []);

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
      <div className="bg-white w-4/5 h-[80vh] shadow-lg rounded-xl text-black flex p-8 mx-12 -mt-20">
        {/* Sidebar ด้านซ้าย */}
        <div className="w-1/4 h-full bg-gray-100 rounded-xl p-4 border border-black">
          <h2 className="text-lg font-semibold">สวัสดี </h2>
          <ul className="mt-4 space-y-2">
            <li className="p-2 bg-gray-200 rounded-lg cursor-pointer">ข้อมูลส่วนตัว</li>
            <li className="p-2 bg-gray-200 rounded-lg cursor-pointer">ที่อยู่จัดส่งสินค้า</li>
            <li className="p-2 bg-gray-200 rounded-lg cursor-pointer">รายการคำสั่งซื้อ</li>
            <li className="p-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-400 transition hover:text-white" onClick={handleLogout}>ออกจากระบบ</li>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            {modalContent}
            </Modal>
          </ul>
        </div>

        {/* Content ด้านขวา */}
        <div className="w-3/4 h-full bg-white rounded-xl p-6 border border-black ml-4">
          <h1 className="text-2xl font-bold">Profile Content</h1>
          <p className="mt-2 text-gray-600">Welcome to your profile page!</p>
        </div>
      </div>
    </div>
    </div>
  );
}