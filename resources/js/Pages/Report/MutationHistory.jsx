import Modal from "@/Components/Modal";
import { useEffect, useState } from "react";
import CreateBankTransfer from "./CreateBankTransfer";

export default function MutationHistory({
  data,
  charts,
  journals,
  hq,
  warehouses,
}) {
  const chartsArr = Object.values(charts);
  const journalsArr = Object.values(journals);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebt, setTotalDebt] = useState(0);
  const [isOpenCreateBankTransfer, setIsOpenCreateBankTransfer] =
    useState(false);

  function openModalCreateBankTransfer() {
    setIsOpenCreateBankTransfer(true);
  }

  function closeModal() {
    setIsOpenCreateBankTransfer(false);
  }

  function formatNumber(num) {
    return new Number(num).toLocaleString("id-ID");
  }

  const chartsTotal = chartsArr.reduce((a, b) => a + b.balance, 0);
  const accountsCode = chartsArr.map((chart) => chart.acc_code);

  useEffect(() => {
    setTotalCredit(
      journalsArr
        .filter((journal) => accountsCode.includes(journal.cred_code))
        .reduce((sum, journal) => sum + journal.amount, 0)
    );
    setTotalDebt(
      journalsArr
        .filter((journal) => accountsCode.includes(journal.debt_code))
        .reduce((sum, journal) => sum + journal.amount, 0)
    );
  }, [journalsArr, accountsCode]);

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
  return (
    <>
      <div className="my-5 bg-white p-3 rounded-lg">
        <button
          onClick={openModalCreateBankTransfer}
          className="w-full sm:w-40 bg-blue-500 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-md mb-1 mr-2"
        >
          Mutasi Saldo
        </button>
        <Modal
          show={isOpenCreateBankTransfer}
          onClose={closeModal}
          title={"Penambahan Saldo Cabang"}
        >
          <CreateBankTransfer
            charts={chartsArr}
            hq={hq}
            warehouses={warehouses}
          />
        </Modal>
        <h1 className="my-3 font-bold">Mutasi Saldo</h1>
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
                <td className="text-right p-2">
                  {formatNumber(calculateDebt(chart.acc_code))}
                </td>
                <td className="text-right p-2 text-red-500">
                  {formatNumber(calculateCredit(chart.acc_code))}
                </td>
                <td className="text-right p-2"></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-y border-slate-100 odd:bg-white even:bg-blue-50 font-bold">
              <td className="p-2">Total</td>
              <td className="text-right p-2 text-red-500">
                {formatNumber(chartsTotal)}
              </td>
              <td className="text-right p-2">{formatNumber(totalDebt)}</td>
              <td className="text-right p-2">{formatNumber(totalCredit)}</td>
              <td className="text-right p-2">
                {formatNumber(totalDebt - totalCredit)}
              </td>
            </tr>
          </tfoot>
        </table>
        <h1 className="my-3 font-bold">History Mutasi Saldo</h1>
        <table className="table-auto w-full text-xs mb-2">
          <thead className="bg-white text-blue-950">
            <tr className="border-b">
              <th className="text-center p-3">Waktu</th>
              <th className="text-left p-3">Nama Akun</th>
              <th className="text-center">Masuk (Debet)</th>
              <th className="text-center">Keluar (Credit)</th>
            </tr>
          </thead>
          <tbody>
            {journalsArr.map((journal) => (
              <tr
                key={journal.id}
                className="border-b border-slate-100 odd:bg-white even:bg-blue-50"
              >
                <td className="text-center p-2">{journal.date_issued}</td>
                <td className="p-2">
                  <span className="font-bold text-slate-700">
                    {journal.invoice}
                    <br />
                    {journal.cred.acc_name + " --> " + journal.debt.acc_name}
                  </span>
                </td>
                <td className="text-right p-3">
                  {accountsCode.includes(journal.debt_code) &&
                    formatNumber(journal.amount)}
                </td>
                <td className="text-right p-3">
                  {accountsCode.includes(journal.cred_code) &&
                    formatNumber(journal.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
