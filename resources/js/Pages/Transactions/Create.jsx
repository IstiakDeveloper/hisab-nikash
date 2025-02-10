import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Save,
    ArrowLeft,
    DollarSign,
    Calendar,
    FileText,
    Layers
} from 'lucide-react';

export default function TransactionCreate({
    auth,
    wallets,
    categories
}) {
    const { data, setData, post, processing, errors } = useForm({
        wallet_id: '',
        type: 'expense',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category_id: '',
        source: '',
        note: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('transactions.store'));
    };

    // Filter categories based on selected type
    const filteredCategories = categories.filter(
        category => category.type === data.type
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Add New Transaction
                    </h2>
                    <Link
                        href={route('transactions.index')}
                        className="flex items-center text-gray-600 hover:text-gray-800"
                    >
                        <ArrowLeft className="mr-2" /> Back to Transactions
                    </Link>
                </div>
            }
        >
            <Head title="Add New Transaction" />

            <div className="py-12">
                <div className="max-w-md mx-auto sm:px-6 lg:px-8">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 space-y-4"
                    >
                        {/* Transaction Type */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-gray-100 rounded-lg p-1 flex">
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'expense')}
                                    className={`px-4 py-2 rounded-lg ${
                                        data.type === 'expense'
                                            ? 'bg-red-500 text-white'
                                            : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    Expense
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'income')}
                                    className={`px-4 py-2 rounded-lg ${
                                        data.type === 'income'
                                            ? 'bg-green-500 text-white'
                                            : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    Income
                                </button>
                            </div>
                        </div>

                        {/* Wallet Selection */}
                        <div>
                            <label
                                htmlFor="wallet_id"
                                className="block text-gray-700 font-bold mb-2"
                            >
                                Select Wallet
                            </label>
                            <div className="relative">
                                <select
                                    id="wallet_id"
                                    value={data.wallet_id}
                                    onChange={(e) => setData('wallet_id', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md ${
                                        errors.wallet_id ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Select a Wallet</option>
                                    {wallets.map((wallet) => (
                                        <option key={wallet.id} value={wallet.id}>
                                            {wallet.name} (${wallet.balance.toLocaleString()})
                                        </option>
                                    ))}
                                </select>
                                {errors.wallet_id && (
                                    <p className="text-red-500 text-xs mt-1">{errors.wallet_id}</p>
                                )}
                            </div>
                        </div>

                        {/* Amount */}
                        <div>
                            <label
                                htmlFor="amount"
                                className="block text-gray-700 font-bold mb-2"
                            >
                                Amount
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <DollarSign className="text-gray-400" size={20} />
                                </div>
                                <input
                                    type="number"
                                    id="amount"
                                    value={data.amount}
                                    onChange={(e) => setData('amount', e.target.value)}
                                    className={`w-full pl-10 px-3 py-2 border rounded-md ${
                                        errors.amount ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                />
                                {errors.amount && (
                                    <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                                )}
                            </div>
                        </div>

                        {/* Date */}
                        <div>
                            <label
                                htmlFor="date"
                                className="block text-gray-700 font-bold mb-2"
                            >
                                Date
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="text-gray-400" size={20} />
                                </div>
                                <input
                                    type="date"
                                    id="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className={`w-full pl-10 px-3 py-2 border rounded-md ${
                                        errors.date ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.date && (
                                    <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                                )}
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label
                                htmlFor="category_id"
                                className="block text-gray-700 font-bold mb-2"
                            >
                                Category
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Layers className="text-gray-400" size={20} />
                                </div>
                                <select
                                    id="category_id"
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className={`w-full pl-10 px-3 py-2 border rounded-md ${
                                        errors.category_id ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">Select Category</option>
                                    {filteredCategories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>
                                )}
                            </div>
                        </div>

                        {/* Source (for income) or Additional Details */}
                        <div>
                            <label
                                htmlFor="source"
                                className="block text-gray-700 font-bold mb-2"
                            >
                                {data.type === 'income' ? 'Income Source' : 'Additional Details'}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FileText className="text-gray-400" size={20} />
                                </div>
                                <input
                                    type="text"
                                    id="source"
                                    value={data.source}
                                    onChange={(e) => setData('source', e.target.value)}
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder={
                                        data.type === 'income'
                                            ? 'e.g. Salary, Freelance'
                                            : 'Additional notes'
                                    }
                                />
                            </div>
                        </div>

                        {/* Note */}
                        <div>
                            <label
                                htmlFor="note"
                                className="block text-gray-700 font-bold mb-2"
                            >
                                Note
                            </label>
                            <textarea
                                id="note"
                                value={data.note}
                                onChange={(e) => setData('note', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Optional notes about this transaction"
                                rows="3"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 disabled:opacity-50"
                            >
                                <Save className="mr-2" />
                                {processing ? 'Saving Transaction...' : 'Save Transaction'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
