import { useEffect, useState } from "react";

export default function MutationHistory({ data, charts, journals }) {
  const chartsArr = Object.values(charts);
  const journalsArr = Object.values(journals);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);

  function formatNumber(num) {
    return new Number(num).toLocaleString("id-ID");
  }

  const chartsTotal = chartsArr.reduce((a, b) => a + b.balance, 0);
  console.log(journalsArr);
  const calculateDebt = (selectedAccount) => {
    let sum = 0;
    journalsArr.forEach((journal) => {
      if (journal.debt_code === selectedAccount) {
        sum += journal.amount;
      }
    });
    return sum;
  };

  const calculateCredit = (selectedAccount) => {
    let sum = 0;
    journalsArr.forEach((journal) => {
      if (journal.cred_code === selectedAccount) {
        sum += journal.amount;
      }
    });
    return sum;
  };

  useEffect(() => {
    const filterejJournals = journalsArr.filter(
      (journal) => journal.debt_code === chartsArr.acc_code
    );
    setTotalCredit(filterejJournals.reduce((a, b) => a + b.amount, 0));
    setTotalDebt(filterejJournals.reduce((a, b) => a + b.amount, 0));
  }, [chartsTotal]);

  return (
    <div className="my-5">
      <table className="table-auto w-full text-xs mb-2">
        <thead className="bg-white text-blue-950">
          <tr className="border-b">
            <th className="text-left p-3">Nama Akun</th>
            <th className="text-center">Saldo Akhir</th>
            <th className="text-center">Mutasi Masuk</th>
            <th className="text-center">Mutasi keluar</th>
            <th className="text-center">Sisa</th>
          </tr>
        </thead>
        <tbody>
          {chartsArr.map((chart) => (
            <tr
              key={chart.id}
              className="border-b border-slate-100 odd:bg-white even:bg-blue-50"
            >
              <td className="p-2">{chart.acc_name}</td>
              <td className="text-right p-2 text-blue-500 font-bold">
                {formatNumber(chart.balance)}
              </td>
              <td className="text-right">
                {formatNumber(calculateDebt(chart.acc_code))}
              </td>
              <td className="text-right">
                {formatNumber(calculateCredit(chart.acc_code))}
              </td>
              <td className="text-right"></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-y border-slate-100 odd:bg-white even:bg-blue-50 font-bold">
            <td className="p-2">Total</td>
            <td className="text-right p-2 text-red-500">
              {formatNumber(chartsTotal)}
            </td>
            <td className="text-right">{formatNumber(totalDebt)}</td>
            <td className="text-right">{formatNumber(totalCredit)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
