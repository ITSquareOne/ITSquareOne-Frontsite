"use client";
import { useEffect, useState } from "react";
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

export default function ProfilePage() {
    const router = useRouter();
    const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [profile, setProfile] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null); // ✅ เก็บ token ใน state

    useEffect(() => {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }, []);
  
    useEffect(() => {
      if (token === null) return; 
      if (!token) {
        router.push("/sign-in");
      } else {
        getProfile();
      }
    }, [token]); 

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

  const editProfile = async () => {
    if (profile) {
      try {
        const updatedProfile = {
          firstNameEn: profile.firstNameEn,
          lastNameEn: profile.lastNameEn,
          firstNameTh: profile.firstNameTh,
          lastNameTh: profile.lastNameTh,
          profile : profile.profile
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
      <div className="bg-white w-4/5 min-h-[70vh] shadow-lg rounded-xl text-black flex p-8 mx-12 -mt-20">
        <div className="w-1/4 min-h-[70vh] h-full bg-gray-100 rounded-xl p-4 border border-black">
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

        <div className="w-3/4 h-auto bg-white rounded-xl p-6 border border-black ml-4">
          <h1 className="text-2xl font-bold">ข้อมูลส่วนตัว</h1>
          <p className="mt-2 text-gray-600">ยินดีต้อนรับเข้าสู่หน้าโปรไฟล์!</p>
          {profile ? (
             <div className="bg-white shadow-md rounded-lg p-6 w-full">
              <div className="flex justify-center items-center flex-col">
                <img
                  src={`data:image/jpeg;base64,${profile.profile}`} 
                  className="w-32 h-32 rounded-full border"
                />
                <input type="file" accept="image/*" onChange={base64GameChanger} className="p-1 mt-4 border rounded-md"/>
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
                    <button onClick={() => setEditModalOpen(true)}  className=" bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">แก้ไข</button>
                    
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
      </div>
    </div>
    </div>
  );
}