import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeatureSection from "@/components/home/FeatureSection";
import LoginModal from "@/components/auth/LoginModal";

const Index = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar Navbar */}
      <Navbar onLoginClick={() => setShowLoginModal(true)} />

      {/* Main content area with margin to accommodate sidebar */}
      <div className="ml-64 flex flex-col w-full">
        <main className="flex-grow">
          <Hero />

          <FeatureSection
            title="Quality Control"
            description="Monitor and manage the quality of your textile products with our comprehensive quality control system. Track rejections, identify common issues, and improve your production quality."
            imageSrc="https://images.unsplash.com/photo-1558599249-69938ec90b06?q=80&w=1920&auto=format&fit=crop"
            linkTo="/quality-control"
          />

          <FeatureSection
            title="Cutting Management"
            description="Efficiently manage the cutting process for your textile products. Track progress, update statuses, and ensure smooth transitions to the stitching department."
            imageSrc="https://images.unsplash.com/photo-1586744566771-f5d8661500e8?q=80&w=1920&auto=format&fit=crop"
            imagePosition="right"
            linkTo="/cutting-management"
          />

          <FeatureSection
            title="Stitching Process"
            description="Assign tailors, track stitching progress, and manage the entire process from cut fabric to finished product with our intuitive stitching management system."
            imageSrc="https://images.unsplash.com/photo-1605060431885-472211c3275d?q=80&w=1920&auto=format&fit=crop"
            linkTo="/stitching-process"
          />
        </main>

        <Footer />
      </div>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
};

export default Index;
