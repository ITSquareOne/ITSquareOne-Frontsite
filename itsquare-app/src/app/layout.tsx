"use client";

import { useEffect, useState } from "react";
import { Kanit } from "next/font/google";
import "./globals.css";




const kanit = Kanit({
  weight: "500",
  subsets: ["thai","latin"],
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch("data/items.json") 
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
      <body
        className={`${kanit.className} alo guys`}
      >
        <nav className="bg-white border-gray-200 p-5 w-full"> {/* dark:bg-gray-900 ไว้ทำ darkmode */}
           <div className="flex flex-wrap items-center mx-auto container justify-center" id="navbar-default">
            <div className="flex items-center space-x-4 md:space-x-12 justify-between">
                <a href="/" className="md:block hidden text-2xl font-bold text-blue-500">
                  ITSquareOne
                </a>
                <a href="/" className="md:hidden block text-2xl font-bold text-blue-500">
                  IT^1
                </a>

                <div className="relative block flex-grow">
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="border border-gray-300 text-black rounded-full py-2 px-16 pl-10 w-full xl:min-w-[700px] md:max-w-[400px]  focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M15 11A4 4 0 1111 7a4 4 0 014 4z" />
                  </svg>
                    {filteredSuggestions.length > 0 && (
                      <ul className="absolute bg-white border-2 border-black mt-1 w-full rounded shadow-lg z-50 text-black cursor-pointer">
                        {filteredSuggestions.slice(0, 7).map((suggestion, index) => (
                          <li key={index} className="p-2 hover:bg-gray-200">
                            <a href={"item/" + suggestion}>{suggestion}</a>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>

                <ul className="flex-nowrap md:flex-row md:space-x-6 md:flex hidden">
                <li className="whitespace-nowrap"><a href="#" className="text-lg text-white shadow-[0px_3px_6px_1px_rgba(0,_0,_0,_0.3)] bg-[#f0d125] hover:bg-[#c7c42c] p-2 px-6 rounded-full transition delay-180 duration-300 ease-in-out">Cart</a></li>
                  <li className="whitespace-nowrap"><a href="./sign-in" className="text-lg text-white shadow-[0px_3px_6px_1px_rgba(0,_0,_0,_0.3)] bg-[#FF619B] hover:bg-[#ff4388] p-2 px-6 rounded-full transition delay-180 duration-300 ease-in-out">Sign In</a></li>
                  <li className="whitespace-nowrap"><a href="./sign-up" className="text-lg text-white shadow-[0px_3px_6px_1px_rgba(0,_0,_0,_0.3)] hover:bg-[#1b1a1d] bg-[#190832] p-2 px-6 rounded-full transition delay-180 duration-300 ease-in-out">Sign Up</a></li>
                </ul>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="md:hidden text-gray-600 focus:outline-none"
                  >
                    {isOpen ? "✖" : "☰"}
                </button>
               
              </div>
            </div>
            <div className={`${isOpen ? "block" : "hidden"} md:hidden mt-3`}> {/* hamburger temp gonna fix with design later */}
                <ul className="flex flex-col items-center space-y-3">
                  <li>
                    <a href="#" className="text-lg text-gray-900 hover:text-blue-700">Cart</a>
                  </li>
                  <li>
                    <a href="#" className="text-lg text-gray-900 hover:text-blue-700">Sign in</a>
                  </li>
                  <li>
                    <a href="#" className="text-lg text-gray-900 hover:text-blue-700">Sign Up</a>
                  </li>
                </ul>
              </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
