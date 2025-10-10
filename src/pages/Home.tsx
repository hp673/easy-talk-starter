import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, ChevronRight } from "lucide-react";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import WorkplaceEAMSection from "@/components/landing/WorkplaceEAMSection";
import PricingSection from "@/components/landing/PricingSection";
import VideoSection from "@/components/landing/VideoSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import ContactSection from "@/components/landing/ContactSection";
import FinalCTA from "@/components/landing/FinalCTA";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <WorkplaceEAMSection />
      <PricingSection />
      <VideoSection />
      <SocialProofSection />
      <ContactSection />
      <FinalCTA />
    </div>
  );
};

export default Home;
