import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase.js';
import LoginForm from './LoginForm.jsx';
import LeadsDashboard from './LeadsDashboard.jsx';

export default function AdminDashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('leads');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-4 text-white">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-md mx-auto">
                <LoginForm user={user} onAuthChange={setUser} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* User Info */}
            <LoginForm user={user} onAuthChange={setUser} />

            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl shadow-xl border border-white/20">
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('leads')}
                        className={`px-6 py-4 font-medium transition-colors ${
                            activeTab === 'leads'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-slate-600 hover:text-slate-800'
                        }`}
                    >
                        📋 Leads ({user ? 'Loading...' : '0'})
                    </button>
                    <button
                        onClick={() => setActiveTab('blog')}
                        className={`px-6 py-4 font-medium transition-colors ${
                            activeTab === 'blog'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-slate-600 hover:text-slate-800'
                        }`}
                    >
                        📝 Blog Management
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`px-6 py-4 font-medium transition-colors ${
                            activeTab === 'analytics'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-slate-600 hover:text-slate-800'
                        }`}
                    >
                        📊 Analytics
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === 'leads' && <LeadsDashboard user={user} />}

                    {activeTab === 'blog' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800">Blog Management</h3>
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                <p className="text-blue-700">
                                    To manage blog posts, visit the{' '}
                                    <a
                                        href="/admin/index.html"
                                        target="_blank"
                                        className="font-medium underline hover:no-underline"
                                    >
                                        TinaCMS editor
                                    </a>
                                </p>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <h4 className="font-medium text-slate-800 mb-2">Quick Actions</h4>
                                    <div className="space-y-2">
                                        <a
                                            href="/admin/index.html#/collections/posts"
                                            target="_blank"
                                            className="block text-blue-600 hover:text-blue-800"
                                        >
                                            → Create New Blog Post
                                        </a>
                                        <a
                                            href="/posts"
                                            target="_blank"
                                            className="block text-blue-600 hover:text-blue-800"
                                        >
                                            → View Published Posts
                                        </a>
                                    </div>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-4">
                                    <h4 className="font-medium text-slate-800 mb-2">SEO Tips</h4>
                                    <ul className="text-sm text-slate-600 space-y-1">
                                        <li>• Use keywords in titles</li>
                                        <li>• Write detailed descriptions</li>
                                        <li>• Include relevant tags</li>
                                        <li>• Add hero images</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-800">Analytics Overview</h3>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="bg-blue-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-600">--</div>
                                    <div className="text-sm text-slate-600">Total Visitors</div>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-green-600">--</div>
                                    <div className="text-sm text-slate-600">Assessments Started</div>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-purple-600">--</div>
                                    <div className="text-sm text-slate-600">Conversion Rate</div>
                                </div>
                            </div>
                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                                <p className="text-yellow-700">
                                    Connect Google Analytics for detailed visitor insights.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}