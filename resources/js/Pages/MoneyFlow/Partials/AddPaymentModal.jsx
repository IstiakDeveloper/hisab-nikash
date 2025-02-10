import { useForm } from '@inertiajs/react';
import { XIcon } from 'lucide-react';

export default function AddPaymentModal({ isOpen, onClose, moneyFlow }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        payment_method: '',
        note: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('money-flows.payments.store', moneyFlow.id), {
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
                                Add Payment
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <XIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Amount</label>
                                <input
                                    type="number"
                                    max={moneyFlow.remaining_amount}
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
                                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                                <select
                                    value={data.payment_method}
                                    onChange={e => setData('payment_method', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Select Method</option>
                                    <option value="cash">Cash</option>
                                    <option value="bank">Bank Transfer</option>
                                    <option value="mobile_banking">Mobile Banking</option>
                                </select>
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
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Add Payment
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
