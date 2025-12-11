import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "Is my data secure?",
        answer: "Absolutely. We use bank-grade 256-bit encryption to store your data. We never sell your personal information to third parties."
    },
    {
        question: "Do you store my bank or GPay statement?",
        answer: "No. We process your statements in real-time using secure OCR technology to extract insights, and then the file is immediately discarded. Your raw statements are never stored."
    },
    {
        question: "How accurate is the categorization?",
        answer: "Our AI model is trained on millions of Indian transaction patterns. It achieves 98% accuracy in categorizing merchants like Swiggy, Zomato, Uber, and local UPI payments."
    },
    {
        question: "Can I cancel anytime?",
        answer: "Yes, you can cancel your Premium subscription at any time. You will continue to have access until the end of your billing period."
    },
    {
        question: "Is Premium worth it?",
        answer: "Premium users save an average of ₹5,000/month by identifying leaks and optimizing investments. The ₹149/month fee pays for itself many times over."
    }
];

const FAQSection: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section className="py-24 relative">
            <div className="max-w-3xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-purple-400 font-semibold tracking-wide uppercase mb-3"
                    >
                        FAQ
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white"
                    >
                        Frequently Asked Questions
                    </motion.p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden"
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-white/5"
                            >
                                <span className="text-lg font-medium text-white">{faq.question}</span>
                                <span className={`transform transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`}>
                                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </button>
                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
