export default function MoneyFlowDetails({ moneyFlow }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'partial': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b">
                <h3 className="text-lg font-medium text-gray-900">Money Flow Details</h3>
            </div>
            <div className="px-4 py-5 sm:p-6 space-y-4">
                <div>
                    <p className="text-sm font-medium text-gray-500">Person Name</p>
                    <p className="mt-1 text-lg text-gray-900">{moneyFlow.person_name}</p>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-500">Type</p>
                    <span className={`mt-1 inline-flex px-2 py-1 text-sm rounded-full ${
                        moneyFlow.type === 'receive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {moneyFlow.type === 'receive' ? 'Receivable' : 'Payable'}
                    </span>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-500">Amount</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                        ৳{moneyFlow.amount.toLocaleString()}
                    </p>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-500">Remaining Amount</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                        ৳{moneyFlow.remaining_amount.toLocaleString()}
                    </p>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span className={`mt-1 inline-flex px-2 py-1 text-sm rounded-full ${getStatusColor(moneyFlow.status)}`}>
                        {moneyFlow.status}
                    </span>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="mt-1 text-gray-900">{moneyFlow.date}</p>
                </div>

                {moneyFlow.due_date && (
                    <div>
                        <p className="text-sm font-medium text-gray-500">Due Date</p>
                        <p className="mt-1 text-gray-900">{moneyFlow.due_date}</p>
                    </div>
                )}

                {moneyFlow.note && (
                    <div>
                        <p className="text-sm font-medium text-gray-500">Note</p>
                        <p className="mt-1 text-gray-900 whitespace-pre-wrap">{moneyFlow.note}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
