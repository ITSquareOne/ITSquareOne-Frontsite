"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  // for search bar
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  // fetch product data
  useEffect(() => {
    fetch('data/items.json')
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => console.error("Fetch error: " + error));
  }, []);

  const filteredProducts = product.filter((item) => {
    return (
      (selectedCategory === "All" || item.category === selectedCategory) &&
      (searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div
      className="relative min-h-screen bg-cover bg-center px-8 items-center flex flex-col"
      style={{ backgroundImage: "url('/bg-main.png')", backgroundAttachment: "fixed" }}
    >

      {/* Category Filters */}
      <div className="container flex flex-row mt-4 md:mt-9 gap-4 flex-wrap justify-center">
        {["All", "Power Supply", "CPU", "Ram", "HDD & SSD", "Mainboard", "GPU", "Other"].map((category) => (
          <button key={category} onClick={() => setSelectedCategory(category)} className={`px-3 py-1 rounded-full text-base 
                    ${selectedCategory === category ? "bg-gray-400 text-white" : "bg-white text-black hover:bg-gray-300"}`}>{category}</button>
        ))}
        {/* <hr className="border-t-2 border-gray-300 mx-2 rounded-xl w-full" /> */}
      </div>
<br /><br />
      {/* Price and catergory filter
      <div className="container flex flex-row mt-4 gap-4 mx-4 flex-wrap items-start mb-6">
        <button className="bg-white text-black px-3 py-2 rounded-full text-base flex items-center hover:bg-gray-300">
          Price Filter
          <Image src="/svg_505380.svg" alt="icon" width={20} height={20} className="ml-2" />
        </button>
        <button className="bg-white text-black px-3 py-2 rounded-full text-base hover:bg-gray-300">Recommend mee mai wa???</button>
        <hr className="border-t-2 border-gray-300 mx-2 rounded-xl w-full" />
      </div> */}

      {/* Search Bar */}
      <div className="relative w-full max-w-[600px] mb-4">
        <input
          type="text"
          placeholder="ค้นหาสินค้า..."
          className="border border-gray-300 text-black rounded-full py-3 px-12 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <svg className="absolute left-4 top-3 w-6 h-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M15 11A4 4 0 1111 7a4 4 0 014 4z" />
        </svg>
      </div>

      {/* Product Grid */}
      <div className="w-full max-w-[1200px] mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-5">
        {filteredProducts.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-lg w-full md:w-[250px] h-auto flex flex-col items-center p-4 mb-4">

            {/* Product Image */}
            <div className="border-2 border-gray-400 w-full md:h-[200px] rounded-xl overflow-hidden">
              <Image src={item.img} alt="icon" width={250} height={300} className="w-full h-full object-cover" />
            </div>

            {/* Product Name */}
            <div className="text-black text-start w-full mt-3 pb-2 font-semibold text-sm md:text-m">
              <p>{item.name}</p>
            </div>

            {/* Price & Cart Button */}
            <button onClick={() => router.push(`product/${item.name}`)}
              className="bg-[#FFD83C] hover:bg-[#fdca3c] shadow-md mt-auto text-black w-full py-2 rounded-full text-base flex items-center justify-center gap-2 transition delay-180 duration-300 ease-in-out">
              <Image src="/Shopping cart.png" alt="icon" width={20} height={20} />
              {item.price} บาท
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
