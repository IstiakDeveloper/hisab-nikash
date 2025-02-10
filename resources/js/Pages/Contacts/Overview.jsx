import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ArrowLeft, ArrowUp, ArrowDown, User, BarChart } from "lucide-react";

export default function ContactOverview({
    auth,
    total_given,
    total_received,
    top_contacts,
}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Contacts Overview
                    </h2>
                    <Link
                        href={route("contacts.index")}
                        className="flex items-center text-gray-600 hover:text-gray-800"
                    >
                        <ArrowLeft className="mr-2" /> Back to Contacts
                    </Link>
                </div>
            }
        >
            <Head title="Contacts Overview" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* Summary Cards */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center mb-4">
                                <ArrowUp
                                    className="text-green-500 mr-3"
                                    size={24}
                                />
                                <h3 className="text-lg font-semibold text-gray-700">
                                    Total Received
                                </h3>
                            </div>
                            <div className="text-3xl font-bold text-green-600">
                                ${total_received.toLocaleString()}
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center mb-4">
                                <ArrowDown
                                    className="text-red-500 mr-3"
                                    size={24}
                                />
                                <h3 className="text-lg font-semibold text-gray-700">
                                    Total Given
                                </h3>
                            </div>
                            <div className="text-3xl font-bold text-red-600">
                                ${total_given.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Top Contacts */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center">
                                <BarChart
                                    className="mr-3 text-blue-500"
                                    size={24}
                                />
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Top Contacts
                                </h3>
                            </div>
                        </div>

                        {top_contacts.length === 0 ? (
                            <div className="p-6 text-center text-gray-600">
                                No contacts with outstanding balances
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {top_contacts.map((contact) => (
                                    <Link
                                        key={contact.id}
                                        href={route(
                                            "contacts.show",
                                            contact.id
                                        )}
                                        className="block hover:bg-gray-50 transition"
                                    >
                                        <div className="p-6 flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="bg-blue-100 p-3 rounded-full mr-4">
                                                    <User
                                                        className="text-blue-500"
                                                        size={24}
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-800">
                                                        {contact.name}
                                                    </h4>
                                                    <p
                                                        className={`text-sm font-medium ${
                                                            contact.current_balance >=
                                                            0
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }`}
                                                    >
                                                        Balance: $
                                                        {contact.current_balance.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <ArrowLeft
                                                className="text-gray-400"
                                                size={20}
                                            />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
