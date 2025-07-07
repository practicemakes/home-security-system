import { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase.js';
import TurnstileWidget from './TurnstileWidget.jsx';

export default function ConsultationForm() {
    // State for form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [bestTimeToCall, setBestTimeToCall] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    // Load saved data from localStorage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem('consultationData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setName(parsedData.name || '');
            setEmail(parsedData.email || '');
            setPhone(parsedData.phone || '');
            setBestTimeToCall(parsedData.bestTimeToCall || '');
            setSubmitted(true);
        }
    }, []);

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Phone number should have 10 digits';
        }

        if (!bestTimeToCall) {
            newErrors.bestTimeToCall = 'Please select a time range';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Create data object
        const consultationData = {
            name,
            email,
            phone,
            bestTimeToCall
        };

        // Save to localStorage
        localStorage.setItem('consultationData', JSON.stringify(consultationData));
        setSubmitted(true);
    };

    // Reset form
    const resetForm = () => {
        setName('');
        setEmail('');
        setPhone('');
        setBestTimeToCall('');
        setErrors({});
        localStorage.removeItem('consultationData');
        setSubmitted(false);
    };

    // Format phone number as user types
    const formatPhoneNumber = (value) => {
        // Remove all non-digits
        const phoneNumber = value.replace(/\D/g, '');

        // Format the phone number as (XXX) XXX-XXXX
        if (phoneNumber.length <= 3) {
            return phoneNumber;
        } else if (phoneNumber.length <= 6) {
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        } else {
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
        }
    };

    const handlePhoneChange = (e) => {
        const formattedPhone = formatPhoneNumber(e.target.value);
        setPhone(formattedPhone);
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="grid md:grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className={`w-full px-4 py-3 border-2 ${errors.name ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:border-blue-500 focus:outline-none transition-colors`}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john.doe@example.com"
                            className={`w-full px-4 py-3 border-2 ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:border-blue-500 focus:outline-none transition-colors`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={handlePhoneChange}
                            placeholder="(123) 456-7890"
                            className={`w-full px-4 py-3 border-2 ${errors.phone ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:border-blue-500 focus:outline-none transition-colors`}
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        <p className="text-sm text-slate-500 mt-1">We'll use this to contact you about your consultation.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            What's the best time to call?
                        </label>
                        <select
                            value={bestTimeToCall}
                            onChange={(e) => setBestTimeToCall(e.target.value)}
                            className={`w-full px-4 py-3 border-2 ${errors.bestTimeToCall ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:border-blue-500 focus:outline-none transition-colors`}
                        >
                            <option value="">Select a time range</option>
                            <option value="morning">Morning (8am - 12pm)</option>
                            <option value="afternoon">Afternoon (12pm - 5pm)</option>
                            <option value="evening">Evening (5pm - 9pm)</option>
                        </select>
                        {errors.bestTimeToCall && <p className="text-red-500 text-sm mt-1">{errors.bestTimeToCall}</p>}
                        <p className="text-sm text-slate-500 mt-1">This helps us schedule your consultation at a convenient time.</p>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
                    >
                        {submitted ? 'Update Information' : 'Schedule Consultation'}
                    </button>

                    {submitted && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="bg-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-600 transition-all duration-300"
                        >
                            Reset Form
                        </button>
                    )}
                </div>
            </form>

            {submitted && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mt-6">
                    <p className="text-green-700">
                        Thank you for scheduling a consultation! We'll contact you soon to confirm your appointment.
                    </p>
                </div>
            )}
        </div>
    );
}
