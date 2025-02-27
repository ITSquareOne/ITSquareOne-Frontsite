"use client"
import Image from "next/image";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
    { month: "Jan", users: 2000, orders: 8000, income: 50000 },
    { month: "Feb", users: 4000, orders: 15000, income: 120000 },
    { month: "Mar", users: 6000, orders: 25000, income: 250000 },
    { month: "Apr", users: 8000, orders: 50000, income: 500000 },
    { month: "May", users: 10000, orders: 100000, income: 1000000 },
  ];
export default function manager() {
  return (
    <div 
      className="relative min-h-[93vh] flex bg-cover bg-center" 
      style={{ backgroundImage: "url('/bg-main.png')" }}
    >
      <div className="w-1/4 m-12 mr-4 bg-white min-h-[80vh] p-6 rounded-xl">
        <ul className="space-y-4">
          <li className="p-3 bg-yellow-400 rounded-full  text-xl text-center text-black font-medium">Dashboard</li>
          <li className="p-3 bg-gray-200 text-xl text-black font-medium rounded-full text-center">Order</li>
          <li className="p-3 bg-gray-200 text-xl  text-black font-medium rounded-full text-center">Manage Stock</li>
          <li className="p-3 bg-gray-200 text-xl text-black font-medium rounded-full text-center">Manage Staff</li>
          <li className="p-3 bg-gray-200 text-xl text-black font-medium rounded-full text-center">Manage User</li>
        </ul>
      </div>

      <div className="flex-1 bg-gray-100  p-6 rounded-lg my-12 mr-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-black">Total Users</h2>
            <p className="text-2xl  text-black  font-bold">10,000 Users</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-black">Total Order</h2>
            <p className="text-2xl  text-black font-bold">100,000 Orders</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-black">Total Income</h2>
            <p className="text-2xl  text-black font-bold">$1,000,000</p>
          </div>
        </div>

        <div className="bg-gray-300 flex items-center justify-center h-64 rounded-lg shadow-md p-4">
          <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} />
            <Line type="monotone" dataKey="income" stroke="#ff7300" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
