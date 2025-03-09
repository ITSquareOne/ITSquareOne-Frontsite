"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { CanceledOrder, Order, getOrderDetails, getCanceledOrder } from "@/app/utils/api";

export default function OrderDetail () {
    const { id } = useParams(); 
    const orderId = Number(id); 
    const [order, setOrder] = useState<Order | null>(null);
    const [canceledOrder, setcanceledOrder] = useState<CanceledOrder | null>(null);

    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);


  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || !token) return; 
      try {
        setLoading(true);
        let data = await getOrderDetails(token, orderId);
        if (Array.isArray(data) && data.length !== 0) {
          setOrder(data);
        } else {
          data = await getCanceledOrder(token, orderId);
          setcanceledOrder(data);
        }

      } catch (error) {
        console.error("Error fetching order details:", error);
      }  finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, token]); 

  if (loading) return <div>⏳ Loading...</div>;
  
  if (canceledOrder) {     
    return (
      <div 
        className="flex items-center justify-center h-screen bg-cover bg-center">
        <div className="bg-white rounded-xl shadow-lg p-6 w-[80%] max-w-4xl">
        <h1 className="text-center text-xl font-bold mb-4 text-black">
        ❌ คำสั่งซื้อถูกยกเลิก
        </h1>
        <h1 className="text-center text-xl font-bold mb-4 text-black">
          รายละเอียดคำสั่งซื้อ #{orderId}
        </h1>
        <h2 className="text-center text-lg font-bold text-gray-700">
            {canceledOrder?.brief.split(",").map((line, index) => (
                <span key={index} className="block">{line.trim()}</span>
            ))}
        </h2>

        <button onClick={() => window.history.back()} className="mt-8 px-4 py-2 bg-yellow-500 text-black rounded-lg shadow-md hover:bg-yellow-600 transition">
          Back
        </button>
      </div>
    </div>
    );
  }
    
  return (
    <div
      className="relative min-h-[93vh] flex flex-col items-center justify-center bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/bg-main.png')" }}
    >
      <div className="bg-white rounded-xl shadow-lg p-6 w-[80%] max-w-4xl">
        <h1 className="text-center text-xl font-bold mb-4 text-black">
          รายละเอียดคำสั่งซื้อ #{orderId}
        </h1>

        <table className="w-full border-collapse mb-4">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 text-gray-700">ชื่อสินค้า</th>
              <th className="text-right p-3 text-gray-700">ราคา</th>
            </tr>
          </thead>
          <tbody>
            {order?.map((item) => (
              <tr key={item.part_id} className="border-t">
                <td className="flex items-center gap-4 p-3">
                  <Image
                    src={`data:image/jpeg;base64,${item.part_image}`}
                    alt={item.part_code}
                    width={80}
                    height={80}
                    className="rounded-md border"
                  />
                  <div>
                    <p className="font-semibold text-blue-500">{item.part_code}</p>
                    <p className="text-sm text-gray-500">สภาพ: {item.condition}%</p>
                  </div>
                </td>
                <td className="text-right p-3 font-semibold text-gray-900">
                  THB {item.price.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={() => window.history.back()} className="mt-8 px-4 py-2 bg-yellow-500 text-black rounded-lg shadow-md hover:bg-yellow-600 transition">
          Back
        </button>
      </div>
    </div>
  );
};

