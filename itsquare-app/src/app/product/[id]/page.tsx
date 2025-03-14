"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchOneItem, Product, User, getProfile } from "../../utils/api";
import { useCart, componentLimits } from "../../components/CartContext";
import { Dialog } from "@headlessui/react";

const renderStars = (condition: number) => {
  const totalStars = 5;
  const rating = Math.round((condition / 100) * totalStars);

  return (
    <div className="flex text-yellow-400">
      {[...Array(totalStars)].map((_, index) => (
        <span key={index}>
          {index < rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
};

export default function ProductPage() {
    const {id} = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const decodedId = typeof id === 'string' ? decodeURIComponent(id) : ''; 
    const [Profile, setProfile] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const { cart, addToCart, getTypeCount } = useCart(); 
    const [IsAdding, setIsAdding] = useState(false);
    const [alreadyInCart, setAlreadyInCart] = useState(false);
    const [limitReached, setLimitReached] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;
    try {
      const existingItem = cart.find((item) => item.id === product.id);
      if (existingItem) {
        setAlreadyInCart(true);
        return;
      }
      
      // Check component limits
      const productType = product.type as number;
      const limit = componentLimits[productType];
      
      if (limit) {
        const typeCount = getTypeCount(productType);
        
        if (typeCount >= limit.max) {
          setLimitReached(true);
          return;
        }
      }
      
      // Add to cart if not already in cart and within limits
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: `data:image/jpeg;base64,${product.part_image}`,
        type: product.type
      });
      setIsAdding(true);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      const profileData = await getProfile(token);
      if (profileData) {
        setProfile(profileData);
      }
    };
    fetchProfile();
  }, [token]);

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

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    if (!product) return <p className="text-center mt-10">Loading...</p>;
    
    // Check if this product type has a limit
    const productType = product.type as number;
    const limit = componentLimits[productType];
    const currentCount = getTypeCount(productType);
    const isAtLimit = limit !== undefined && currentCount >= limit.max;
    
    // Get component type name
    const getComponentTypeName = (type: number) => {
      switch (type) {
        case 1: return "CPU";
        case 2: return "Mainboard";
        case 3: return "VGA Card";
        case 4: return "Memory";
        case 5: return "Harddisk";
        case 6: return "SSD";
        case 7: return "Power Supply";
        case 8: return "Case";
        default: return "Other";
      }
    };
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-6">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full text-center relative">
            <a className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-lg border border-blue-600 hover:bg-blue-600 inline-block transition " href="/main-cate">
                back
            </a>
            <div className="flex justify-center">
                <Image 
                    src={product.part_image ? `data:image/jpeg;base64,${product.part_image}` : "/sorry.jpg"}
                    alt={product.name} 
                    width={200} 
                    height={200} 
                    className="rounded-lg"
                />
            </div>
            <h1 className="text-xl font-bold mt-4 text-black uppercase">{product.name}</h1>
            
            {/* Component type badge */}
            <div className="mt-2">
              <span className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full">
                {getComponentTypeName(productType)}
                {limit && ` (${currentCount}/${limit.max})`}
              </span>
            </div>
            
            <p className="text-blue-600 text-2xl font-bold mt-2">{product.price} บาท</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-gray-600">สภาพ:</span>
              {renderStars(product.condition)}
            </div>
            
            {Profile?.role === "student" && (
              <button 
                onClick={handleAddToCart} 
                disabled={isAtLimit}
                className={`mt-4 ${
                  isAtLimit 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-pink-500 hover:bg-pink-600"
                } text-white px-6 py-2 rounded-lg border transition`}
              >
                {isAtLimit 
                  ? `ถึงขีดจำกัด ${getComponentTypeName(productType)} แล้ว` 
                  : "เพิ่มสู่ตะกร้า"}
              </button>
            )}
            
            <Dialog open={IsAdding} onClose={() => setIsAdding(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 md:w-1/4 w-3/4 text-center text-black">
                <div>
                  <h2 className="text-xl font-semibold text-green-600">เพิ่มสินค้าลงในตะกร้าเรียบร้อย ✅</h2>
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      window.location.href = "/main-cate";
                    }}
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
                  onClick={() => {setAlreadyInCart(false);  window.location.href = "/main-cate";}}
                  className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  ปิด
                </button>
              </div>
            </Dialog>
            
            <Dialog open={limitReached} onClose={() => setLimitReached(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 md:w-1/4 w-3/4 text-center text-black">
                <h2 className="text-xl font-semibold text-orange-600">
                  ถึงขีดจำกัดจำนวน {getComponentTypeName(productType)} แล้ว ⚠️
                </h2>
                <p className="mt-2 text-gray-600">
                  คุณสามารถเลือก {getComponentTypeName(productType)} ได้สูงสุด {limit?.max} ชิ้นเท่านั้น
                </p>
                <button
                  onClick={() => {setLimitReached(false);}}
                  className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  ปิด
                </button>
              </div>
            </Dialog>
            
            <div className="text-left mt-4 text-gray-700">
                <p className="text-gray-600 text-md mb-4">รหัสชิ้นส่วน: {product.part_code}</p>
                <p className="whitespace-pre-line">
                    {(product.description ?? "").split("|").map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                </p>
          </div>
    </div>
</div>
  );
}