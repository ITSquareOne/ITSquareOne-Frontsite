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

export interface User {
    user_id?: number;
    username?: string;
    firstNameEn?: string;
    lastNameEn?: string;
    firstNameTh?: string;
    lastNameTh?: string;
    profile: string | null;
    role?: string;
  }
  
export interface Address {
    address_id?: number;
    user_id?: number;
    address?: string;
    created_at?: string;
    updated_at?: string;
  }

const api_url = "http://localhost:3000/api";

export const fetchItemsForCategory = async (token: string | null): Promise<Product[]> => {
  if (!token) return [];

  try {
    const [partItemsResponse, partsResponse] = await Promise.all([
      axios.get(`${api_url}/part-items`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }),
      axios.get(`${api_url}/parts`, {
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
      const partItemResponse = await axios.get(`${api_url}/part-items/partid/${partid}`, {
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
  
      const partResponse = await axios.get(`${api_url}/parts/${part_code}`, {
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

export const getAddress = async (token: string): Promise<Address[]> => {
    try {
        const { data } = await axios.get<Address[]>(`${api_url}/addresses/self`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        });
        return data;
    } catch (error) {
        console.error("Error fetching addresses:", error);
        throw error;
    }
};

export const createAddress = async (token: string, address: string): Promise<Address> => {
    try {
        const newAddress: Address = {
        address,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        };

        const { data } = await axios.post<Address>(`${api_url}/addresses/self`, newAddress, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        });

        return data;
    } catch (error) {
        console.error("Error creating address:", error);
        throw error;
    }
};

export const editAddress = async (
    token: string,
    selectedAddressId: number,
    updateAddress: string
    ): Promise<void> => {
    try {
        const updatedAddress: Partial<Address> = {
        address: updateAddress,
        updated_at: new Date().toISOString(),
        };

        await axios.put(`${api_url}/addresses/self/${selectedAddressId}`, updatedAddress, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        });
    } catch (error) {
        console.error("Error updating address:", error);
        throw error;
    }
};

export const deleteAddress = async (token: string, selectedAddressId: number): Promise<void> => {
    try {
        await axios.delete(`${api_url}/addresses/self/${selectedAddressId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
        });
    } catch (error) {
        console.error("Error deleting address:", error);
        throw error;
    }
};
export const createOrder = async (token: string, addressId: number, partIds: number[]) => {
    try {
        const requestBody = {
            address_id: addressId,
            part_ids: partIds,
        };

        console.log("🔍 Sending request body:", JSON.stringify(requestBody, null, 2));

        const response = await fetch(`${api_url}/orders/create`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        console.log("🔍 Response status:", response.status);

        const responseData = await response.json();
        console.log("🔍 Response data:", responseData);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${JSON.stringify(responseData)}`);
        }

        return responseData;
    } catch (error) {
        console.error("🚨 Failed to create order", error);
        throw error;
    }
};

export const getAllStatus = async (token: string) => {
    try {
      const response = await axios.get(`${api_url}/orders`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch order status", error);
      return [];
    }
  };

export const getStatusForUser = async (token: string) => {
    try {
      const response = await axios.get(`${api_url}/orders/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch order status", error);
      return [];
    }
  };

export const deleteUserOrder = async (token: string, itemId: number) => {
    try {
        await axios.delete(`${api_url}/orders/${itemId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            },
        });
    } catch (error) {
        console.error("Error deleting address:", error);
        throw error;
    }
};
  


export const getOrderDetails = async (token: string, itemId: number) => {
  try {
      await axios.get(`${api_url}/orders/details/${itemId}`, {
      headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          },
      });
  } catch (error) {
      console.error("Error deleting address:", error);
      throw error;
  }
};

export const updateOrderStatus = async (
    token: string, 
    itemId: number, 
    status: string, 
    technicianId: number, 
    totalPrice: number
) => {
    try {
        await axios.put(`${api_url}/orders/${itemId}`, {
            status,
            technician_id: technicianId,  
            total_price: totalPrice       
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });
    } catch (error) {
        console.error("Error updating status:", error);
        throw error;
    }
};

export const getProfile = async (token: string) => {
    try {
        const response = await axios.get(`${api_url}/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });
        return response.data;
    } catch (err) {
      console.log(err);
    }
}

export const confirmPayment = async (token: string, orderId: number) => {
    try {
        await axios.get(`${api_url}/orders/confirmPayment/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });
    } catch (err) {
      console.log(err);
    }
}

