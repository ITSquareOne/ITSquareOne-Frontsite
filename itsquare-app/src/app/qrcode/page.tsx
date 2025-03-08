"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from 'next/navigation';
import { confirmPayment } from "../utils/api";

export default function Payment() {
  const [token, setToken] = useState<string | null>(null);
  const searchParams = useSearchParams(); 
  const totalPrice = searchParams.get('totalPrice'); 
  const orderId = searchParams.get('orderId'); 
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    document.body.style.overflow = "hidden"; 
    if (storedToken) {
      setToken(storedToken);
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

  };

  const handleConfirmPayment = async () => {
  if (!token || !orderId) return;
  if (!selectedFile) {
    alert("กรุณาอัปโหลดสลิปการโอนก่อนยืนยันการชำระเงิน");
    return;
  }
  try {
    await confirmPayment(token, parseInt(orderId));
    alert("การชำระเงินสำเร็จ!");
    window.location.href = "/status";
  } catch (error) {
    console.log(error);
    alert("เกิดข้อผิดพลาดในการยืนยันการชำระเงิน");
  }
};

  useEffect(() => {
    console.log(base64Image);
  }, [base64Image]);
  useEffect(() => {
    if (!token) return;
  }, [token]);

  return (
    <div
      className="relative min-h-screen flex flex-col items-center bg-cover bg-center px-4 py-5"
      
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
        className="absolute bottom-20 left-0 hidden md:block xl:w-1/4 w-auto object-contain"
      />

      {/* Responsive QR Payment Card */}
      <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
        {/* Header Section */}
        <div className="w-full py-2 bg-blue-700 rounded-tl-3xl text-center text-white font-bold">
          QR Payment
        </div>

        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-br-3xl shadow-lg text-center w-full">
          {/* 📷 QR Code Image */}
          <div className="flex justify-center mb-4">
            <Image src="/qrcode.png" alt="QR Code" width={200} height={200} className="w-2/3 sm:w-1/2" />
          </div>

          {/* ✅ Display Dynamic Payment Amount */}
          <p className="text-lg font-bold text-gray-800">
            ชำระเงิน {totalPrice} บาท {/* แสดงค่า totalPrice */}
          </p>

          <div className="mt-4">
            <label className="block text-gray-500 font-semibold mb-2">หลักฐานการชำระเงิน</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" />
          </div>

          {/* Buttons */}
          <div className="gap-3 flex justify-center">
            <button onClick={handleConfirmPayment} className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition">
              ยืนยัน
            </button>
            <button className="mt-4 bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-500 transition">
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
