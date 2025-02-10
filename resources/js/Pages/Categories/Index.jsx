import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    PlusCircle,
    BarChart,
    TrendingUp,
    TrendingDown,
    Edit,
    Trash2,
    Tag,
} from "lucide-react";

export default function CategoryIndex({ auth, categories }) {
    const { delete: destroy } = useForm();
    const [activeTab, setActiveTab] = useState("expense");

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this category?")) {
            destroy(route("categories.destroy", id));
        }
    };

    const renderCategories = (categoryType) => {
        const currentCategories = categories[categoryType] || [];

        if (currentCategories.length === 0) {
            return (
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-center">
                    <Tag className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-gray-600">
                        No {categoryType} categories yet.
                        <Link
                            href={route("categories.create")}
                            className="text-blue-500 ml-1 hover:underline"
                        >
                            Create your first category
                        </Link>
                    </p>
                </div>
            );
        }

        return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCategories.map((category) => (
                    <div
                        key={category.id}
                        className="bg-white overflow-hidden shadow-lg sm:rounded-lg p-6 relative"
                    >
                        {/* Category Actions */}
                        <div className="absolute top-4 right-4 flex space-x-2">
                            <Link
                                href={route("categories.edit", category.id)}
                                className="text-blue-500 hover:text-blue-700"
                                title="Edit Category"
                            >
                                <Edit size={20} />
                            </Link>
                            <button
                                onClick={() => handleDelete(category.id)}
                                className="text-red-500 hover:text-red-700"
                                title="Delete Category"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>

                        {/* Category Details */}
                        <div className="flex items-center mb-4">
                            <div
                                className="p-3 rounded-full mr-4"
                                style={{
                                    backgroundColor: category.color
                                        ? `${category.color}20`
                                        : "bg-gray-100",
                                }}
                            >
                                <span
                                    className="text-2xl"
                                    style={{
                                        color:
                                            category.color || "text-gray-500",
                                    }}
                                >
                                    {category.icon || "📊"}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {category.name}
                                </h3>
                                <p className="text-gray-500 capitalize">
                                    {category.transactions_count || 0}{" "}
                                    Transactions
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Categories
                    </h2>
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route("categories.analysis")}
                            className="flex items-center text-gray-600 hover:text-gray-800"
                        >
                            <BarChart className="mr-2" /> Analysis
                        </Link>
                        <Link
                            href={route("categories.create")}
                            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            <PlusCircle className="mr-2" /> Add Category
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Categories" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Category Type Tabs */}
                    <div className="mb-6 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab("expense")}
                                className={`flex-1 p-4 flex items-center justify-center ${
                                    activeTab === "expense"
                                        ? "bg-red-50 text-red-600 border-b-2 border-red-500"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                <TrendingDown className="mr-2" />
                                Expense Categories
                            </button>
                            <button
                                onClick={() => setActiveTab("income")}
                                className={`flex-1 p-4 flex items-center justify-center ${
                                    activeTab === "income"
                                        ? "bg-green-50 text-green-600 border-b-2 border-green-500"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                <TrendingUp className="mr-2" />
                                Income Categories
                            </button>
                        </div>
                    </div>

                    {/* Categories Grid */}
                    {renderCategories(activeTab)}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
