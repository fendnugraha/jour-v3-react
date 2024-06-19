import { usePage } from "@inertiajs/react";

export default function CashBankBalance({ accounts }) {
  const accountArray = Object.keys(accounts).map((key) => accounts[key]);

  function formatNumber(num) {
    return new Number(num).toLocaleString("id-ID");
  }
  return (
    <>
      <div className="w-full flex items-center justify-center flex-col text-white py-4  rounded-xl mb-2 bg-orange-600">
        <span className="text-xs font-medium">Total Kas & Bank</span>
        <h1 className="text-2xl font-bold">
          {formatNumber(accountArray.reduce((a, b) => a + b.balance, 0))}
        </h1>
      </div>
      {accountArray.map((account) => (
        <div
          className="w-full flex justify-center justify-items-stretch flex-col text-slate-800 mb-2"
          key={account.id}
        >
          <span className="text-xs text-sl font-medium rounded-md">
            {account.acc_name}
          </span>
          <h1 className="text-xl font-semibold text-right bg-slate-200 py-1 px-3 rounded-lg">
            {formatNumber(account.balance)}
          </h1>
        </div>
      ))}
    </>
  );
}
