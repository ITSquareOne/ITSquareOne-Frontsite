"use client"
import Image from "next/image";
import { useState } from "react";

export default function Sign_in() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-cover bg-center justify-center items-center flex" style={{backgroundImage: "url('/bg-main.png')"}}>
        <div className="bg-white md:max-w-[600px] md:min-h-[400px] mb-[200px] max-w-[340px] min-h-[400px] shadow-[0px_8px_7px_1px_rgba(0,_0,_0,_0.6)]
 rounded-xl container text-black  flex flex-col px-8">
          <h1 className="text-4xl font-semibold text-[#190832] mt-8 mb-4 text-center">Sign in</h1>
          <label className="">Username</label>
          <input type="text" className="border-[#353535] border-2 rounded-md py-3 px-4" placeholder="Enter username"></input>
          <label className="mt-4">Password</label>
          <input type="password" className="border-[#353535] border-2 rounded-md py-3 px-4" placeholder="Enter password"></input>
          <a onClick={() => setIsOpen(true)} className="cursor-pointer underline mt-2">Forgot Password?</a>
          <button className="mt-4 bg-gray-800 hover:bg-black text-white w-40 text-center mx-auto rounded-md py-2 hover:text-white transition delay-180 duration-300 ease-in-out">Sign in</button>
          <a href="sign-up" className="cursor-pointer underline text-center mt-4">Don't have an account?</a>
          {isOpen && ( 
            <div className="bg-black bg-opacity-30 flex inset-0 fixed justify-center items-center">
              <div className="container bg-white max-w-[500px] min-h-[150px] rounded-md shadow-[0px_8px_7px_1px_rgba(0,_0,_0,_0.2)] flex flex-col p-4 px-6">
                <label className="">Email</label>
                <input type="text" className="border-[#adadad] border-2 rounded-md py-2 px-4 mb-4" placeholder="Enter email"></input>
                <div className="items-center flex justify-center gap-8">
                  <button onClick={() => setIsOpen(false)} className="hover:text-red-500 transition delay-180 duration-300 ease-in-out">cancel</button>
                  <button onClick={() => location.reload()} className="rounded-md bg-gray-800 hover:bg-black px-4 py-2 text-white  transition delay-180 duration-300 ease-in-out">Reset password</button>
                </div>
              </div>
            </div>
          )}
        
        </div>
    </div>
  );
}
