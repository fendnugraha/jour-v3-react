import { usePage } from "@inertiajs/react";

export default function CashBankBalance() {
  const { accounts } = usePage().props;
  console.log(accounts);
  return (
    <>
      <h1 className="text-xl font-semibold mb-2">Cash Bank Balance</h1>
      <table className="table-auto w-full text-xs mb-2">
        <tbody className="">
          {/* {accounts.map((account) => (
            <tr key={account.id}>
              <td className="p-4">{account.acc_name}</td>
              <td className="p-4">{account.balance}</td>
            </tr>
          ))} */}
        </tbody>
      </table>
    </>
  );
}
