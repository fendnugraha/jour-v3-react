<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use function Termwind\render;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Setting/Product/ProductIndex', [
            'title' => 'Product',
            'products' => \App\Models\Product::orderBy('name')->paginate(10)->withQueryString(),
        ]);
    }

    public function edit($id)
    {
        $product = \App\Models\Product::find($id);
        return Inertia::render('Setting/Product/EditProduct', [
            'title' => 'Edit Product - ' . $product->name,
            'product' => $product
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = \App\Models\Product::find($id);
        $product->update($request->all());
        return redirect()->route('setting.product');
    }

    public function destroy($id)
    {
        $product = \App\Models\Product::find($id);
        $product->delete();
        return redirect()->route('setting.product');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'cost' => 'required',
            'price' => 'required',
        ]);

        \App\Models\Product::create($request->all());

        return redirect()->route('setting.product')->with('success', 'Product created successfully');
    }
}
