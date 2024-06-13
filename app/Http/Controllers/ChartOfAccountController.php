<?php

namespace App\Http\Controllers;

use App\Models\ChartOfAccount;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ChartOfAccountController extends Controller
{
    public $search = '';

    public function index()
    {
        return Inertia::render('Setting/Account/AccountTable', [
            'accounts' => ChartOfAccount::with('account')->where('acc_name', 'like', '%' . $this->search . '%')->paginate(10),
        ]);
    }
}
