"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { fetchItemsForCategory, Product } from "../utils/api";
import { useCart, componentLimits } from "../components/CartContext";

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

const conditionOptions = [
  { label: "คุณภาพเยี่ยม", value: 100 },
  { label: "คุณภาพดี", value: 75 },
  { label: "พอใช้", value: 50 },
  { label: "ต่ำกว่ามาตรฐาน", value: 25 },
];

export default function Category() {
  const { cart, getTypeCount } = useCart();
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
      console.log("Fetched products:", products);
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

  // Creating the dropdown list using brand names
  const uniqueBrands = ["All", ...Object.values(brandMap)];

  const filteredProducts = product.filter((item) => {
    const brandName = brandMap[item.brand as number]; // Convert brand_id to brand_name
    return (
      !item.order_id &&
      (selectedCategory === "All" || item.type === categoryMap[selectedCategory]) &&
      (selectedBrand === "All" || brandName === selectedBrand) &&
      (searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // making star rating for condition
  const renderStars = (condition: number) => {
    const totalStars = 5; // Maximum number of stars
    const rating = Math.round((condition / 100) * totalStars); // Convert 100 scale to 5-star rating

    return (
      <div className="flex text-yellow-400">
        {[...Array(totalStars)].map((_, index) => (
          <span key={index}>
            {index < rating ? "★" : "☆"} {/* Filled or empty star */}
          </span>
        ))}
      </div>
    );
  };

  // Function to get component count status
  const getComponentCountLabel = (categoryName: string) => {
    if (categoryName === "All") return null;
    
    const typeId = categoryMap[categoryName];
    
    // For regular components with limits
    if (componentLimits[typeId] !== undefined) {
      const count = getTypeCount(typeId);
      const { min, max } = componentLimits[typeId];
      const isFull = count >= max;
      
      // Special handling for storage devices
      if (typeId === 5 || typeId === 6) {
        // Calculate total storage devices
        const totalStorage = getTypeCount(5) + getTypeCount(6);
        // Mark as met if either there are items of this type, or if the combined storage requirement is met
        const isMet = count > 0 || totalStorage > 0;
        
        return {
          label: `${count}/${max}`,
          isFull,
          isMet
        };
      }
      
      // For other components, check if minimum count is met
      const isMet = count >= min;
      
      return {
        label: `${count}/${max}`,
        isFull,
        isMet
      };
    }
    
    // For VGA and Others which don't have limits
    return null;
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center px-8 items-center flex flex-col">

      {/* Category Filters */}
      <div className="container flex flex-row mt-4 md:mt-9 gap-4 flex-wrap justify-center">
        {Object.keys(categoryMap).map((category) => {
          const countStatus = getComponentCountLabel(category);
          
          return (
            <button 
              key={category} 
              onClick={() => setSelectedCategory(category)}
              className={`
                px-3 py-1 rounded-full text-base relative
                ${selectedCategory === category 
                  ? "bg-gray-400 text-white" 
                  : "bg-white text-black hover:bg-gray-300"
                }
                ${countStatus?.isFull ? "opacity-50" : ""}
              `}
            >
              {category}
              {countStatus && (
                <span 
                  className={`
                    absolute -top-2 -right-2 text-xs px-1.5 py-0.5 rounded-full
                    ${countStatus.isMet ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}
                  `}
                >
                  {countStatus.label}
                </span>
              )}
            </button>
          );
        })}
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
          {filteredProducts.map((item, index) => {
            // Check if this component type has a limit
            const typeId = item.type as number;
            const hasLimit = componentLimits[typeId];
            const isAtLimit = hasLimit ? getTypeCount(typeId) >= componentLimits[typeId].max : false;
            
            return (
              <div key={item.id || index} className={`
                  bg-white rounded-xl shadow-lg w-full md:w-[250px] h-auto flex flex-col items-center p-4 mb-4
                  ${isAtLimit ? 'opacity-50' : ''}
                `}>
                <div className="relative border-2 border-gray-400 w-full md:h-[200px] rounded-xl overflow-hidden">
                  {hasLimit && (
                    <div className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full px-2 py-1 text-xs">
                      {getTypeCount(typeId)}/{componentLimits[typeId].max} {hasLimit.name}
                    </div>
                  )}
                  <Image src={item.part_image ? `data:image/jpeg;base64,${item.part_image}` : "/sorry.jpg"} alt="icon"
                    width={250} height={300} className="w-full h-full object-cover" />
                </div>
                {/* Condition stars */}
                <div className="text-gray-500 w-full mt-2 font-semibold text-md md:text-m">
                  <div className=" gap-2 flex items-center mt-2">
                    <span className="font-thin">คุณภาพ :</span> {renderStars(item.condition)}
                  </div>
                </div>
                {/* Product Name */}
                <div className="text-black text-start w-full pb-2 mt-1 font-semibold text-sm md:text-m">
                  <p>{item.name}</p>
                </div>

                {/* Price & Cart Button */}
                <button onClick={() => router.push(`product/${item.id}`)}
                  className="bg-[#FFD83C] hover:bg-[#fdca3c] shadow-md mt-auto text-black w-full py-2 rounded-full text-base flex items-center justify-center gap-2">
                  <Image src="/Shopping cart.png" alt="icon" width={20} height={20} />
                  {item.price} บาท
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-500 text-center text-lg mt-10">🛒 ยังไม่มีสินค้าในระบบ</div>
      )}
    </div>
  );
}