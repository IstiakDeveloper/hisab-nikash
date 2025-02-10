export default function SummaryCards({ summary }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="text-green-500">Total Receivable</div>
                        </div>
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-gray-900">
                        ৳{summary.total_receivable.toLocaleString()}
                    </div>
                    {summary.overdue_receivable > 0 && (
                        <div className="mt-1 text-sm text-red-600">
                            ৳{summary.overdue_receivable.toLocaleString()} overdue
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="text-red-500">Total Payable</div>
                        </div>
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-gray-900">
                        ৳{summary.total_payable.toLocaleString()}
                    </div>
                    {summary.overdue_payable > 0 && (
                        <div className="mt-1 text-sm text-red-600">
                            ৳{summary.overdue_payable.toLocaleString()} overdue
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className={summary.net_balance >= 0 ? 'text-green-500' : 'text-red-500'}>
                                Net Balance
                            </div>
                        </div>
                    </div>
                    <div className={`mt-2 text-3xl font-semibold ${
                        summary.net_balance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                        ৳{Math.abs(summary.net_balance).toLocaleString()}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                        {summary.net_balance >= 0 ? 'You will receive' : 'You will pay'}
                    </div>
                </div>
            </div>
        </div>
    );
}
