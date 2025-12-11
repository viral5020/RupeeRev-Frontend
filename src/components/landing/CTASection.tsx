import React from 'react';
import { useNavigate } from 'react-router-dom';

const CTASection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-primary">
            <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                    <span className="block">Ready to take control?</span>
                    <span className="block">Start your free trial today.</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-indigo-200">
                    Join thousands of users who are already managing their finances smarter with Money Manager.
                </p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-indigo-50 sm:w-auto"
                >
                    Sign up for free
                </button>
            </div>
        </div>
    );
};

export default CTASection;
