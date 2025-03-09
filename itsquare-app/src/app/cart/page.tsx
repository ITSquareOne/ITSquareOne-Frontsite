"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart, componentLimits, requiredStorageTypes } from "../components/CartContext";

export default function PcBuildSummary() {
  const { cart, removeFromCart, getTypeCount } = useCart();
  const [error, setError] = useState<string | null>(null);

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);
  
  // Check if all required components are present in required quantities
  const validateCart = () => {
    // Check for minimum requirements of each component type
    for (const [typeStr, limit] of Object.entries(componentLimits) as [string, {min: number, max: number, name: string}][]) {
      const type = Number(typeStr);
      const count = getTypeCount(type);
      
      // Special case for storage (either HDD or SSD required)
      if (requiredStorageTypes.includes(type)) {
        continue; // We'll handle storage separately
      }
      
      if (count < limit.min) {
        return `กรุณาเพิ่ม ${limit.name} อย่างน้อย ${limit.min} ชิ้น`;
      }
      
      if (count > limit.max) {
        return `สามารถเลือก ${limit.name} ได้สูงสุด ${limit.max} ชิ้น`;
      }
    }
    
    // Special case: Check for minimum storage (HDD or SSD)
    const totalStorage = requiredStorageTypes.reduce((sum, type) => sum + getTypeCount(type), 0);
    if (totalStorage < 1) {
      return "กรุณาเพิ่ม Harddisk หรือ SSD อย่างน้อย 1 ชิ้น";
    }
    
    return null; // No errors
  };
  
  const handleCheckout = () => {
    const validationError = validateCart();
    if (validationError) {
      setError(validationError);
      return;
    }
    window.location.href = "/checkingout";
  };

  return (
    <div className="min-h-screen flex flex-col text-white overflow-hidden pt-[5vh]">
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-32 px-8 flex-grow justify-center">
        {/* Left Section: Your Computer */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold">YOUR COMPUTER</h2>
          <div className="flex gap-4 mt-4">
            <Image src="/monitor.svg" alt="Monitor" width={100} height={100} />
            <Image src="/cpu_full.svg" alt="PC Case" width={100} height={100} />
          </div>
          <a href="/main-cate" className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold">
            Build a PC
          </a>
        </div>

        {/* Right Section: Cart Summary */}
        <div className="w-full max-w-lg bg-white text-black rounded-lg shadow-lg flex flex-col">
          {/* SPECS Header */}
          <h3 className="bg-yellow-400 text-center text-lg font-semibold py-2 rounded-t-lg">SPECS</h3>

          {/* Component Counter */}
          <div className="p-4 grid grid-cols-2 gap-2">
            {Object.entries(componentLimits).map(([typeStr, limit]) => {
              const type = Number(typeStr);
              const count = getTypeCount(type);
              const isComplete = count >= limit.min && count <= limit.max;
              
              return (
                <div key={typeStr} className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${isComplete ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {count}/{limit.max} {limit.name}
                  </span>
                </div>
              );
            })}
            
            {/* Storage counter (combined HDD and SSD) */}
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                requiredStorageTypes.reduce((sum, type) => sum + getTypeCount(type), 0) > 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
              }`}>
                {requiredStorageTypes.reduce((sum, type) => sum + getTypeCount(type), 0)}/4 Storage (HDD/SSD)
              </span>
            </div>
          </div>

          {/* SPECS Scrollable Section */}
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {cart.map((item) => (
                <div key={item.id} className="flex flex-row">
                    <Image                     
                    src={item.image && item.image.startsWith("data:image/jpeg;base64,") && !item.image.includes("undefined") ? item.image : "/sorry.jpg"}                    
                    alt="PC Component" 
                    width={150} 
                    height={100}
                    className="mr-4"/>
                    <div> 
                        <p>{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {
                            item.type === 1 ? "CPU" :
                            item.type === 2 ? "Mainboard" :
                            item.type === 3 ? "VGA Card" :
                            item.type === 4 ? "Memory" :
                            item.type === 5 ? "Harddisk" :
                            item.type === 6 ? "SSD" :
                            item.type === 7 ? "Power Supply" :
                            item.type === 8 ? "Case" :
                            "Other"
                          }
                        </p>
                        <p className="mt-2 text-xl text-blue-500">{item.price} บาท</p>
                        <button className="bg-red-500 hover:bg-red-600 text-white transition p-1 px-2 shadow-md rounded-lg mt-2" onClick={() => removeFromCart(item.id)}>ลบสินค้า</button>
                    </div>
                </div>
            ))}
          </div>

          {error && <p className="text-red-500 text-center py-2 whitespace-pre">{error}</p>}

          <div className="flex justify-between items-center bg-gray-200 p-4 rounded-b-lg">
            <p className="text-lg font-semibold">Total: {totalPrice} THB</p>
            {cart.length > 0 && (
              <button onClick={handleCheckout} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                สั่งประกอบคอมพิวเตอร์
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}