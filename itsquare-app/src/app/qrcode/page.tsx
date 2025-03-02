"use client";
import Image from "next/image";
import { useEffect } from "react";

export default function Payment() {
  useEffect(() => {
    // Disable scrolling when the page loads
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // Re-enable scrolling when leaving
    };
  }, []);

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/bg-main.png')" }}
    >
      {/*Fixed to Bottom-Right9*/}
      <Image
        src="/popo.png" // Adjust the image path
        alt="PoPo Mascot"
        width={250}
        height={250}
        className="absolute bottom-20 right-0 hidden md:block xl:w-1/4 w-auto object-contain rotate-90"
      />
      <Image
        src="/cpu.png" // Adjust the image path
        alt="PoPo Mascot"
        width={250}
        height={250}
        className="absolute bottom-20 left-0 hidden md:block xl:w-1/4 w-auto object-contain "
      />

      {/* Responsive QR Payment Card */}
      <div className="mb-10 -mt-5 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
        {/* Header Section */}
        <div className="w-full py-2 bg-blue-700 rounded-tl-3xl text-center text-white font-bold">
          QR Payment
        </div>

        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-br-3xl shadow-lg text-center w-full">
          {/* 📷 QR Code Image */}
          <div className="flex justify-center mb-4">
            <Image src="/qrcode.png" alt="QR Code" width={200} height={200} className="w-2/3 sm:w-1/2" />
          </div>

          {/* Payment Amount */}
          <p className="text-lg font-bold text-gray-800">ชำระเงิน {0} บาท</p>

          {/* Buttons */}
          <div className="gap-3 flex justify-center">
            <button className="mt-4 bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-500 transition">
              ยกเลิก
            </button>
            <button className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition">
              เสร็จสิ้น
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
