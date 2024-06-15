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
            'products' => \App\Models\Product::all()
        ]);
    }
}
