import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const LandingHeader: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setMobileMenuOpen(false);
    };

    const handleGetPremium = () => {
        if (user) {
            navigate('/pricing');
        } else {
            navigate('/login?redirect=/pricing');
        }
        setMobileMenuOpen(false);
    };

    const handleLogin = () => {
        navigate('/login');
        setMobileMenuOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0F1C]/80 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                        ₹
                    </div>
                    <span className="text-xl font-bold text-white">RupeeRev</span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white transition-colors">
                        Features
                    </button>
                    <button onClick={() => scrollToSection('pricing')} className="text-gray-300 hover:text-white transition-colors">
                        Pricing
                    </button>
                    <button onClick={() => scrollToSection('reviews')} className="text-gray-300 hover:text-white transition-colors">
                        Reviews
                    </button>
                    <button onClick={() => scrollToSection('testimonials')} className="text-gray-300 hover:text-white transition-colors">
                        Testimonials
                    </button>
                    <button
                        onClick={handleLogin}
                        className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                    >
                        Login
                    </button>
                    <button
                        onClick={handleGetPremium}
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all hover:scale-105"
                    >
                        Get Premium
                    </button>
                </nav>

                {/* Mobile Navigation */}
                <div className="md:hidden flex items-center gap-2">
                    {/* Login Button - Always visible on mobile */}
                    <button
                        onClick={handleLogin}
                        className="px-3 py-1.5 text-sm bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                        Login
                    </button>

                    {/* Hamburger Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {mobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden bg-[#0A0F1C]/95 backdrop-blur-lg border-t border-white/10 overflow-hidden"
                    >
                        <nav className="px-4 py-4 space-y-2">
                            <button
                                onClick={() => scrollToSection('features')}
                                className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                Features
                            </button>
                            <button
                                onClick={() => scrollToSection('pricing')}
                                className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                Pricing
                            </button>
                            <button
                                onClick={() => scrollToSection('reviews')}
                                className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                Reviews
                            </button>
                            <button
                                onClick={() => scrollToSection('testimonials')}
                                className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                Testimonials
                            </button>
                            <button
                                onClick={handleGetPremium}
                                className="block w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all mt-2"
                            >
                                Get Premium
                            </button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default LandingHeader;
