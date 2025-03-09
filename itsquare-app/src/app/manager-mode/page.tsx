"use client"
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { User, getUsers, getOneUser, editUser, fetchSalesDaily, fetchSalesMonthly, fetchSalesYearly } from "@/app/utils/api";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function manager() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setselectedUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("วิเคราะห์ยอดขาย");
  const menuItems = ["วิเคราะห์ยอดขาย", "จัดการบัญชีพนักงาน", "จัดการบัญชีผู้ใช้"];
  const [token, setToken] = useState<string | null>(null);
  const [salesData, setSalesData] = useState([]);
  const [timeFrame, setTimeFrame] = useState<"daily" | "monthly" | "yearly">("daily");
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);


  useEffect(() => {
    console.log("Updated selectedUser:", selectedUser?.user_id);
  }, [selectedUser]);

  const handleEditUser = async () => {
    if (!selectedUser || !selectedUser.user_id || !selectedUser.role) return;
    if (!token) return;
  
    const success = await editUser(selectedUser.user_id, selectedUser.role, token);
    if (success) {
      setIsOpen(false);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.user_id === selectedUser.user_id ? { ...user, role: selectedUser.role } : user
        )
      );
    }
  };

  const handleGetOneUser = async (userId: any) => {
    if (token) {
      const user = await getOneUser(userId, token);
      if (user) {
        setselectedUser(user);
        setIsOpen(true);
      }
    }
    };

  useEffect(() => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (token) {
        const data = await getUsers(token); 
        setUsers(data || []);
      }
    };
    fetchUsers();
  }, [token]);

  const fetchData = async () => {
    if (!token) return;
  
    let data;
    if (timeFrame === "daily") {
      data = await fetchSalesDaily(token);
    } else if (timeFrame === "monthly") {
      data = await fetchSalesMonthly(token);
    } else if (timeFrame === "yearly") {
      data = await fetchSalesYearly(token);
    }
  
    if (data) {
      const formattedData = data.map((item: any) => ({
        date: timeFrame === "daily"
          ? `${item.DateReport.Day}/${item.DateReport.Month}`
          : timeFrame === "monthly"
          ? `${item.DateReport.Month}/${item.DateReport.Year}`
          : `${item.DateReport.Year}`,
        orders: item.OrderCount,
        income: item.Total,
      }));
  
      setSalesData(formattedData);
      setTotalOrder(formattedData.reduce((sum: any, item: { orders: any; }) => sum + item.orders, 0));
      setTotalIncome(formattedData.reduce((sum: any, item: { income: any; }) => sum + item.income, 0));
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [token, timeFrame]);

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
                    className={`p-2 text-xl text-start font-medium rounded-xl shadow-md border-2 border-gray-200 cursor-pointer 
                      ${selected === item ? "bg-yellow-400 text-black hover:bg-yellow-600 hover:text-white transition" : "bg-white text-black hover:bg-slate-400  hover:text-white transition"}`}
                    onClick={() => setSelected(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 bg-gray-100  p-6 rounded-lg my-12 mr-4">
        {selected === "วิเคราะห์ยอดขาย" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-700">เลือกช่วงเวลา:</h2>
            <select
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value as "daily" | "monthly" | "yearly")}
              className="p-2 border rounded-md text-black"
            >
              <option value="daily">รายวัน</option>
              <option value="monthly">รายเดือน</option>
              <option value="yearly">รายปี</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-black">รายการทั้งหมด</h2>
              <p className="text-2xl text-black font-bold">{totalOrder} รายการ</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-black">รายได้ทั้งหมด</h2>
              <p className="text-2xl text-black font-bold">{totalIncome.toLocaleString()} บาท</p>
            </div>
          </div>

          <div className="bg-gray-300 flex items-center justify-center h-72 rounded-lg shadow-md p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ left: 50, right: 50}} >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  label={{ value: timeFrame === "daily" ? "วันที่/เดือน" : timeFrame === "monthly" ? "" : "", position: "bottom", offset: 0, dy: 0 }}
                  padding={{ left: 10, right: 10 }}
/>
                <YAxis
                  yAxisId="left"
                  label={{ value: "เงิน (บาท)", angle: -90, position: "center",
                    dx: -40 }}
                />
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: 25 }} />
                <Line type="monotone" dataKey="orders" stroke="#2475f0" strokeWidth={2} name="จำนวนออเดอร์" yAxisId="left"/>
                <Line type="monotone" dataKey="income" stroke="#fa6220" strokeWidth={2} name="รายได้" yAxisId="left" />
              </LineChart >
            </ResponsiveContainer>
          </div>
        </>
      )}

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
                    <button onClick={() => handleGetOneUser(user.user_id)} className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition">Edit</button>
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
                onClick={handleEditUser}
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
                    <button onClick={() => handleGetOneUser(user.user_id)} className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition">Edit</button>
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
                onClick={handleEditUser}
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
