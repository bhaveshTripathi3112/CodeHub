import React from "react";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import StatsSection from "../components/StatsSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function HomePage() {
  return (
    <div className="bg-black text-gray-300 min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  );
}

export default HomePage;
