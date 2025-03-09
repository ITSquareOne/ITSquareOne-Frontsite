"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CartProvider, useCart } from "./components/CartContext";
import { Kanit } from "next/font/google";
import "./globals.css";
import { getProfile, User } from "./utils/api";
import LogoutModal from "./components/LogoutModal";
const kanit = Kanit({
  weight: "500",
  subsets: ["thai", "latin"],
});

// Create a new NavigationBar component
function NavigationBar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [Profile, setProfile] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { cart } = useCart(); // Now this is safe to use

  const role = Profile?.role;

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
        setProfile(profileData);
      }
    };
    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setProfile(null);
    setToken(null);
    router.push("/"); // Redirect to main page after logout
  };

  return (
    <>
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
            <div className="flex flex-row gap-6 items-center">
              {/* profile for all users */}
              {isLoggedIn && (
              <a href="/profile" className="flex text-base text-black px-4 transition duration-300 ease-in-out items-center gap-2">
                <div className="flex flex-col">
                  <span className="underline">{Profile?.username}</span>
                  <span className="text-xs text-end">{Profile?.role}</span>
                </div>
                {Profile?.profile ? (
                  <img
                    src={`data:image/jpeg;base64,${Profile.profile}`}
                    className="w-8 h-8 rounded-full object-cover"
                    alt="Profile"
                  />
                ) : (
                  <img
                    src="/profile.svg"
                    className="w-8 h-8 rounded-full object-cover bg-white"
                    alt="Default Profile"
                  />
                )}
              </a>)}
              {/* Cart for student in mobile view */}
              {isLoggedIn && role === "student" && (
                <div className="relative">
                  <img
                    src="/cart.svg"
                    alt="Cart"
                    className="cursor-pointer w-9 h-9 mr-4 mt-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/cart");
                    }}
                  />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cart.length}
                    </span>
                  )}
                </div>
              )}
              {/* Hamburger Icon */}
              <svg
                className="w-6 h-6 text-[#757575] hover:text-gray-400"
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
            </div>
          </button>
          {/* Right Side (Sign In & Sign Up Buttons) */}
          <div className="hidden md:flex items-center space-x-5 mr-4">
            {!isLoggedIn ? (
              <a href="/sign-in" className="text-base text-white shadow-md bg-[#FF619B] hover:bg-[#ff4388] p-2 px-4 rounded-full transition duration-300 ease-in-out">
                เข้าสู่ระบบ
              </a>
            ) : (
              <>
                {role === "technician" && (
                  <div className="flex gap-4">
                    <a href="/main-cate" className="text-base text-white shadow-md hover:text-gray-300 bg-[#190832] hover:bg-[#1b1a1d] p-2 px-4 rounded-full transition duration-300 ease-in-out">
                      หน้าสินค้า
                    </a>
                    <a href="/status-tech" className="text-base text-white shadow-md bg-pink-500 hover:bg-pink-600 p-2 px-4 rounded-full transition duration-300 ease-in-out">
                      จัดการออเดอร์
                    </a>
                    <a href="/profile" className="flex text-base text-black px-4 transition duration-300 ease-in-out items-center gap-2">
                      <div className="flex flex-col">
                        <span className="underline">{Profile?.username}</span>
                        <span className="text-xs text-end">{Profile?.role}</span>
                      </div>
                      {Profile?.profile ? (
                        <img
                          src={`data:image/jpeg;base64,${Profile.profile}`}
                          className="w-8 h-8 rounded-full object-cover"
                          alt="Profile"
                        />
                      ) : (
                        <img
                          src="/profile.svg"
                          className="w-8 h-8 rounded-full object-cover bg-white"
                          alt="Default Profile"
                        />
                      )}
                    </a>
                    <img
                      src="/config.svg"
                      alt=""
                      className="h-11 w-11 cursor-pointer"
                      onClick={() => {
                        router.push("/tech-mode?tab=stock"); // Add default tab parameter
                      }}
                    />
                  </div>
                )}
                {role === "student" && (
                  <div className="flex gap-4">
                    <a href="/main-cate" className="text-base text-white shadow-md hover:text-gray-300 bg-[#190832] hover:bg-[#1b1a1d] p-2 px-4 rounded-full transition duration-300 ease-in-out">
                      หน้าสินค้า
                    </a>
                    <a href="/status" className="text-base text-white shadow-md bg-[#296bf8] hover:bg-[#274dcc] p-2 px-4 rounded-full transition duration-300 ease-in-out">
                      ติดตามสถานะ
                    </a>
                    <a href="/profile" className="flex text-base text-black px-4 transition duration-300 ease-in-out items-center gap-2">
                      <div className="flex flex-col">
                        <span className="underline">{Profile?.username}</span>
                        <span className="text-xs text-end">{Profile?.role}</span>
                      </div>
                      {Profile?.profile ? (
                        <img
                          src={`data:image/jpeg;base64,${Profile.profile}`}
                          className="w-8 h-8 rounded-full object-cover"
                          alt="Profile"
                        />
                      ) : (
                        <img
                          src="/profile.svg"
                          className="w-8 h-8 rounded-full object-cover bg-white"
                          alt="Default Profile"
                        />
                      )}
                    </a>
                    <div className="relative">
                      <img
                        src="/cart.svg"
                        alt="Cart"
                        className="cursor-pointer w-9 h-9 mr-4 mt-1"
                        onClick={() => router.push("/cart")}
                      />
                      {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          {cart.length}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {role === "manager" && (
                  <div className="flex gap-4">
                     <a href="/main-cate" className="text-base text-white shadow-md hover:text-gray-300 bg-[#190832] hover:bg-[#1b1a1d] p-2 px-4 rounded-full transition duration-300 ease-in-out">
                      หน้าสินค้า
                    </a>
                    <a href="/manager-mode" className="text-base text-white shadow-md bg-[#296bf8] hover:bg-[#274dcc] p-2 px-4 rounded-full transition duration-300 ease-in-out">
                      แผงควบคุม
                    </a>
                    <a href="/profile" className="flex text-base text-black px-4 transition duration-300 ease-in-out items-center gap-2">
                      <div className="flex flex-col">
                        <span className="underline">{Profile?.username}</span>
                        <span className="text-xs text-end">{Profile?.role}</span>
                      </div>
                      {Profile?.profile ? (
                        <img
                          src={`data:image/jpeg;base64,${Profile.profile}`}
                          className="w-8 h-8 rounded-full object-cover"
                          alt="Profile"
                        />
                      ) : (
                        <img
                          src="/profile.svg"
                          className="w-8 h-8 rounded-full object-cover bg-white"
                          alt="Default Profile"
                        />
                      )}
                    </a>

                  </div>
                )}
                <img
                  src="/logout.svg"
                  alt="Logout"
                  className="h-9 w-9 cursor-pointer"
                  onClick={() => setIsModalOpen(true)} // Open logout confirmation modal
                />
              </>
            )}
          </div>
        </div>
      </nav>
     
      {/* Mobile Dropdown Menu */}
      <div className={`${
        isOpen ? "block" : "hidden"
      } md:hidden fixed top-[48px] left-0 w-full bg-white shadow-md z-40 transition-all duration-300 ease-in-out`}>
        <ul className="flex flex-col space-y-2 p-4">
          {!isLoggedIn ? (
            <li className="w-full">
              <a href="/sign-in" 
                className="block w-full p -3 text-center text-black">
                เข้าสู่ระบบ
              </a>
            </li>
          ) : (
            <>
              {role === "manager" && (
                <li className="w-full">
                  <a href="/main-cate" 
                    className="block w-full p-3 text-center roundet-text-base bg-white text-black hover:text-white hover:bg-[#2761cc] transition-colors">
                    หน้าสินค้า
                  </a>
                  <a href="/manager-mode" 
                    className="block w-full p-3 text-center roundet-text-base bg-white text-black hover:text-white hover:bg-[#2761cc] transition-colors">
                    แผงควบคุม
                  </a>
                </li>
              )}
              
              {role === "technician" && (
                <>
                  <li className="w-full">
                    <a href="/main-cate" 
                      className="block w-full p-3 mt-3 text-center text-black hover:bg-gray-100 transition-colors ">
                      หน้าสินค้า
                    </a>
                  </li>
                  <li className="w-full">
                    <a href="/status-tech" 
                      className="block w-full p-3 text-center text-black hover:bg-gray-100 transition-colors ">
                      จัดการออเดอร์
                    </a>
                  </li>
                  <li className="w-full">
                    <a href="/tech-mode" 
                      className="block w-full p-3 text-center text-black hover:bg-gray-100 transition-colors">
                      จัดการคลัง
                    </a>
                  </li>
                </>
              )}

              {role === "student" && (
                <>
                  <li className="w-full">
                  <a href="/main-cate" 
                      className="mt-3 block w-full p-3 text-center text-black hover:bg-gray-100 transition-colors">
                      หน้าสินค้า
                    </a>
                    <a href="/status" 
                      className="mt-3 block w-full p-3 text-center text-black hover:bg-gray-100 transition-colors">
                      ติดตามสถานะ
                    </a>
                  </li>
                  <li className="relative w-full">
                    <div className="flex items-center justify-center gap-4 p-3 roundet-text-base w-full text-center text-black hover:bg-gray-100 transition-colors">
                      <span>รายการคำสั่งซื้อ</span>
                      {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          {cart.length}
                        </span>
                      )}
                    </div>
                  </li>
                </>
              )}

              {/* Logout Button */}
              <li className="w-full">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="block w-full p-3 text-center roundet-text-base bg-gray-100 text-gray-900 hover:bg-red-500 hover:text-white transition-colors"
                >
                  ออกจากระบบ
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLogout={handleLogout}
      />
    </>
  );
}

// Update your RootLayout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${kanit.className} alo guys`}>
        <CartProvider>
          <NavigationBar />
          <div className="my-20">
            {children}
          </div>
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