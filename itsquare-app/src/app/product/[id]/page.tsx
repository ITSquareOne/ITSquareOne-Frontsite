"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchOneItem, Product } from "../../utils/api";
import { useCart } from "../../components/CartContext";
import { Dialog } from "@headlessui/react";



// Function to convert condition percentage to a readable label
const getConditionLabel = (condition: number) => {
  if (condition >= 91) return "ใหม่เอี่ยม"; // Like New
  if (condition >= 71) return "ดีเยี่ยม"; // Excellent
  if (condition >= 41) return "ดี"; // Good
  return "พอใช้"; // Fair
};

export default function ProductPage() {
    const {id} = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const decodedId = typeof id === 'string' ? decodeURIComponent(id) : ''; 
    const [token, setToken] = useState<string | null>(null);
    const { cart, addToCart } = useCart(); // ดึง cart และ addToCart จาก Context
    const [IsAdding, setIsAdding] = useState(false);
    const [alreadyInCart, setAlreadyInCart] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;
    try {
      const existingItem = cart.find((item) => item.id === product.id);
      if (existingItem) {
        setAlreadyInCart(true);
      } else {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: `data:image/jpeg;base64,${product.part_image}`
        });
        setIsAdding(true); 
      }
    } catch (error) {
      console.log(error);
    }
  }
    useEffect(() => {
      const storedToken = localStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
      }
    }, []);

    useEffect(() => {
      localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
      console.log("Updated cart:", cart);
    }, [cart]);
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
            <button onClick={handleAddToCart} className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg border hover:bg-pink-600 transition">
              เพิ่มสู่ตะกร้า
            </button>
            <Dialog open={IsAdding} onClose={() => setIsAdding(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 md:w-1/4 w-3/4 text-center text-black">
                <div>
                  <h2 className="text-xl font-semibold text-green-600">เพิ่มสินค้าลงในตะกร้าเรียบร้อย ✅</h2>
                  <button
                    onClick={() => setIsAdding(false)}
                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                    >
                      ปิด
                  </button>
                </div>
              </div>
            </Dialog>
            <Dialog open={alreadyInCart} onClose={() => setAlreadyInCart(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 md:w-1/4 w-3/4 text-center text-black">
                <h2 className="text-xl font-semibold text-red-600">สินค้านี้อยู่ในตะกร้าแล้ว ❗</h2>
                <button
                  onClick={() => setAlreadyInCart(false)}
                  className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  ปิด
                </button>
              </div>
            </Dialog>
            <div className="text-left mt-4 text-gray-700">
                <p className="text-gray-600 text-md mb-4">รหัสชิ้นส่วน: {product.part_code}</p>
                <p className="whitespace-pre-line">{product.description}</p>
          </div>
    </div>
</div>
  );
}
