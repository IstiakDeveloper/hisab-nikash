import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminLayout from "@/layouts/admin-layout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Wallet,
    Plus,
    Trash2,
    Edit2,
    Calendar as CalendarIcon,
    ArrowUpRight,
    ArrowDownRight,
    CreditCard,
    Building,
    Smartphone,
    TrendingUp,
    DollarSign,
    PlusCircle,
    BarChart3
} from "lucide-react";

// Custom form label component to avoid the FormContext error
const Label = ({ children, className, ...props }) => (
    <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props}>
        {children}
    </label>
);

export default function Home({
    accounts,
    totalBalance,
    expenseCategories,
    incomeCategories,
    recentTransactions,
    monthlyIncome,
    monthlyExpense,
    expenseByCategory,
    monthlyTrend
}) {
    const [activeTab, setActiveTab] = useState("overview");
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [transactionType, setTransactionType] = useState("expense");
    const [categoryType, setCategoryType] = useState("expense");
    const [date, setDate] = useState(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Transaction form
    const transactionForm = useForm({
        account_id: accounts.length > 0 ? accounts[0].id : "",
        category_id: "",
        amount: "",
        type: "expense",
        date: format(new Date(), "yyyy-MM-dd"),
        description: "",
    });

    // Account form
    const accountForm = useForm({
        name: "",
        balance: "",
        account_type: "bank",
        notes: "",
    });

    // Category form
    const categoryForm = useForm({
        name: "",
        type: "expense",
        color: "",
        icon: "",
    });

    const accountTypeIcons = {
        cash: <Wallet className="w-4 h-4 mr-2 text-yellow-500" />,
        bank: <Building className="w-4 h-4 mr-2 text-blue-500" />,
        card: <CreditCard className="w-4 h-4 mr-2 text-purple-500" />,
        mobile: <Smartphone className="w-4 h-4 mr-2 text-green-500" />,
    };

    const accountTypeColors = {
        cash: "bg-yellow-100 text-yellow-800",
        bank: "bg-blue-100 text-blue-800",
        card: "bg-purple-100 text-purple-800",
        mobile: "bg-green-100 text-green-800",
    };

    // Submit transaction form
    const submitTransaction = (e) => {
        e.preventDefault();
        transactionForm.post(route("transaction.store"), {
            onSuccess: () => {
                setIsTransactionModalOpen(false);
                transactionForm.reset();
            },
        });
    };

    // Submit account form
    const submitAccount = (e) => {
        e.preventDefault();
        accountForm.post(route("account.store"), {
            onSuccess: () => {
                setIsAccountModalOpen(false);
                accountForm.reset();
            },
        });
    };

    // Submit category form
    const submitCategory = (e) => {
        e.preventDefault();
        categoryForm.post(route("category.store"), {
            onSuccess: () => {
                setIsCategoryModalOpen(false);
                categoryForm.reset();
            },
        });
    };

    // Calculate remaining budget
    const remaining = monthlyIncome - monthlyExpense;
    const remainingPercentage = monthlyIncome > 0 ? (remaining / monthlyIncome) * 100 : 0;

    return (
        <AdminLayout>
            <Head title="Personal Finance" />

            {/* Quick Action Buttons at the Top */}
            <div className="sticky top-16 z-20 bg-white px-4 py-2 border-b flex items-center justify-between mb-4 sm:rounded-lg shadow-sm">
                <h1 className="text-xl font-bold">Personal Finance</h1>
                <div className="flex items-center space-x-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="hidden sm:flex"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Category
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsAccountModalOpen(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Account
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => setIsTransactionModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Transaction
                    </Button>
                </div>
            </div>

            <div className="space-y-6 pb-20 px-4">
                {/* Top Summary Cards */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <Card className="overflow-hidden border bg-white shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Total Balance</p>
                                    <h3 className="text-xl font-bold mt-1">{totalBalance.toLocaleString()} ৳</h3>
                                </div>
                                <div className="h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Wallet className="h-5 w-5 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden border bg-white shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Income</p>
                                    <h3 className="text-xl font-bold text-green-600 mt-1">{monthlyIncome.toLocaleString()} ৳</h3>
                                </div>
                                <div className="h-9 w-9 bg-green-100 rounded-full flex items-center justify-center">
                                    <ArrowUpRight className="h-5 w-5 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden border bg-white shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Expenses</p>
                                    <h3 className="text-xl font-bold text-red-600 mt-1">{monthlyExpense.toLocaleString()} ৳</h3>
                                </div>
                                <div className="h-9 w-9 bg-red-100 rounded-full flex items-center justify-center">
                                    <ArrowDownRight className="h-5 w-5 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden border bg-white shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Remaining</p>
                                    <h3 className="text-xl font-bold text-purple-600 mt-1">{remaining.toLocaleString()} ৳</h3>
                                </div>
                                <div className="h-9 w-9 bg-purple-100 rounded-full flex items-center justify-center">
                                    <TrendingUp className="h-5 w-5 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="grid grid-cols-3 rounded-lg bg-white shadow-sm">
                        <TabsTrigger value="overview" className="py-2">
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="accounts" className="py-2">
                            Accounts
                        </TabsTrigger>
                        <TabsTrigger value="transactions" className="py-2">
                            Transactions
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-4">
                        {/* Accounts Quick Look */}
                        <Card className="bg-white shadow">
                            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                <CardTitle className="text-lg font-semibold">Your Accounts</CardTitle>
                                <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() => setActiveTab("accounts")}
                                    className="h-8 px-2 text-blue-600"
                                >
                                    View All
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {accounts.map((account) => (
                                        <div key={account.id} className="flex justify-between items-center p-2 border-b last:border-0">
                                            <div className="flex items-center">
                                                <div className={`w-8 h-8 rounded-full ${accountTypeColors[account.account_type] || "bg-gray-100"} flex items-center justify-center mr-3`}>
                                                    {accountTypeIcons[account.account_type] || <Wallet className="w-4 h-4 text-gray-600" />}
                                                </div>
                                                <span className="font-medium">{account.name}</span>
                                            </div>
                                            <span className="font-semibold">{account.balance.toLocaleString()} ৳</span>
                                        </div>
                                    ))}

                                    {accounts.length === 0 && (
                                        <div className="text-center py-4">
                                            <p className="text-gray-500 mb-2">No accounts added yet</p>
                                            <Button onClick={() => setIsAccountModalOpen(true)} size="sm">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Account
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Transactions */}
                        <Card className="bg-white shadow">
                            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
                                <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() => setActiveTab("transactions")}
                                    className="h-8 px-2 text-blue-600"
                                >
                                    View All
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {recentTransactions.length > 0 ? (
                                        recentTransactions.slice(0, 5).map((transaction) => (
                                            <div key={transaction.id} className="flex justify-between items-center p-2 border-b last:border-0">
                                                <div className="flex items-center">
                                                    {transaction.type === "income" ? (
                                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                                            <ArrowUpRight className="w-4 h-4 text-green-600" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                                                            <ArrowDownRight className="w-4 h-4 text-red-600" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-sm line-clamp-1">{transaction.description || (transaction.category ? transaction.category.name : "Uncategorized")}</p>
                                                        <p className="text-xs text-gray-500">{transaction.account.name} • {new Date(transaction.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <span className={`font-semibold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                                                    {transaction.type === "income" ? "+" : "-"}{transaction.amount.toLocaleString()} ৳
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-gray-500 mb-2">No transactions yet</p>
                                            <Button onClick={() => setIsTransactionModalOpen(true)} size="sm">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Transaction
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Monthly Summary */}
                        <Card className="bg-white shadow">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-semibold">Monthly Summary</CardTitle>
                                <p className="text-sm text-gray-500">{format(new Date(), "MMMM yyyy")}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            <span className="text-sm">Income: {monthlyIncome.toLocaleString()} ৳</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <span className="text-sm">Expenses: {monthlyExpense.toLocaleString()} ৳</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium">Budget</span>
                                            <span className="text-sm font-medium">{Math.round(remainingPercentage)}% remaining</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-2 ${remainingPercentage > 50 ? 'bg-green-500' : remainingPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                style={{ width: `${100 - Math.round(remainingPercentage)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Accounts Tab */}
                    <TabsContent value="accounts" className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Your Accounts</h2>
                            <Button
                                onClick={() => setIsAccountModalOpen(true)}
                                className="flex items-center"
                                size="sm"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                <span>Add Account</span>
                            </Button>
                        </div>

                        <div className="grid gap-4">
                            {accounts.map((account) => (
                                <Card key={account.id} className="bg-white shadow">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className={`w-10 h-10 rounded-full ${accountTypeColors[account.account_type] || "bg-gray-100"} flex items-center justify-center mr-3`}>
                                                    {accountTypeIcons[account.account_type] ? React.cloneElement(accountTypeIcons[account.account_type], { className: "w-5 h-5" }) : <Wallet className="w-5 h-5 text-gray-600" />}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold">{account.name}</h3>
                                                    <Badge variant="outline" className={`${accountTypeColors[account.account_type]} text-xs mt-1`}>
                                                        {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold">{account.balance.toLocaleString()} ৳</p>
                                                <div className="flex mt-2">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8">
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        {account.notes && (
                                            <p className="text-sm text-gray-500 mt-2 border-t pt-2">{account.notes}</p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}

                            {accounts.length === 0 && (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
                                    <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 mb-4">You don't have any accounts yet</p>
                                    <Button onClick={() => setIsAccountModalOpen(true)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Your First Account
                                    </Button>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Transactions Tab */}
                    <TabsContent value="transactions" className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Transactions</h2>
                            <Button
                                onClick={() => setIsTransactionModalOpen(true)}
                                className="flex items-center"
                                size="sm"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                <span>Add Transaction</span>
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            <Button
                                variant={transactionType === "all" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setTransactionType("all")}
                            >
                                All
                            </Button>
                            <Button
                                variant={transactionType === "expense" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setTransactionType("expense")}
                                className={transactionType === "expense" ? "bg-red-500 hover:bg-red-600 text-white" : "text-red-500"}
                            >
                                <ArrowDownRight className="h-4 w-4 mr-2" />
                                Expenses
                            </Button>
                            <Button
                                variant={transactionType === "income" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setTransactionType("income")}
                                className={transactionType === "income" ? "bg-green-500 hover:bg-green-600 text-white" : "text-green-500"}
                            >
                                <ArrowUpRight className="h-4 w-4 mr-2" />
                                Income
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {recentTransactions.filter(t => transactionType === "all" || t.type === transactionType).map((transaction) => (
                                <Card key={transaction.id} className="bg-white shadow hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                {transaction.type === "income" ? (
                                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                                        <ArrowUpRight className="w-5 h-5 text-green-600" />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                                                        <ArrowDownRight className="w-5 h-5 text-red-600" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium">{transaction.description || (transaction.category ? transaction.category.name : "Uncategorized")}</p>
                                                    <div className="flex text-xs text-gray-500 mt-1">
                                                        <span>{transaction.account.name}</span>
                                                        <span className="mx-1">•</span>
                                                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-lg font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                                                    {transaction.type === "income" ? "+" : "-"}{transaction.amount.toLocaleString()} ৳
                                                </p>
                                                <div className="flex mt-2">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8">
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {recentTransactions.filter(t => transactionType === "all" || t.type === transactionType).length === 0 && (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
                                    <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 mb-4">No transactions found</p>
                                    <Button onClick={() => setIsTransactionModalOpen(true)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Transaction
                                    </Button>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Add Transaction Modal */}
            <Dialog open={isTransactionModalOpen} onOpenChange={setIsTransactionModalOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Add Transaction</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitTransaction}>
                        <div className="grid gap-5 mb-5">
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    type="button"
                                    className={`flex items-center justify-center h-12 ${transactionForm.data.type === "expense"
                                            ? "bg-red-500 hover:bg-red-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    onClick={() => transactionForm.setData("type", "expense")}
                                >
                                    <ArrowDownRight className="w-5 h-5 mr-2" />
                                    <span className="font-medium">Expense</span>
                                </Button>
                                <Button
                                    type="button"
                                    className={`flex items-center justify-center h-12 ${transactionForm.data.type === "income"
                                            ? "bg-green-500 hover:bg-green-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    onClick={() => transactionForm.setData("type", "income")}
                                >
                                    <ArrowUpRight className="w-5 h-5 mr-2" />
                                    <span className="font-medium">Income</span>
                                </Button>
                            </div>

                            <div>
                                <Label htmlFor="amount" className="block mb-2 text-gray-900">Amount</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={transactionForm.data.amount}
                                        onChange={(e) => transactionForm.setData("amount", e.target.value)}
                                        className="pl-10 text-lg h-12"
                                    />
                                </div>
                                {transactionForm.errors.amount && (
                                    <p className="text-sm text-red-500 mt-1">{transactionForm.errors.amount}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="account_id" className="block mb-2 text-gray-900">Account</Label>
                                <Select
                                    value={transactionForm.data.account_id}
                                    onValueChange={(value) => transactionForm.setData("account_id", value)}
                                >
                                    <SelectTrigger id="account_id" className="h-12">
                                        <SelectValue placeholder="Select account" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accounts.map((account) => (
                                            <SelectItem key={account.id} value={account.id.toString()}>
                                                <div className="flex items-center">
                                                    {accountTypeIcons[account.account_type] || <Wallet className="w-4 h-4 mr-2" />}
                                                    <span>{account.name}</span>
                                                    <span className="ml-1 text-gray-500">({account.balance.toLocaleString()} ৳)</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {transactionForm.errors.account_id && (
                                    <p className="text-sm text-red-500 mt-1">{transactionForm.errors.account_id}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="category_id" className="block mb-2 text-gray-900">Category</Label>
                                <Select
                                    value={transactionForm.data.category_id}
                                    onValueChange={(value) => transactionForm.setData("category_id", value)}
                                >
                                    <SelectTrigger id="category_id" className="h-12">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(transactionForm.data.type === "expense" ? expenseCategories : incomeCategories).map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                <div className="flex items-center">
                                                    <div
                                                        className="w-3 h-3 rounded-full mr-2"
                                                        style={{ backgroundColor: category.color || '#888888' }}
                                                    ></div>
                                                    <span>{category.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {transactionForm.errors.category_id && (
                                    <p className="text-sm text-red-500 mt-1">{transactionForm.errors.category_id}</p>
                                )}
                            </div>

                            <div className="relative">
                                <Label htmlFor="date" className="block mb-2 text-gray-900">Date</Label>
                                <div className="flex">
                                    <div className="relative w-full">
                                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                                        <Input
                                            id="date"
                                            type="text"
                                            placeholder="Select date"
                                            value={format(date, "PP")}
                                            readOnly
                                            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                            className="pl-10 h-12 w-full cursor-pointer"
                                        />
                                    </div>
                                </div>
                                {isCalendarOpen && (
                                    <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg p-2">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={(newDate) => {
                                                if (newDate) {
                                                    setDate(newDate);
                                                    transactionForm.setData("date", format(newDate, "yyyy-MM-dd"));
                                                    setIsCalendarOpen(false);
                                                }
                                            }}
                                            initialFocus
                                            className="rounded-md border"
                                        />
                                    </div>
                                )}
                                {transactionForm.errors.date && (
                                    <p className="text-sm text-red-500 mt-1">{transactionForm.errors.date}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="description" className="block mb-2 text-gray-900">Description (Optional)</Label>
                                <Input
                                    id="description"
                                    value={transactionForm.data.description}
                                    onChange={(e) => transactionForm.setData("description", e.target.value)}
                                    placeholder="What was this transaction for?"
                                    className="h-12"
                                />
                            </div>
                        </div>

                        <DialogFooter className="flex gap-3 mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsTransactionModalOpen(false)}
                                className="flex-1 h-12"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={transactionForm.processing}
                                className="flex-1 h-12"
                            >
                                {transactionForm.processing ? "Saving..." : "Save Transaction"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Add Account Modal */}
            <Dialog open={isAccountModalOpen} onOpenChange={setIsAccountModalOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Add Account</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitAccount}>
                        <div className="grid gap-5 mb-5">
                            <div>
                                <Label htmlFor="account_name" className="block mb-2 text-gray-900">Account Name</Label>
                                <Input
                                    id="account_name"
                                    value={accountForm.data.name}
                                    onChange={(e) => accountForm.setData("name", e.target.value)}
                                    placeholder="My Bank Account"
                                    className="h-12"
                                />
                                {accountForm.errors.name && (
                                    <p className="text-sm text-red-500 mt-1">{accountForm.errors.name}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="balance" className="block mb-2 text-gray-900">Initial Balance</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                                    <Input
                                        id="balance"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={accountForm.data.balance}
                                        onChange={(e) => accountForm.setData("balance", e.target.value)}
                                        className="pl-10 h-12"
                                    />
                                </div>
                                {accountForm.errors.balance && (
                                    <p className="text-sm text-red-500 mt-1">{accountForm.errors.balance}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="account_type" className="block mb-2 text-gray-900">Account Type</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div
                                        className={`h-20 flex flex-col items-center justify-center border rounded-lg cursor-pointer transition-all ${accountForm.data.account_type === 'cash' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:bg-gray-50'}`}
                                        onClick={() => accountForm.setData("account_type", "cash")}
                                    >
                                        <Wallet className={`h-6 w-6 mb-2 ${accountForm.data.account_type === 'cash' ? 'text-yellow-500' : 'text-gray-500'}`} />
                                        <span className={`text-sm font-medium ${accountForm.data.account_type === 'cash' ? 'text-yellow-700' : 'text-gray-700'}`}>Cash</span>
                                    </div>
                                    <div
                                        className={`h-20 flex flex-col items-center justify-center border rounded-lg cursor-pointer transition-all ${accountForm.data.account_type === 'bank' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                                        onClick={() => accountForm.setData("account_type", "bank")}
                                    >
                                        <Building className={`h-6 w-6 mb-2 ${accountForm.data.account_type === 'bank' ? 'text-blue-500' : 'text-gray-500'}`} />
                                        <span className={`text-sm font-medium ${accountForm.data.account_type === 'bank' ? 'text-blue-700' : 'text-gray-700'}`}>Bank</span>
                                    </div>
                                    <div
                                        className={`h-20 flex flex-col items-center justify-center border rounded-lg cursor-pointer transition-all ${accountForm.data.account_type === 'card' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'}`}
                                        onClick={() => accountForm.setData("account_type", "card")}
                                    >
                                        <CreditCard className={`h-6 w-6 mb-2 ${accountForm.data.account_type === 'card' ? 'text-purple-500' : 'text-gray-500'}`} />
                                        <span className={`text-sm font-medium ${accountForm.data.account_type === 'card' ? 'text-purple-700' : 'text-gray-700'}`}>Card</span>
                                    </div>
                                    <div
                                        className={`h-20 flex flex-col items-center justify-center border rounded-lg cursor-pointer transition-all ${accountForm.data.account_type === 'mobile' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
                                        onClick={() => accountForm.setData("account_type", "mobile")}
                                    >
                                        <Smartphone className={`h-6 w-6 mb-2 ${accountForm.data.account_type === 'mobile' ? 'text-green-500' : 'text-gray-500'}`} />
                                        <span className={`text-sm font-medium ${accountForm.data.account_type === 'mobile' ? 'text-green-700' : 'text-gray-700'}`}>Mobile Banking</span>
                                    </div>
                                </div>
                                {accountForm.errors.account_type && (
                                    <p className="text-sm text-red-500 mt-1">{accountForm.errors.account_type}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="notes" className="block mb-2 text-gray-900">Notes (Optional)</Label>
                                <Input
                                    id="notes"
                                    value={accountForm.data.notes}
                                    onChange={(e) => accountForm.setData("notes", e.target.value)}
                                    placeholder="Any additional details"
                                    className="h-12"
                                />
                            </div>
                        </div>

                        <DialogFooter className="flex gap-3 mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAccountModalOpen(false)}
                                className="flex-1 h-12"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={accountForm.processing}
                                className="flex-1 h-12"
                            >
                                {accountForm.processing ? "Creating..." : "Create Account"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Add Category Modal */}
            <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Add Category</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitCategory}>
                        <div className="grid gap-5 mb-5">
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    type="button"
                                    className={`flex items-center justify-center h-12 ${categoryForm.data.type === "expense"
                                            ? "bg-red-500 hover:bg-red-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    onClick={() => {
                                        categoryForm.setData("type", "expense");
                                        setCategoryType("expense");
                                    }}
                                >
                                    <ArrowDownRight className="w-5 h-5 mr-2" />
                                    <span className="font-medium">Expense</span>
                                </Button>
                                <Button
                                    type="button"
                                    className={`flex items-center justify-center h-12 ${categoryForm.data.type === "income"
                                            ? "bg-green-500 hover:bg-green-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    onClick={() => {
                                        categoryForm.setData("type", "income");
                                        setCategoryType("income");
                                    }}
                                >
                                    <ArrowUpRight className="w-5 h-5 mr-2" />
                                    <span className="font-medium">Income</span>
                                </Button>
                            </div>

                            <div>
                                <Label htmlFor="category_name" className="block mb-2 text-gray-900">Category Name</Label>
                                <Input
                                    id="category_name"
                                    value={categoryForm.data.name}
                                    onChange={(e) => categoryForm.setData("name", e.target.value)}
                                    placeholder="Category Name"
                                    className="h-12"
                                />
                                {categoryForm.errors.name && (
                                    <p className="text-sm text-red-500 mt-1">{categoryForm.errors.name}</p>
                                )}
                            </div>

                            <div>
                                <Label className="block mb-2 text-gray-900">Color</Label>
                                <div className="grid grid-cols-8 gap-3">
                                    {[
                                        "#3B82F6", // blue
                                        "#10B981", // green
                                        "#F59E0B", // amber
                                        "#EF4444", // red
                                        "#8B5CF6", // purple
                                        "#EC4899", // pink
                                        "#06B6D4", // cyan
                                        "#84CC16", // lime
                                    ].map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            className={cn(
                                                "w-9 h-9 rounded-full border-2 transition-all",
                                                categoryForm.data.color === color ? "border-gray-900 scale-110" : "border-transparent hover:scale-110"
                                            )}
                                            style={{ backgroundColor: color }}
                                            onClick={() => categoryForm.setData("color", color)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="flex gap-3 mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCategoryModalOpen(false)}
                                className="flex-1 h-12"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={categoryForm.processing}
                                className="flex-1 h-12"
                            >
                                {categoryForm.processing ? "Creating..." : "Create Category"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div
                className="fixed bottom-6 right-6 z-40 md:hidden"
                onClick={() => setIsTransactionModalOpen(true)}
            >
                <Button
                    size="lg"
                    className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 group relative"
                >
                    <PlusCircle className="h-7 w-7" />
                    <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                        +
                    </span>
                    <span className="sr-only">Add transaction</span>
                </Button>
            </div>
        </AdminLayout>
    );
}
