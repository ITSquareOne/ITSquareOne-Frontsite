"use client";

import { useEffect, useState } from "react";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  weight: "500",
  subsets: ["thai", "latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch("/data/items.json") 
      .then((res) => res.json())
      .then((data) => {
        const itemNames = data.map((item: { name: string }) => item.name);
        setSuggestions(itemNames);
      })
      .catch((err) => console.error("Error loading items:", err));
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredSuggestions(
        suggestions.filter((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredSuggestions([]);
    }
  }, [searchQuery, suggestions]);

  return (
    <html lang="en">
      <body className={`${kanit.className} alo guys`}>
        {/*  Navbar - ITSquareOne on Left, Sign In/Sign Up on Right */}
        <nav className="fixed top-0 left-0 w-full bg-white border-gray-200 p-5 shadow-md z-50"> 
          {/* Ensures navbar stays at the top with shadow */}
          <div className="flex items-center justify-between mx-auto container">
            
            {/*  Left Side (Logo) */}
            <a href="/" className="text-4xl font-bold text-blue-500 ml-4">
              <div className="flex ">
                IT<span className="text-black">SquareOne</span>
              </div>
            </a>

            {/* Right Side (Sign In & Sign Up Buttons) */}
            <div className="hidden md:flex items-center space-x-5 mr-4">
              <a href="./sign-in" className="text-lg text-white shadow-lg bg-[#FF619B] hover:bg-[#ff4388] p-2 px-6 rounded-full transition duration-300 ease-in-out">
                เข้าสู่ระบบ
              </a>
            
            </div>

            {/* Hamburger Menu for Mobile View */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-600 focus:outline-none"
            >
              {isOpen ? "✖" : "☰"}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          <div className={`${isOpen ? "block" : "hidden"} md:hidden mt-3`}>
            <ul className="flex flex-col items-center space-y-3">
              {/* <li>
                <a href="#" className="text-lg text-gray-900 hover:text-blue-700">Cart</a>
              </li> */}
              <li>
                <a href="./sign-in" className="text-lg text-gray-900 hover:text-blue-700">เข้าสู่ระบบ</a>
              </li>
              <li>
                <a href="./sign-up" className="text-lg text-gray-900 hover:text-blue-700">ลงทะเบียน</a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Push content down to prevent navbar overlap */}
        <div className="pt-[80px]">
          {children}
        </div>

      </body>
    </html>
  );
}
