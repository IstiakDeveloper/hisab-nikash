import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Wallet, PlusCircle, Edit, Trash2 } from 'lucide-react';

export default function WalletIndex({ auth, wallets }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this wallet?')) {
            destroy(route('wallets.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        My Wallets
                    </h2>
                    <Link
                        href={route('wallets.create')}
                        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        <PlusCircle className="mr-2" /> Add Wallet
                    </Link>
                </div>
            }
        >
            <Head title="My Wallets" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {wallets.length === 0 ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-center">
                            <Wallet className="mx-auto mb-4 text-gray-400" size={48} />
                            <p className="text-gray-600">
                                You haven't added any wallets yet.
                                <Link
                                    href={route('wallets.create')}
                                    className="text-blue-500 ml-1 hover:underline"
                                >
                                    Add your first wallet
                                </Link>
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wallets.map((wallet) => (
                                <div
                                    key={wallet.id}
                                    className="bg-white overflow-hidden shadow-lg sm:rounded-lg p-6 relative"
                                >
                                    <div className="absolute top-4 right-4 flex space-x-2">
                                        <Link
                                            href={route('wallets.edit', wallet.id)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <Edit size={20} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(wallet.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                                            <Wallet className="text-blue-500" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold">{wallet.name}</h3>
                                            <p className="text-gray-500 capitalize">{wallet.type}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-green-600">
                                            ${wallet.balance.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
