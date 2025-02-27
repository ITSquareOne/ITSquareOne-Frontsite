"use client";
import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";


export default function Sign_in() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    // Prevent scrolling when the page loads
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // Restore scroll when navigating away
    };
  }, []);
  
  return (
    <div className="relative min-h-screen bg-cover bg-center justify-center items-center flex" style={{backgroundImage: "url('/bg-main.png')"}}>
        <div className="bg-white md:max-w-[600px] md:min-h-[400px] mb-[200px] max-w-[340px] min-h-[400px] shadow-[0px_8px_7px_1px_rgba(0,_0,_0,_0.6)]
 rounded-xl container text-black  flex flex-col px-8">
          <h1 className="text-4xl font-semibold text-[#190832] mt-8 mb-4 text-center">เข้าสู่ระบบ</h1>
          <label className="">ชื่อผู้ใช้งาน</label>
          <input type="text" className="border-[#353535] border-2 rounded-md py-3 px-4" placeholder="กรอกชื่อผู้ใช้งาน"></input>
   
          {/* PASSWORD INPUT WITH TOGGLE ICON */}
        <label className="mt-4">รหัสผ่าน</label>
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            className="border-[#353535] border-2 rounded-md py-3 px-4 w-full pr-10"
            placeholder="กรอกรหัสผ่าน"
          />
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
          <button className="mt-4 bg-gray-800 hover:bg-black text-white w-40 text-center mx-auto rounded-md py-2 hover:text-white transition delay-180 duration-300 ease-in-out">เข้าสู่ระบบ</button>
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
  );
}
