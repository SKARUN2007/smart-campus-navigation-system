import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { QuickDestinations } from '@/components/home/QuickDestinations';
import { HowItWorks } from '@/components/home/HowItWorks';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { CampusMapPreview } from '@/components/home/CampusMapPreview';
import { FacilitiesSection } from '@/components/home/FacilitiesSection';
import { CTASection } from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-cyan-500 selection:text-white">
      {/* Global Navigation Bar */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* Hero Section with Interactive Vector Illustration & Search */}
        <HeroSection />

        {/* Quick Destinations / Where would you like to go? */}
        <QuickDestinations />

        {/* How It Works Section / Campus Navigation Made Simple */}
        <HowItWorks />

        {/* Features Showcase Section */}
        <FeaturesSection />

        {/* Campus Map High-Resolution Visual Preview Section */}
        <CampusMapPreview />

        {/* Facilities Directory Showcase Section */}
        <FacilitiesSection />

        {/* Call-to-Action Section */}
        <CTASection />
      </main>

      {/* Global Professional Footer */}
      <Footer />
    </div>
  );
}
