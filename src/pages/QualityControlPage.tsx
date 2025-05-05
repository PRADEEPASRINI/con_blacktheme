
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import QualityControl from "@/components/modules/QualityControl";

const QualityControlPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        <QualityControl />
      </main>
      <Footer />
    </div>
  );
};

export default QualityControlPage;
