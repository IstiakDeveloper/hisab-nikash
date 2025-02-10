import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Save,
    ArrowLeft,
    Tag,
    Layers
} from 'lucide-react';

export default function CategoryCreate({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        type: 'expense',
        icon: '💸',
        color: '#3B82F6' // Default blue
    });

    // Predefined icons and colors
    const predefinedIcons = ['💰', '🏦', '🛍️', '🍽️', '🚗', '🏠', '💻', '🎉', '📚', '🚀'];
    const predefinedColors = [
        '#3B82F6', // Blue
        '#10B981', // Green
        '#EF4444', // Red
        '#F59E0B', // Yellow
        '#6366F1', // Indigo
        '#8B5CF6', // Purple
        '#EC4899'  // Pink
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('categories.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Create New Category
                    </h2>
                    <Link
                        href={route('categories.index')}
                        className="flex items-center text-gray-600 hover:text-gray-800"
                    >
                        <ArrowLeft className="mr-2" /> Back to Categories
                    </Link>
                </div>
            }
        >
            <Head title="Create Category" />

            <div className="py-12">
                <div className="max-w-md mx-auto sm:px-6 lg:px-8">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 space-y-4"
                    >
                        {/* Category Type */}
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

                        {/* Category Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-gray-700 font-bold mb-2"
                            >
                                Category Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Tag className="text-gray-400" size={20} />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`w-full pl-10 px-3 py-2 border rounded-md ${
                                        errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter category name"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                )}
                            </div>
                        </div>

                        {/* Icon Selection */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">
                                Select Icon
                            </label>
                            <div className="grid grid-cols-5 gap-2">
                                {predefinedIcons.map((icon) => (
                                    <button
                                        key={icon}
                                        type="button"
                                        onClick={() => setData('icon', icon)}
                                        className={`p-2 rounded-md text-2xl text-center ${
                                            data.icon === icon
                                                ? 'bg-blue-100 border-2 border-blue-500'
                                                : 'hover:bg-gray-100'
                                        }`}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">
                                Select Color
                            </label>
                            <div className="grid grid-cols-7 gap-2">
                                {predefinedColors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setData('color', color)}
                                        style={{ backgroundColor: color }}
                                        className={`h-8 w-8 rounded-full ${
                                            data.color === color
                                                ? 'ring-2 ring-offset-2 ring-blue-500'
                                                : 'hover:opacity-80'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="mt-4 flex items-center justify-center">
                            <div
                                className="p-4 rounded-full flex items-center justify-center"
                                style={{
                                    backgroundColor: `${data.color}20`,
                                    color: data.color
                                }}
                            >
                                <span className="text-4xl">{data.icon}</span>
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
                                {processing ? 'Creating Category...' : 'Create Category'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
