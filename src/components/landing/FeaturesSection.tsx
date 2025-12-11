import React from 'react';
import { motion } from 'framer-motion';

const features = [
    {
        name: 'AI-Powered Insights',
        description: 'Personalized recommendations that help you save more every month.',
        icon: '🔮',
    },
    {
        name: 'Smart Expense Categorization',
        description: 'Auto detects merchants like Tea Time Tales, petrol pumps, Airtel, and more.',
        icon: '🏷️',
    },
    {
        name: 'GPay OCR PDF Import',
        description: 'Reads Google Pay statements with 98% accuracy using advanced OCR + AI.',
        icon: '📄',
    },
    {
        name: 'Adaptive Budgeting',
        description: 'A budget that adjusts based on your lifestyle and spending patterns.',
        icon: '⚖️',
    },
    {
        name: 'Goal Prediction Engine',
        description: 'Know exactly when you will reach each financial goal.',
        icon: '🎯',
    },
    {
        name: 'Smart SIP Recommendations',
        description: 'Invest smarter using AI-calculated monthly surplus.',
        icon: '📈',
    },
    {
        name: 'Monthly Surplus Planner',
        description: 'Automatically identifies salary, bills, and fixed costs.',
        icon: '🗓️',
    },
    {
        name: 'Multi-Year Insights',
        description: 'Track financial progress over 12, 24, or 36 months.',
        icon: '📅',
    },
    {
        name: 'Rewards System',
        description: 'Earn points every time you manage money wisely.',
        icon: '🎁',
    },
    {
        name: 'Financial Health Score',
        description: 'An AI-powered score that reflects your money habits.',
        icon: '❤️',
    },
    {
        name: 'Spend Pattern Detection',
        description: 'Detect rising tea, fuel, food, or monthly bill spikes.',
        icon: '🔍',
    },
    {
        name: 'AI Assistant Chatbot',
        description: 'Ask anything about your spending, budget, or investments.',
        icon: '💬',
    },
];

const FeaturesSection: React.FC = () => {
    return (
        <section className="py-24 lg:py-32 relative" id="features">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-purple-400 font-semibold tracking-wide uppercase mb-3"
                    >
                        The Future of Money Management
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white"
                    >
                        Powered by AI. Designed for clarity. <br className="hidden md:block" /> Built for everyone.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                                {feature.name}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
