import React, { createContext, useContext, useState, useEffect } from "react";

// Define types for our data models
export interface ProductItem {
  id: string;
  customerId: string;
  date: string;
  itemName: string;
  size: string;
  color: string;
  quantity: number;
  cuttingStatus: "Not Started" | "In Progress" | "Done";
  stitchingStatus: "Not Started" | "In Progress" | "Done";
  tailor?: string;
  qualityStatus?: "Passed" | "Rejected";
  rejectedReason?: string;
  supervisor?: string;
  clothType?: string;
  imageUrl?: string;
}

interface DataContextType {
  items: ProductItem[];
  loading: boolean;
  error: string | null;
  fetchItemsByCustomerId: (customerId: string) => void;
  updateItem: (updatedItem: ProductItem) => void;
  filterItems: (filter: Partial<ProductItem>) => ProductItem[];
  customers: { id: string; name: string }[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Static data for orders
const staticData: ProductItem[] = [
  {
    id: "1",
    customerId: "sfd12345",
    date: "2025-05-01",
    itemName: "Women T-shirt",
    size: "XL",
    color: "Blue",
    quantity: 100,
    cuttingStatus: "Done",
    stitchingStatus: "In Progress",
    clothType: "Cotton",
    supervisor: "John Doe",
  },
  {
    id: "2",
    customerId: "sfd12345",
    date: "2025-05-02",
    itemName: "Men T-shirt",
    size: "M",
    color: "Black",
    quantity: 50,
    cuttingStatus: "In Progress",
    stitchingStatus: "Not Started",
    clothType: "Polyester",
    supervisor: "Jane Smith",
  },
  {
    id: "3",
    customerId: "sfd12345",
    date: "2025-05-03",
    itemName: "Men Pant",
    size: "L",
    color: "Blue",
    quantity: 10,
    cuttingStatus: "Done",
    stitchingStatus: "Done",
    clothType: "Cotton",
    supervisor: "Raj Kumar",
  },
  {
    id: "4",
    customerId: "sfd12345",
    date: "2025-05-04",
    itemName: "Women T-shirt",
    size: "M",
    color: "Blue",
    quantity: 100,
    cuttingStatus: "Not Started",
    stitchingStatus: "Not Started",
    clothType: "Cotton",
    supervisor: "Priya Shah",
  },
  {
    id: "5",
    customerId: "sfd12345",
    date: "2025-05-05",
    itemName: "Women Jacket",
    size: "XL",
    color: "Blue",
    quantity: 100,
    cuttingStatus: "Done",
    stitchingStatus: "In Progress",
    clothType: "Denim",
    supervisor: "Michael Chen",
  },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItemsByCustomerId = (customerId: string) => {
    setLoading(true);
    setError(null);

    // Simulate API call with static data
    setTimeout(() => {
      try {
        const filteredData = staticData.filter((item) => item.customerId === customerId);
        setItems(filteredData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch items");
        setLoading(false);
      }
    }, 800);
  };

  const updateItem = (updatedItem: ProductItem) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const filterItems = (filter: Partial<ProductItem>) => {
    return items.filter((item) => {
      for (const key in filter) {
        if (
          filter[key as keyof ProductItem] !== undefined &&
          item[key as keyof ProductItem] !== filter[key as keyof ProductItem]
        ) {
          return false;
        }
      }
      return true;
    });
  };

  // Load data for first customer on initial render
  useEffect(() => {
    fetchItemsByCustomerId("sfd12345");
  }, []);

  const value = {
    items,
    loading,
    error,
    fetchItemsByCustomerId,
    updateItem,
    filterItems,
    customers: [{ id: "sfd12345", name: "Customer Orders" }],
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};