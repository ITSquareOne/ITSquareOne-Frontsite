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
        console.log("Loaded items:", data);
        const itemNames = data.map((item: { part_name: string }) => item.part_name);
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
        {/* Navbar */}
        <nav className="fixed top-0 left-0 w-full bg-white border-gray-200 p-3 shadow-md z-50">
          <div className="flex items-center justify-between mx-auto container">
            {/* Logo */}
            <a href="/" className="font-bold text-blue-500 ml-4">
              <div className="flex text-2xl">
                IT<span className="text-black">SquareOne</span>
              </div>
            </a>

            {/* Sign In */}
            <div className="hidden md:flex items-center">
              <a
                href="./sign-in"
                className="text-lg text-white shadow-lg bg-[#FF619B] hover:bg-[#ff4388] p-2 px-6 rounded-full transition duration-300 ease-in-out"
              >
                เข้าสู่ระบบ
              </a>
            </div>

            {/* Mobile Menu */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-600 focus:outline-none"
            >
              {isOpen ? "✖" : "☰"}
            </button>
          </div>

          {/* Mobile Dropdown */}
          {isOpen && (
            <div className="md:hidden mt-3">
              <ul className="flex flex-col items-center space-y-3">
                <li>
                  <a href="./sign-in" className="text-lg text-gray-900 hover:text-blue-700">
                    เข้าสู่ระบบ
                  </a>
                </li>
                <li>
                  <a href="./sign-up" className="text-lg text-gray-900 hover:text-blue-700">
                    ลงทะเบียน
                  </a>
                </li>
              </ul>
            </div>
          )}
        </nav>

        {/* Content Area */}
        <div className="mt-16 mb-12">{children}</div> 

        {/* Fixed Bottom Bar - Copyright */}
        <footer className="fixed bottom-0 left-0 w-full bg-gray-100 text-black p-2 py-1/3 text-xs md:py-4 border-t border-gray-300">
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

      </body>
    </html>
  );
}
