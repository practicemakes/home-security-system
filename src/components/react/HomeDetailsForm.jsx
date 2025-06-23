import { useState, useEffect } from 'react';

export default function HomeDetailsForm() {
    // State for form inputs
    const [doorCount, setDoorCount] = useState(0);
    const [windowRoomCount, setWindowRoomCount] = useState(0);
    const [hasDogs, setHasDogs] = useState(false);
    const [homeOften, setHomeOften] = useState(false);
    const [frequentVisitors, setFrequentVisitors] = useState(false);
    const [frequentPackages, setFrequentPackages] = useState(false);
    const [hasGasAppliances, setHasGasAppliances] = useState(false);
    const [outsideVisitors, setOutsideVisitors] = useState(false);
    const [connectThermostat, setConnectThermostat] = useState(false);
    const [cameras, setCameras] = useState({
        frontDoor: false,
        garageDoor: false,
        leftSide: false,
        rightSide: false,
        backyard: false
    });
    const [submitted, setSubmitted] = useState(false);

    // Load saved data from localStorage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem('homeDetailsData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setDoorCount(parsedData.doorCount || 0);
            setWindowRoomCount(parsedData.windowRoomCount || 0);
            setHasDogs(parsedData.hasDogs || false);
            setHomeOften(parsedData.homeOften || false);
            setFrequentVisitors(parsedData.frequentVisitors || false);
            setFrequentPackages(parsedData.frequentPackages || false);
            setHasGasAppliances(parsedData.hasGasAppliances || false);
            setOutsideVisitors(parsedData.outsideVisitors || false);
            setConnectThermostat(parsedData.connectThermostat || false);
            setCameras(parsedData.cameras || {
                frontDoor: false,
                garageDoor: false,
                leftSide: false,
                rightSide: false,
                backyard: false
            });
            setSubmitted(true);
        }
    }, []);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Create data object
        const homeDetailsData = {
            doorCount,
            windowRoomCount,
            hasDogs,
            homeOften,
            frequentVisitors,
            frequentPackages,
            hasGasAppliances,
            outsideVisitors,
            connectThermostat,
            cameras
        };
        
        // Save to localStorage
        localStorage.setItem('homeDetailsData', JSON.stringify(homeDetailsData));
        setSubmitted(true);
        
        // Scroll to the next tab
        const securitySystemTab = document.querySelector('[data-tab="security-system"]');
        if (securitySystemTab) {
            securitySystemTab.click();
        }
    };

    // Handle camera checkbox changes
    const handleCameraChange = (location) => {
        setCameras(prev => ({
            ...prev,
            [location]: !prev[location]
        }));
    };

    // Reset form
    const resetForm = () => {
        setDoorCount(0);
        setWindowRoomCount(0);
        setHasDogs(false);
        setHomeOften(false);
        setFrequentVisitors(false);
        setFrequentPackages(false);
        setHasGasAppliances(false);
        setOutsideVisitors(false);
        setConnectThermostat(false);
        setCameras({
            frontDoor: false,
            garageDoor: false,
            leftSide: false,
            rightSide: false,
            backyard: false
        });
        localStorage.removeItem('homeDetailsData');
        setSubmitted(false);
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Doors and Windows */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            How many exterior doors does your home have?
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={doorCount}
                            onChange={(e) => setDoorCount(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        />
                        <p className="text-sm text-slate-500 mt-1">This will determine the number of door contact sensors needed.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            How many rooms have windows?
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={windowRoomCount}
                            onChange={(e) => setWindowRoomCount(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                        />
                        <p className="text-sm text-slate-500 mt-1">This will determine the number of glass break detectors needed.</p>
                    </div>
                </div>

                {/* Pets and Home Occupancy */}
                <div className="bg-slate-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Pets and Home Occupancy</h3>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="hasDogs"
                                checked={hasDogs}
                                onChange={() => setHasDogs(!hasDogs)}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="hasDogs" className="ml-2 text-slate-700">
                                Do you have dogs?
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="homeOften"
                                checked={homeOften}
                                onChange={() => setHomeOften(!homeOften)}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="homeOften" className="ml-2 text-slate-700">
                                Are you home a lot?
                            </label>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                            If both answers are NO, we'll recommend a motion detector. Otherwise, no motion detector will be needed.
                        </p>
                    </div>
                </div>

                {/* Visitors and Packages */}
                <div className="bg-slate-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Visitors and Packages</h3>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="frequentVisitors"
                                checked={frequentVisitors}
                                onChange={() => setFrequentVisitors(!frequentVisitors)}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="frequentVisitors" className="ml-2 text-slate-700">
                                Do you have a lot of people come to your door?
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="frequentPackages"
                                checked={frequentPackages}
                                onChange={() => setFrequentPackages(!frequentPackages)}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="frequentPackages" className="ml-2 text-slate-700">
                                Do you get a lot of packages delivered to your porch?
                            </label>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                            If either answer is YES, we'll recommend a doorbell camera.
                        </p>
                    </div>
                </div>

                {/* Home Safety */}
                <div className="bg-slate-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Home Safety</h3>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="hasGasAppliances"
                                checked={hasGasAppliances}
                                onChange={() => setHasGasAppliances(!hasGasAppliances)}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="hasGasAppliances" className="ml-2 text-slate-700">
                                Do you have gas appliances?
                            </label>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                            If YES, we'll recommend a CO detector for the main floor. If NO, we'll recommend a smoke/carbon combo detector.
                        </p>
                    </div>
                </div>

                {/* Access Control */}
                <div className="bg-slate-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Access Control</h3>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="outsideVisitors"
                                checked={outsideVisitors}
                                onChange={() => setOutsideVisitors(!outsideVisitors)}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="outsideVisitors" className="ml-2 text-slate-700">
                                Does anyone outside your family visit often?
                            </label>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                            If YES, we'll recommend a connected door lock.
                        </p>
                    </div>
                </div>

                {/* Smart Home Integration */}
                <div className="bg-slate-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Smart Home Integration</h3>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="connectThermostat"
                                checked={connectThermostat}
                                onChange={() => setConnectThermostat(!connectThermostat)}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="connectThermostat" className="ml-2 text-slate-700">
                                Would you want access to your wifi connected thermostat via your security system?
                            </label>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                            If YES, we'll recommend connecting your thermostat to the security system.
                        </p>
                    </div>
                </div>

                {/* Surveillance Cameras */}
                <div className="bg-slate-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Surveillance Cameras</h3>
                    <p className="text-sm text-slate-600 mb-4">
                        Select the areas you'd like to cover with surveillance cameras (one camera per selection):
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="frontDoor"
                                checked={cameras.frontDoor}
                                onChange={() => handleCameraChange('frontDoor')}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="frontDoor" className="ml-2 text-slate-700">
                                Front Door
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="garageDoor"
                                checked={cameras.garageDoor}
                                onChange={() => handleCameraChange('garageDoor')}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="garageDoor" className="ml-2 text-slate-700">
                                Garage Door
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="leftSide"
                                checked={cameras.leftSide}
                                onChange={() => handleCameraChange('leftSide')}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="leftSide" className="ml-2 text-slate-700">
                                Left Side of Home
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="rightSide"
                                checked={cameras.rightSide}
                                onChange={() => handleCameraChange('rightSide')}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="rightSide" className="ml-2 text-slate-700">
                                Right Side of Home
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="backyard"
                                checked={cameras.backyard}
                                onChange={() => handleCameraChange('backyard')}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="backyard" className="ml-2 text-slate-700">
                                Backyard
                            </label>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
                    >
                        {submitted ? 'Update Home Details' : 'Submit Home Details'}
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
                        Your home details have been saved! Please proceed to the Security System tab to see your recommended security components.
                    </p>
                </div>
            )}
        </div>
    );
}