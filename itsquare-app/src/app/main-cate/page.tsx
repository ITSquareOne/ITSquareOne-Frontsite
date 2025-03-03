"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  price: number;
  condition: number;
  part_code: string;
  part_image: string;
  brand_id: number;
  type_id: number;
}

const categoryMap: { [key: string]: number } = {
  "All": 0,
  "CPU": 1,
  "Power Supply": 2,
  "Ram": 3,
  "HDD & SSD": 4,
  "Mainboard": 5,
  "GPU": 6,
  "Other": 7
};


export default function Category() {
  const [product, setProduct] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  const fetchItems = async () => {
    if (!token) return; 
    
    try {
      const [partItemsResponse, partsResponse] = await Promise.all([
      axios.get("http://localhost:3000/api/part-items", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }), axios.get("http://localhost:3000/api/parts", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }),
    ]);
    const partItems = partItemsResponse.data;
    const parts = partsResponse.data;
    if (Array.isArray(partItems) && Array.isArray(parts)) {
      const mergedProducts = partItems.map((item: any) => {
        const part = parts.find((p: any) => p.part_code === item.part_code) || {};
        return {
          id: item.part_id,
          name: part.name,
          price: item.price,
          condition: item.condition,
          part_code: item.part_code,
          part_image: item.part_image,
          brand_id: part.brand_id || 0,
          type_id: part.type_id || 0,
        };
      });
      setProduct(mergedProducts);
    } else {
      console.error("Fetch error: Data format incorrect", { partItems, parts });
      }
    } catch (error) {
      console.error("Fetch error: " + error);
    }
  };

useEffect(() => {
  const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
  }
}, []);

useEffect(() => {
  fetchItems();
}, [token]); 


  const filteredProducts = product.filter((item) => {
    return (
      (selectedCategory === "All" || item.type_id === categoryMap[selectedCategory]) &&
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
        {Object.keys(categoryMap).map((category) => (
          <button key={category} onClick={() => setSelectedCategory(category)} className={`px-3 py-1 rounded-full text-base 
                    ${selectedCategory === category ? "bg-gray-400 text-white" : "bg-white text-black hover:bg-gray-300"}`}>{category}</button>
        ))}
      </div>
<br /><br />
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
        {filteredProducts.map((item, index) => (
          <div key={item.id || index} className="bg-white rounded-xl shadow-lg w-full md:w-[250px] h-auto flex flex-col items-center p-4 mb-4">
            
            <div className="border-2 border-gray-400 w-full md:h-[200px] rounded-xl overflow-hidden">
              <Image src={`data:image/jpeg;base64,${item.part_image}`} alt="icon" width={250} height={300} className="w-full h-full object-cover" />
            </div>

            {/* Product Name */}
            <div className="text-black text-start w-full mt-3 pb-2 font-semibold text-sm md:text-m">
              <p>{item.name}</p>
            </div>

            {/* Price & Cart Button */}
            <button onClick={() => router.push(`product/${item.id}`)}
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
