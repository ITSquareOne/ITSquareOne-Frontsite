"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Prevent scrolling when the page loads
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // Restore scroll when navigating away
    };
  }, []);

  useEffect(() => {
    // ✅ Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleButtonClick = () => {
    if (isLoggedIn) {
      router.push("/main-cate"); // ✅ Redirect to main category page if logged in
    } else {
      router.push("/sign-in"); // ✅ Redirect to login page if not logged in
    }
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center">
      <Image
        src="/popo.png"
        alt="PoPo"
        width={600}
        height={500}
        className="absolute right-0 top-0 -mt-10 md:block xl:w-1/4 w-auto hidden object-contain"
      />
      <div className="absolute p-6 md:top-1/4 md:left-1/3 top-0 left-1/3 -translate-x-1/2 -translate-y-1/3 mt-20">
        <h1 className="lg:text-7xl md:text-5xl text-2xl font-bold md:mb-10 mb-6">สวัสดี,</h1>
        <h1 className="lg:text-7xl md:text-5xl text-2xl font-bold md:mb-10 mb-10">อยากประกอบคอมใช่ไหม?</h1>
        <button
          className="text-black md:text-xl text-2xl text-center flex bg-yellow-300 md:py-3 md:px-12 py-2 px-4 rounded-full hover:bg-transparent hover:border-yellow-300 hover:border-2 hover:text-white transition delay-180 duration-300 ease-in-out"
          onClick={handleButtonClick} // ✅ Handle button click event
        >
          <span className="lg:text-2xl text-l">เริ่มประกอบ</span>
        </button>
      </div>
    </div>
  );
}
