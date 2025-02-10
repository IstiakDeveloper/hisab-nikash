// resources/js/Pages/MoneyFlow/Index.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { PlusIcon, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import AddMoneyFlowModal from './Partials/AddMoneyFlowModal';
import MoneyFlowList from './Partials/MoneyFlowList';
import SummaryCards from './Partials/SummaryCards';

export default function Index({ receivable, payable, summary }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(null);

    const openModal = (type) => {
        setSelectedType(type);
        setIsModalOpen(true);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Money Flow" />

            <div className="py-6">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Summary Cards */}
                    <SummaryCards summary={summary} />

                    {/* Action Buttons */}
                    <div className="mt-8 flex justify-center space-x-4">
                        <button
                            onClick={() => openModal('receive')}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <ArrowUpCircle className="w-5 h-5 mr-2" />
                            Add Receivable
                        </button>
                        <button
                            onClick={() => openModal('give')}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <ArrowDownCircle className="w-5 h-5 mr-2" />
                            Add Payable
                        </button>
                    </div>

                    {/* Lists */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Receivables (To Get)
                            </h2>
                            <MoneyFlowList items={receivable} type="receive" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Payables (To Give)
                            </h2>
                            <MoneyFlowList items={payable} type="give" />
                        </div>
                    </div>
                </div>
            </div>

            <AddMoneyFlowModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type={selectedType}
            />
        </AuthenticatedLayout>
    );
}
