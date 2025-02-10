import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Save,
    ArrowLeft,
    User,
    Phone,
    Mail,
    MapPin,
    DollarSign
} from 'lucide-react';

export default function ContactEdit({ auth, contact }) {
    const { data, setData, put, processing, errors } = useForm({
        name: contact.name,
        phone: contact.phone || '',
        email: contact.email || '',
        address: contact.address || '',
        current_balance: contact.current_balance
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('contacts.update', contact.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit Contact
                    </h2>
                    <Link
                        href={route('contacts.index')}
                        className="flex items-center text-gray-600 hover:text-gray-800"
                    >
                        <ArrowLeft className="mr-2" /> Back to Contacts
                    </Link>
                </div>
            }
        >
            <Head title={`Edit Contact - ${contact.name}`} />

            <div className="py-12">
                <div className="max-w-md mx-auto sm:px-6 lg:px-8">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 space-y-4"
                    >
                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-gray-700 font-bold mb-2"
                            >
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="text-gray-400" size={20} />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`w-full pl-10 px-3 py-2 border rounded-md ${
                                        errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter contact's full name"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                )}
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-gray-700 font-bold mb-2"
                            >
                                Phone Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="text-gray-400" size={20} />
                                </div>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className={`w-full pl-10 px-3 py-2 border rounded-md ${
                                        errors.phone ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter phone number"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-gray-700 font-bold mb-2"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="text-gray-400" size={20} />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`w-full pl-10 px-3 py-2 border rounded-md ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter email address"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label
                                htmlFor="address"
                                className="block text-gray-700 font-bold mb-2"
                            >
                                Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                                    <MapPin className="text-gray-400" size={20} />
                                </div>
                                <textarea
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Enter full address (optional)"
                                    rows="3"
                                />
                            </div>
                        </div>

                        {/* Current Balance */}
                        <div>
                            <label
                                htmlFor="current_balance"
                                className="block text-gray-700 font-bold mb-2"
                            >
                                Current Balance
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <DollarSign className="text-gray-400" size={20} />
                                </div>
                                <input
                                    type="number"
                                    id="current_balance"
                                    value={data.current_balance}
                                    onChange={(e) => setData('current_balance', e.target.value)}
                                    className={`w-full pl-10 px-3 py-2 border rounded-md ${
                                        errors.current_balance ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="0.00"
                                    step="0.01"
                                />
                                {errors.current_balance && (
                                    <p className="text-red-500 text-xs mt-1">{errors.current_balance}</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 disabled:opacity-50"
                            >
                                <Save className="mr-2" />
                                {processing ? 'Updating Contact...' : 'Update Contact'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
