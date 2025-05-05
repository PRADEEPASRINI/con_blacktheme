
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StitchingProcess from "@/components/modules/StitchingProcess";

const StitchingProcessPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        <StitchingProcess />
      </main>
      <Footer />
    </div>
  );
};

export default StitchingProcessPage;
