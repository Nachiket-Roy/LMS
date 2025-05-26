import React, { useState } from 'react';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can add your form submit logic here (e.g., API call)
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row items-center justify-center p-6 gap-10">
            {/* Illustration */}
            <div className="max-w-md hidden md:block">
                <img
                    src="/vector/ContactUs.svg"
                    alt="Contact us illustration"
                    className="w-full max-w-lg"
                />
            </div>


            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
                <h2 className="text-3xl font-bold mb-6 text-purple-900">Contact Us</h2>

                {submitted ? (
                    <p className="text-green-600 text-lg font-semibold">
                        Thanks for reaching out! We'll get back to you soon.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            type="text"
                            placeholder="Your Name"
                            required
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700"
                        />
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="Your Email"
                            required
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700"
                        />
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Your Message"
                            required
                            rows={5}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700"
                        />
                        <button
                            type="submit"
                            className="bg-purple-900 text-white py-3 rounded-md hover:bg-purple-800 transition"
                        >
                            Send Message
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ContactUs;
