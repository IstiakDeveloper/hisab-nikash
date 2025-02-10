// resources/js/Layouts/AuthenticatedLayout.jsx
import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Home,
    CreditCard,
    Users,
    List,
    Menu,
    X,
    LogOut,
    Settings,
    ChevronDown,
    Bell,
    Banknote,
} from "lucide-react";

const AuthenticatedLayout = ({ header, children }) => {
    const { auth } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const navigation = [
        { name: "Dashboard", href: route("dashboard"), icon: Home },
        { name: "Wallets", href: route("wallets.index"), icon: CreditCard },
        { name: "Transactions", href: route("transactions.index"), icon: List },
        { name: "Contacts", href: route("contacts.index"), icon: Users },
        { name: "Categories", href: route("categories.index"), icon: List },
        {name: 'Money Flow', href: route('money-flows.index'), icon: Banknote },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-6 bg-blue-600">
                    <Link href="/" className="flex items-center">
                        <span className="text-xl font-semibold text-white">
                            MoneyTrack
                        </span>
                    </Link>
                    <button
                        onClick={toggleSidebar}
                        className="p-1 text-white rounded-md lg:hidden hover:bg-blue-500 focus:outline-none"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="px-4 py-4 space-y-1">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 group transition-colors duration-200"
                            >
                                <Icon className="w-5 h-5 mr-3 text-gray-500 group-hover:text-gray-900" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Top Navigation */}
                <div className="fixed top-0 right-0 left-0 z-40 lg:left-64">
                    <div className="flex items-center justify-between h-16 px-4 bg-white shadow-sm">
                        <button
                            onClick={toggleSidebar}
                            className="p-1 text-gray-600 rounded-md lg:hidden hover:bg-gray-100 focus:outline-none"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Right side navigation */}
                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <button className="p-1 text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none">
                                <Bell className="w-6 h-6" />
                            </button>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={toggleProfile}
                                    className="flex items-center space-x-3 text-sm focus:outline-none"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                        {auth.user.name.charAt(0)}
                                    </div>
                                    <div className="hidden md:flex md:items-center">
                                        <span className="text-gray-700">
                                            {auth.user.name}
                                        </span>
                                        <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
                                    </div>
                                </button>

                                {/* Dropdown menu */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg py-1">
                                        <Link
                                            href={route("profile.edit")}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <div className="flex items-center">
                                                <Settings className="w-4 h-4 mr-2" />
                                                Settings
                                            </div>
                                        </Link>
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <div className="flex items-center">
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Logout
                                            </div>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="pt-16">
                    {" "}
                    {/* Add padding-top to push content below fixed header */}
                    {/* Page Heading */}
                    {header && (
                        <header className="bg-white shadow">
                            <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}
                    {/* Main Content */}
                    <main className="py-6">
                        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>

            {/* Mobile sidebar backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}
        </div>
    );
};

export default AuthenticatedLayout;
