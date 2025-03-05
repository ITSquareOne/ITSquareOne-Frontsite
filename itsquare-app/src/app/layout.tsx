"use client";

import { useEffect, useState } from "react";
import { CartProvider } from "./components/CartContext";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  weight: "500",
  subsets: ["thai", "latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  })


  return (
    <html lang="en">
      <body className={`${kanit.className} alo guys`}>
      <CartProvider>
        {/* ✅ Navbar - ITSquareOne on Left, Sign In/Sign Up on Right */}
        <nav className="bg-white border-gray-200 p-5 w-full fixed top-0 left-0 z-50 shadow-md"> 
          {/* Ensures navbar stays at the top with shadow */}
          <div className="flex items-center justify-between mx-auto container">
            
            {/* ✅ Left Side (Logo) */}
            <a href="/" className="text-4xl font-bold text-blue-500 ml-4">
              <div className="flex ">
                IT<span className="text-black">SquareOne</span>
              </div>
            </a>

            {/* ✅ Right Side (Sign In & Sign Up Buttons) */}
            
            <div className="hidden md:flex items-center space-x-5 mr-4">
              {!isLoggedIn ? (
                <>
                  <a href="/sign-in" className="text-lg text-white shadow-lg bg-[#FF619B] hover:bg-[#ff4388] p-2 px-6 rounded-full transition duration-300 ease-in-out">
                  Sign In
                  </a>
                  <a href="/sign-up" className="text-lg text-white shadow-lg bg-[#190832] hover:bg-[#1b1a1d] p-2 px-6 rounded-full transition duration-300 ease-in-out">
                    Sign Up
                  </a>
                </>) : (
                  <>
                    <a href="/cart" className="text-lg text-white shadow-lg bg-[#FF619B] hover:bg-[#ff4388] p-2 px-6 rounded-full transition duration-300 ease-in-out">
                  Cart
                  </a>
                  <a href="/profile" className="text-lg text-white shadow-lg bg-[#190832] hover:bg-[#1b1a1d] p-2 px-6 rounded-full transition duration-300 ease-in-out">
                    Profile
                  </a>
                  </>
                )}
              
            </div>

            {/* ✅ Hamburger Menu for Mobile View */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-600 focus:outline-none"
            >
              {isOpen ? "✖" : "☰"}
            </button>
          </div>

          {/* ✅ Mobile Dropdown Menu */}
          <div className={`${isOpen ? "block" : "hidden"} md:hidden mt-3`}>
            <ul className="flex flex-col items-center space-y-3">
              {/* <li>
                <a href="#" className="text-lg text-gray-900 hover:text-blue-700">Cart</a>
              </li> */}
              {!isLoggedIn ? (
                <>
                  <li>
                    <a href="/sign-in" className="text-lg text-gray-900 hover:text-blue-700">Sign in</a>
                  </li>
                  <li>
                    <a href="/sign-up" className="text-lg text-gray-900 hover:text-blue-700">Sign Up</a>
                  </li>
                </>) : (
                  <>
                    <li>
                      <a href="/cart" className="text-lg text-gray-900 hover:text-blue-700">Cart</a>
                    </li>
                    <li>
                      <a href="/profile" className="text-lg text-gray-900 hover:text-blue-700">Profile</a>
                    </li>
                  </>
                )}
              
            </ul>
          </div>
        </nav>

        {/* ✅ Push content down to prevent navbar overlap */}
        <div className="pt-[80px]">
          {children}
        </div>
        <footer className="fixed bottom-0 left-0 w-full bg-gray-100 text-black p-2 py-1/3 text-xs md:py-3 border-t border-gray-300">
        <div className="container mx-auto flex justify-between items-center px-4 md:text-l ">
          {/* Left Side: Copyright */}
          <div>© 2024 ITSquareOne. All Rights Reserved.</div>

          {/* Right Side: Links */}
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
