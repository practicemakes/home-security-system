import { useState } from 'react';

export default function PropertyForm() {
    const [address, setAddress] = useState('');
    const [propertyType, setPropertyType] = useState('single-family');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const mockPropertyData = {
        images: [
            { id: 1, title: 'Front View', url: '/api/placeholder/300/200' },
            { id: 2, title: 'Back Yard', url: '/api/placeholder/300/200' },
            { id: 3, title: 'Side Entrance', url: '/api/placeholder/300/200' },
            { id: 4, title: 'Garage', url: '/api/placeholder/300/200' },
            { id: 5, title: 'Living Room', url: '/api/placeholder/300/200' },
            { id: 6, title: 'Kitchen', url: '/api/placeholder/300/200' }
        ],
        details: {
            bedrooms: 3,
            bathrooms: 2,
            sqft: 1850,
            yearBuilt: 2015,
            lot: '0.25 acres',
            stories: 2,
            garage: '2-car attached'
        },
        crime: {
            violent: 320,
            property: 1800,
            burglary: 280,
            theft: 1200,
            overall: 'Moderate Risk'
        }
    };

    const analyzeProperty = async () => {
        if (!address.trim()) {
            alert('Please enter a property address');
            return;
        }

        setLoading(true);

        // Simulate API calls to Zillow and crime databases
        setTimeout(() => {
            setResults(mockPropertyData);
            setLoading(false);
        }, 3000);
    };

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Property Address
                    </label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="123 Main St, City, State, ZIP"
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Property Type
                    </label>
                    <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    >
                        <option value="single-family">Single Family Home</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="condo">Condominium</option>
                        <option value="apartment">Apartment</option>
                        <option value="commercial">Commercial Property</option>
                    </select>
                </div>
            </div>

            <button
                onClick={analyzeProperty}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
                {loading ? '🔍 Analyzing Property...' : '📊 Analyze Property & Get Images'}
            </button>

            {loading && (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-4 text-slate-600">Fetching property images and crime data...</p>
                </div>
            )}

            {results && (
                <div className="space-y-8 mt-8">
                    {/* Property Images */}
                    <div className="bg-slate-50 rounded-2xl p-6">
                        <h3 className="text-xl font-semibold text-slate-800 mb-4">📸 Property Images</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {results.images.map((image) => (
                                <div key={image.id} className="bg-white rounded-xl p-4 text-center border border-slate-200">
                                    <div className="w-full h-32 bg-slate-200 rounded-lg mb-3 flex items-center justify-center text-slate-500">
                                        📷 {image.title}
                                    </div>
                                    <p className="text-sm font-medium text-slate-700">{image.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Crime Analysis */}
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-2xl p-6">
                        <h3 className="text-xl font-semibold text-slate-800 mb-4">🚨 Crime Analysis</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="font-medium">Violent Crime Rate:</span>
                                    <span className="text-red-600 font-semibold">{results.crime.violent}/100k</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Property Crime Rate:</span>
                                    <span className="text-red-600 font-semibold">{results.crime.property}/100k</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Burglary Rate:</span>
                                    <span className="text-red-600 font-semibold">{results.crime.burglary}/100k</span>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-4">
                                <h4 className="font-semibold text-slate-800 mb-2">Risk Assessment</h4>
                                <p className="text-orange-600 font-semibold text-lg">{results.crime.overall}</p>
                                <p className="text-sm text-slate-600 mt-2">
                                    Higher than average property crime rates suggest enhanced security measures recommended.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Property Details */}
                    <div className="bg-blue-50 rounded-2xl p-6">
                        <h3 className="text-xl font-semibold text-slate-800 mb-4">🏠 Property Details</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            {Object.entries(results.details).map(([key, value]) => (
                                <div key={key} className="bg-white rounded-lg p-4 text-center">
                                    <p className="text-sm text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                    <p className="text-lg font-semibold text-slate-800">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
