"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface User {
  user_id: number;
  username: string;
  firstNameEn: string;
  lastNameEn: string;
  firstNameTh: string;
  lastNameTh: string;
  profile: string | null;
  role: string;
}

const data = [
    { month: "Jan", users: 2000, orders: 8000, income: 50000 },
    { month: "Feb", users: 4000, orders: 15000, income: 120000 },
    { month: "Mar", users: 6000, orders: 25000, income: 250000 },
    { month: "Apr", users: 8000, orders: 50000, income: 500000 },
    { month: "May", users: 10000, orders: 100000, income: 1000000 },
  ];
export default function manager() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setselectedUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("วิเคราะห์ยอดขาย");
  const menuItems = ["วิเคราะห์ยอดขาย", "ยอดการสั่งซื้อ", "จัดการบัญชีพนักงาน", "จัดการบัญชีผู้ใช้"];
  const [token, setToken] = useState<string | null>(null);

  const getOneUser = async (userId: number) => {
    try {
      const results = await axios.get<User>(`http://localhost:3000/api/managers/users/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      setselectedUser(results.data);
      setIsOpen(true);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    console.log("Updated selectedUser:", selectedUser?.user_id);
  }, [selectedUser]);

  const editUser = async () => {
    if (!selectedUser) {
      return;
    }
    console.log("Sending request to update user:", selectedUser);


    try {
        const results = await axios.put(
          `http://localhost:3000/api/managers/users/${selectedUser.user_id}/role`,
          {
            role: selectedUser.role,
          },
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json",
              "Content-Type": "application/json"
            }
          }
        );
        console.log("Updated Successfully:", results.data);
        setIsOpen(false);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.user_id === selectedUser.user_id
              ? { ...user, role: selectedUser.role } 
              : user
          )
        );
      } catch (err) {
        console.error("Error updating user:", err);
      }
    };
  const getUsers = async () => {
    try {
      const results = await axios.get("http://localhost:3000/api/managers/users", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      setUsers(results.data);
    } catch (err) {
      console.log(err);
    }
    
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);

    }
}, []);

  useEffect(() => {
    getUsers();
  }, [token]); 

  return (
    <div 
      className="relative min-h-[93vh] flex bg-cover bg-center" 
      style={{ backgroundImage: "url('/bg-main.png')" }}
    >
      <div className="w-1/4 m-12 mr-4 bg-white min-h-[80vh] p-6 rounded-xl">
      <ul className="space-y-4">
          {menuItems.map((item) => (
            <li 
              key={item}
              className={`p-3 text-xl text-center font-medium rounded-full border-4 border-gray-300 cursor-pointer 
                ${selected === item ? "bg-yellow-400 text-black hover:bg-yellow-600 hover:text-white transition" : "bg-white text-black hover:bg-slate-400  hover:text-white transition"}`}
              onClick={() => setSelected(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 bg-gray-100  p-6 rounded-lg my-12 mr-4">
      {selected === "วิเคราะห์ยอดขาย" && 
        <>
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
        </>
       }
      
      {selected === "ยอดการสั่งซื้อ" && 
        <>
        <div className="bg-white p-4 rounded-lg shadow-md border-2 text-black border-gray-300 w-1/3 mb-6">
          <h2 className="text-lg font-semibold">Total Order</h2>
          <p className="text-2xl font-bold">100000 Orders</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {[
            { status: "Inspecting", count: "100000 Orders" },
            { status: "In Progress", count: "100000 Orders" },
            { status: "Completed", count: "100000 Orders" },
            { status: "Canceled", count: "100000 Orders" },
          ].map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md border-2  text-black border-gray-300 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold">{item.status}</h2>
                <p className="text-2xl font-bold">{item.count}</p>
              </div>
              <button className="mt-4 bg-blue-500 text-white px-3 py-1 rounded-lg self-start">
                View Order
              </button>
            </div>
          ))}
        </div>
        </>
      }

      {selected === "จัดการบัญชีพนักงาน" && 
        <>
        <table className="w-full border border-blue-500 text-black">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black px-4 py-2">ID</th>
              <th className="border border-black px-4 py-2">Username</th>
              <th className="border border-black px-4 py-2">Firstname</th>
              <th className="border border-black px-4 py-2">Lastname</th>
              <th className="border border-black px-4 py-2">Role</th>
              <th className="border border-black px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
              {users.filter((user) => user.role === "technician").map((user) => (
                <tr key={user.user_id} className="text-center">
                  <td className="border border-black px-4 py-2">{user.user_id}</td>
                  <td className="border border-black px-4 py-2">{user.username}</td>
                  <td className="border border-black px-4 py-2">{user.firstNameTh}</td>
                  <td className="border border-black px-4 py-2">{user.lastNameTh}</td>
                  <td className="border border-black px-4 py-2">{user.role}</td>
                  <td className="border border-black px-4 py-2">
                    <button onClick={() => getOneUser(user.user_id)} className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition">Edit</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-96 text-center text-black">
          <h2 className="text-xl font-bold mb-4">Edit User</h2>
          
          {selectedUser && (
            <div className="space-y-3">
              <div>
                <label className="block text-left font-semibold">First Name (TH)</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded-md"
                  value={selectedUser.firstNameTh}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-left font-semibold">Last Name (TH)</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded-md"
                  value={selectedUser.lastNameTh}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-left font-semibold">Role</label>
                <select
                  className="w-full border p-2 rounded-md"
                  value={selectedUser.role}
                  onChange={(e) => setselectedUser({ ...selectedUser, role: e.target.value })}
                >
                  <option value="student">นักศึกษา</option>
                  <option value="technician">ช่างเทคนิค</option>
                </select>
              </div>

              <button
                onClick={editUser}
                className="mt-4 mr-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                แก้ไข
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                ปิด
              </button>
            </div>
          )}
          </div>
        </Dialog>
        
        </>
       }

      {selected === "จัดการบัญชีผู้ใช้" && 
        <>
        <table className="w-full border border-blue-500 text-black">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black px-4 py-2">ID</th>
              <th className="border border-black px-4 py-2">Username</th>
              <th className="border border-black px-4 py-2">Firstname</th>
              <th className="border border-black px-4 py-2">Lastname</th>
              <th className="border border-black px-4 py-2">Role</th>
              <th className="border border-black px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
              {users.filter((user) => user.role === "student").map((user) => (
                <tr key={user.user_id} className="text-center">
                  <td className="border border-black px-4 py-2">{user.user_id}</td>
                  <td className="border border-black px-4 py-2">{user.username}</td>
                  <td className="border border-black px-4 py-2">{user.firstNameTh}</td>
                  <td className="border border-black px-4 py-2">{user.lastNameTh}</td>
                  <td className="border border-black px-4 py-2">{user.role}</td>
                  <td className="border border-black px-4 py-2">
                    <button onClick={() => getOneUser(user.user_id)} className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition">Edit</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-96 text-center text-black">
          <h2 className="text-xl font-bold mb-4">Edit User</h2>
          
          {selectedUser && (
            <div className="space-y-3">
              <div>
                <label className="block text-left font-semibold">First Name (TH)</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded-md"
                  value={selectedUser.firstNameTh}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-left font-semibold">Last Name (TH)</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded-md"
                  value={selectedUser.lastNameTh}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-left font-semibold">Role</label>
                <select
                  className="w-full border p-2 rounded-md"
                  value={selectedUser.role}
                  onChange={(e) => setselectedUser({ ...selectedUser, role: e.target.value })}
                >
                  <option value="student">นักศึกษา</option>
                  <option value="technician">ช่างเทคนิค</option>
                </select>
              </div>

              <button
                onClick={editUser}
                className="mt-4 mr-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                แก้ไข
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                ปิด
              </button>
            </div>
          )}
          </div>
        </Dialog>
        
        </>
       }
      </div>
    </div>
    
  );
}
