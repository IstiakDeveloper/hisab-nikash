export default function PaymentHistory({ payments }) {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b">
                <h3 className="text-lg font-medium text-gray-900">Payment History</h3>
            </div>
            <div className="divide-y divide-gray-200">
                {payments.length > 0 ? (
                    payments.map((payment) => (
                        <div key={payment.id} className="px-4 py-4 sm:px-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        ৳{payment.amount.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-500">{payment.date}</p>
                                </div>
                                {payment.payment_method && (
                                    <span className="inline-flex px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                        {payment.payment_method}
                                    </span>
                                )}
                            </div>
                            {payment.note && (
                                <p className="mt-1 text-sm text-gray-500">{payment.note}</p>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="px-4 py-5 text-center text-gray-500">
                        No payments recorded yet.
                    </div>
                )}
            </div>
        </div>
    );
}
