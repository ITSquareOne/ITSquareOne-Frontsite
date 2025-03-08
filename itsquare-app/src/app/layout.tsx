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
              {/* Right Side (Sign In & Sign Up Buttons) */}
              <div className="hidden md:flex items-center space-x-5 mr-4">
                {!isLoggedIn ? (
                  <a href="/sign-in" className="text-lg text-white shadow-lg bg-[#FF619B] hover:bg-[#ff4388] p-2 px-6 rounded-full transition duration-300 ease-in-out">
                    Sign In
                  </a>
                ) : (
                  <>
                    <a href="/cart" className="text-lg text-white shadow-lg bg-[#FF619B] hover:bg-[#ff4388] p-2 px-6 rounded-full transition duration-300 ease-in-out">
                      Cart
                    </a>
                    <a href="/profile" className="text-lg text-white shadow-lg bg-[#190832] hover:bg-[#1b1a1d] p-2 px-6 rounded-full transition duration-300 ease-in-out">
                      Profile
                    </a>
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
