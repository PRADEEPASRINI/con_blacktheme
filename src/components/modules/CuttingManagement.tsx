
import React, { useState, useRef } from "react";
import { useData, ProductItem } from "@/context/DataContext";
import DataTable, { Column } from "@/components/ui/DataTable";
import { useToast } from "@/components/ui/use-toast";
import { Check, Save } from "lucide-react";

const CuttingManagement = () => {
  const { items, loading, updateItem, customers, fetchItemsByCustomerId } = useData();
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0].id);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProductItem>>({});
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value;
    setSelectedCustomerId(customerId);
    fetchItemsByCustomerId(customerId);
    setEditingId(null);
  };

  const handleEdit = (item: ProductItem) => {
    setEditingId(item.id);
    setEditForm({
      cuttingStatus: item.cuttingStatus,
      supervisor: item.supervisor,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSave = (item: ProductItem) => {
    setSaving(true);

    // Simulate API call delay
    setTimeout(() => {
      const updatedItem = {
        ...item,
        ...editForm,
      };
      
      updateItem(updatedItem);
      setEditingId(null);
      setSaving(false);
      
      toast({
        title: "Cutting status updated",
        description: `${item.itemName} has been updated to ${editForm.cuttingStatus}.`,
      });
    }, 600);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleRowClick = (item: ProductItem) => {
    if (editingId === null) {
      handleEdit(item);
    }
  };

  const columns: Column<ProductItem>[] = [
    { header: "#", accessor: (_, index) => index + 1, width: "60px" },
    { header: "Item Name", accessor: "itemName" },
    { header: "Color", accessor: "color", width: "100px" },
    { header: "Size", accessor: "size", width: "80px" },
    { header: "Quantity", accessor: "quantity", width: "100px" },
    {
      header: "Cutting Status",
      accessor: (item) => {
        if (editingId === item.id) {
          return (
            <select
              name="cuttingStatus"
              value={editForm.cuttingStatus}
              onChange={handleInputChange}
              className="w-full rounded-md border border-textile-300 px-2 py-1 text-sm"
              autoFocus
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          );
        }
        return (
          <span className={`status-badge ${item.cuttingStatus.toLowerCase().replace(' ', '-')}`}>
            {item.cuttingStatus}
          </span>
        );
      },
      width: "150px",
    },
    {
      header: "Supervisor",
      accessor: (item) => {
        if (editingId === item.id) {
          return (
            <input
              type="text"
              name="supervisor"
              value={editForm.supervisor || ""}
              onChange={handleInputChange}
              className="w-full rounded-md border border-textile-300 px-2 py-1 text-sm"
            />
          );
        }
        return item.supervisor;
      },
      width: "150px",
    },
    { header: "Date", accessor: "date", width: "110px" },
    {
      header: "Actions",
      accessor: (item) => {
        if (editingId === item.id) {
          return (
            <div className="flex space-x-2">
              <button
                onClick={() => handleSave(item)}
                disabled={saving}
                className="inline-flex items-center rounded-md bg-textile-900 px-2 py-1 text-xs text-white hover:bg-textile-800"
              >
                {saving ? (
                  <span className="flex items-center">
                    <span className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Saving
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="mr-1 h-3 w-3" />
                    Save
                  </span>
                )}
              </button>
              <button
                onClick={handleCancel}
                className="inline-flex items-center rounded-md bg-textile-200 px-2 py-1 text-xs text-textile-800 hover:bg-textile-300"
              >
                Cancel
              </button>
            </div>
          );
        }
        return (
          <button
            onClick={() => handleEdit(item)}
            className="inline-flex items-center rounded-md bg-textile-100 px-2 py-1 text-xs text-textile-800 hover:bg-textile-200"
          >
            Edit
          </button>
        );
      },
      width: "120px",
    },
  ];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-textile-900">Cutting Management</h1>
      
      <div className="mb-6">
        <label htmlFor="customer" className="mb-2 block text-sm font-medium text-textile-700">
          Select Customer ID
        </label>
        <select
          id="customer"
          value={selectedCustomerId}
          onChange={handleCustomerChange}
          className="w-full rounded-md border border-textile-300 px-3 py-2 text-textile-900 md:w-1/3"
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.id}: {customer.name}
            </option>
          ))}
        </select>
      </div>
      
      <form ref={formRef}>
        <DataTable
          columns={columns}
          data={items}
          keyExtractor={(item) => item.id}
          onRowClick={handleRowClick}
          isLoading={loading}
        />
      </form>
      
      <div className="mt-6 rounded-md bg-textile-50 p-4 text-sm text-textile-700">
        <p className="font-medium">Instructions:</p>
        <ul className="ml-5 mt-2 list-disc">
          <li>Click on any row to edit the cutting status and supervisor</li>
          <li>Save to update the status and notify the stitching department</li>
          <li>Items marked "Done" will be available for the stitching process</li>
        </ul>
      </div>
    </div>
  );
};

export default CuttingManagement;
