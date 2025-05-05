
import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import ProgressChart from "./ProgressChart";
import RejectionChart from "./RejectionChart";
import TailorPerformance from "./TailorPerformance";
import { Info } from "lucide-react";

const AnalyticsDashboard = () => {
  const { items, loading, customers, fetchItemsByCustomerId } = useData();
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0].id);

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value;
    setSelectedCustomerId(customerId);
    fetchItemsByCustomerId(customerId);
  };

  // Calculate summary metrics
  const totalItems = items.length;
  const cutItems = items.filter(item => item.cuttingStatus === "Done").length;
  const stitchedItems = items.filter(item => item.stitchingStatus === "Done").length;
  const rejectedItems = items.filter(item => item.qualityStatus === "Rejected").length;
  
  // Calculate percentages
  const cutPercentage = totalItems > 0 ? Math.round((cutItems / totalItems) * 100) : 0;
  const stitchedPercentage = totalItems > 0 ? Math.round((stitchedItems / totalItems) * 100) : 0;
  const rejectionRate = stitchedItems > 0 ? Math.round((rejectedItems / stitchedItems) * 100) : 0;

  const renderSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-3/4 rounded bg-textile-200"></div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="h-32 rounded bg-textile-200"></div>
        <div className="h-32 rounded bg-textile-200"></div>
        <div className="h-32 rounded bg-textile-200"></div>
        <div className="h-32 rounded bg-textile-200"></div>
      </div>
      <div className="h-64 rounded bg-textile-200"></div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="h-80 rounded bg-textile-200"></div>
        <div className="h-80 rounded bg-textile-200"></div>
      </div>
    </div>
  );

  const SectionExplanation = ({ title, description }: { title: string; description: string }) => (
    <div className="mb-2 flex items-start gap-2 text-sm text-textile-600">
      <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <div>
        <span className="font-medium">{title}:</span> {description}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 animate-fade-in">
      <h1 className="mb-8 text-3xl font-bold text-textile-900">Analytics Dashboard</h1>
      
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
        <SectionExplanation 
          title="Customer Selection" 
          description="Choose a customer ID to view analytics specific to that customer's orders and production data."
        />
      </div>
      
      {loading ? (
        renderSkeleton()
      ) : (
        <>
          {/* Summary Cards */}
          <div className="mb-2">
            <SectionExplanation 
              title="Summary Metrics" 
              description="These cards provide at-a-glance metrics about the selected customer's production status, including cutting and stitching progress and quality control outcomes."
            />
          </div>
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-2 text-sm font-medium text-textile-500">Total Items</h3>
              <p className="text-3xl font-bold text-textile-900">{totalItems}</p>
              <div className="mt-4 h-2 w-full rounded-full bg-textile-100">
                <div className="h-full rounded-full bg-textile-900" style={{ width: "100%" }}></div>
              </div>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-2 text-sm font-medium text-textile-500">Cutting Progress</h3>
              <p className="text-3xl font-bold text-textile-900">{cutPercentage}%</p>
              <div className="mt-4 h-2 w-full rounded-full bg-textile-100">
                <div 
                  className="h-full rounded-full bg-textile-600" 
                  style={{ width: `${cutPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-2 text-sm font-medium text-textile-500">Stitching Progress</h3>
              <p className="text-3xl font-bold text-textile-900">{stitchedPercentage}%</p>
              <div className="mt-4 h-2 w-full rounded-full bg-textile-100">
                <div 
                  className="h-full rounded-full bg-textile-700" 
                  style={{ width: `${stitchedPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-2 text-sm font-medium text-textile-500">Rejection Rate</h3>
              <p className="text-3xl font-bold text-textile-900">{rejectionRate}%</p>
              <div className="mt-4 h-2 w-full rounded-full bg-textile-100">
                <div 
                  className="h-full rounded-full bg-red-500" 
                  style={{ width: `${rejectionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Progress Chart */}
          <div className="mb-2">
            <SectionExplanation 
              title="Progress Timeline" 
              description="This chart shows the daily progression of cutting, stitching, and rejection counts over the last 7 days, helping identify trends and bottlenecks in production."
            />
          </div>
          <div className="mb-8">
            <ProgressChart items={items} />
          </div>
          
          {/* Two Column Charts */}
          <div className="mb-2">
            <SectionExplanation 
              title="Quality and Performance Analysis" 
              description="These charts break down rejection reasons and tailor performance metrics to help identify quality issues and recognize high-performing team members."
            />
          </div>
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <RejectionChart items={items} />
            <TailorPerformance items={items} />
          </div>
          
          {/* Stitching Issues */}
          <div className="mb-2">
            <SectionExplanation 
              title="Common Stitching Issues" 
              description="This section highlights recurring problems in the stitching process, categorized by severity level to prioritize quality improvements."
            />
          </div>
          <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-medium text-textile-800">Common Stitching Issues</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { issue: "Loose stitching", count: 7, level: "high" },
                { issue: "Skipped hems", count: 5, level: "medium" },
                { issue: "Broken thread", count: 3, level: "low" },
                { issue: "Size mismatch", count: 2, level: "low" },
              ].map((issue) => (
                <div 
                  key={issue.issue} 
                  className={`rounded-lg p-4 ${
                    issue.level === "high" ? "bg-red-50" : 
                    issue.level === "medium" ? "bg-yellow-50" : "bg-blue-50"
                  }`}
                >
                  <h4 className="font-medium text-textile-900">{issue.issue}</h4>
                  <p className={`text-sm ${
                    issue.level === "high" ? "text-red-700" : 
                    issue.level === "medium" ? "text-yellow-700" : "text-blue-700"
                  }`}>
                    {issue.count} occurrences
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recent Rejections */}
          <div className="mb-2">
            <SectionExplanation 
              title="Recent Rejections" 
              description="This table lists the most recent items that failed quality control, including details about the item, tailor, and rejection reason to facilitate follow-up and process improvement."
            />
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-medium text-textile-800">Recent Rejections</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-textile-200">
                    <th className="pb-2 text-left text-sm font-medium text-textile-500">Item</th>
                    <th className="pb-2 text-left text-sm font-medium text-textile-500">Date</th>
                    <th className="pb-2 text-left text-sm font-medium text-textile-500">Tailor</th>
                    <th className="pb-2 text-left text-sm font-medium text-textile-500">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {items
                    .filter(item => item.qualityStatus === "Rejected")
                    .slice(0, 5)
                    .map((item) => (
                      <tr key={item.id} className="border-b border-textile-100">
                        <td className="py-3 text-sm text-textile-900">{item.itemName}</td>
                        <td className="py-3 text-sm text-textile-900">{item.date}</td>
                        <td className="py-3 text-sm text-textile-900">{item.tailor || "N/A"}</td>
                        <td className="py-3 text-sm text-textile-900">
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                            {item.rejectedReason}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
