"use client";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation"; // Change this line

export default function Sign_in() {
  const router = useRouter(); // Add this line
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [inputError, setInputError] = useState(false); // ✅ NEW: For input error state
  const [errorMessage, setErrorMessage] = useState(""); // ✅ NEW: Error message state
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // Restore scroll when navigating away
    };
  }, []);

  const handleLogin = async () => {
  setInputError(false);
  setErrorMessage("");

  if (!username.includes("tn") && !username.includes("it") && !username.includes("mn") && !username.includes("tester")) {
    setInputError(true);
    setErrorMessage("กรุณากรอกชื่อผู้ใช้ที่ถูกต้อง");
    return;
  }

  try {
    console.log("🔗 Sending login request...");

    const res = await axios.post("http://localhost:3000/api/users/login", 
      { username, password }, 
      { headers: { "Accept": "application/json", "Content-Type": "application/json" } }
    );

    console.log("✅ API Response:", res.data);

    // Check if accessToken exists
    if (res.data.tokens.accessToken) {
      console.log("🔑 Storing token...");
      localStorage.setItem("token", res.data.tokens.accessToken);
      setIsModalOpen(true); // Show modal on successful login
    } else {
      console.error("❌ Login failed: No accessToken received.");
      setInputError(true);
      setErrorMessage("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("❌ API Error:", err.response?.data || err.message);
    } else {
      console.error("❌ Unexpected Error:", err);
    }
    setInputError(true);
    setErrorMessage("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
  }
};

  
  

  return (
    <div className="relative min-h-screen bg-cover bg-center flex justify-center items-center" style={{ backgroundImage: "url('/bg-main.png')" }}>
      <div className="bg-white md:max-w-[600px] md:min-h-[400px] mb-[200px] max-w-[340px] min-h-[400px] shadow-lg rounded-xl container text-black flex flex-col px-8 relative">
        <h1 className="text-4xl font-semibold text-[#190832] mt-8 mb-4 text-center">เข้าสู่ระบบ</h1>
        
        {/* Username Input */}
        <label>ชื่อผู้ใช้งาน</label>
        <input
          required
          type="text"
          className={`border-2 rounded-md py-3 px-4 ${inputError ? "border-red-500" : "border-gray-300"}`} // ✅ Turns red if error
          placeholder="กรอกชื่อผู้ใช้งาน"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password Input */}
        <label className="mt-4">รหัสผ่าน</label>
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            required
            className={`border-2 rounded-md py-3 px-4 w-full pr-10 ${inputError ? "border-red-500" : "border-gray-300"}`} // ✅ Turns red if error
            placeholder="กรอกรหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        {/* ✅ Error message is positioned absolutely below password field without pushing the button */}
        <div className="h-6 relative">
          {inputError && (
            <p className="text-red-500 text-sm absolute left-0 mt-1">{errorMessage}</p>
          )}
        </div>

        {/* Forgot Password Link */}
        <a onClick={() => setIsOpen(true)} className="cursor-pointer underline mt-1">ลืมรหัสผ่าน?</a>

        {/* Login Button (Now stays in place) */}
        <button className="mt-2 bg-gray-800 hover:bg-black text-white w-40 text-center mx-auto rounded-md py-2 transition" onClick={handleLogin}>
          เข้าสู่ระบบ
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-black text-center">
            <h2 className="text-xl font-semibold">✅ เข้าสู่ระบบสำเร็จ</h2>
            <p className="mt-2">คุณสามารถใช้งานระบบได้แล้ว</p>
            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md" onClick={() => router.replace("/")}>
              ไปที่หน้าหลัก
            </button>
          </div>
        </div>
      )}
    </div>
    
  );
}