"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CartProvider } from "./components/CartContext";
import { Kanit } from "next/font/google";
import "./globals.css";
import { getProfile, User } from "./utils/api";
import LogoutModal from "./components/LogoutModal";
const kanit = Kanit({
  weight: "500",
  subsets: ["thai", "latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [techProfile, setTechProfile] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const role = techProfile?.role;

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      const profileData = await getProfile(token);
      if (profileData) {
        setTechProfile(profileData);
      }
    };
    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setTechProfile(null);
    setToken(null);
    router.push("/"); // Redirect to main page after logout
  };

  return (
    <html lang="en">
      <body className={`${kanit.className} alo guys`}>
        <CartProvider>
          {/* Navbar - Fixed at the top */}
          <nav className="bg-white border-gray-200 p-2 w-full fixed top-0 left-0 z-50 shadow-md">
            <div className="flex items-center justify-between mx-auto container">
              {/* Left Side (Logo) */}
              <a href="/" className="text-2xl font-bold text-blue-500 ml-4">
                <div className="flex">
                  IT<span className="text-black">SquareOne</span>
                </div>
              </a>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2"
                aria-label="Toggle menu"
              >
                {/* Hamburger Icon */}
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {isOpen ? (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  ) : (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 6h16M4 12h16M4 18h16" 
                    />
                  )}
                </svg>
              </button>
              {/* Right Side (Sign In & Sign Up Buttons) */}
              <div className="hidden md:flex items-center space-x-5 mr-4">
                {!isLoggedIn ? (
                  <a href="/sign-in" className="text-lg text-white shadow-lg bg-[#FF619B] hover:bg-[#ff4388] p-2 px-6 rounded-full transition duration-300 ease-in-out">
                    เข้าสู่ระบบ
                  </a>
                ) : (
                  <>
                    <a href="/cart" className="text-lg text-white shadow-lg bg-[#FF619B] hover:bg-[#ff4388] p-2 px-6 rounded-full transition duration-300 ease-in-out">
                      ตะกร้า
                    </a>
                    <a href="/profile" className="text-lg text-white shadow-lg bg-[#190832] hover:bg-[#1b1a1d] p-2 px-6 rounded-full transition duration-300 ease-in-out">
                      โปรไฟล์
                    </a>
                    
                    {role === "technician" && (
                     <a href="/status-tech" className="text-lg text-white shadow-lg bg-[#296bf8] hover:bg-[#274dcc] p-2 px-6 rounded-full transition duration-300 ease-in-out">
                        จัดการออร์เดอร์
                     </a>
                  )}
                  {role === "student" && (
                     <a href="/status" className="text-lg text-white shadow-lg bg-[#296bf8] hover:bg-[#274dcc] p-2 px-6 rounded-full transition duration-300 ease-in-out">
                        ติดตามสถานะ
                     </a>
                  )}
                  {role === "manager" && (
                     <a href="/manager-mode" className="text-lg text-white shadow-lg bg-[#296bf8] hover:bg-[#274dcc] p-2 px-6 rounded-full transition duration-300 ease-in-out">
                        แผงควบคุม
                     </a>
                  )}
                  <img
                      src="/logout.svg"
                      alt="Logout"
                      className="h-6 w-6 cursor-pointer"
                      onClick={() => setIsModalOpen(true)} // Open logout confirmation modal
                    />
                  </>
                )}
              </div>
            </div>
          </nav>
                {/* ✅ Mobile Dropdown Menu */}
          <div 
            className={`${
              isOpen ? "block" : "hidden"
            } md:hidden fixed top-[48px] left-0 w-full bg-white shadow-lg z-40 transition-all duration-300 ease-in-out`}
          >
            <ul className="flex flex-col items-center space-y-3 py-4">
              {!isLoggedIn ? (
                <>
                  <li>
                    <a href="/sign-in" className="text-lg text-gray-900 hover:text-blue-700">เข้าสู่ระบบ</a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <a href="/cart" className="text-lg text-gray-900 hover:text-blue-700">ตะกร้า</a>
                  </li>
                  <li>
                    <a href="/profile" className="text-lg text-gray-900 hover:text-blue-700">โปรไฟล์</a>
                  </li>
                  {/* Role-based menu items */}
                  {role === "technician" && (
                    <li>
                      <a href="/status-tech" className="text-lg text-gray-900 hover:text-blue-700">
                        จัดการออร์เดอร์
                      </a>
                    </li>
                  )}
                  {role === "student" && (
                    <li>
                      <a href="/status" className="text-lg text-gray-900 hover:text-blue-700">
                        รายการคำสั่งซื้อ
                      </a>
                    </li>
                  )}
                  {role === "manager" && (
                    <li>
                      <a href="/manager-mode" className="text-lg text-gray-900 hover:text-blue-700">
                        แผงควบคุม
                      </a>
                    </li>
                  )}
                  {/* Logout option */}
                  <li>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="text-lg text-gray-900 hover:text-red-600"
                    >
                      ออกจากระบบ
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
          {/* Main Content Area */}
          <div className="my-20"> {/* Adjust padding-top for navbar and padding-bottom for footer */}
            {children}
          </div>

          {/* Logout Confirmation Modal */}
          <LogoutModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onLogout={handleLogout}
          />

          {/* Footer - Fixed at the bottom */}
          <footer className="fixed bottom-0 left-0 w-full bg-gray-100 text-black p-2 py-1/3 text-xs md:py-3 border-t border-gray-300">
            <div className="container mx-auto flex justify-between items-center px-4 md:text-l ">
              <div>© 2024 ITSquareOne. All Rights Reserved.</div>
              <div className="space-x-3 flex">
                <a href="https://maps.app.goo.gl/YjUgSDAomFCyLzsf6" className="hover:text-blue-500">Location</a>
                <div>|</div>
                <a href="/" className="hover:text-blue-500">Home</a>
                <div>|</div>
                <img src="\Github_logo.svg" alt="GitHub logo" className="h-3 md:h-4 inline" />
                <a href="https://github.com/ITSquareOne" className="hover:text-blue-500 space-x-0">GitHub</a>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
