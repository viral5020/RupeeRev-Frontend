import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PricingSection: React.FC = () => {
    const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleGetStarted = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/login?redirect=/pricing');
        }
    };

    const handleStartTrial = () => {
        if (user) {
            navigate('/pricing');
        } else {
            navigate('/login?redirect=/pricing');
        }
    };

    return (
        <section className="py-24 lg:py-32 relative overflow-hidden" id="pricing">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-purple-400 font-semibold tracking-wide uppercase mb-3"
                    >
                        Pricing
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-8"
                    >
                        Simple, transparent pricing
                    </motion.p>

                    {/* Billing Toggle */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-center items-center gap-4"
                    >
                        <span className={`text-sm font-medium ${billingInterval === 'monthly' ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
                        <button
                            onClick={() => setBillingInterval(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                            className="w-14 h-8 bg-white/10 rounded-full p-1 relative transition-colors duration-300 hover:bg-white/20"
                        >
                            <motion.div
                                layout
                                className="w-6 h-6 bg-purple-500 rounded-full shadow-lg"
                                animate={{ x: billingInterval === 'monthly' ? 0 : 24 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                        <span className={`text-sm font-medium ${billingInterval === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
                            Yearly <span className="text-green-400 text-xs ml-1">(Save 45%)</span>
                        </span>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto mb-20">
                    {/* Free Plan */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col"
                    >
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                            <p className="text-gray-400 text-sm">Essential tools for personal finance tracking.</p>
                        </div>
                        <div className="mb-8">
                            <span className="text-4xl font-bold text-white">₹0</span>
                            <span className="text-gray-500">/forever</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                "Basic expense tracking",
                                "Manual transaction entry",
                                "Goals overview",
                                "Basic budgeting",
                                "5 AI questions/month"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-white">✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={handleGetStarted}
                            className="w-full py-4 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all duration-300"
                        >
                            Get Started
                        </button>
                    </motion.div>

                    {/* Premium Plan */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="relative bg-white/10 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-8 flex flex-col shadow-[0_0_40px_rgba(168,85,247,0.15)]"
                    >
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-4 py-1 rounded-bl-xl rounded-tr-2xl">
                            RECOMMENDED
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-white mb-2">Premium</h3>
                            <p className="text-purple-200 text-sm">Advanced AI insights and automation.</p>
                        </div>
                        <div className="mb-8">
                            <span className="text-4xl font-bold text-white">
                                {billingInterval === 'monthly' ? '₹149' : '₹999'}
                            </span>
                            <span className="text-gray-400">/{billingInterval === 'monthly' ? 'month' : 'year'}</span>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {[
                                "Unlimited AI queries",
                                "GPay OCR + PDF Parsing",
                                "Multi-year insights",
                                "Smart SIP engine",
                                "Goal prediction",
                                "Advanced budgeting",
                                "Auto-categorization",
                                "Financial health score"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-white text-sm">
                                    <span className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-xs text-white shadow-lg">✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={handleStartTrial}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all duration-300"
                        >
                            Start Free Trial
                        </button>
                    </motion.div>
                </div>

                {/* Add-ons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="max-w-3xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <div>
                        <h4 className="text-lg font-bold text-white mb-1">Need more PDF uploads?</h4>
                        <p className="text-gray-400 text-sm">Top up your account with PDF tokens anytime.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 text-center">
                            <div className="text-white font-bold">₹10</div>
                            <div className="text-xs text-gray-500">1 PDF</div>
                        </div>
                        <div className="px-6 py-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-center">
                            <div className="text-purple-300 font-bold">₹49</div>
                            <div className="text-xs text-purple-400/70">10 PDFs</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PricingSection;
