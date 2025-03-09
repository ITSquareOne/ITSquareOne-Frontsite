"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { fetchItemsForCategory, Product } from "../utils/api";

const categoryMap: { [key: string]: number } = {
  "All": 0,
  "CPU": 1,
  "Mainboard": 2,
  "VGA Card": 3,
  "Memory": 4,
  "Harddisk": 5,
  "SSD": 6,
  "Power Supply": 7,
  "Case": 8,
  "Others": 9
};

export default function Category() {
  const [product, setProduct] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [brandMap, setBrandMap] = useState<{ [key: number]: string }>({});
  
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  
  useEffect(() => {
    const getItems = async () => {
      if (!token) return; 
      const products = await fetchItemsForCategory(token);
      setProduct(products);
      console.log("fetched products: ", products);
    };
    
    getItems();
    const interval = setInterval(getItems, 60000); 
    return () => clearInterval(interval); 
  }, [token]); 
  
  useEffect(() => {
    const fetchBrands = async () => {
      if (!token || product.length === 0) return;
  
      try {
        const brandData: { [key: number]: string } = {};
        
        const uniqueBrandIds = [...new Set(product.map((item) => item.brand))];

        const brandRequests = uniqueBrandIds.map(async (brandId) => {
          if (brandId !== 0) { 
            const response = await axios.get(`http://localhost:3000/api/brands/${brandId}`, {
              headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            });
            brandData[brandId as number] = response.data.brand_name;
          }
        });
  
        await Promise.all(brandRequests);
        setBrandMap(brandData);
        console.log("Fetched brand names:", brandData);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, [token, product]);

  // Create dropdown brand list using brand names
  const uniqueBrands = ["All", ...Object.values(brandMap)];

  const filteredProducts = product.filter((item) => {
    return (
      !item.order_id &&
      (selectedCategory === "All" || item.type === categoryMap[selectedCategory]) &&
      (selectedBrand === "All" || brandMap[item.brand as number] === selectedBrand) &&
      (searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="relative min-h-screen bg-cover bg-center px-8 items-center flex flex-col"
      style={{ backgroundImage: "url('/bg-main.png')", backgroundAttachment: "fixed" }}>
      {/* Category Filters */}
      <div className="container flex flex-row mt-4 md:mt-9 gap-4 flex-wrap justify-center">
        {Object.keys(categoryMap).map((category) => (
          <button key={category} onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-base ${
              selectedCategory === category ? "bg-gray-400 text-white" : "bg-white text-black hover:bg-gray-300"
            }`}>
            {category}
          </button>
        ))}
      </div>
      <br /><br />
      
      {/* Search Bar and Brand Filter */}
      <div className="relative w-full max-w-[600px] mb-4 flex gap-4 items-center">
        {/* Search Bar */}
        <div className="relative flex-1">
          <input type="text" placeholder="ค้นหาสินค้า..." className="border border-gray-300 text-black rounded-full py-3 px-12 w-full"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

        {/* Brand Filter Dropdown */}
        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}
          className="border border-gray-300 text-black rounded-full py-3 px-4">
          {uniqueBrands.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="w-full max-w-[1200px] mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-5">
          {filteredProducts.map((item, index) => (
            <div key={item.id || index} className="bg-white rounded-xl shadow-lg w-full md:w-[250px] h-auto flex flex-col items-center p-4 mb-4">
              <div className="border-2 border-gray-400 w-full md:h-[200px] rounded-xl overflow-hidden">
                <Image src={item.part_image ? `data:image/jpeg;base64,${item.part_image}` : "/sorry.jpg"} alt="icon"
                  width={250} height={300} className="w-full h-full object-cover"/>
              </div>
              <div className="text-black text-start w-full mt-3 pb-2 font-semibold text-sm md:text-m">
                <p>{item.name}</p>
              </div>
              {/* Price & Cart Button */}
              <button onClick={() => router.push(`product/${item.id}`)}
                className="bg-[#FFD83C] hover:bg-[#fdca3c] shadow-md mt-auto text-black w-full py-2 rounded-full text-base">
                {item.price} บาท
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center text-lg mt-10">🛒 ยังไม่มีสินค้าในระบบ</div>
      )}
    </div>
  );
}
