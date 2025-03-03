"use client";  //Converts this component into a Client Component, allowing useEffect to work.
import Image from "next/image";
import { useEffect } from "react";
export default function Home() {

  useEffect(() => {
    // Prevent scrolling when the page loads
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // Restore scroll when navigating away
    };
  }, []);

  return (
    <div>
      <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/bg-main.png')" }}>
        <Image
          src="/popo.png" // เปลี่ยนเป็น path ของรูปที่ใช้
          alt="PoPo"
          width={600} // ปรับขนาดตามต้องการ
          height={500}
          className="absolute right-0 top-0 md:bottom-[-10px] md:block xl:w-1/4 w-auto hidden object-contain"
        />
        <div className="absolute p-6 md:top-1/4 md:left-1/3 top-0 left-1/3 -translate-x-1/2 -translate-y-1/3 mt-20">
          <h1 className="lg:text-7xl md:text-5xl text-2xl font-bold md:mb-10 mb-6">สวัสดี,</h1>
          <h1 className="lg:text-7xl md:text-5xl text-2xl font-bold md:mb-10 mb-10">อยากประกอบคอมใช่ไหม?</h1>
          <button className="text-black md:text-4xl text-2xl text-center flex bg-yellow-300 md:py-3 md:px-12 py-2 px-4 rounded-full hover:bg-transparent hover:border-yellow-300 hover:border-2 hover:text-white transition delay-180 duration-300 ease-in-out">
            <a className="lg:text-3xl md:text-3xl text-xl" href="./sign-in">เข้าสู่ระบบ</a>
          </button>
        </div>
      </div>
        <p className="">ITSquareOne - แพลตฟอร์มซื้อ-ขายอะไหล่คอมมือสองสำหรับนักศึกษา IT 💻✨

          ITSquareOne คือเว็บไซต์สำหรับนักศึกษาคณะเทคโนโลยีสารสนเทศที่ต้องการซื้ออะไหล่คอมมือสอง คุณภาพดี ราคาประหยัด 💰 ไม่ว่าคุณจะกำลังมองหา ซีพียู, เมนบอร์ด, การ์ดจอ, แรม หรือ SSD สำหรับอัปเกรดคอมพิวเตอร์ของคุณ หรืออยาก ขายต่ออะไหล่ที่ยังใช้งานได้ ให้เพื่อนนักศึกษาได้ประกอบเครื่องใหม่ในราคาที่เข้าถึงได้</p>
    </div>
  );
}
