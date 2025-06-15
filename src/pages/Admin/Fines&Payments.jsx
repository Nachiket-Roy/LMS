import React, { useState, useEffect } from 'react';
import {
    FaSearch as Search,
    FaFilter as Filter,
    FaDownload as Download,
    FaEye as Eye,
    FaCalendarAlt as Calendar,
    FaDollarSign as DollarSign,
    FaExclamationCircle as AlertCircle,
    FaCheckCircle as CheckCircle,
    FaPrint as Print
} from 'react-icons/fa';
import { getAllFines, getAllPayments } from '../../services/adminApi';

const AdminFinesPayments = () => {
    const [activeTab, setActiveTab] = useState('fines');
    const [fines, setFines] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [finesResponse, paymentsResponse] = await Promise.all([
                getAllFines(),
                getAllPayments()
            ]);

            const transformedFines = finesResponse.data.data.map(fine => ({
                id: fine._id,
                studentId: fine.user_id?._id || 'N/A',
                studentName: fine.user_id?.name || 'Unknown',
                amount: fine.amount,
                reason: fine.reason || (fine.book_id ? `Late return: ${fine.book_id.title}` : 'Fine'),
                status: fine.status,
                date: new Date(fine.createdAt).toISOString().split('T')[0],
                dueDate: fine.dueDate ? new Date(fine.dueDate).toISOString().split('T')[0] : 'N/A'
            }));

            const transformedPayments = paymentsResponse.data.data.map(payment => ({
                id: payment._id,
                studentId: payment.user_id?._id || 'N/A',
                studentName: payment.user_id?.name || 'Unknown',
                amount: payment.amount,
                method: payment.method,
                transactionId: payment.transactionId || 'N/A',
                status: payment.status,
                date: new Date(payment.createdAt).toISOString().split('T')[0]
            }));

            setFines(transformedFines);
            setPayments(transformedPayments);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterData = (data, type) => {
        return data.filter(item => {
            const matchesSearch = item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.studentId.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'overdue':
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'paid':
            case 'completed':
                return <CheckCircle className="w-4 h-4" />;
            case 'overdue':
            case 'failed':
                return <AlertCircle className="w-4 h-4" />;
            default:
                return <Calendar className="w-4 h-4" />;
        }
    };

    const calculateTotals = (data, type) => {
        const total = data.reduce((sum, item) => sum + item.amount, 0);
        const completed = data.filter(item =>
            type === 'fines' ? item.status === 'paid' : item.status === 'completed'
        ).length;
        const pending = data.filter(item => item.status === 'pending').length;

        return { total, completed, pending };
    };

    const handleExport = () => {
        // Add print-specific styles
        const printStyles = `
            <style>
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-area, .print-area * {
                        visibility: visible;
                    }
                    .print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .print-table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    .print-table th,
                    .print-table td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    .print-table th {
                        background-color: #f5f5f5;
                        font-weight: bold;
                    }
                    .print-header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .print-stats {
                        display: flex;
                        justify-content: space-around;
                        margin-bottom: 20px;
                        border: 1px solid #ddd;
                        padding: 10px;
                    }
                    .print-stat {
                        text-align: center;
                    }
                }
            </style>
        `;

        // Add the styles to the document head
        const styleElement = document.createElement('div');
        styleElement.innerHTML = printStyles;
        document.head.appendChild(styleElement);

        // Add print-area class to the main content
        const printArea = document.querySelector('.main-content');
        if (printArea) {
            printArea.classList.add('print-area');
        }

        // Trigger print
        window.print();

        // Clean up
        setTimeout(() => {
            if (printArea) {
                printArea.classList.remove('print-area');
            }
            document.head.removeChild(styleElement);
        }, 1000);
    };

    const fineStats = calculateTotals(fines, 'fines');
    const paymentStats = calculateTotals(payments, 'payments');

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto main-content">
                {/* Header */}
                <div className="mb-8 print-header">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Management</h1>
                    <p className="text-gray-600">Manage student fines and track payments</p>
                    <p className="text-sm text-gray-500 no-print">Generated on: {new Date().toLocaleDateString()}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 print-stats">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 print-stat">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Fines</p>
                                <p className="text-2xl font-bold text-gray-900">₹{fineStats.total}</p>
                            </div>
                            <div className="bg-red-100 p-3 rounded-lg no-print">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 print-stat">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                                <p className="text-2xl font-bold text-gray-900">₹{paymentStats.total}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg no-print">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 print-stat">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Paid Fines</p>
                                <p className="text-2xl font-bold text-gray-900">{fineStats.completed}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg no-print">
                                <CheckCircle className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 print-stat">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Items</p>
                                <p className="text-2xl font-bold text-gray-900">{fineStats.pending + paymentStats.pending}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-lg no-print">
                                <Calendar className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="border-b border-gray-200 no-print">
                        <nav className="flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('fines')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'fines'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Student Fines ({fines.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('payments')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'payments'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Payment History ({payments.length})
                            </button>
                        </nav>
                    </div>

                    {/* Filters */}
                    <div className="p-6 border-b border-gray-200 no-print">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search by student name or ID..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="completed">Completed</option>
                                    <option value="overdue">Overdue</option>
                                    <option value="failed">Failed</option>
                                </select>
                                <button 
                                    onClick={handleExport}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <Print className="w-4 h-4" />
                                    Export/Print
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Print-only header */}
                    <div className="hidden print:block p-4 text-center border-b">
                        <h2 className="text-xl font-bold">
                            {activeTab === 'fines' ? 'Student Fines Report' : 'Payment History Report'}
                        </h2>
                        <p className="text-sm text-gray-600">
                            Filters Applied: {statusFilter !== 'all' ? `Status: ${statusFilter}` : 'All Records'}
                            {searchTerm && ` | Search: "${searchTerm}"`}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {activeTab === 'fines' ? (
                            <div className="overflow-x-auto">
                                <table className="w-full print-table">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Student</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Reason</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Issue Date</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Due Date</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 no-print">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filterData(fines, 'fines').map((fine) => (
                                            <tr key={fine.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{fine.studentName}</div>
                                                        <div className="text-sm text-gray-500">{fine.studentId}</div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 font-semibold text-gray-900">₹{fine.amount}</td>
                                                <td className="py-4 px-4 text-gray-700">{fine.reason}</td>
                                                <td className="py-4 px-4 text-gray-600">{fine.date}</td>
                                                <td className="py-4 px-4 text-gray-600">{fine.dueDate}</td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(fine.status)}`}>
                                                        <span className="no-print">{getStatusIcon(fine.status)}</span>
                                                        {fine.status.charAt(0).toUpperCase() + fine.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 no-print">
                                                    <button
                                                        onClick={() => {
                                                            alert("Action not Available")
                                                        }} 
                                                        className="text-blue-600 hover:text-blue-800 transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full print-table">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Student</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Payment Method</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Transaction ID</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                                            <th className="text-left py-3 px-4 font-medium text-gray-700 no-print">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filterData(payments, 'payments').map((payment) => (
                                            <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{payment.studentName}</div>
                                                        <div className="text-sm text-gray-500">{payment.studentId}</div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 font-semibold text-gray-900">₹{payment.amount}</td>
                                                <td className="py-4 px-4 text-gray-700">{payment.method}</td>
                                                <td className="py-4 px-4 text-sm text-gray-600 font-mono">{payment.transactionId}</td>
                                                <td className="py-4 px-4 text-gray-600">{payment.date}</td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                                        <span className="no-print">{getStatusIcon(payment.status)}</span>
                                                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 no-print">
                                                    <button className="text-blue-600 hover:text-blue-800 transition-colors">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminFinesPayments;  