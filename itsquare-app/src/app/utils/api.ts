import axios from "axios";

export interface Product {
    id: number;
    name: string;
    price: number;
    description?: string;
    condition: number;
    part_code: string;
    part_image: string;
    brand: string | number;
    type: string | number;
  }
  
export interface Item {
    id?: number;
    part_code: string;
    condition: number;
    price: number;
    part_image: string;
  }
  
  
export interface Brands {
    brand_id: number;
    brand_name: string;
    logo?: string;
  }
  
export interface types {
    type_id: number;
    type_name: string;
  }
  
  
export interface Parts {
    part_code: string;
    name: string;
    description?: string;
    brand_id: number;
    type_id: number;
  }

export const fetchItemsForCategory = async (token: string | null): Promise<Product[]> => {
  if (!token) return [];

  try {
    const [partItemsResponse, partsResponse] = await Promise.all([
      axios.get("http://localhost:3000/api/part-items", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }),
      axios.get("http://localhost:3000/api/parts", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }),
    ]);

    const partItems = partItemsResponse.data;
    const parts = partsResponse.data;

    if (Array.isArray(partItems) && Array.isArray(parts)) {
      return partItems.map((item: any) => {
        const part = parts.find((p: any) => p.part_code === item.part_code) || {};
        return {
          id: item.part_id,
          name: part.name || "Unknown",
          price: item.price,
          condition: item.condition,
          part_code: item.part_code,
          part_image: item.part_image,
          brand: part.brand_id || 0,
          type: part.type_id || 0,
        };
      });
    } else {
      console.error("Fetch error: Data format incorrect", { partItems, parts });
      return [];
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

export const fetchOneItem = async (token: string | null, partid: string | number): Promise<Product | null> => {
    if (!token) return null;
  
    try {
      const partItemResponse = await axios.get(`http://localhost:3000/api/part-items/partid/${partid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
  
      const partItem = partItemResponse.data;
      if (!partItem) {
        console.error("Fetch error: Part item not found");
        return null;
      }
  
      const part_code = partItem.part_code;
  
      const partResponse = await axios.get(`http://localhost:3000/api/parts/${part_code}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
  
      const part = partResponse.data;
      if (!part) {
        console.error("Fetch error: Part not found");
        return null;
      }
  
      return {
        id: partItem.part_id,
        name: part.name || "Unknown",
        price: partItem.price,
        description: part.description || "Unknown",
        condition: partItem.condition,
        part_code: partItem.part_code,
        part_image: partItem.part_image,
        brand: part.brand_id || 0,
        type: part.type_id || 0,
      };
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  };