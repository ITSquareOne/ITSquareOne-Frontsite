"use client";
import Image from "next/image";
import { useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Sign_up() {

  
  useEffect(() => {
    // Prevent scrolling when the page loads
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // Restore scroll when navigating away
    };
  }, []);
  return (
    <div className="relative min-h-screen bg-cover bg-center justify-center items-center flex pt-10" style={{backgroundImage: "url('/bg-main.png')"}}>
        <div className="bg-white md:max-w-[600px] md:min-h-[400px] mb-[200px] max-w-[340px] min-h-[400px] shadow-[0px_8px_7px_1px_rgba(0,_0,_0,_0.6)]
 rounded-xl container text-black  flex flex-col px-8 pb-8 ">
          <h1 className="text-4xl font-semibold text-[#190832] mt-8 mb-4 text-center">Sign up</h1>
          <form action="">
              <label className="">Username</label> <br />
              <input type="text" className="border-[#353535] border-2 rounded-md py-3 px-4 w-full" placeholder="Enter username"></input><br />
<br />
              <label className="">Email</label> <br />
              <input type="email" className="border-[#353535] border-2 rounded-md py-3 px-4 w-full" placeholder="Enter email"></input><br />
<br />
              <label className="mt-4">Password</label> <br />
              <input type="password" className="border-[#353535] border-2 rounded-md py-3 px-4 w-full" placeholder="Enter password" ></input> <br />
<br />
              <label className="mt-4">Confirm Password</label><br />
              <input type="password" className="border-[#353535] border-2 rounded-md py-3 px-4 w-full" placeholder="Confirm password"></input> <br />
<br />
              <div className="flex">
                <button type="submit" className="mt-4 bg-gray-800 hover:bg-black text-white w-40 text-center mx-auto rounded-md py-2 hover:text-white transition delay-180 duration-300 ease-in-out">Sign up</button>
              </div>
          </form>
        </div>
    </div>
  );
}
