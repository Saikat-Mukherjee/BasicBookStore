import React from 'react';

const HelpSupport = () => {
    const faqs = [
        {
            question: "How do I track my order?",
            answer: "You can track your order by visiting the 'My Orders' section in your profile. Click on the specific order to view its current status and tracking information."
        },
        {
            question: "What is your return policy?",
            answer: "We accept returns within 30 days of purchase. Items must be in their original condition. Please contact our support team to initiate a return."
        },
        {
            question: "Do you ship internationally?",
            answer: "Yes, we ship to select international destinations. Shipping costs and delivery times vary by location."
        },
        {
            question: "How can I contact customer support?",
            answer: "You can reach our support team via email at support@bookstore.com or by calling 1-800-BOOK-HELP. Our hours are Mon-Fri, 9am-5pm EST."
        }
    ];

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Help & Support</h1>
            
            <div className="bg-blue-50 rounded-xl p-8 mb-10 text-center">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">How can we help you today?</h2>
                <div className="max-w-xl mx-auto">
                    <input 
                        type="text" 
                        placeholder="Search for help..." 
                        className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>

            <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                            <p className="text-gray-600">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Still need help?</h2>
                <p className="text-gray-600 mb-6">Our support team is available to assist you with any questions or issues.</p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Contact Support
                </button>
            </div>
        </div>
    );
};

export default HelpSupport;
