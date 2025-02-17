import Image from "next/image";

export default function Sign_up() {
  return (
    <div className="relative min-h-screen bg-cover bg-center justify-center items-center flex" style={{backgroundImage: "url('/bg-main.png')"}}>
        <div className="bg-white md:max-w-[600px] md:min-h-[400px] mb-[200px] max-w-[340px] min-h-[400px] shadow-[0px_8px_7px_1px_rgba(0,_0,_0,_0.6)]
 rounded-xl container text-black  flex flex-col px-8 pb-8 ">
          <h1 className="text-4xl font-semibold text-[#190832] mt-8 mb-4 text-center">Sign in</h1>
          <label className="">Username</label>
          <input type="text" className="border-[#353535] border-2 rounded-md py-3 px-4" placeholder="Enter username"></input>
          <label className="">Email</label>
          <input type="text" className="border-[#353535] border-2 rounded-md py-3 px-4" placeholder="Enter email"></input>
          <label className="mt-4">Password</label>
          <input type="text" className="border-[#353535] border-2 rounded-md py-3 px-4" placeholder="Enter password"></input>
          <label className="mt-4">Confirm Password</label>
          <input type="text" className="border-[#353535] border-2 rounded-md py-3 px-4" placeholder="Confirm password"></input>
          <button className="mt-4 bg-gray-800 hover:bg-black text-white w-40 text-center mx-auto rounded-md py-2 hover:text-white transition delay-180 duration-300 ease-in-out">Sign up</button>
        </div>
    </div>
  );
}
