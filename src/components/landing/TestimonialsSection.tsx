import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
    {
        content: "RupeeRev showed me where my money was leaking. Game-changing.",
        author: "Aditi Sharma",
        role: "Product Designer",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
        content: "I started SIPs because of the AI suggestions. So simple.",
        author: "Rahul Verma",
        role: "Software Engineer",
        image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
        content: "The GPay OCR import saved me hours every month.",
        author: "Priya Patel",
        role: "Small Business Owner",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
];

const TestimonialsSection: React.FC = () => {
    return (
        <section className="py-24 lg:py-32 relative" id="testimonials">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-purple-400 font-semibold tracking-wide uppercase mb-3"
                    >
                        Testimonials
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white"
                    >
                        Loved by thousands
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.author}
                                    className="w-12 h-12 rounded-full border-2 border-purple-500/30"
                                />
                                <div>
                                    <div className="text-white font-semibold">{testimonial.author}</div>
                                    <div className="text-gray-400 text-xs">{testimonial.role}</div>
                                </div>
                            </div>
                            <p className="text-gray-300 leading-relaxed">"{testimonial.content}"</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
