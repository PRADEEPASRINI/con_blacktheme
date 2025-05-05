
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CuttingManagement from "@/components/modules/CuttingManagement";

const CuttingManagementPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        <CuttingManagement />
      </main>
      <Footer />
    </div>
  );
};

export default CuttingManagementPage;
