import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    PlusCircle,
    Filter,
    ArrowUp,
    ArrowDown,
    FileText,
    Edit,
    Trash2,
    CreditCard
} from 'lucide-react';

export default function TransactionIndex({
    auth,
    transactions,
    wallets,
    stats
}) {
    const [filterOpen, setFilterOpen] = useState(false);
    const { data, setData, get } = useForm({
        wallet_id: '',
        type: '',
        start_date: '',
        end_date: ''
    });

    const applyFilters = (e) => {
        e.preventDefault();
        get(route('transactions.index'), {
            preserveState: true,
            preserveScroll: true
        });
    };

    const resetFilters = () => {
        setData({
            wallet_id: '',
            type: '',
            start_date: '',
            end_date: ''
        });
        get(route('transactions.index'), {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Transactions
                    </h2>
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('transactions.report')}
                            className="flex items-center text-gray-600 hover:text-gray-800"
                        >
                            <FileText className="mr-2" /> Reports
                        </Link>
                        <Link
                            href={route('transactions.create')}
                            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            <PlusCircle className="mr-2" /> Add Transaction
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Transactions" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Monthly Stats */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center mb-4">
                                <ArrowUp className="text-green-500 mr-2" />
                                <h3 className="text-gray-600">Monthly Income</h3>
                            </div>
                            <p className="text-2xl font-bold text-green-600">
                                ${stats.monthly_income.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center mb-4">
                                <ArrowDown className="text-red-500 mr-2" />
                                <h3 className="text-gray-600">Monthly Expenses</h3>
                            </div>
                            <p className="text-2xl font-bold text-red-600">
                                ${stats.monthly_expense.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center mb-4">
                                <CreditCard className="text-blue-500 mr-2" />
                                <h3 className="text-gray-600">Net Balance</h3>
                            </div>
                            <p className={`text-2xl font-bold ${
                                stats.net_balance >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                                ${stats.net_balance.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 border-b border-gray-200">
                            <button
                                onClick={() => setFilterOpen(!filterOpen)}
                                className="flex items-center text-gray-600 hover:text-gray-800"
                            >
                                <Filter className="mr-2" />
                                {filterOpen ? 'Hide Filters' : 'Show Filters'}
                            </button>
                        </div>

                        {filterOpen && (
                            <form onSubmit={applyFilters} className="p-6">
                                <div className="grid md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">Wallet</label>
                                        <select
                                            value={data.wallet_id}
                                            onChange={(e) => setData('wallet_id', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        >
                                            <option value="">All Wallets</option>
                                            {wallets.map((wallet) => (
                                                <option
                                                    key={wallet.id}
                                                    value={wallet.id}
                                                >
                                                    {wallet.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Type</label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        >
                                            <option value="">All Types</option>
                                            <option value="income">Income</option>
                                            <option value="expense">Expense</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Start Date</label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">End Date</label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 flex space-x-4">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    >
                                        Apply Filters
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetFilters}
                                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Transactions List */}
                    {transactions.data.length === 0 ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-center">
                            <p className="text-gray-600">
                                No transactions found.
                                <Link
                                    href={route('transactions.create')}
                                    className="text-blue-500 ml-1 hover:underline"
                                >
                                    Add your first transaction
                                </Link>
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-100 border-b">
                                        <tr>
                                            <th className="p-4 text-left text-gray-600">Date</th>
                                            <th className="p-4 text-left text-gray-600">Wallet</th>
                                            <th className="p-4 text-left text-gray-600">Category</th>
                                            <th className="p-4 text-left text-gray-600">Type</th>
                                            <th className="p-4 text-right text-gray-600">Amount</th>
                                            <th className="p-4 text-center text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.data.map((transaction) => (
                                            <tr
                                                key={transaction.id}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="p-4">
                                                    {new Date(transaction.date).toLocaleDateString()}
                                                </td>
                                                <td className="p-4">
                                                    {transaction.wallet.name}
                                                </td>
                                                <td className="p-4">
                                                    {transaction.category ? transaction.category.name : 'Uncategorized'}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`
                                                        px-2 py-1 rounded-full text-xs font-semibold
                                                        ${transaction.type === 'income'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }
                                                    `}>
                                                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <span className={
                                                        transaction.type === 'income'
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                    }>
                                                        {transaction.type === 'income' ? '+' : '-'}
                                                        ${transaction.amount.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="flex justify-center space-x-2">
                                                        <Link
                                                            href={route('transactions.edit', transaction.id)}
                                                            className="text-blue-500 hover:text-blue-700"
                                                            title="Edit Transaction"
                                                        >
                                                            <Edit size={20} />
                                                        </Link>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to delete this transaction?')) {
                                                                    // Implement delete logic
                                                                }
                                                            }}
                                                            className="text-red-500 hover:text-red-700"
                                                            title="Delete Transaction"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {transactions.total > transactions.per_page && (
                                <div className="p-4 flex justify-between items-center border-t">
                                    <span className="text-gray-600">
                                        Showing {transactions.from} to {transactions.to} of {transactions.total} transactions
                                    </span>
                                    <div className="flex space-x-2">
                                        {transactions.prev_page_url && (
                                            <Link
                                                href={transactions.prev_page_url}
                                                className="px-4 py-2 bg-white border rounded-md hover:bg-gray-100"
                                            >
                                                Previous
                                            </Link>
                                        )}
                                        {transactions.next_page_url && (
                                            <Link
                                                href={transactions.next_page_url}
                                                className="px-4 py-2 bg-white border rounded-md hover:bg-gray-100"
                                            >
                                                Next
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
