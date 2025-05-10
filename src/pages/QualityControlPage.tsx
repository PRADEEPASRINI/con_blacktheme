import React, { useState, useEffect } from "react";
import { useData, ProductItem } from "@/context/DataContext";
import DataTable, { Column } from "@/components/ui/DataTable";
import FileUpload from "@/components/ui/FileUpload";
import { Check, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ColorGroup {
  color: string;
  clothType: string;
  items: ProductItem[];
}

const QualityControl = () => {
  const { items, loading, updateItem, fetchItemsByCustomerId } = useData();
  const [searchId, setSearchId] = useState("");
  const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null);
  const [formData, setFormData] = useState<Partial<ProductItem>>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uniqueColorGroups, setUniqueColorGroups] = useState<ColorGroup[]>([]);
  const { toast } = useToast();

  // Group items by unique colors
  useEffect(() => {
    const colorMap = new Map<string, ColorGroup>();
    
    items.forEach(item => {
      const key = item.color;
      if (!colorMap.has(key)) {
        colorMap.set(key, {
          color: item.color,
          clothType: item.clothType || "",
          items: [item]
        });
      } else {
        colorMap.get(key)?.items.push(item);
      }
    });
    
    setUniqueColorGroups(Array.from(colorMap.values()));
  }, [items]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      fetchItemsByCustomerId(searchId.trim());
      setSelectedItem(null);
    }
  };

  const handleRowClick = (colorGroup: ColorGroup) => {
    // Use the first item in the color group as a representative
    const representativeItem = colorGroup.items[0];
    setSelectedItem(representativeItem);
    setFormData({
      clothType: colorGroup.clothType,
      color: colorGroup.color,
      qualityStatus: representativeItem.qualityStatus || "Passed",
      rejectedReason: representativeItem.rejectedReason,
      supervisor: representativeItem.supervisor || "",
      imageUrl: representativeItem.imageUrl,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setFormData({ ...formData, imageUrl });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setSaving(true);
    setTimeout(() => {
      // Update all items with the same color
      const colorToUpdate = selectedItem.color;
      const itemsToUpdate = items.filter(item => item.color === colorToUpdate);
      
      itemsToUpdate.forEach(item => {
        const updatedItem = {
          ...item,
          qualityStatus: formData.qualityStatus,
          rejectedReason: formData.rejectedReason,
          supervisor: formData.supervisor,
          imageUrl: formData.imageUrl,
        };
        updateItem(updatedItem);
      });

      setSaving(false);
      setSaveSuccess(true);

      toast({
        title: "Quality check saved",
        description: `Quality status for color ${colorToUpdate} has been updated.`,
      });

      setTimeout(() => setSaveSuccess(false), 2000);
    }, 800);
  };

  const columns: Column<ColorGroup>[] = [
    { header: "Cloth Type", accessor: "clothType" },
    { header: "Color", accessor: "color", width: "100px" },
    {
      header: "Dyeing Status",
      accessor: () => (
        <span className="status-badge done">
          Done
        </span>
      ),
      width: "130px"
    },
    {
      header: "Quality Status",
      accessor: (colorGroup) => {
        const status = colorGroup.items[0].qualityStatus;
        if (!status) return <span className="text-gray-400">Pending</span>;
        return (
          <span className={`status-badge ${status === "Passed" ? "done" : "rejected"}`}>
            {status}
          </span>
        );
      },
      width: "130px"
    },
    {
      header: "Rejection Details",
      accessor: (colorGroup) => {
        const status = colorGroup.items[0].qualityStatus;
        const reason = colorGroup.items[0].rejectedReason;
        const imageUrl = colorGroup.items[0].imageUrl;
        
        if (status === "Rejected") {
          return (
            <div className="flex flex-col gap-2">
              <span className="text-red-400">{reason || "Not specified"}</span>
              {imageUrl && (
                <div className="mt-1">
                  <img 
                    src={imageUrl} 
                    alt={`Issue: ${reason}`} 
                    className="h-16 w-16 rounded-md object-cover cursor-pointer hover:opacity-80" 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(imageUrl, '_blank');
                    }}
                  />
                </div>
              )}
            </div>
          );
        }
        return <span className="text-gray-400">N/A</span>;
      },
      width: "180px"
    },
    {
      header: "Supervisor",
      accessor: (colorGroup) => colorGroup.items[0].supervisor || "Not Assigned",
      width: "120px"
    },
    {
      header: "Date",
      accessor: (colorGroup) => colorGroup.items[0].date,
      width: "110px"
    },
  ];

  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 bg-black text-white">
      <h1 className="mb-8 text-3xl font-bold">Quality Control</h1>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Enter Customer ID (e.g., SFD12345)"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="flex-1 rounded-md border border-gray-600 bg-zinc-800 px-3 py-2 text-white"
        />
        <button
          type="submit"
          className="rounded-md bg-white text-black px-4 py-2 hover:bg-gray-200"
        >
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-xl font-medium">Items List</h2>
          <DataTable
            columns={columns}
            data={uniqueColorGroups}
            keyExtractor={(colorGroup) => colorGroup.color}
            onRowClick={handleRowClick}
            isLoading={loading}
          />
        </div>

        <div>
          <h2 className="mb-4 text-xl font-medium">Quality Inspection</h2>

          {selectedItem ? (
            <form onSubmit={handleSubmit} className="rounded-lg bg-zinc-900 p-6 shadow-md">
              <h3 className="mb-4 border-b border-gray-600 pb-2 text-lg font-medium">
                {formData.color} Quality Check
              </h3>

              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Cloth Type</label>
                <input
                  type="text"
                  name="clothType"
                  value={formData.clothType || ""}
                  readOnly
                  className="w-full rounded-md border border-gray-600 bg-zinc-800 px-3 py-2 text-white"
                />
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color || ""}
                  readOnly
                  className="w-full rounded-md border border-gray-600 bg-zinc-800 px-3 py-2 text-white"
                />
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Date</label>
                <input
                  type="date"
                  name="date"
                  value={currentDate}
                  className="w-full rounded-md border border-gray-600 bg-zinc-800 px-3 py-2 text-white"
                />
              </div>

              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">Quality Status</label>
                <select
                  name="qualityStatus"
                  value={formData.qualityStatus || "Passed"}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-600 bg-zinc-800 px-3 py-2 text-white"
                >
                  <option value="Passed">Passed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {formData.qualityStatus === "Rejected" && (
                <>
                  <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium">Rejection Reason</label>
                    <select
                      name="rejectedReason"
                      value={formData.rejectedReason || ""}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-600 bg-zinc-800 px-3 py-2 text-white"
                      required
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
                <label className="mb-1 block text-sm font-medium">Supervisor</label>
                <input
                  type="text"
                  name="supervisor"
                  value={formData.supervisor || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-600 bg-zinc-800 px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center rounded-md bg-white text-black px-4 py-2 transition-colors hover:bg-gray-200 disabled:bg-gray-400"
              >
                {saving ? (
                  <span className="flex items-center">
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></span>
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
            <div className="flex h-64 flex-col items-center justify-center rounded-lg bg-zinc-900 p-6 text-center shadow-md">
              <p className="text-gray-400">Select a color from the list to perform quality inspection</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QualityControl;