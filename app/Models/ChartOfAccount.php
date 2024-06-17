<?php

namespace App\Models;

use Carbon\Carbon;
use App\Models\Warehouse;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ChartOfAccount extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function debt()
    {
        return $this->hasMany(Journal::class, 'debt_code', 'acc_code');
    }

    public function cred()
    {
        return $this->hasMany(Journal::class, 'cred_code', 'acc_code');
    }

    public function warehouse()
    {
        return $this->hasMany(Warehouse::class);
    }

    public function scopeFilterAccount($query, array $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where('acc_name', 'like', '%' . $search . '%')
                ->orWhere('acc_code', 'like', '%' . $search . '%')
                ->orWhereHas('account', function ($query) use ($search) {
                    $query->where('name', 'like', '%' . $search . '%');
                });
        });
    }
    public function acc_code($account_id)
    {
        $accounts = Account::find($account_id);

        $lastCode = DB::table('chart_of_accounts')
            ->select(DB::raw('MAX(RIGHT(acc_code,3)) AS lastCode'))
            ->where('account_id', $account_id)
            ->get();

        if ($lastCode[0]->lastCode != null) {
            $kd = $lastCode[0]->lastCode + 1;
        } else {
            $kd = "001";
        }

        return $accounts->code . '-' . \sprintf("%03s", $kd);
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function endBalanceBetweenDate($account_code, $start_date, $end_date)
    {
        $initBalance = $this->where('acc_code', $account_code)->first();
        $transaction = Journal::whereBetween('date_issued', [
            Carbon::parse($start_date)->startOfDay(),
            Carbon::parse($end_date)->endOfDay(),
        ])
            ->where('debt_code', $account_code)
            ->orWhere('cred_code', $account_code)
            ->whereBetween('date_issued', [
                Carbon::parse($start_date)->startOfDay(),
                Carbon::parse($end_date)->endOfDay(),
            ])
            ->get();

        $debit = $transaction->where('debt_code', $account_code)->sum('amount');
        $kredit = $transaction->where('cred_code', $account_code)->sum('amount');

        if ($initBalance->Account->status == "D") {
            return $initBalance->st_balance + $debit - $kredit;
        } else {
            return $initBalance->st_balance + $kredit - $debit;
        }
    }

    public function equityCount($end_date, $includeEquity = true)
    {
        $coa = $this->all();

        foreach ($coa as $coaItem) {
            $coaItem->balance = $this->endBalanceBetweenDate($coaItem->acc_code, '0000-00-00', $end_date);
        }

        $initBalance = $coa->where('acc_code', '30100-001')->first()->st_balance;
        $assets = $coa->whereIn('account_id', \range(1, 18))->sum('balance');
        $liabilities = $coa->whereIn('account_id', \range(19, 25))->sum('balance');
        $equity = $coa->where('account_id', 26)->sum('balance');

        // Use Eloquent to update a specific record
        $this->where('acc_code', '30100-001')->update(['st_balance' => $initBalance + $assets - $liabilities - $equity]);

        // Return the calculated equity
        return ($includeEquity ? $initBalance : 0) + $assets - $liabilities - ($includeEquity ? $equity : 0);
    }
}
