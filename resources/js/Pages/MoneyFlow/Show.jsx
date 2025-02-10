import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { PlusIcon, ArrowLeftIcon } from 'lucide-react';
import AddPaymentModal from './Partials/AddPaymentModal';
import PaymentHistory from './Partials/PaymentHistory';
import MoneyFlowDetails from './Partials/MoneyFlowDetails';

export default function Show({ moneyFlow }) {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    return (
        <AuthenticatedLayout>
            <Head title={`Money Flow - ${moneyFlow.person_name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center">
                            <a
                                href={route('money-flows.index')}
                                className="flex items-center text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                                Back to Money Flow
                            </a>
                        </div>
                        <button
                            onClick={() => setIsPaymentModalOpen(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Add Payment
                        </button>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Money Flow Details Card */}
                        <div className="lg:col-span-1">
                            <MoneyFlowDetails moneyFlow={moneyFlow} />
                        </div>

                        {/* Payment History */}
                        <div className="lg:col-span-2">
                            <PaymentHistory payments={moneyFlow.payments} />
                        </div>
                    </div>
                </div>
            </div>

            <AddPaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                moneyFlow={moneyFlow}
            />
        </AuthenticatedLayout>
    );
}
