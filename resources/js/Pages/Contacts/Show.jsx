import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    ArrowLeft,
    User,
    Phone,
    Mail,
    MapPin,
    PlusCircle,
    Edit,
    Trash2,
    ArrowUp,
    ArrowDown
} from 'lucide-react';

export default function ContactShow({
    auth,
    contact,
    transactions,
    wallets
}) {
    const { delete: destroy } = useForm();
    const [addTransactionOpen, setAddTransactionOpen] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        wallet_id: '',
        type: 'receive',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        note: ''
    });

    const handleAddTransaction = (e) => {
        e.preventDefault();
        post(route('contacts.add-transaction', contact.id), {
            onSuccess: () => setAddTransactionOpen(false)
        });
    };

    const handleDeleteTransaction = (id) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            destroy(route('contact-transactions.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Contact Details: {contact.name}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('contacts.edit', contact.id)}
                            className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                            <Edit className="mr-2" /> Edit Contact
                        </Link>
                        <Link
                            href={route('contacts.index')}
                            className="flex items-center text-gray-600 hover:text-gray-800"
                        >
                            <ArrowLeft className="mr-2" /> Back to Contacts
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Contact Details - ${contact.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Contact Details Card */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-8">
                        <div className="p-6">
                            <div className="flex items-center mb-6">
                                <div className="bg-blue-100 p-4 rounded-full mr-6">
                                    <User className="text-blue-500" size={36} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">{contact.name}</h3>
                                    <p className={`text-xl font-semibold ${
                                        contact.current_balance >= 0
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }`}>
                                        Current Balance: ${contact.current_balance.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {contact.phone && (
                                    <div className="flex items-center">
                                        <Phone className="mr-3 text-gray-400" size={20} />
                                        <span>{contact.phone}</span>
                                    </div>
                                )}
                                {contact.email && (
                                    <div className="flex items-center">
                                        <Mail className="mr-3 text-gray-400" size={20} />
                                        <span>{contact.email}</span>
                                    </div>
                                )}
                                {contact.address && (
                                    <div className="flex items-start md:col-span-2">
                                        <MapPin className="mr-3 text-gray-400 mt-1" size={20} />
                                        <span>{contact.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Add Transaction Section */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-8">
                        <div className="p-6">
                            <button
                                onClick={() => setAddTransactionOpen(!addTransactionOpen)}
                                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            >
                                <PlusCircle className="mr-2" />
                                {addTransactionOpen ? 'Cancel' : 'Add Transaction'}
                            </button>

                            {addTransactionOpen && (
                                <form
                                    onSubmit={handleAddTransaction}
                                    className="mt-6 grid md:grid-cols-4 gap-4"
                                >
                                    {/* Wallet Selection */}
                                    <div>
                                        <label className="block text-gray-700 mb-2">Wallet</label>
                                        <select
                                            value={data.wallet_id}
                                            onChange={(e) => setData('wallet_id', e.target.value)}
                                            className={`w-full border rounded-md px-3 py-2 ${
                                                errors.wallet_id ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            required
                                        >
                                            <option value="">Select Wallet</option>
                                            {wallets.map((wallet) => (
                                                <option key={wallet.id} value={wallet.id}>
                                                    {wallet.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.wallet_id && (
                                            <p className="text-red-500 text-xs mt-1">{errors.wallet_id}</p>
                                        )}
                                    </div>

                                    {/* Transaction Type */}
                                    <div>
                                        <label className="block text-gray-700 mb-2">Type</label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        >
                                            <option value="receive">Receive</option>
                                            <option value="give">Give</option>
                                        </select>
                                    </div>

                                    {/* Amount */}
                                    <div>
                                        <label className="block text-gray-700 mb-2">Amount</label>
                                        <input
                                            type="number"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            className={`w-full border rounded-md px-3 py-2 ${
                                                errors.amount ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="0.00"
                                            step="0.01"
                                            required
                                        />
                                        {errors.amount && (
                                            <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                                        )}
                                    </div>

                                    {/* Date */}
                                    <div>
                                        <label className="block text-gray-700 mb-2">Date</label>
                                        <input
                                            type="date"
                                            value={data.date}
                                            onChange={(e) => setData('date', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            required
                                        />
                                    </div>

                                    {/* Note */}
                                    <div className="md:col-span-4">
                                        <label className="block text-gray-700 mb-2">Note (Optional)</label>
                                        <textarea
                                            value={data.note}
                                            onChange={(e) => setData('note', e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            placeholder="Additional notes"
                                            rows="2"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="md:col-span-4">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                                        >
                                            {processing ? 'Adding...' : 'Add Transaction'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Transactions List */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-4">Transactions</h3>

                            {transactions.data.length === 0 ? (
                                <div className="text-center text-gray-600">
                                    No transactions found
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-100 border-b">
                                            <tr>
                                                <th className="p-3 text-left">Date</th>
                                                <th className="p-3 text-left">Wallet</th>
                                                <th className="p-3 text-left">Type</th>
                                                <th className="p-3 text-right">Amount</th>
                                                <th className="p-3 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.data.map((transaction) => (
                                                <tr
                                                    key={transaction.id}
                                                    className="border-b hover:bg-gray-50"
                                                >
                                                    <td className="p-3">
                                                        {new Date(transaction.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-3">
                                                        {transaction.wallet.name}
                                                    </td>
                                                    <td className="p-3">
                                                        <span className={`
                                                            px-2 py-1 rounded-full text-xs font-semibold
                                                            ${transaction.type === 'receive'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                            }
                                                        `}>
                                                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        <span className={
                                                            transaction.type === 'receive'
                                                                ? 'text-green-600'
                                                                : 'text-red-600'
                                                        }>
                                                            {transaction.type === 'receive' ? '+' : '-'}
                                                            ${transaction.amount.toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <button
                                                            onClick={() => handleDeleteTransaction(transaction.id)}
                                                            className="text-red-500 hover:text-red-700"
                                                            title="Delete Transaction"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* Pagination */}
                                    {transactions.total > transactions.per_page && (
                                        <div className="mt-4 flex justify-between items-center">
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
