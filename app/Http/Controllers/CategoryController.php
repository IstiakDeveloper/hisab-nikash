<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::where('tenant_id', Auth::user()->tenant_id)
            ->where('user_id', Auth::id())
            ->withCount('transactions')
            ->get();

        // Group categories by type and convert to arrays
        $categoriesByType = [
            'income' => $categories->where('type', 'income')->values()->all(),
            'expense' => $categories->where('type', 'expense')->values()->all()
        ];

        return Inertia::render('Categories/Index', [
            'categories' => $categoriesByType
        ]);
    }

    public function create()
    {
        return Inertia::render('Categories/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
            'icon' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:255'
        ]);

        $category = Category::create([
            'tenant_id' => Auth::user()->tenant_id,
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'type' => $validated['type'],
            'icon' => $validated['icon'] ?? null,
            'color' => $validated['color'] ?? null
        ]);

        return redirect()->route('categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function edit(Category $category)
    {
        $this->authorize('view', $category);

        return Inertia::render('Categories/Edit', [
            'category' => $category
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $this->authorize('update', $category);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
            'icon' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:255'
        ]);

        $category->update($validated);

        return redirect()->route('categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        $this->authorize('delete', $category);

        // Check if category has any transactions before deleting
        $hasTransactions = $category->transactions()->exists();

        if ($hasTransactions) {
            return back()->with('error', 'Cannot delete category with existing transactions.');
        }

        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Category deleted successfully.');
    }

    public function analysis()
    {
        $userId = Auth::id();
        $tenantId = Auth::user()->tenant_id;

        // Category-wise total amounts for expenses
        $expenseCategories = DB::table('transactions')
            ->where('tenant_id', $tenantId)
            ->where('user_id', $userId)
            ->where('type', 'expense')
            ->select(
                'category_id',
                DB::raw('SUM(amount) as total_amount'),
                DB::raw('COUNT(*) as transaction_count')
            )
            ->groupBy('category_id')
            ->get();

        // Category-wise total amounts for income
        $incomeCategories = DB::table('transactions')
            ->where('tenant_id', $tenantId)
            ->where('user_id', $userId)
            ->where('type', 'income')
            ->select(
                'category_id',
                DB::raw('SUM(amount) as total_amount'),
                DB::raw('COUNT(*) as transaction_count')
            )
            ->groupBy('category_id')
            ->get();

        // Fetch category details
        $expenseCategoryDetails = Category::whereIn(
            'id',
            $expenseCategories->pluck('category_id')
        )->get()->keyBy('id');

        $incomeCategoryDetails = Category::whereIn(
            'id',
            $incomeCategories->pluck('category_id')
        )->get()->keyBy('id');

        return Inertia::render('Categories/Analysis', [
            'expense_categories' => $expenseCategories->map(function ($category) use ($expenseCategoryDetails) {
                $categoryDetail = $expenseCategoryDetails->get($category->category_id);
                return [
                    'name' => $categoryDetail->name,
                    'icon' => $categoryDetail->icon,
                    'color' => $categoryDetail->color,
                    'total_amount' => $category->total_amount,
                    'transaction_count' => $category->transaction_count
                ];
            }),
            'income_categories' => $incomeCategories->map(function ($category) use ($incomeCategoryDetails) {
                $categoryDetail = $incomeCategoryDetails->get($category->category_id);
                return [
                    'name' => $categoryDetail->name,
                    'icon' => $categoryDetail->icon,
                    'color' => $categoryDetail->color,
                    'total_amount' => $category->total_amount,
                    'transaction_count' => $category->transaction_count
                ];
            })
        ]);
    }
}
