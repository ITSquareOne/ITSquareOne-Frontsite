"use client";
import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";
import Modal from "./LoginModal";
import axios from "axios";
import { useRouter } from "next/navigation";


export default function Sign_in() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // Restore scroll when navigating away
    };
  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/users/login",
        {
          username,
          password,
        },
        {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        }  
      );
      console.log("Login successful", res.data);

      if (res.data) {
        localStorage.setItem("token", res.data.tokens.accessToken);
        
      }
      setModalContent(
        <div>
          <h2 className="text-xl font-semibold text-green-600">เข้าสู่ระบบสำเร็จ ✅</h2>
          <p className="mt-2 text-gray-600">คุณสามารถใช้งานระบบได้แล้ว</p>
        </div>
      );
      setTimeout(() => {
        window.location.href = "/";
      }, 1500); 
    } catch (err) {
      console.log("เข้าสู่ระบบล้มเหลว");
      
      setModalContent(
        <div>
          <h2 className="text-xl font-semibold text-red-600">เข้าสู่ระบบล้มเหลว ❌</h2>
          <p className="mt-2 text-gray-600">กรุณาตรวจสอบชื่อผู้ใช้หรือรหัสผ่าน</p>
        </div>
      );
    } finally {
      setIsModalOpen(true);
    }
  };
  
  return (
    <div className={isModalOpen ? ' bg-black opacity-50' : ''}>
      <div className="relative min-h-screen bg-cover bg-center justify-center items-center flex" style={{backgroundImage: "url('/bg-main.png')"}}>
        <div className="bg-white md:max-w-[600px] md:min-h-[400px] mb-[200px] max-w-[340px] min-h-[400px] shadow-[0px_8px_7px_1px_rgba(0,_0,_0,_0.6)]
 rounded-xl container text-black  flex flex-col px-8">
          <h1 className="text-4xl font-semibold text-[#190832] mt-8 mb-4 text-center">เข้าสู่ระบบ</h1>
          <label className="">ชื่อผู้ใช้งาน</label>
          <input required type="text" 
          className="border-[#353535] border-2 rounded-md py-3 px-4" 
          placeholder="กรอกชื่อผู้ใช้งาน"
          value={username}
          onChange={(e) => setUsername(e.target.value)}></input>
   
        <label className="mt-4">รหัสผ่าน</label>
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            required
            className="border-[#353535] border-2 rounded-md py-3 px-4 w-full pr-10"
            placeholder="กรอกรหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
            )}
          </button>
        </div>
          
          <a onClick={() => setIsOpen(true)} className="cursor-pointer underline mt-2">ลืมรหัสผ่าน?</a>
          <button className="mt-4 bg-gray-800 hover:bg-black text-white w-40 text-center mx-auto rounded-md py-2 hover:text-white transition delay-180 duration-300 ease-in-out"
           onClick={handleLogin}>เข้าสู่ระบบ</button>
           <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            {modalContent}
          </Modal>
          <a href="sign-up" className="cursor-pointer underline text-center mt-4">ไม่มีบัญชี?</a>
          {isOpen && ( 
            <form className="bg-black bg-opacity-30 flex inset-0 fixed justify-center items-center">
              <div className="container bg-white max-w-[500px] min-h-[150px] rounded-md shadow-[0px_8px_7px_1px_rgba(0,_0,_0,_0.2)] flex flex-col p-4 px-6">
                <label className="">อีเมลเพื่อเปลี่ยนรหัสผ่าน</label>
                <input required type="email" className="border-[#adadad] border-2 rounded-md py-2 px-4 mb-4" placeholder="กรอกอีเมล"></input>
                <div className="items-center flex justify-center gap-8">
                  <button onClick={() => setIsOpen(false)} className="hover:text-red-500 transition delay-180 duration-300 ease-in-out">ยกเลิก</button>
                  <button type="submit" /*onClick={() => location.reload()}*/ className="rounded-md bg-gray-800 hover:bg-black px-4 py-2 text-white  transition delay-180 duration-300 ease-in-out">ยืนยัน</button>
                </div>
              </div>
            </form>
          )}
        
        </div>
    </div>
    </div> 
  );
}
