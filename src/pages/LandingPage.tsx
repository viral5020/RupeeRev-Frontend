import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import ReviewsSection from '../components/landing/ReviewsSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import PricingSection from '../components/landing/PricingSection';
import CTASection from '../components/landing/CTASection';
import FAQSection from '../components/landing/FAQSection';
import Footer from '../components/landing/Footer';
import LandingHeader from '../components/landing/LandingHeader';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#0A0F1C] text-white selection:bg-purple-500/30 overflow-x-hidden">
            <LandingHeader />
            <HeroSection />
            <FeaturesSection />
            <ReviewsSection />
            <PricingSection />
            <TestimonialsSection />
            <FAQSection />
            <CTASection />
            <Footer />
        </div>
    );
};

export default LandingPage;
