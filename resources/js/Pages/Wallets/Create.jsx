import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Wallet, Save, ArrowLeft } from 'lucide-react';

export default function WalletCreate({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'cash',
        balance: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('wallets.store'));
    };

    const walletTypes = [
        { value: 'cash', label: 'Cash' },
        { value: 'bank', label: 'Bank Account' },
        { value: 'bkash', label: 'bKash' },
        { value: 'credit_card', label: 'Credit Card' },
        { value: 'other', label: 'Other' }
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Create New Wallet
                    </h2>
                    <Link
                        href={route('wallets.index')}
                        className="flex items-center text-gray-600 hover:text-gray-800"
                    >
                        <ArrowLeft className="mr-2" /> Back to Wallets
                    </Link>
                </div>
            }
        >
            <Head title="Create Wallet" />

            <div className="py-12">
                <div className="max-w-md mx-auto sm:px-6 lg:px-8">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6"
                    >
                        <div className="mb-4">
                            <label
                                htmlFor="name"
                                className="block text-gray-700 font-bold mb-2"
                            >
                                Wallet Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="e.g. Personal Savings"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="type"
                                className="block text-gray-700 font-bold mb-2"
                            >
                                Wallet Type
                            </label>
                            <select
                                id="type"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                {walletTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="balance"
                                className="block text-gray-700 font-bold mb-2"
                            >
                                Initial Balance
                            </label>
                            <input
                                type="number"
                                id="balance"
                                value={data.balance}
                                onChange={(e) => setData('balance', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md ${
                                    errors.balance ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                            />
                            {errors.balance && (
                                <p className="text-red-500 text-xs mt-1">{errors.balance}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                            >
                                <Save className="mr-2" />
                                {processing ? 'Saving...' : 'Create Wallet'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
