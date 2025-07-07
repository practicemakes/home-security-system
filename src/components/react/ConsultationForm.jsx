import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase.js';
import TurnstileWidget from "./TurnstileWidget.jsx";

export default function ConsultationForm() {
    // State for form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [bestTimeToCall, setBestTimeToCall] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState(null);

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
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!turnstileToken || !validateForm()) {
            return;
        }

        setSaving(true);
        setErrors({});

        try {
            // Verify turnstile
            const verifyResponse = await fetch('/api/verify-turnstile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: turnstileToken })
            });

            const { success } = await verifyResponse.json();
            if (!success) throw new Error('Verification failed');

            // Get home details from localStorage if available
            const homeDetailsData = localStorage.getItem('homeDetailsData');
            const parsedHomeDetails = homeDetailsData ? JSON.parse(homeDetailsData) : null;

            // Create comprehensive lead data
            const leadData = {
                // Consultation form data
                consultationData: {
                    name: name.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    bestTimeToCall
                },

                // Include home details if available
                homeDetailsData: parsedHomeDetails,

                // Calculate system summary if home details exist
                systemSummary: parsedHomeDetails ? calculateSystemSummary(parsedHomeDetails) : null,

                // Metadata
                status: 'new',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                source: 'website_consultation_form'
            };

            // Save to Firestore
            const docRef = await addDoc(collection(db, 'leads'), leadData);
            console.log('Lead saved with ID: ', docRef.id);

            // Save to localStorage for form persistence
            const consultationData = {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                bestTimeToCall
            };
            localStorage.setItem('consultationData', JSON.stringify(consultationData));

            setSubmitted(true);

            // Optional: Clear form after successful submission
            // You can uncomment this if you want to clear the form
            // resetForm();

        } catch (error) {
            console.error('Error saving lead: ', error);
            setErrors({
                submit: 'Failed to save your information. Please try again.'
            });
        } finally {
            setSaving(false);
        }
    };

    // Calculate system summary from home details
    const calculateSystemSummary = (homeData) => {
        let deviceCount = 0;
        const devices = [];

        // Door contact sensors
        if (homeData.doorCount > 0) {
            deviceCount += homeData.doorCount;
            devices.push(`${homeData.doorCount} Door Sensors`);
        }

        // Glass break detectors
        if (homeData.windowRoomCount > 0) {
            deviceCount += homeData.windowRoomCount;
            devices.push(`${homeData.windowRoomCount} Glass Break Detectors`);
        }

        // Motion detector
        if (!homeData.hasDogs && !homeData.homeOften) {
            deviceCount += 1;
            devices.push('1 Motion Detector');
        }

        // Doorbell camera
        if (homeData.frequentVisitors || homeData.frequentPackages) {
            deviceCount += 1;
            devices.push('1 Doorbell Camera');
        }

        // Safety detectors
        if (homeData.hasGasAppliances) {
            deviceCount += 1;
            devices.push('1 CO Detector');
        } else {
            deviceCount += 1;
            devices.push('1 Smoke/Carbon Combo Detector');
        }

        // Connected door lock
        if (homeData.outsideVisitors) {
            deviceCount += 1;
            devices.push('1 Smart Door Lock');
        }

        // Thermostat integration
        if (homeData.connectThermostat) {
            deviceCount += 1;
            devices.push('1 Thermostat Integration');
        }

        // Surveillance cameras
        if (homeData.cameras) {
            let cameraCount = 0;
            Object.values(homeData.cameras).forEach(selected => {
                if (selected) cameraCount++;
            });
            if (cameraCount > 0) {
                deviceCount += cameraCount;
                devices.push(`${cameraCount} Surveillance Camera${cameraCount > 1 ? 's' : ''}`);
            }
        }

        const estimatedCost = deviceCount > 0 ? (deviceCount * 5) + 20 : 0;

        return {
            totalDevices: deviceCount,
            deviceList: devices,
            estimatedCost,
            monthlyCost: estimatedCost
        };
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
                            disabled={saving}
                            className={`w-full px-4 py-3 border-2 ${errors.name ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50`}
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
                            disabled={saving}
                            className={`w-full px-4 py-3 border-2 ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50`}
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
                            disabled={saving}
                            className={`w-full px-4 py-3 border-2 ${errors.phone ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50`}
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
                            disabled={saving}
                            className={`w-full px-4 py-3 border-2 ${errors.bestTimeToCall ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50`}
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

                {/* Error message for submission */}
                {errors.submit && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <p className="text-red-700">{errors.submit}</p>
                    </div>
                )}

                <TurnstileWidget
                    onVerify={setTurnstileToken}
                    onError={() => setTurnstileToken(null)}
                />

                {/* Submit Button */}
                <div className="flex justify-between">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {saving ? (
                            <>
                                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                                Saving...
                            </>
                        ) : submitted ? (
                            'Update Information'
                        ) : (
                            'Schedule Consultation'
                        )}
                    </button>

                    {submitted && !saving && (
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
                        Thank you for scheduling a consultation! We've saved your information and will contact you soon to confirm your appointment.
                    </p>
                </div>
            )}
        </div>
    );
}