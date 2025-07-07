import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase.js';

export default function LeadsDashboard({ user }) {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (user) {
            fetchLeads();
        }
    }, [user]);

    const fetchLeads = async () => {
        try {
            const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const leadsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLeads(leadsData);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateLeadStatus = async (leadId, newStatus) => {
        try {
            const leadRef = doc(db, 'leads', leadId);
            await updateDoc(leadRef, {
                status: newStatus,
                updatedAt: new Date()
            });

            // Update local state
            setLeads(leads.map(lead =>
                lead.id === leadId
                    ? { ...lead, status: newStatus }
                    : lead
            ));
        } catch (error) {
            console.error('Error updating lead:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800';
            case 'contacted': return 'bg-yellow-100 text-yellow-800';
            case 'qualified': return 'bg-green-100 text-green-800';
            case 'closed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredLeads = filter === 'all'
        ? leads
        : leads.filter(lead => lead.status === filter);

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-2 text-slate-600">Loading leads...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Leads Dashboard</h2>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-600">Total: {leads.length}</span>
                    <button
                        onClick={fetchLeads}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {['all', 'new', 'contacted', 'qualified', 'closed'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                            filter === status
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                    >
                        {status} {status !== 'all' && `(${leads.filter(l => l.status === status).length})`}
                    </button>
                ))}
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {filteredLeads.length === 0 ? (
                    <div className="p-8 text-center text-slate-600">
                        No leads found for the selected filter.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Contact Info
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Home Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    System Summary
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Date
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                            {filteredLeads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-900">
                                            {lead.consultationData?.name || 'N/A'}
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            {lead.consultationData?.email || 'N/A'}
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            {lead.consultationData?.phone || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-900">
                                            {lead.homeDetailsData?.doorCount || 0} doors, {lead.homeDetailsData?.windowRoomCount || 0} window rooms
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            {lead.homeDetailsData?.hasDogs && 'Has dogs, '}
                                            {lead.homeDetailsData?.homeOften && 'Home often'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-900">
                                            {lead.systemSummary?.totalDevices || 0} devices
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            ${lead.systemSummary?.estimatedCost || 0}/month
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={lead.status || 'new'}
                                            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                            className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(lead.status || 'new')}`}
                                        >
                                            <option value="new">New</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="qualified">Qualified</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {lead.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}