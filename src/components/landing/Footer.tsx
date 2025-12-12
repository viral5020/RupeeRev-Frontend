import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="py-12 border-t border-white/10 bg-[#0A0F1C] relative z-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                                ₹
                            </div>
                            <span className="text-xl font-bold text-white">RupeeRev</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            The Future of Personal Finance. <br />
                            Automated. Intelligent. Secure.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#features" className="hover:text-purple-400 transition-colors">Features</a></li>
                            <li><a href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</a></li>
                            <li><a href="#testimonials" className="hover:text-purple-400 transition-colors">Testimonials</a></li>
                            <li><a href="#faq" className="hover:text-purple-400 transition-colors">FAQ</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="/" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="/" className="hover:text-purple-400 transition-colors">Terms of Service</a></li>
                            <li><a href="/" className="hover:text-purple-400 transition-colors">Security</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="mailto:support@rupeerev.com" className="hover:text-purple-400 transition-colors">support@rupeerev.com</a></li>
                            <li><a href="/" className="hover:text-purple-400 transition-colors">Twitter</a></li>
                            <li><a href="/" className="hover:text-purple-400 transition-colors">LinkedIn</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} RupeeRev. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
