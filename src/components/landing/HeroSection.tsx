import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-[128px]" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
                            Your Money. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                Smarter. Faster. Automated.
                            </span>
                        </h1>
                        <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-lg">
                            RupeeRev is the AI-powered personal finance platform that reads your GPay statements, analyzes your spending, predicts your goals, and helps you save, invest, and grow smarter.
                        </p>

                        {/* Bullet Highlights */}
                        <ul className="space-y-3 mb-10 text-gray-300">
                            {[
                                "🔮 AI-powered insights with Gemini",
                                "🔍 GPay PDF OCR with 98% accuracy",
                                "📊 Smart budgeting & analytics",
                                "💡 SIP & investment suggestions"
                            ].map((item, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_#A855F7]" />
                                    {item}
                                </motion.li>
                            ))}
                        </ul>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300"
                            >
                                Start Free
                            </button>
                            <button
                                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-8 py-4 bg-white/5 backdrop-blur-lg border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 hover:scale-105 transition-all duration-300"
                            >
                                Get Premium – ₹149/mo
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Column: Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Floating Glass Cards */}
                        <div className="relative w-full aspect-square max-w-lg mx-auto">
                            {/* Main Card */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 flex flex-col"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                    <div className="text-gray-500 text-sm">RupeeRev AI</div>
                                </div>
                                <div className="space-y-4 flex-1">
                                    <div className="h-32 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl border border-white/5 p-4">
                                        <div className="text-sm text-gray-400 mb-2">Total Balance</div>
                                        <div className="text-3xl font-bold text-white">₹1,24,500</div>
                                        <div className="text-xs text-green-400 mt-1">+12.5% this month</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-24 bg-white/5 rounded-xl border border-white/5 p-3">
                                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 mb-2">📊</div>
                                            <div className="text-xs text-gray-400">Spending</div>
                                            <div className="text-white font-semibold">₹45k</div>
                                        </div>
                                        <div className="h-24 bg-white/5 rounded-xl border border-white/5 p-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 mb-2">🚀</div>
                                            <div className="text-xs text-gray-400">Invested</div>
                                            <div className="text-white font-semibold">₹20k</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Elements */}
                            <motion.div
                                animate={{ y: [0, 30, 0], x: [0, -10, 0] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="hidden md:block absolute -right-8 top-20 w-48 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">₹</div>
                                    <div>
                                        <div className="text-xs text-gray-300">Salary Credited</div>
                                        <div className="text-sm font-bold text-white">+ ₹85,000</div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, -25, 0], x: [0, 15, 0] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="hidden md:block absolute -left-8 bottom-32 w-48 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">⚠️</div>
                                    <div>
                                        <div className="text-xs text-gray-300">High Spending</div>
                                        <div className="text-sm font-bold text-white">Swiggy</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
