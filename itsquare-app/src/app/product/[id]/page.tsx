"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface Product {
  part_id: number;
  part_code: string;
  name: string;
  price: number;
  condition: number;
  part_image: string;
  brand_id: number;
}

// Function to convert condition percentage to a readable label
const getConditionLabel = (condition: number) => {
  if (condition >= 91) return "ใหม่เอี่ยม"; // Like New
  if (condition >= 71) return "ดีเยี่ยม"; // Excellent
  if (condition >= 41) return "ดี"; // Good
  return "พอใช้"; // Fair
};

export default function ProductPage() {
  const { id } = useParams();
  const productId = typeof id === "string" ? decodeURIComponent(id) : "";
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    console.log("Fetching product with part_id:", productId); // Debugging log

    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. Please log in.");
          return;
        }

        // Fetch product details from /api/part-items/partid/{partid}
        const partItemRes = await axios.get(`http://localhost:3000/api/part-items/partid/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!partItemRes.data) {
          console.error("Product not found.");
          return;
        }

        const partItem = partItemRes.data;

        // Fetch product name from /api/parts using part_code
        const partRes = await axios.get(`http://localhost:3000/api/parts?part_code=${partItem.part_code}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const partData = partRes.data.length > 0 ? partRes.data[0] : { name: "Unknown Product", brand_id: null };

        // Merge data
        setProduct({
          ...partItem,
          name: partData.name,
          brand_id: partData.brand_id,
        });
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-6" style={{ backgroundImage: "url('/bg-main.png')" }}>
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl items-center">
        <div className="place-items-center">
          {product.part_image ? (
            <Image 
              src={`data:image/jpeg;base64,${product.part_image}`} 
              alt={`${product.name}`} 
              width={300} 
              height={300} 
              className="rounded-lg" 
            />
          ) : (
            <p className="text-gray-500">No image available</p>
          )}
        </div>
        <h1 className="text-2xl font-bold mt-4 text-black">{product.name}</h1>
        <p className="text-gray-600">รหัสสินค้า: {product.part_code}</p>

        {/* Product Condition */}
        <p className="text-sm mt-2 text-gray-600">
          สภาพสินค้า: <span className="text-black font-semibold">{getConditionLabel(product.condition)}</span>
        </p>

        <p className="text-xl font-semibold mt-2 text-black">{product.price} บาท</p>
        
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          เพิ่มสู่ตะกร้า
        </button>
      </div>
    </div>
  );
}
