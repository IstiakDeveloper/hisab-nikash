import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    PlusCircle,
    User,
    Phone,
    Mail,
    BarChart,
    Edit,
    Trash2
} from 'lucide-react';

export default function ContactIndex({ auth, contacts }) {
    const { delete: destroy } = useForm();
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this contact?')) {
            destroy(route('contacts.destroy', id));
        }
    };

    // Filter contacts based on search term
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.phone && contact.phone.includes(searchTerm)) ||
        (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Contacts
                    </h2>
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('contacts.overview')}
                            className="flex items-center text-gray-600 hover:text-gray-800"
                        >
                            <BarChart className="mr-2" /> Overview
                        </Link>
                        <Link
                            href={route('contacts.create')}
                            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            <PlusCircle className="mr-2" /> Add Contact
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Contacts" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">{/* Search Input */}
                    <div className="mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-4">
                            <input
                                type="text"
                                placeholder="Search contacts by name, phone, or email"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Contacts Grid */}
                    {filteredContacts.length === 0 ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-center">
                            <User className="mx-auto mb-4 text-gray-400" size={48} />
                            <p className="text-gray-600">
                                {searchTerm
                                    ? `No contacts found matching "${searchTerm}"`
                                    : "You haven't added any contacts yet."
                                }
                                {!searchTerm && (
                                    <Link
                                        href={route('contacts.create')}
                                        className="text-blue-500 ml-1 hover:underline"
                                    >
                                        Add your first contact
                                    </Link>
                                )}
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredContacts.map((contact) => (
                                <div
                                    key={contact.id}
                                    className="bg-white overflow-hidden shadow-lg sm:rounded-lg p-6 relative"
                                >
                                    {/* Contact Actions */}
                                    <div className="absolute top-4 right-4 flex space-x-2">
                                        <Link
                                            href={route('contacts.edit', contact.id)}
                                            className="text-blue-500 hover:text-blue-700"
                                            title="Edit Contact"
                                        >
                                            <Edit size={20} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(contact.id)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Delete Contact"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>

                                    {/* Contact Details */}
                                    <div className="flex items-center mb-4">
                                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                                            <User className="text-blue-500" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold">{contact.name}</h3>
                                            <p className="text-gray-500">
                                                {contact.total_transactions || 0} Transactions
                                            </p>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="space-y-2">
                                        {contact.phone && (
                                            <div className="flex items-center text-gray-600">
                                                <Phone className="mr-2 text-gray-400" size={16} />
                                                <span>{contact.phone}</span>
                                            </div>
                                        )}
                                        {contact.email && (
                                            <div className="flex items-center text-gray-600">
                                                <Mail className="mr-2 text-gray-400" size={16} />
                                                <span>{contact.email}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Balance */}
                                    <div className="mt-4 text-right">
                                        <p className={`text-xl font-bold ${
                                            contact.current_balance >= 0
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}>
                                            ${contact.current_balance.toLocaleString()}
                                        </p>
                                        <Link
                                            href={route('contacts.show', contact.id)}
                                            className="text-blue-500 hover:underline text-sm"
                                        >
                                            View Transactions
                                        </Link>
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
