// resources/js/Pages/MoneyFlow/Partials/AddMoneyFlowModal.jsx
import { useForm } from '@inertiajs/react';
import { XIcon } from 'lucide-react';
import { useEffect } from 'react';

export default function AddMoneyFlowModal({ isOpen, onClose, type }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        person_name: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        due_date: '',
        note: '',
        type: ''  // Initialize empty
    });

    // Update form data when type changes
    useEffect(() => {
        if (type) {
            setData('type', type);
        }
    }, [type]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting with data:', data); // Debug log
        post(route('money-flows.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>

                <div className="relative bg-white rounded-lg max-w-md w-full">
                    <div className="px-6 py-4 border-b">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                                {type === 'receive' ? 'Add Receivable' : 'Add Payable'}
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <XIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        {/* Hidden type field */}
                        <input type="hidden" name="type" value={data.type} />

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Person Name</label>
                                <input
                                    type="text"
                                    value={data.person_name}
                                    onChange={e => setData('person_name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.person_name && (
                                    <div className="mt-1 text-sm text-red-600">{errors.person_name}</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Amount</label>
                                <input
                                    type="number"
                                    value={data.amount}
                                    onChange={e => setData('amount', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.amount && (
                                    <div className="mt-1 text-sm text-red-600">{errors.amount}</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    value={data.date}
                                    onChange={e => setData('date', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                                <input
                                    type="date"
                                    value={data.due_date}
                                    onChange={e => setData('due_date', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Note</label>
                                <textarea
                                    value={data.note}
                                    onChange={e => setData('note', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    rows="3"
                                ></textarea>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                                    type === 'receive'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                Add {type === 'receive' ? 'Receivable' : 'Payable'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
