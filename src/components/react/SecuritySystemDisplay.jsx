import { useState, useEffect } from 'react';

export default function SecuritySystemDisplay() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [homeData, setHomeData] = useState(null);
    const [emailSent, setEmailSent] = useState(false);

    useEffect(() => {
        // Load data from localStorage
        const savedData = localStorage.getItem('homeDetailsData');

        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setHomeData(parsedData);

            // Generate recommendations based on the data
            const newRecommendations = generateRecommendations(parsedData);
            setRecommendations(newRecommendations);
        } else {
            // No data found
            setRecommendations([
                {
                    id: 'no-data',
                    title: 'No Home Details Found',
                    description: 'Please complete the Home Details questionnaire to get security system recommendations.',
                    icon: '⚠️',
                    count: 0,
                    color: 'yellow'
                }
            ]);
        }

        setLoading(false);
    }, []);

    // Function to generate recommendations based on home details
    const generateRecommendations = (data) => {
        const recs = [];

        // Door contact sensors based on door count
        if (data.doorCount > 0) {
            recs.push({
                id: 'door-sensors',
                title: 'Door Contact Sensors',
                description: 'Detects when doors are opened or closed.',
                icon: '🚪',
                count: data.doorCount,
                color: 'blue'
            });
        }

        // Glass break detectors based on window room count
        if (data.windowRoomCount > 0) {
            recs.push({
                id: 'glass-break',
                title: 'Glass Break Detectors',
                description: 'Detects the sound of breaking glass.',
                icon: '🪟',
                count: data.windowRoomCount,
                color: 'green'
            });
        }

        // Motion detector based on dogs and home occupancy
        if (!data.hasDogs && !data.homeOften) {
            recs.push({
                id: 'motion',
                title: 'Motion Detector',
                description: 'Detects movement in your home when you\'re away.',
                icon: '👁️',
                count: 1,
                color: 'purple'
            });
        }

        // Doorbell camera based on visitors and packages
        if (data.frequentVisitors || data.frequentPackages) {
            recs.push({
                id: 'doorbell',
                title: 'Doorbell Camera',
                description: 'See and speak with visitors at your door.',
                icon: '🔔',
                count: 1,
                color: 'blue'
            });
        }

        // CO detector or smoke/carbon combo based on gas appliances
        if (data.hasGasAppliances) {
            recs.push({
                id: 'co-detector',
                title: 'CO Detector',
                description: 'Detects carbon monoxide gas on your main floor.',
                icon: '☢️',
                count: 1,
                color: 'red'
            });
        } else {
            recs.push({
                id: 'smoke-carbon',
                title: 'Smoke/Carbon Combo Detector',
                description: 'Detects both smoke and carbon monoxide.',
                icon: '🔥',
                count: 1,
                color: 'orange'
            });
        }

        // Connected door lock based on outside visitors
        if (data.outsideVisitors) {
            recs.push({
                id: 'door-lock',
                title: 'Connected Door Lock',
                description: 'Control access to your home remotely.',
                icon: '🔒',
                count: 1,
                color: 'indigo'
            });
        }

        // Thermostat integration
        if (data.connectThermostat) {
            recs.push({
                id: 'thermostat',
                title: 'Thermostat Integration',
                description: 'Connect your WiFi thermostat to your security system.',
                icon: '🌡️',
                count: 1,
                color: 'teal'
            });
        }

        // Surveillance cameras based on selected locations
        let cameraCount = 0;
        for (const location in data.cameras) {
            if (data.cameras[location]) {
                cameraCount++;
            }
        }

        if (cameraCount > 0) {
            recs.push({
                id: 'cameras',
                title: 'Surveillance Cameras',
                description: 'Monitor selected areas around your home.',
                icon: '📹',
                count: cameraCount,
                color: 'gray'
            });
        }

        return recs;
    };

    // Calculate total number of devices
    const totalDevices = recommendations.reduce((sum, rec) => sum + rec.count, 0);

    // Calculate estimated monthly cost ($5 per device plus $20 base)
    const estimatedMonthlyCost = totalDevices > 0 ? (totalDevices * 5) + 20 : 0;

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-4 text-slate-600">Loading your security recommendations...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {homeData ? (
                <>
                    <div className="bg-blue-50 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-slate-800 mb-4">Your Security System Recommendations</h3>
                        <p className="text-slate-600 mb-4">
                            Based on your home details, we recommend the following security components:
                        </p>

                        <div className="grid gap-4 md:grid-cols-2">
                            {recommendations.map((rec) => {
                                // Map color to specific Tailwind classes
                                const bgColorClass = `bg-${rec.color === 'blue' ? 'blue' : 
                                                        rec.color === 'green' ? 'green' : 
                                                        rec.color === 'red' ? 'red' : 
                                                        rec.color === 'yellow' ? 'yellow' : 
                                                        rec.color === 'purple' ? 'purple' : 
                                                        rec.color === 'orange' ? 'orange' : 
                                                        rec.color === 'indigo' ? 'indigo' : 
                                                        rec.color === 'teal' ? 'teal' : 'gray'}-50`;

                                const borderColorClass = `border-${rec.color === 'blue' ? 'blue' : 
                                                            rec.color === 'green' ? 'green' : 
                                                            rec.color === 'red' ? 'red' : 
                                                            rec.color === 'yellow' ? 'yellow' : 
                                                            rec.color === 'purple' ? 'purple' : 
                                                            rec.color === 'orange' ? 'orange' : 
                                                            rec.color === 'indigo' ? 'indigo' : 
                                                            rec.color === 'teal' ? 'teal' : 'gray'}-500`;

                                return (
                                    <div key={rec.id} className={`${bgColorClass} border-l-4 ${borderColorClass} rounded-lg p-4 flex items-start`}>
                                        <div className="text-2xl mr-3">{rec.icon}</div>
                                        <div>
                                            <h4 className="font-semibold text-slate-800">
                                                {rec.title} {rec.count > 1 && <span className="text-blue-600">({rec.count})</span>}
                                            </h4>
                                            <p className="text-sm text-slate-600">{rec.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {totalDevices > 0 && (
                        <div className="bg-green-50 rounded-xl p-6">
                            <h3 className="text-xl font-semibold text-slate-800 mb-4">System Summary</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-lg p-4 text-center">
                                    <p className="text-sm text-slate-600">Total Devices</p>
                                    <p className="text-3xl font-bold text-blue-600">{totalDevices}</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 text-center">
                                    <p className="text-sm text-slate-600">Estimated Monthly Cost</p>
                                    <p className="text-3xl font-bold text-green-600">${estimatedMonthlyCost}</p>
                                    <p className="text-xs text-slate-500 mt-1">$20 base + $5 per device</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-slate-50 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-slate-800 mb-4">Next Steps</h3>
                        <p className="text-slate-600 mb-4">
                            Proceed to the Consultation tab to schedule a professional consultation and installation.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button 
                                onClick={() => {
                                    const consultationTab = document.querySelector('[data-tab="consultation"]');
                                    if (consultationTab) {
                                        consultationTab.click();
                                    }
                                }}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                            >
                                Schedule Consultation
                            </button>
                            <button 
                                onClick={() => {
                                    // In a real implementation, this would send an email
                                    // For now, we'll just set the emailSent state to true
                                    setEmailSent(true);

                                    // Reset the state after 5 seconds
                                    setTimeout(() => {
                                        setEmailSent(false);
                                    }, 5000);
                                }}
                                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center gap-2"
                            >
                                <span>📧</span> Email Myself a Copy
                            </button>
                        </div>

                        {emailSent && (
                            <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                                <p className="text-green-700">
                                    A copy of your security system recommendations has been sent to your email!
                                </p>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">No Home Details Found</h3>
                    <p className="text-slate-600 mb-4">
                        Please complete the Home Details questionnaire to get personalized security system recommendations.
                    </p>
                    <button 
                        onClick={() => {
                            const homeDetailsTab = document.querySelector('[data-tab="home-details"]');
                            if (homeDetailsTab) {
                                homeDetailsTab.click();
                            }
                        }}
                        className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-all duration-300"
                    >
                        Go to Home Details
                    </button>
                </div>
            )}
        </div>
    );
}
