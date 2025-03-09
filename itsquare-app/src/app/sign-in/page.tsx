"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../components/Modal"; // Modal component for success login

export default function Sign_in() {
  const [isOpen, setIsOpen] = useState(false); // State for modal (successful login)
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [inputError, setInputError] = useState({
    username: false,
    password: false,
  });
  const [errorMessage, setErrorMessage] = useState({
    username: "",
    password: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // Success modal state
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // Restore scroll when navigating away
    };
  }, []);

  const handleLogin = async () => {
    setInputError({ username: false, password: false });
    setErrorMessage({ username: "", password: "" });

    // Check if username is valid
    if (!username.includes("tn") && !username.includes("it") && !username.includes("mn") && !username.includes("tester") && !username.includes("tech")) {
      setInputError((prev) => ({ ...prev, username: true }));
      setErrorMessage((prev) => ({ ...prev, username: "ชื่อผู้ใช้อาจจะไม่ถูกต้อง ❌" }));
      return;
    }

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
        localStorage.setItem("token", res.data.tokens.accessToken); // Store token
        setModalContent(
          <div>
            <h2 className="text-xl font-semibold text-green-600">เข้าสู่ระบบสำเร็จ ✅</h2>
            <p className="mt-2 text-gray-600">คุณสามารถใช้งานระบบได้แล้ว</p>
          </div>
        );
        setIsModalOpen(true);

        setTimeout(() => {
          window.location.href = "/"; // Redirect to profile after 1.5s
        }, 1500);
      }
    } catch (err) {
      console.log("เข้าสู่ระบบล้มเหลว");

      setInputError({ username: false, password: true });
      setErrorMessage({
        username: "",
        password: "รหัสผ่านไม่ถูกต้อง ❌", // Show error message
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close modal after success
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className={isModalOpen ? "bg-black opacity-50" : ""}>
      <div className="relative min-h-screen bg-cover bg-center flex items-center justify-center -mt-10" 
        style={{ backgroundImage: "url('/bg-main.png')", backgroundAttachment: "fixed" }}>
        {/* Move form down by adding -mt-20 to offset from center */}
        <div className="bg-white w-full max-w-[400px] p-8 rounded-2xl shadow-lg -mt-20">
          <h1 className="text-3xl font-semibold text-[#190832] mb-8 text-center">เข้าสู่ระบบ</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                ชื่อผู้ใช้งาน
              </label>
              <input
                required
                type="text"
                className={`w-full border-2 rounded-lg py-2.5 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                  ${inputError.username ? "border-red-500" : "border-gray-300"}`}
                placeholder="กรอกชื่อผู้ใช้งาน"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {inputError.username && 
                <p className="text-red-600 text-sm">{errorMessage.username}</p>
              }
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className={`w-full border-2 rounded-lg py-2.5 px-4 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                    ${inputError.password ? "border-red-500" : "border-gray-300"}`}
                  placeholder="กรอกรหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
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
              {inputError.password && 
                <p className="text-red-600 text-sm">{errorMessage.password}</p>
              }
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit"
                className="w-full bg-[#190832] text-white py-3 rounded-lg font-medium
                  hover:bg-black transition-colors duration-200"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          </form>

          {/* Modal for login success */}
          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            {modalContent}
          </Modal>

          {/* Forgot Password Modal */}
          {isOpen && (
            <form className="bg-black bg-opacity-30 flex inset-0 fixed justify-center items-center">
              <div className="container bg-white max-w-[500px] min-h-[150px] rounded-md shadow-[0px_8px_7px_1px_rgba(0,_0,_0,_0.2)] flex flex-col p-4 px-6">
                <label className="">อีเมลเพื่อเปลี่ยนรหัสผ่าน</label>
                <input required type="email" className="border-[#adadad] border-2 rounded-md py-2 px-4 mb-4" placeholder="กรอกอีเมล"></input>
                <div className="items-center flex justify-center gap-8">
                  <button onClick={() => setIsOpen(false)} className="hover:text-red-500 transition delay-180 duration-300 ease-in-out">ยกเลิก</button>
                  <button type="submit" className="rounded-md bg-gray-800 hover:bg-black px-4 py-2 text-white  transition delay-180 duration-300 ease-in-out">ยืนยัน</button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div> 
  );
}
