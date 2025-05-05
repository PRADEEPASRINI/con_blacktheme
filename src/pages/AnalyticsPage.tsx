
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

const AnalyticsPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        <AnalyticsDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default AnalyticsPage;
