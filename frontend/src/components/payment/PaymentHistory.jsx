import React, { useEffect } from 'react';
import { usePaymentStore } from '../../stores/usePaymentStore.js';

const PaymentHistory = ({ userId }) => {
    const {
        paymentHistory,
        loading,
        error,
        getPaymentHistory,
        cancelPayment
    } = usePaymentStore();

    useEffect(() => {
        if (userId) {
            getPaymentHistory(userId);
        }
    }, [userId, getPaymentHistory]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED':
                return 'text-green-600 bg-green-100';
            case 'DENIED':
            case 'FAILED':
                return 'text-red-600 bg-red-100';
            case 'PENDING':
                return 'text-yellow-600 bg-yellow-100';
            case 'REFUNDED':
                return 'text-gray-600 bg-gray-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'APPROVED':
                return 'Approved';
            case 'DENIED':
                return 'Declined';
            case 'FAILED':
                return 'Failed';
            case 'PENDING':
                return 'Pending';
            case 'REFUNDED':
                return 'Refunded';
            default:
                return 'Unknown';
        }
    };

    const handleCancelPayment = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this payment? This action cannot be undone.')) {
            try {
                await cancelPayment(orderId);
            } catch (error) {
                console.error('Failed to cancel payment:', error);
            }
        }
    };

    const canCancelPayment = (payment) => {
        return payment.status === 'APPROVED';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-3 text-gray-600">Loading payment history...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">Error loading payment history: {error}</p>
            </div>
        );
    }

    if (paymentHistory.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <p className="text-gray-500 text-lg">No payment history found</p>
                <p className="text-gray-400 text-sm">Your completed purchases will appear here</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
            </div>

            <div className="divide-y divide-gray-200">
                {paymentHistory.map((payment) => (
                    <div key={payment.id} className="p-6">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                    {getStatusText(payment.status)}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {new Date(payment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold text-gray-900">
                                    ${payment.amount}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600">
                                    <strong>Transaction ID:</strong>
                                    <span className="font-mono ml-1">{payment.transactionId}</span>
                                </p>
                                <p className="text-gray-600">
                                    <strong>Payment Method:</strong> {payment.paymentMethod}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-600">
                                    <strong>Order ID:</strong>
                                    <span className="font-mono ml-1">{payment.order?.id || 'N/A'}</span>
                                </p>
                                {payment.address && (
                                    <p className="text-gray-600">
                                        <strong>Billing Address:</strong> {payment.address}
                                    </p>
                                )}
                            </div>
                        </div>

                        {payment.failureReason && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">
                                    <strong>Failure Reason:</strong> {payment.failureReason}
                                </p>
                            </div>
                        )}

                        {canCancelPayment(payment) && (
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => handleCancelPayment(payment.order?.id)}
                                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 hover:border-red-400 rounded-lg transition duration-200"
                                >
                                    Cancel & Refund
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentHistory;