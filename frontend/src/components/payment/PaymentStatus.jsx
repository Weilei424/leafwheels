import React, { useState, useEffect } from 'react';
import { usePaymentStore } from '../../stores/usePaymentStore.js';

const PaymentStatus = ({ orderId }) => {
    const { getPaymentStatus, loading, error } = usePaymentStore();
    const [paymentInfo, setPaymentInfo] = useState(null);

    useEffect(() => {
        if (orderId) {
            fetchPaymentStatus();
        }
    }, [orderId]);

    const fetchPaymentStatus = async () => {
        try {
            const status = await getPaymentStatus(orderId);
            setPaymentInfo(status);
        } catch (error) {
            console.error('Failed to fetch payment status:', error);
        }
    };

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
                return 'Payment Approved';
            case 'DENIED':
                return 'Payment Declined';
            case 'FAILED':
                return 'Payment Failed';
            case 'PENDING':
                return 'Payment Pending';
            case 'REFUNDED':
                return 'Payment Refunded';
            default:
                return 'Unknown Status';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <span className="ml-2 text-gray-600">Checking payment status...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">Error: {error}</p>
            </div>
        );
    }

    if (!paymentInfo) {
        return null;
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h3>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(paymentInfo.status)}`}>
                        {getStatusText(paymentInfo.status)}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Amount:</span>
                    <span className="text-sm text-gray-900">${paymentInfo.amount}</span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Transaction ID:</span>
                    <span className="text-sm text-gray-900 font-mono">{paymentInfo.transactionId}</span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Payment Method:</span>
                    <span className="text-sm text-gray-900">{paymentInfo.paymentMethod}</span>
                </div>

                {paymentInfo.failureReason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">
                            <strong>Failure Reason:</strong> {paymentInfo.failureReason}
                        </p>
                    </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                    <span>Created:</span>
                    <span>{new Date(paymentInfo.createdAt).toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default PaymentStatus;