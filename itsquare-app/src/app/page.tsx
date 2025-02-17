import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{backgroundImage: "url('/bg-main.png')"}}>
       <Image 
        src="/popo.png" // เปลี่ยนเป็น path ของรูปที่ใช้
        alt="PoPo"
        width={600} // ปรับขนาดตามต้องการ
        height={500}
        className="absolute right-0 top-0 md:bottom-[-10px] md:block xl:w-1/4 w-auto hidden object-contain"
      />
      <div className="absolute md:top-1/3 md:left-1/3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 ">
        <h1 className="lg:text-9xl md:text-7xl text-6xl font-bold md:mb-16 mb-10">Hey,</h1>
        <h1 className="lg:text-9xl md:text-7xl text-4xl font-bold md:mb-16 mb-10">need help?</h1>
        <button className="text-black md:text-4xl text-2xl text-center flex bg-yellow-300 md:p-4 py-4 md:px-12 px-6 rounded-full hover:bg-transparent hover:border-yellow-300 hover:border-2 hover:text-white transition delay-180 duration-300 ease-in-out">
         <a href="./main-cate">Start building</a> 
        </button>
      </div>
    </div>
  );
}
