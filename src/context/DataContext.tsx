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

// Sample data for initial load
const sampleCustomers = [
  { id: "SFD12345", name: "Men's shirts, dresses, jackets" },
  { id: "SFD1234", name: "Kidswear batch" },
  { id: "SFD116", name: "Ethnic wear & kurtas" },
  { id: "SFD065", name: "Uniform bulk batch" },
];

// Generate sample data based on customer ID
const generateSampleData = (customerId: string): ProductItem[] => {
  const items: ProductItem[] = [];
  const clothTypes = ["Cotton", "Silk", "Wool", "Polyester", "Linen", "Denim", "Chiffon", "Velvet", "Satin", "Corduroy"];
  const colors = ["Red", "Blue", "Green", "Black", "White", "Yellow", "Purple", "Navy", "Maroon", "Beige", "Grey", "Pink", "Orange", "Teal"];
  const sizes = ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "6", "8", "10", "12", "14", "16"];
  const tailors = ["Ravi", "Anjali", "Krish", "Devi", "Amaan", "Nisha", "Priya", "Mohit", "Deepak", "Sanya"];
  const rejectionReasons = ["Stitch Pull", "Color Fade", "Tear", "Pattern Issue", "Wrong Size", "Fabric Defect", "Button Misaligned", "Seam Imperfection"];
  const supervisors = ["John Doe", "Jane Smith", "Raj Kumar", "Priya Shah", "Michael Chen"];
  
  const getRandomStatus = () => {
    const statuses = ["Not Started", "In Progress", "Done"];
    return statuses[Math.floor(Math.random() * statuses.length)] as "Not Started" | "In Progress" | "Done";
  };
  
  const getRandomQualityStatus = () => {
    return Math.random() > 0.7 ? "Rejected" : "Passed";
  };

  let itemNames: string[] = [];
  
  // Custom item names based on customer ID
  switch (customerId) {
    case "SFD12345":
      itemNames = [
        "Men's Formal Shirt", "Men's Casual Shirt", "Women's Blouse", "Summer Dress", 
        "Winter Jacket", "Business Suit", "Silk Blazer", "Denim Jacket", 
        "Office Trousers", "Cotton Dress", "Evening Gown", "Linen Shirt", 
        "Wedding Dress", "Wool Coat", "Party Wear Dress"
      ];
      break;
    case "SFD1234":
      itemNames = [
        "Kids T-Shirt", "Kids Shorts", "Baby Romper", "Girl's Frock", "Boy's Shirt",
        "Children's Pajamas", "School Uniform Set", "Toddler Jumper", "Kids Jeans",
        "Baby Onesie", "Kids Sweater", "Girl's Leggings", "Boy's Blazer",
        "Kids Party Dress", "Children's Jacket"
      ];
      break;
    case "SFD116":
      itemNames = [
        "Kurta", "Salwar", "Saree Blouse", "Sherwani", "Ethnic Jacket",
        "Anarkali Suit", "Lehenga", "Churidar", "Dhoti Pants", "Nehru Jacket",
        "Pathani Suit", "Ghagra Choli", "Kurti", "Sharara Set", "Dupatta"
      ];
      break;
    case "SFD065":
      itemNames = [
        "School Uniform Shirt", "School Uniform Pants", "Corporate Shirt", "Security Uniform", 
        "Hotel Staff Uniform", "Hospital Scrubs", "Chef Coat", "Airline Staff Uniform",
        "Police Uniform", "Factory Worker Overalls", "Restaurant Server Uniform",
        "Lab Coat", "Maintenance Staff Uniform", "Sports Team Uniform", "Hospitality Uniform"
      ];
      break;
    default:
      itemNames = ["Generic Item"];
  }

  // Generate 12-15 items per customer (random count between this range)
  const count = 12 + Math.floor(Math.random() * 4);
  
  for (let i = 0; i < count; i++) {
    const itemName = itemNames[i % itemNames.length];
    const cuttingStatus = getRandomStatus();
    // Make stitching status logically dependent on cutting status
    const stitchingStatus = cuttingStatus === "Not Started" ? "Not Started" : 
                            cuttingStatus === "In Progress" ? (Math.random() > 0.7 ? "In Progress" : "Not Started") : 
                            getRandomStatus();
    const qualityStatus = stitchingStatus === "Done" ? (getRandomQualityStatus() as "Passed" | "Rejected") : undefined;
    
    // Generate dates with more recent dates for newer items
    const currentDate = new Date();
    const daysAgo = Math.floor(Math.random() * 30); // 0-30 days ago
    currentDate.setDate(currentDate.getDate() - daysAgo);
    const formattedDate = currentDate.toISOString().split('T')[0];

    const item: ProductItem = {
      id: `${customerId}-${i + 1}`,
      customerId,
      date: formattedDate,
      itemName,
      size: sizes[Math.floor(Math.random() * sizes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      quantity: 10 + Math.floor(Math.random() * 91), // 10-100 quantity
      cuttingStatus,
      stitchingStatus,
      clothType: clothTypes[Math.floor(Math.random() * clothTypes.length)],
      supervisor: supervisors[Math.floor(Math.random() * supervisors.length)],
    };
    
    // Assign tailor if stitching has started
    if (stitchingStatus !== "Not Started") {
      item.tailor = tailors[Math.floor(Math.random() * tailors.length)];
    }
    
    // Add rejection reason if quality check failed
    if (qualityStatus === "Rejected") {
      item.rejectedReason = rejectionReasons[Math.floor(Math.random() * rejectionReasons.length)];
    }
    
    items.push(item);
  }
  
  return items;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchItemsByCustomerId = (customerId: string) => {
    setLoading(true);
    setError(null);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        const data = generateSampleData(customerId);
        setItems(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch items");
        setLoading(false);
      }
    }, 800);
  };
  
  const updateItem = (updatedItem: ProductItem) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };
  
  const filterItems = (filter: Partial<ProductItem>) => {
    return items.filter(item => {
      for (const key in filter) {
        if (filter[key as keyof ProductItem] !== undefined && 
            item[key as keyof ProductItem] !== filter[key as keyof ProductItem]) {
          return false;
        }
      }
      return true;
    });
  };
  
  // Load data for first customer on initial render
  useEffect(() => {
    fetchItemsByCustomerId("SFD12345");
  }, []);
  
  const value = {
    items,
    loading,
    error,
    fetchItemsByCustomerId,
    updateItem,
    filterItems,
    customers: sampleCustomers,
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
