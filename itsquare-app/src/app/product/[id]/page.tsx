"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchOneItem, Product } from "../../utils/api";

export default function ProductPage() {
    const {id} = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const decodedId = typeof id === 'string' ? decodeURIComponent(id) : ''; 
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
      const storedToken = localStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
      }
    }, []);

    useEffect(() => {
      if (token && decodedId) {
        const fetchProduct = async () => {
            try {
                const fetchedProduct = await fetchOneItem(token, decodedId);
                if (fetchedProduct) {
                    setProduct(fetchedProduct);
                } else {
                    console.error("Product not found");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };
        fetchProduct();
    }
    }, [token, id]);

    if (!product) return <p className="text-center mt-10">Loading...</p>;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-6" style={{ backgroundImage: "url('/bg-main.png')" }}>
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full text-center relative">
            <a className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-lg border border-blue-600 hover:bg-blue-600 inline-block transition " href="/main-cate">
                back
            </a>
            <div className="flex justify-center">
                <Image 
                    src={`data:image/jpeg;base64,${product.part_image}`}  
                    alt={product.name} 
                    width={200} 
                    height={200} 
                    className="rounded-lg"
                />
            </div>
            <h1 className="text-xl font-bold mt-4 text-black uppercase">{product.name}</h1>
            <p className="text-blue-600 text-2xl font-bold">{product.price} บาท</p>
            <button className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg border hover:bg-pink-600 transition">
                เพิ่มสู่ตะกร้า
            </button>
            <div className="text-left mt-4 text-gray-700">
                <p className="text-gray-600 text-md mb-4">รหัสชิ้นส่วน: {product.part_code}</p>
                <p className="whitespace-pre-line">{product.description}</p>
          </div>
    </div>
</div>
  );
}

