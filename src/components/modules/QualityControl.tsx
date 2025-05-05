
import React, { useState } from "react";
import { useData, ProductItem } from "@/context/DataContext";
import DataTable, { Column } from "@/components/ui/DataTable";
import FileUpload from "@/components/ui/FileUpload";
import { Check, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const QualityControl = () => {
  const { items, loading, updateItem, customers, fetchItemsByCustomerId } = useData();
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0].id);
  const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null);
  const [formData, setFormData] = useState<Partial<ProductItem>>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { toast } = useToast();

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value;
    setSelectedCustomerId(customerId);
    fetchItemsByCustomerId(customerId);
    setSelectedItem(null);
  };

  const handleRowClick = (item: ProductItem) => {
    setSelectedItem(item);
    setFormData({
      clothType: item.clothType,
      color: item.color,
      qualityStatus: item.qualityStatus || "Passed",
      rejectedReason: item.rejectedReason,
      supervisor: item.supervisor,
      imageUrl: item.imageUrl,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (file: File) => {
    // In a real app, you would upload this to a server and get a URL back
    // For this demo, we'll use a local URL
    const imageUrl = URL.createObjectURL(file);
    setFormData({ ...formData, imageUrl });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setSaving(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const updatedItem = {
        ...selectedItem,
        ...formData,
      };
      
      updateItem(updatedItem);
      setSaving(false);
      setSaveSuccess(true);
      
      toast({
        title: "Quality check saved",
        description: `Quality status for ${updatedItem.itemName} has been updated.`,
      });
      
      // Reset success indicator after animation
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 800);
  };

  const columns: Column<ProductItem>[] = [
    { header: "Item", accessor: "itemName" },
    { header: "Size", accessor: "size", width: "80px" },
    { header: "Color", accessor: "color", width: "100px" },
    { 
      header: "Stitching Status", 
      accessor: (item) => (
        <span className={`status-badge ${item.stitchingStatus.toLowerCase().replace(' ', '-')}`}>
          {item.stitchingStatus}
        </span>
      ),
      width: "130px"
    },
    { 
      header: "Quality Status", 
      accessor: (item) => {
        if (!item.qualityStatus) return <span className="text-textile-400">Pending</span>;
        return (
          <span className={`status-badge ${item.qualityStatus === "Passed" ? "done" : "rejected"}`}>
            {item.qualityStatus}
          </span>
        );
      },
      width: "130px"
    },
    { 
      header: "Date", 
      accessor: "date",
      width: "110px"
    },
  ];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-textile-900">Quality Control</h1>
      
      <div className="mb-6">
        <label htmlFor="customer" className="mb-2 block text-sm font-medium text-textile-700">
          Select Customer
        </label>
        <select
          id="customer"
          value={selectedCustomerId}
          onChange={handleCustomerChange}
          className="w-full rounded-md border border-textile-300 px-3 py-2 text-textile-900"
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.id}: {customer.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-xl font-medium text-textile-800">Items List</h2>
          <DataTable
            columns={columns}
            data={items.filter(item => item.stitchingStatus === "Done")}
            keyExtractor={(item) => item.id}
            onRowClick={handleRowClick}
            isLoading={loading}
          />
        </div>
        
        <div>
          <h2 className="mb-4 text-xl font-medium text-textile-800">Quality Inspection</h2>
          
          {selectedItem ? (
            <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 border-b border-textile-200 pb-2 text-lg font-medium">
                {selectedItem.itemName}
              </h3>
              
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-textile-700">
                  Cloth Type
                </label>
                <input
                  type="text"
                  name="clothType"
                  value={formData.clothType || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-textile-300 px-3 py-2"
                />
              </div>
              
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-textile-700">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-textile-300 px-3 py-2"
                  readOnly
                />
              </div>
              
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-textile-700">
                  Quality Status
                </label>
                <select
                  name="qualityStatus"
                  value={formData.qualityStatus || "Passed"}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-textile-300 px-3 py-2"
                >
                  <option value="Passed">Passed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              
              {formData.qualityStatus === "Rejected" && (
                <>
                  <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium text-textile-700">
                      Rejection Reason
                    </label>
                    <select
                      name="rejectedReason"
                      value={formData.rejectedReason || ""}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-textile-300 px-3 py-2"
                    >
                      <option value="">Select reason</option>
                      <option value="Stitch Pull">Stitch Pull</option>
                      <option value="Color Fade">Color Fade</option>
                      <option value="Tear">Tear</option>
                      <option value="Pattern Issue">Pattern Issue</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <FileUpload
                      label="Upload Photo of Issue"
                      onFileSelect={handleFileUpload}
                      previewUrl={formData.imageUrl}
                    />
                  </div>
                </>
              )}
              
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-textile-700">
                  Supervisor
                </label>
                <input
                  type="text"
                  name="supervisor"
                  value={formData.supervisor || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-textile-300 px-3 py-2"
                />
              </div>
              
              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center rounded-md bg-textile-900 px-4 py-2 text-white transition-colors hover:bg-textile-800 disabled:bg-textile-400"
              >
                {saving ? (
                  <span className="flex items-center">
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Saving...
                  </span>
                ) : saveSuccess ? (
                  <span className="flex items-center">
                    <Check className="mr-2 h-5 w-5" />
                    Saved!
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="mr-2 h-5 w-5" />
                    Save Quality Check
                  </span>
                )}
              </button>
            </form>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg bg-white p-6 text-center shadow-md">
              <p className="text-textile-500">Select an item from the list to perform quality inspection</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QualityControl;
