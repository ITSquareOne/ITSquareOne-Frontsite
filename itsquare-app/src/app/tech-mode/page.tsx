"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { Product, Item, Brands, types, Parts } from "../utils/api";
import Image from "next/image";


export default function technician() {
  const [selected, setSelected] = useState("จัดการแผงขายสินค้า");
  const menuItems = ["จัดการแผงขายสินค้า", "จัดการคลังสินค้า", "จัดการแบรนด์สินค้าในคลัง"];
  const [token, setToken] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [editBrand, setEditBrand] = useState<Brands | null>(null);
  const [editParts, setEditParts] = useState<Parts | null>(null);
  const [deleteItem, setDeleteItem] = useState<Item | null>(null);
  const [deletePart, setDeletePart] = useState<Parts | null>(null);
  const [deleteBrand, setDeleteBrand] = useState<Brands | null>(null);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [isEditBrandOpen, setIsEditBrandOpen] = useState(false);
  const [isEditPartsOpen, setIsEditPartsOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
  const [isDeleteItemOpen, setIsDeleteItemOpen] = useState(false);
  const [isDeletePartOpen, setIsDeletePartOpen] = useState(false);
  const [isDeleteBrandOpen, setIsDeleteBrandOpen] = useState(false);
  const [product, setProduct] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brands[]>([]);
  const [allparts, setAllParts] = useState<Parts[]>([]);
  const [types, setTypes] = useState<types[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [brandSearchTerm, setBrandSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [item, setItem] = useState<Item>({
    part_code: "",
    condition: 0,
    price: 0,
    part_image: ""
  })
  const [parts, setParts] = useState<Parts>({
    part_code: "",
    name: "",
    brand_id: 0,
    type_id: 0
  });
  const [brand, setBrand] = useState<Brands>({
    brand_id: 0,
    brand_name: "",
  });
  const conditionOptions = [
    { label: "คุณภาพเยี่ยม", value: 100 },
    { label: "คุณภาพดี", value: 75 },
    { label: "พอใช้", value: 50 },
    { label: "ต่ำกว่ามาตรฐาน", value: 25 },
  ];

  const api_url = "http://localhost:3000/api";

  const fetchItems = async () => {
    if (!token) return;

    try {
      const [partItemsResponse, partsResponse, brandsResponse, typeResponse] = await Promise.all([
        axios.get(`${api_url}/part-items`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }), axios.get(`${api_url}/parts`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }), axios.get(`${api_url}/brands`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }), axios.get(`${api_url}/part-types`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }),
      ]);
      const partItems = partItemsResponse.data;
      const parts = partsResponse.data;
      const brands = brandsResponse.data;
      const types = typeResponse.data;
      setBrands(brandsResponse.data);
      setTypes(typeResponse.data);
      setAllParts(partsResponse.data);

      if (Array.isArray(partItems) && Array.isArray(parts) && Array.isArray(brands) && Array.isArray(types)) {
        const mergedProducts = partItems.map((item: any) => {
          const part = parts.find((p: any) => p.part_code === item.part_code) || {};
          return {
            id: item.part_id,
            name: part.name,
            price: item.price,
            condition: item.condition,
            part_code: item.part_code,
            part_image: item.part_image,
            description: part.description,
            brand: brands.find((b: any) => b.brand_id === part.brand_id)?.brand_name || "Other",
            type: types.find((t: any) => t.type_id === part.type_id)?.type_name || "Other"
          };
        });
        setProduct(mergedProducts);
      } else {
        console.log("Fetch error: Data format incorrect", { partItems, parts });
      }
    } catch (error) {
      console.log("Fetch error: " + error);
    }
  };

  const addItem = async () => {
    console.log(item);
    try {
      await axios.post(`${api_url}/part-items`,
        {
          part_code: item.part_code,
          condition: item.condition,
          price: item.price,
          part_image: item.part_image
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        }
      );
      setItem({
        part_code: "",
        condition: 0,
        price: 0,
        part_image: ""
      });
      await fetchItems();
      setIsAddItemOpen(false);
      alert("วางขายสินค้าสำเร็จ!");
    } catch (error) {
      console.log("❌ เกิดข้อผิดพลาด:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
    }
  }

  const addParts = async () => {
    console.log(parts);
    console.log(token);
    try {
      await axios.post(`${api_url}/parts`,
        {
          part_code: parts.part_code,
          name: parts.name,
          description: parts.description,
          brand_id: parts.brand_id,
          type_id: parts.type_id
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        }
      );
      setParts({
        part_code: "",
        name: "",
        description: "",
        brand_id: 0,
        type_id: 0
      });
      await fetchItems();
      setIsAddProductOpen(false);
      alert("เพิ่มสินค้าสำเร็จ!");
    } catch (error) {
      console.log("❌ เกิดข้อผิดพลาด:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
    }
  }

  const addBrand = async () => {
    if (!brand) {
      return;
    }
    try {
      await axios.post(`${api_url}/brands`,
        {
          brand_name: brand.brand_name,
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        }
      );
      await fetchItems();
      setIsAddBrandOpen(false);
      alert("เพิ่มแบรนด์สำเร็จ!");
    } catch (error) {
      console.log("❌ เกิดข้อผิดพลาด:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
    }
  }

  const EditItem = async () => {
    console.log(editItem);
    if (!editItem) {
      alert("❌ ไม่มี part_id สำหรับอัปเดต!");
      return;
    }
    try {
      await axios.put(`${api_url}/part-items/${editItem.id}`,
        {
          condition: editItem.condition,
          price: editItem.price,
          part_image: editItem.part_image
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        }
      );
      await fetchItems();
      setIsEditItemOpen(false);
      alert("แก้ไขสินค้าสำเร็จ!");
    } catch (error) {
      console.log("❌ เกิดข้อผิดพลาด:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
    }
  }

  const EditParts = async () => {
    console.log(editParts);
    if (!editParts) {
      alert("❌ ผิดพลาด!");
      return;
    }
    try {
      await axios.put(`${api_url}/parts/${editParts.part_code}`,
        {
          part_code: editParts.part_code,
          name: editParts.name,
          description: editParts.description,
          brand_id: editParts.brand_id,
          type_id: editParts.type_id
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        }
      );
      await fetchItems();
      setIsEditPartsOpen(false);
      alert("แก้ไขสินค้าสำเร็จ!");
    } catch (error) {
      console.log("❌ เกิดข้อผิดพลาด:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
    }
  }

  const EditBrand = async () => {
    console.log(editItem);
    if (!editBrand) {
      alert("❌ ไม่มี Brand ID!");
      return;
    }
    try {
      await axios.put(`${api_url}/brands/${editBrand.brand_id}`,
        {
          brand_name: editBrand.brand_name,
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        }
      );
      await fetchItems();
      setIsEditBrandOpen(false);
      alert("แก้ไขแบรนด์สำเร็จ!");
    } catch (error) {
      console.log("❌ เกิดข้อผิดพลาด:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
    }
  }

  const DeleteItem = async () => {
    //  console.log(deleteItem);
    if (!deleteItem) {
      return;
    }
    try {
      await axios.delete(`${api_url}/part-items/${deleteItem.id}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        }
      );
      await fetchItems();
      setIsDeleteItemOpen(false);
      alert("ลบสินค้าเรียบร้อยแล้ว!");
    } catch (error) {
      console.log("❌ เกิดข้อผิดพลาด:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
    }
  }

  const DeletePart = async () => {
    console.log(deletePart);
    if (!deletePart) {
      return;
    }
    try {
      await axios.delete(`${api_url}/parts/${deletePart.part_code}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        }
      );
      await fetchItems();
      setIsDeletePartOpen(false);
      alert("ลบสินค้าเรียบร้อยแล้ว!");
    } catch (error) {
      console.log("❌ เกิดข้อผิดพลาด:", error);
      alert("เกิดข้อผิดพลาดในการลบสินค้า อาจมีสินค้าที่เกี่ยวข้องวางจำหน่ายอยู่!");
    }
  }

  const DeleteBrand = async () => {
    console.log(deleteBrand);
    if (!deleteBrand) {
      return;
    }
    try {
      await axios.delete(`${api_url}/brands/${deleteBrand.brand_id}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        }
      );
      await fetchItems();
      setIsDeleteBrandOpen(false);
      alert("ลบแบรนด์สำเร็จ!");
    } catch (error) {
      console.log("❌ เกิดข้อผิดพลาด:", error);
      alert("เกิดข้อผิดพลาดในการลบแบรนด์ อาจมีสินค้าที่เกี่ยวข้องวางจำหน่ายอยู่!");
    }
  }

  const handleEditItem = (item: Item) => {
    setEditItem(item);
    setIsEditItemOpen(true);
  };

  const handleEditBrand = (item: Brands) => {
    setEditBrand(item);
    setIsEditBrandOpen(true);
  };

  const handleEditParts = (item: Parts) => {
    setEditParts(item);
    console.log(editParts);
    setIsEditPartsOpen(true);
  };

  const handleDeleteItem = (item: Item) => {
    setDeleteItem(item);
    setIsDeleteItemOpen(true);
  };

  const handleDeletePart = (item: Parts) => {
    setDeletePart(item);
    setIsDeletePartOpen(true);
  };

  const handleDeleteBrand = (item: Brands) => {
    setDeleteBrand(item);
    setIsDeleteBrandOpen(true);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setState((prev: any) => ({ ...prev, part_image: reader.result as string }));
    };
    reader.onerror = (error) => {
      console.log("❌ เกิดข้อผิดพลาดในการอ่านไฟล์:", error);
      alert("ไม่สามารถอ่านไฟล์รูปภาพได้");
    };
  };

  useEffect(() => {
    console.log("Updated editParts:", editParts);
  }, [editParts])

  useEffect(() => {
    console.log("Updated editItem:", editItem);
  }, [editItem])

  useEffect(() => {
    console.log("Updated editBrand:", editBrand);
  }, [editBrand])

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [token]);

  return (
    <div className="relative flex bg-cover bg-center -top-12">
      <div className="w-1/4 my-12 ml-12 mr-4 bg-white h-[80vh] p-6 rounded-xl">
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li
              key={item}
              className={`p-3 text-xl text-center font-medium rounded-full shadow-lg border-gray-200 border-2 cursor-pointer 
            ${selected === item ? "bg-yellow-400 text-black hover:bg-yellow-600 hover:text-white transition" : "bg-white text-black hover:bg-slate-400  hover:text-white transition"}`}
              onClick={() => setSelected(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 bg-gray-100 p-6 rounded-lg my-12 mr-12 flex flex-col h-[80vh]">

        {selected === "จัดการแผงขายสินค้า" &&
          <>
            <h1 className="text-center font-semibold text-black mb-3 text-xl">ตารางแผงขายสินค้า</h1>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="search" className="block text-black font-medium mb-1">ค้นหาตามชื่อ</label>
                <input
                  id="search"
                  type="text"
                  placeholder="ค้นหาสินค้า..."
                  className="w-full p-2 border border-gray-300 rounded-lg text-black"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="typeFilter" className="block text-black font-medium mb-1">กรองตามประเภท</label>
                <select
                  id="typeFilter"
                  className="w-full p-2 border border-gray-300 rounded-lg text-black"
                  value={selectedType || ""}
                  onChange={(e) => setSelectedType(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">ทั้งหมด</option>
                  {types.map((type) => (
                    <option key={type.type_id} value={type.type_id}>
                      {type.type_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="overflow-x-auto flex-1 overflow-y-auto shadow-md rounded-lg">
              <table className="w-full border border-blue-500 text-black text-center border-collapse">
                <thead className="sticky top-0 bg-gray-200">
                  <tr>
                    <th className="border border-black px-4 py-2">ID</th>
                    <th className="border border-black px-4 py-2">Name</th>
                    <th className="border border-black px-4 py-2">Brand</th>
                    <th className="border border-black px-4 py-2">Category</th>
                    <th className="border border-black px-4 py-2">Price</th>
                    <th className="border border-black px-4 py-2">Condition</th>
                    <th className="border border-black px-4 py-2">Image</th>
                    <th className="border border-black px-4 py-2">Edit</th>
                    <th className="border border-black px-4 py-2">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {product
                    .filter((item) => {
                      // Filter by search term (case-insensitive)
                      const matchesSearch = searchTerm === "" ||
                        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()));

                      // Filter by selected type
                      const matchesType = selectedType === null ||
                        (item.type && types.find(t => t.type_id === selectedType)?.type_name === item.type);

                      return matchesSearch && matchesType;
                    })
                    .sort((a, b) => a.id - b.id)
                    .map((item) => (
                      <tr key={item.id} className="text-center">
                        <td className="border border-black px-4 py-2">{item.id}</td>
                        <td className="border border-black px-4 py-2">{item.name}</td>
                        <td className="border border-black px-4 py-2">{item.brand}</td>
                        <td className="border border-black px-4 py-2">{item.type}</td>
                        <td className="border border-black px-4 py-2">{item.price}</td>
                        <td className="border border-black px-4 py-2">
                          {conditionOptions.find(opt => opt.value === item.condition)?.label || "ไม่ทราบ"}
                        </td>
                        <td className="px-4 py-2 border border-black">
                          {item.part_image ? (
                            <Image
                              src={`data:image/jpeg;base64,${item.part_image}`}
                              width={40}
                              height={40}
                              alt="part image"
                              className="mx-auto"
                            />
                          ) : (
                            <span className="flex h-full mx-auto">no image</span>
                          )}
                        </td>
                        <td className="border border-black px-4 py-2">
                          <button onClick={() => handleEditItem(item)} className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition">Edit</button>
                        </td>
                        <td className="border border-black px-4 py-2">
                          <button onClick={() => handleDeleteItem(item)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition">Delete</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="text-black gap-5 flex mt-4">
              <button onClick={() => setIsAddItemOpen(true)} className="bg-blue-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">วางขายสินค้า</button>
            </div>
            <Dialog open={isAddItemOpen} onClose={() => setIsAddItemOpen(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-2/4 text-start text-black">
                <h2 className="text-xl font-bold mb-4">เพิ่มสินค้าที่จะวางขายสินค้า</h2>
                <label className="block font-medium">สินค้าที่จะวางขาย</label>
                <select
                  className="border w-full p-2 mb-2"
                  value={item?.part_code}
                  onChange={(e) => setItem({ ...item!, part_code: e.target.value })}
                >
                  <option value="">-- เลือกสินค้า --</option>
                  {allparts.map((allparts) => (
                    <option key={allparts.part_code} value={allparts.part_code}>{allparts.name}</option>
                  ))}
                </select>
                <label className="block font-medium">คุณภาพของสินค้า</label>
                <select
                  className="border w-full p-2 mb-2"
                  value={item?.condition}
                  onChange={(e) => setItem({ ...item!, condition: Number(e.target.value) })}
                >
                  <option value="">-- เลือกคุณภาพ --</option>
                  {conditionOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <label className="block font-medium">ราคา</label>
                <input className="border w-full p-2 mb-2" placeholder="กรุณากรอกราคาสินค้า" type="number" value={item?.price === 0 ? "" : item?.price} onChange={(e) => setItem({ ...item!, price: Number(e.target.value) })} />
                <label className="block font-medium">อัปโหลดรูปภาพ</label>
                <input
                  type="file"
                  className="border w-full p-2 mb-2"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setItem)}
                />
                <div className="flex justify-end gap-2">
                  <button onClick={addItem} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                  <button onClick={() => setIsAddItemOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
                </div>
              </div>
            </Dialog>
            <Dialog open={isEditItemOpen} onClose={() => setIsEditItemOpen(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-2/4 text-start text-black">
                <h2 className="text-xl font-bold mb-4">แก้ไขข้อมูลของสินค้า</h2>
                <label className="block font-medium">คุณภาพของสินค้า</label>
                <select
                  className="border w-full p-2 mb-2"
                  value={editItem?.condition}
                  onChange={(e) => setEditItem({ ...editItem!, condition: Number(e.target.value) })}
                >
                  <option value="">-- เลือกคุณภาพ --</option>
                  {conditionOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <label className="block font-medium">ราคา</label>
                <input className="border w-full p-2 mb-2" placeholder="กรุณากรอกราคาสินค้า" type="number" value={editItem?.price === 0 ? "" : editItem?.price} onChange={(e) => setEditItem({ ...editItem!, price: Number(e.target.value) })} />
                <label className="block font-medium">แก้ไขรูปภาพ</label>
                <input
                  type="file"
                  className="border w-full p-2 mb-2"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setEditItem)}
                />
                <div className="flex justify-end gap-2">
                  <button onClick={EditItem} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                  <button onClick={() => setIsEditItemOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
                </div>
              </div>
            </Dialog>
            <Dialog open={isDeleteItemOpen} onClose={() => setIsDeleteItemOpen(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 md:w-1/4 w-3/4 text-center justify-center text-black">
                <div className="flex justify-center mb-4">
                  <svg className="items-center flex " width="64" height="64" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24 7H20.9C20.4216 4.67358 18.3751 3.003 16 3H14C11.6249 3.003 9.57843 4.67358 9.1 7H6C5.44772 7 5 7.44772 5 8C5 8.55228 5.44772 9 6 9H7V22C7.00331 24.7601 9.23995 26.9967 12 27H18C20.7601 26.9967 22.9967 24.7601 23 22V9H24C24.5523 9 25 8.55228 25 8C25 7.44772 24.5523 7 24 7ZM14 5H16C17.271 5.00155 18.4036 5.8023 18.829 7H11.171C11.5964 5.8023 12.729 5.00155 14 5ZM21 22C21 23.6569 19.6569 25 18 25H12C10.3431 25 9 23.6569 9 22V9H21V22ZM13 21C13.5523 21 14 20.5523 14 20V14C14 13.4477 13.5523 13 13 13C12.4477 13 12 13.4477 12 14V20C12 20.5523 12.4477 21 13 21ZM18 20C18 20.5523 17.5523 21 17 21C16.4477 21 16 20.5523 16 20V14C16 13.4477 16.4477 13 17 13C17.5523 13 18 13.4477 18 14V20Z" fill="rgba(227, 31, 38, 1)"></path></svg>
                </div>
                <h1 className="text-2xl font-bold mb-4">คุณแน่ใจที่จะลบสินค้าชิ้นนี้ใช่หรือไม่?</h1>
                <div className="space-y-3">
                  <button
                    onClick={DeleteItem}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg mr-4 hover:bg-red-600 transition"
                  >
                    ยืนยัน
                  </button>
                  <button
                    onClick={() => setIsDeleteItemOpen(false)}
                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            </Dialog>
          </>
        }

        {selected === "จัดการคลังสินค้า" &&
          <>
            <h1 className="text-center font-semibold text-black mb-3 text-xl">ตารางสินค้าภายในคลัง</h1>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="search-inventory" className="block text-black font-medium mb-1">ค้นหาตามชื่อ</label>
                <input
                  id="search-inventory"
                  type="text"
                  placeholder="ค้นหาสินค้า..."
                  className="w-full p-2 border border-gray-300 rounded-lg text-black"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="typeFilter-inventory" className="block text-black font-medium mb-1">กรองตามประเภท</label>
                <select
                  id="typeFilter-inventory"
                  className="w-full p-2 border border-gray-300 rounded-lg text-black"
                  value={selectedType || ""}
                  onChange={(e) => setSelectedType(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">ทั้งหมด</option>
                  {types.map((type) => (
                    <option key={type.type_id} value={type.type_id}>
                      {type.type_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto shadow-md rounded-lg">
              <table className="w-full border border-blue-500 text-black">
                <thead className="sticky top-0 bg-gray-200">
                  <tr>
                    <th className="border border-black px-4 py-2">Part Code</th>
                    <th className="border border-black px-4 py-2">Name</th>
                    <th className="border border-black px-4 py-2">Brand</th>
                    <th className="border border-black px-4 py-2">Category</th>
                    <th className="border border-black px-4 py-2">Edit</th>
                    <th className="border border-black px-4 py-2">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {allparts
                    .filter((item) => {
                      // Filter by search term (case-insensitive)
                      const matchesSearch = searchTerm === "" ||
                        (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()));

                      // Filter by selected type
                      const matchesType = selectedType === null || item.type_id === selectedType;

                      return matchesSearch && matchesType;
                    })
                    .sort((a, b) => a.part_code.localeCompare(b.part_code))
                    .map((item) => {
                      const brandName = brands.find((brand) => brand.brand_id === item.brand_id)?.brand_name || "ไม่ทราบ";
                      const typeName = types.find((type) => type.type_id === item.type_id)?.type_name || "ไม่ทราบ";

                      return (
                        <tr key={item.part_code} className="text-center">
                          <td className="border border-black px-4 py-2">{item.part_code}</td>
                          <td className="border border-black px-4 py-2">{item.name}</td>
                          <td className="border border-black px-4 py-2">{brandName}</td>
                          <td className="border border-black px-4 py-2">{typeName}</td>
                          <td className="border border-black px-4 py-2">
                            <button onClick={() => handleEditParts(item)} className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition">Edit</button>
                          </td>
                          <td className="border border-black px-4 py-2">
                            <button onClick={() => handleDeletePart(item)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition">Delete</button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div className="text-black gap-5 flex mt-4">
              <button onClick={() => setIsAddProductOpen(true)} className="bg-blue-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">เพิ่มสินค้าภายในคลัง</button>
            </div>
            <Dialog open={isAddProductOpen} onClose={() => setIsAddProductOpen(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-2/4 text-start text-black">
                <h2 className="text-xl font-bold mb-4 text-center">เพิ่มสินค้าภายในคลัง</h2>
                <label className="block font-medium">รหัสของสินค้า</label>
                <input className="border w-full p-2 mb-2" placeholder="กรอกรหัสของสินค้า" value={parts?.part_code} onChange={(e) => setParts({ ...parts!, part_code: e.target.value })} />
                <label className="block font-medium">ชื่อของสินค้า</label>
                <input className="border w-full p-2 mb-2" placeholder="กรอกชื่อของสินค้า" value={parts?.name} onChange={(e) => setParts({ ...parts!, name: e.target.value })} />
                <label className="block font-medium">รายละเอียดของสินค้า</label>
                <textarea rows={3} placeholder="กรอกรายละเอียดของสินค้า" className="border w-full p-2 mb-2" value={parts?.description} onChange={(e) => setParts({ ...parts!, description: e.target.value })} />
                <label className="block font-medium">แบรนด์</label>
                <select
                  className="border w-full p-2 mb-2"
                  value={parts?.brand_id}
                  onChange={(e) => setParts({ ...parts!, brand_id: Number(e.target.value) })}
                >
                  <option value="">-- เลือกแบรนด์ --</option>
                  {brands.map((brand) => (
                    <option key={brand.brand_id} value={brand.brand_id}>{brand.brand_name}</option>
                  ))}
                </select>

                <label className="block font-medium">ประเภทของสินค้า</label>
                <select
                  className="border w-full p-2 mb-2"
                  value={parts?.type_id}
                  onChange={(e) => setParts({ ...parts!, type_id: Number(e.target.value) })}
                >
                  <option value="">-- เลือกประเภทสินค้า --</option>
                  {types.map((type) => (
                    <option key={type.type_id} value={type.type_id}>{type.type_name}</option>
                  ))}
                </select>
                <div className="flex justify-end gap-2">
                  <button onClick={addParts} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                  <button onClick={() => setIsAddProductOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
                </div>
              </div>
            </Dialog>
            <Dialog open={isEditPartsOpen} onClose={() => setIsEditPartsOpen(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-2/4 text-start text-black">
                <h2 className="text-xl font-bold mb-4">แก้ไขข้อมูลของสินค้า</h2>
                <label className="block font-medium">รหัสของสินค้า</label>
                <input className="border w-full p-2 mb-2 text-gray-500" value={editParts?.part_code} readOnly />
                <label className="block font-medium">ชื่อของสินค้า</label>
                <input className="border w-full p-2 mb-2" value={editParts?.name} onChange={(e) => setEditParts({ ...editParts!, name: e.target.value })} />
                <label className="block font-medium">รายละเอียดของสินค้า</label>
                <textarea className="border w-full p-2 mb-2" placeholder="กรอกรายละเอียดของสินค้า" rows={3} value={editParts?.description} onChange={(e) => setEditParts({ ...editParts!, description: e.target.value })} />
                <label className="block font-medium">แบรนด์</label>
                <select
                  className="border w-full p-2 mb-2"
                  value={editParts?.brand_id}
                  onChange={(e) => setEditParts({ ...editParts!, brand_id: Number(e.target.value) })}
                >
                  <option value="">-- เลือกแบรนด์ --</option>
                  {brands.map((brand) => (
                    <option key={brand.brand_id} value={brand.brand_id}>{brand.brand_name}</option>
                  ))}
                </select>

                <label className="block font-medium">ประเภทของสินค้า</label>
                <select
                  className="border w-full p-2 mb-2"
                  value={editParts?.type_id}
                  onChange={(e) => setEditParts({ ...editParts!, type_id: Number(e.target.value) })}
                >
                  <option value="">-- เลือกประเภทสินค้า --</option>
                  {types.map((type) => (
                    <option key={type.type_id} value={type.type_id}>{type.type_name}</option>
                  ))}
                </select>
                <div className="flex justify-end gap-2">
                  <button onClick={EditParts} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                  <button onClick={() => setIsEditPartsOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
                </div>
              </div>
            </Dialog>
            <Dialog open={isDeletePartOpen} onClose={() => setIsDeletePartOpen(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 md:w-1/4 w-3/4 text-center justify-center text-black">
                <div className="flex justify-center mb-4">
                  <svg className="items-center flex " width="64" height="64" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24 7H20.9C20.4216 4.67358 18.3751 3.003 16 3H14C11.6249 3.003 9.57843 4.67358 9.1 7H6C5.44772 7 5 7.44772 5 8C5 8.55228 5.44772 9 6 9H7V22C7.00331 24.7601 9.23995 26.9967 12 27H18C20.7601 26.9967 22.9967 24.7601 23 22V9H24C24.5523 9 25 8.55228 25 8C25 7.44772 24.5523 7 24 7ZM14 5H16C17.271 5.00155 18.4036 5.8023 18.829 7H11.171C11.5964 5.8023 12.729 5.00155 14 5ZM21 22C21 23.6569 19.6569 25 18 25H12C10.3431 25 9 23.6569 9 22V9H21V22ZM13 21C13.5523 21 14 20.5523 14 20V14C14 13.4477 13.5523 13 13 13C12.4477 13 12 13.4477 12 14V20C12 20.5523 12.4477 21 13 21ZM18 20C18 20.5523 17.5523 21 17 21C16.4477 21 16 20.5523 16 20V14C16 13.4477 16.4477 13 17 13C17.5523 13 18 13.4477 18 14V20Z" fill="rgba(227, 31, 38, 1)"></path></svg>
                </div>
                <h1 className="text-2xl font-bold mb-4">คุณแน่ใจที่จะลบสินค้าชิ้นนี้ใช่หรือไม่?</h1>
                <div className="space-y-3">
                  <button
                    onClick={DeletePart}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg mr-4 hover:bg-red-600 transition"
                  >
                    ยืนยัน
                  </button>
                  <button
                    onClick={() => setIsDeletePartOpen(false)}
                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            </Dialog>
          </>
        }

        {selected === "จัดการแบรนด์สินค้าในคลัง" &&
          <>
            <h1 className="text-center font-semibold text-black mb-3 text-xl">ตารางแบรนด์สินค้าภายในคลัง</h1>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="search-brand" className="block text-black font-medium mb-1">ค้นหาตามชื่อแบรนด์</label>
                <input
                  id="search-brand"
                  type="text"
                  placeholder="ค้นหาแบรนด์..."
                  className="w-full p-2 border border-gray-300 rounded-lg text-black"
                  value={brandSearchTerm}
                  onChange={(e) => setBrandSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto max-h-[60vh] overflow-y-auto shadow-md rounded-lg">
              <table className="w-full border border-blue-500 text-black">
                <thead className="sticky top-0 bg-gray-200">
                  <tr>
                    <th className="border border-black px-4 py-2">ID</th>
                    <th className="border border-black px-4 py-2">Brand</th>
                    <th className="border border-black px-4 py-2">Edit</th>
                    <th className="border border-black px-4 py-2">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {brands
                    .filter((item) => {
                      // Filter by search term (case-insensitive)
                      return brandSearchTerm === "" ||
                        (item.brand_name && item.brand_name.toLowerCase().includes(brandSearchTerm.toLowerCase()));
                    })
                    .sort((a, b) => a.brand_id - b.brand_id)
                    .map((item) => {
                      return (
                        <tr key={item.brand_id} className="text-center">
                          <td className="border border-black px-4 py-2">{item.brand_id}</td>
                          <td className="border border-black px-4 py-2">{item.brand_name}</td>
                          <td className="border border-black px-4 py-2">
                            <button onClick={() => handleEditBrand(item)} className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition">Edit</button>
                          </td>
                          <td className="border border-black px-4 py-2">
                            <button onClick={() => handleDeleteBrand(item)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition">Delete</button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div className="text-black gap-5 flex mt-4">
              <button onClick={() => setIsAddBrandOpen(true)} className="bg-blue-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">เพิ่มแบรนด์</button>
            </div>
            <Dialog open={isDeleteBrandOpen} onClose={() => setIsDeleteBrandOpen(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 md:w-1/4 w-3/4 text-center justify-center text-black">
                <div className="flex justify-center mb-4">
                  <svg className="items-center flex " width="64" height="64" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M24 7H20.9C20.4216 4.67358 18.3751 3.003 16 3H14C11.6249 3.003 9.57843 4.67358 9.1 7H6C5.44772 7 5 7.44772 5 8C5 8.55228 5.44772 9 6 9H7V22C7.00331 24.7601 9.23995 26.9967 12 27H18C20.7601 26.9967 22.9967 24.7601 23 22V9H24C24.5523 9 25 8.55228 25 8C25 7.44772 24.5523 7 24 7ZM14 5H16C17.271 5.00155 18.4036 5.8023 18.829 7H11.171C11.5964 5.8023 12.729 5.00155 14 5ZM21 22C21 23.6569 19.6569 25 18 25H12C10.3431 25 9 23.6569 9 22V9H21V22ZM13 21C13.5523 21 14 20.5523 14 20V14C14 13.4477 13.5523 13 13 13C12.4477 13 12 13.4477 12 14V20C12 20.5523 12.4477 21 13 21ZM18 20C18 20.5523 17.5523 21 17 21C16.4477 21 16 20.5523 16 20V14C16 13.4477 16.4477 13 17 13C17.5523 13 18 13.4477 18 14V20Z" fill="rgba(227, 31, 38, 1)"></path></svg>
                </div>
                <h1 className="text-2xl font-bold mb-4">คุณแน่ใจที่จะลบแบรนด์นี้ใช่หรือไม่?</h1>
                <div className="space-y-3">
                  <button
                    onClick={DeleteBrand}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg mr-4 hover:bg-red-600 transition"
                  >
                    ยืนยัน
                  </button>
                  <button
                    onClick={() => setIsDeleteBrandOpen(false)}
                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            </Dialog>
            <Dialog open={isAddBrandOpen} onClose={() => setIsAddBrandOpen(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-2/4 text-start text-black">
                <h2 className="text-xl font-bold mb-4 text-center">เพิ่มแบรนด์ภายในคลัง</h2>
                <label className="block font-medium">ชื่อของแบรนด์</label>
                <input className="border w-full p-2 mb-2 text-black" placeholder="กรุณากรอกชื่อของแบรนด์" value={brand?.brand_name} onChange={(e) => setBrand({ ...brand!, brand_name: e.target.value })} />
                <div className="flex justify-end gap-2">
                  <button onClick={addBrand} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                  <button onClick={() => setIsAddBrandOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
                </div>
              </div>
            </Dialog>
            <Dialog open={isEditBrandOpen} onClose={() => setIsEditBrandOpen(false)} className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-2/4 text-start text-black">
                <h2 className="text-xl font-bold mb-4">แก้ไขข้อมูลของแบรนด์</h2>
                <label className="block font-medium">ชื่อของแบรนด์</label>
                <input className="border w-full p-2 mb-2 text-black" value={editBrand?.brand_name} onChange={(e) => setEditBrand({ ...editBrand!, brand_name: e.target.value })} />

                <div className="flex justify-end gap-2">
                  <button onClick={EditBrand} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                  <button onClick={() => setIsEditBrandOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
                </div>
              </div>
            </Dialog>
          </>
        }
      </div>
    </div>
  );
}