"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

export default function ProductPage() {
    const {id} = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const decodedId = typeof id === 'string' ? decodeURIComponent(id) : ''; 

    useEffect(() => {
        fetch("/data/items.json")
          .then((response) => response.json())
          .then((data) => {
            console.log("ID from URL:", decodedId);
            const selectedProduct = data.find((item: Product) => item.name.toString() === decodedId);
            console.log("Found Product:", selectedProduct);
            setProduct(selectedProduct);
          })
          .catch((error) => console.error("Fetch error: " + error));
      }, [id]);

    if (!product) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-6"  style={{backgroundImage: "url('/bg-main.png')"}}>
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl items-center">
        <Image src={product.img} alt={product.name} width={300} height={300} className="rounded-lg" />
        <h1 className="text-2xl font-bold mt-4 text-black">{product.name}</h1>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-lg font-semibold mt-2 text-black">THB {product.price}</p>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Buy Now
        </button>
      </div>
    </div>
  );
}

