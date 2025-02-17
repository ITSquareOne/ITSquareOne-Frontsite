"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface Product {
    id: number;
    brand: string;
    vendor: string;
    category: string;
    price: number;
    description: string;
    name: string;
    img: string;
  }
export default function Category() {
    const [product, setProduct] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    useEffect(() => {
        fetch('data/items.json')
        .then((response) => response.json())
        .then((data) => setProduct(data))
        .catch((error) => console.error("Fetch error: " + error));
    }, []);

    const filteredProducts = selectedCategory === "All" ? product : product.filter((item) => item.category === selectedCategory);

  return (
    <div className="relative min-h-screen bg-cover bg-center px-8 items-center flex flex-col" style={{backgroundImage: "url('/bg-main.png')"}}>
        <div className="container flex flex-row mt-4  gap-4 flex-wrap items-start">
            {["All", "Power Supply", "CPU", "Ram", "HDD & SSD", "Mainboard", "GPU", "Other"].map((category) => (
                <button key={category} onClick={() => setSelectedCategory(category)} className={`px-3 py-1 rounded-full text-base 
                    ${selectedCategory === category ? "bg-gray-400 text-white" : "bg-white text-black hover:bg-gray-300"}`}>{category}</button>
            ))}
            <hr className="border-t-2 border-gray-300 mx-2 rounded-xl w-full"/>
        </div>
        <div className="container flex flex-row mt-4 gap-4 mx-4 flex-wrap items-start mb-6">
            <button className="bg-white text-black px-3 py-2 rounded-full text-base flex items-center hover:bg-gray-300">
                Price Filter   
                <Image src="/svg_505380.svg" alt="icon" width={20} height={20} className="ml-2" />
            </button>
            <button className="bg-white text-black px-3 py-2 rounded-full text-base hover:bg-gray-300">Recommend mee mai wa???</button>
            <hr className="border-t-2 border-gray-300 mx-2 rounded-xl w-full"/>
        </div>
        <div className="container rounded-xl text-base w-full h-auto flex flex-row flex-wrap gap-14 py-2 pb-6 px-6 ">
        {filteredProducts.map((item) => (
                <div key={item.id} className="container bg-white rounded-xl text-base w-[250px] h-auto flex flex-col items-center py-2 pb-6 px-6 ">
                <div className="container border-2 border-black w-full h-[200px] rounded-xl mt-4">
                    <Image src={item.img} alt="icon"width={250} height={300} className="w-full h-full object-cover rounded-lg"/>
                </div>
                <div className="text-black text-start w-full mb-5 mt-3">
                  <p>{item.name}</p>
                </div>
                <button className="bg-[#FFD83C] hover:bg-[#fdca3c] shadow-[0px_8px_7px_1px_rgba(0,_0,_0,_0.2)] mt-auto text-black w-full justify-center py-1 rounded-full text-base flex items-center gap-4 transition delay-180 duration-300 ease-in-out">
                  <Image src="/Shopping cart.png" alt="icon" width={20} height={20} className="ml-2" />
                  THB {item.price}
                </button>
              </div>
            ))}
        </div>
    </div>
  );
}
