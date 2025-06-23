import { useState, useRef, useEffect } from 'react';

export default function FloorPlanDesigner() {
    const canvasRef = useRef(null);
    const [currentTool, setCurrentTool] = useState('room');
    const [isDrawing, setIsDrawing] = useState(false);
    const [elements, setElements] = useState([]);
    const [planNotes, setPlanNotes] = useState('');

    const tools = [
        { id: 'room', name: 'Add Room', icon: '🏠' },
        { id: 'door', name: 'Add Door', icon: '🚪' },
        { id: 'window', name: 'Add Window', icon: '🪟' },
        { id: 'camera', name: 'Camera', icon: '📹' },
        { id: 'sensor', name: 'Sensor', icon: '🚨' },
        { id: 'motion', name: 'Motion', icon: '👁️' },
        { id: 'keypad', name: 'Keypad', icon: '🔢' }
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas size
        canvas.width = 800;
        canvas.height = 500;

        // Draw grid
        drawGrid(ctx);
        drawElements(ctx);
    }, [elements]);

    const drawGrid = (ctx) => {
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;

        // Draw grid lines
        for (let x = 0; x <= 800; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 500);
            ctx.stroke();
        }

        for (let y = 0; y <= 500; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(800, y);
            ctx.stroke();
        }
    };

    const drawElements = (ctx) => {
        elements.forEach(element => {
            ctx.fillStyle = element.color || '#3b82f6';
            ctx.strokeStyle = '#1e40af';
            ctx.lineWidth = 2;

            if (element.type === 'room') {
                ctx.fillRect(element.x, element.y, element.width, element.height);
                ctx.strokeRect(element.x, element.y, element.width, element.height);
            } else {
                // Draw device icons
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.arc(element.x, element.y, 15, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();

                // Add icon text
                ctx.fillStyle = 'white';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(getToolIcon(element.type), element.x, element.y + 4);
            }
        });
    };

    const getToolIcon = (type) => {
        const tool = tools.find(t => t.id === type);
        return tool ? tool.icon : '?';
    };

    const handleCanvasClick = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (currentTool === 'room') {
            // For rooms, we'll create a default 100x80 rectangle
            const newElement = {
                id: Date.now(),
                type: 'room',
                x: Math.round(x / 20) * 20,
                y: Math.round(y / 20) * 20,
                width: 100,
                height: 80,
                color: 'rgba(59, 130, 246, 0.3)'
            };
            setElements([...elements, newElement]);
        } else {
            // For devices, place at click location
            const newElement = {
                id: Date.now(),
                type: currentTool,
                x: Math.round(x / 20) * 20,
                y: Math.round(y / 20) * 20
            };
            setElements([...elements, newElement]);
        }
    };

    const clearPlan = () => {
        setElements([]);
    };

    const savePlan = () => {
        const planData = {
            elements: elements,
            notes: planNotes,
            timestamp: new Date().toISOString()
        };

        // In a real app, this would save to a database
        console.log('Saving floor plan:', planData);
        alert('Floor plan saved successfully!');
    };

    return (
        <div className="space-y-6">
            {/* Tool Selection */}
            <div className="flex flex-wrap gap-3">
                {tools.map(tool => (
                    <button
                        key={tool.id}
                        onClick={() => setCurrentTool(tool.id)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                            currentTool === tool.id
                                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                    >
                        {tool.icon} {tool.name}
                    </button>
                ))}
                <button
                    onClick={clearPlan}
                    className="px-4 py-2 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                    🗑️ Clear All
                </button>
            </div>

            {/* Canvas */}
            <div className="border-2 border-slate-300 rounded-2xl overflow-hidden bg-white shadow-inner">
                <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    className="cursor-crosshair w-full"
                    style={{ maxWidth: '100%', height: 'auto' }}
                />
            </div>

            {/* Plan Notes */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Security Plan Notes
                </label>
                <textarea
                    value={planNotes}
                    onChange={(e) => setPlanNotes(e.target.value)}
                    rows={4}
                    placeholder="Add notes about your security recommendations..."
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
            </div>

            {/* Save Button */}
            <button
                onClick={savePlan}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105"
            >
                💾 Save Floor Plan
            </button>

            {/* Current Plan Summary */}
            {elements.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-6">
                    <h4 className="font-semibold text-slate-800 mb-3">Current Plan Summary</h4>
                    <div className="text-sm text-slate-600">
                        <p>Elements: {elements.length}</p>
                        <p>Rooms: {elements.filter(e => e.type === 'room').length}</p>
                        <p>Security Devices: {elements.filter(e => e.type !== 'room' && e.type !== 'door' && e.type !== 'window').length}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
