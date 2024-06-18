import { Link, router, usePage } from "@inertiajs/react";
import Paginator from "../../Components/Paginator";
import { useEffect, useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function JournalTable({
  journals,
  journalsTotal,
  cash,
  warehouses,
  charts,
  initBalance,
  wh,
}) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so we add 1
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
  const formatNumber = (num) => {
    return new Number(num).toLocaleString("id-ID");
  };

  const [search, setSearch] = useState("");
  const [isTaken, setIsTaken] = useState("");
  const [isFree, setIsFree] = useState("");
  const [startDate, setStartDate] = useState(formattedDate);
  const [endDate, setEndDate] = useState(formattedDate);
  const [selectWarehouse, setSelectWarehouse] = useState(wh);
  const [perPage, setPerPage] = useState(5);
  const [selectedAccount, setSelectedAccount] = useState(cash);
  const [sumDebt, setSumDebt] = useState(0);
  const [sumCredit, setSumCredit] = useState(0);
  const [initAccountBalance, setInitAccountBalance] = useState(0);

  const [isNotify, setIsNotify] = useState("");

  const calculateDebt = (selectedAccount) => {
    let sum = 0;
    journalsTotal.forEach((journal) => {
      if (journal.debt_code === selectedAccount) {
        sum += journal.amount;
      }
    });
    return sum;
  };
  const calculateCredit = (selectedAccount) => {
    let sum = 0;
    journalsTotal.forEach((journal) => {
      if (journal.cred_code === selectedAccount) {
        sum += journal.amount;
      }
    });
    return sum;
  };

  useEffect(() => {
    if (selectedAccount && initBalance) {
      const initBalanceArray = Object.values(initBalance);
      const InitAccountBalances = initBalanceArray.find(
        (initBalance) => initBalance.acc_code === selectedAccount
      );

      if (InitAccountBalances) {
        setInitAccountBalance(InitAccountBalances.st_balance);
      }
    }
  }, [initBalance, selectedAccount]);

  useEffect(() => {
    setSumDebt(calculateDebt(selectedAccount));
    setSumCredit(calculateCredit(selectedAccount));
  }, [journals, selectedAccount]);

  useEffect(() => {
    if (isNotify) {
      setTimeout(() => {
        setIsNotify("");
      }, 3000);
    }
  }, [isNotify]);

  const doSearchData = (e) => {
    e.preventDefault();
    router.get(
      "/dashboard",
      {
        search,
        is_taken: isTaken,
        is_free: isFree,
        start_date: startDate,
        end_date: endDate,
        warehouse_id: selectWarehouse,
        perPage: perPage,
        account_id: selectedAccount,
        journalPage: journals.current_page,
      },
      { preserveState: true }
    );
  };
  const deleteJournal = (id) => {
    if (confirm("Are you sure you want to delete this journal?")) {
      router.delete(`/journal/${id}`, {
        onSuccess: () => {
          setIsNotify("Journal deleted successfully");
        },
      });
    }
  };
  return (
    <>
      <form onSubmit={doSearchData}>
        <div className="flex gap-2 mb-2">
          <input
            type="datetime-local"
            name="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-lg text-sm"
          />
          <input
            type="datetime-local"
            name="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-lg text-sm"
          />
          <select
            name="is_taken"
            value={isTaken}
            onChange={(e) => setIsTaken(e.target.value)}
            className="w-40 rounded-lg text-sm"
          >
            <option value="">Semua</option>
            <option value="1">Diambil</option>
            <option value="2">Belum diambil</option>
          </select>
          <select
            name="is_free"
            value={isFree}
            className="w-40 rounded-lg text-sm"
            onChange={(e) => setIsFree(e.target.value)}
          >
            <option value="">All</option>
            <option value="1">Free</option>
            <option value="0">Paid</option>
          </select>
        </div>
        <div className="flex gap-2 mb-2">
          <select
            name="account"
            className="w-full rounded-lg text-sm"
            onChange={(e) => setSelectedAccount(e.target.value)}
            value={selectedAccount}
          >
            <option value="All">Semua Account</option>
            {charts.map((chart) => (
              <option key={chart.id} value={chart.acc_code}>
                {chart.acc_name}
              </option>
            ))}
          </select>
          <select
            name="warehouse"
            className="w-full rounded-lg text-sm"
            onChange={(e) => setSelectWarehouse(e.target.value)}
            value={selectWarehouse}
          >
            <option value="All">Semua Cabang</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>

          <select
            name="perPage"
            className="w-30 rounded-lg text-sm"
            value={perPage}
            onChange={(e) => setPerPage(e.target.value)}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <button
            type="submit"
            className="w-72 bg-slate-800 text-white rounded-lg text-sm"
          >
            Update
          </button>
        </div>
        <input
          type="search"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg text-sm"
          placeholder="Search..."
        />
      </form>
      <div className="flex gap-2 my-2">
        <div className="bg-orange-600 text-white py-1 rounded-lg w-full flex items-center flex-col">
          <span className="text-xs font-medium">Saldo Awal</span>
          <h1 className="text-sm font-bold">
            {formatNumber(initAccountBalance)}
          </h1>
        </div>
        <div className="bg-orange-600 text-white py-1 rounded-lg w-full flex items-center flex-col">
          <span className="text-xs font-medium">Debet</span>
          <h1 className="text-sm font-bold">{formatNumber(sumDebt)}</h1>
        </div>
        <div className="bg-orange-600 text-white py-1 rounded-lg w-full flex items-center flex-col">
          <span className="text-xs font-medium">Credit</span>
          <h1 className="text-sm font-bold">{formatNumber(sumCredit)}</h1>
        </div>
        <div className="bg-orange-600 text-white py-1 rounded-lg w-full flex items-center flex-col">
          <span className="text-xs font-medium">Saldo Akhir</span>
          <h1 className="text-sm font-bold">
            {formatNumber(initAccountBalance + sumDebt - sumCredit)}
          </h1>
        </div>
      </div>
      <table className="table-auto w-full text-xs mb-2">
        <thead className="bg-white text-blue-950">
          <tr className="border-b-2">
            <th className="p-4">Keterangan</th>
            <th>Jumlah</th>
            <th>Fee admin</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {journals.data.map((journal, index) => (
            <tr
              key={journal.id}
              className={` text-xs text-sky-950 hover:bg-slate-300 hover:text-slate-900 ${
                journal.status === 2
                  ? "bg-orange-100"
                  : "odd:bg-white even:bg-blue-50"
              }`}
            >
              <td className="p-4">
                #{index + 1} {journal.date_issued}
                <br />
                <span className="font-bold">
                  {journal.invoice + " - " + journal.trx_type}
                </span>
                <br />
                {journal.description}{" "}
                {journal.sale
                  ? `${journal.sale.product.name} - ${
                      journal.sale.quantity
                    } x ${new Intl.NumberFormat().format(journal.sale.price)}`
                  : ""}
                <br />
                <span className="font-bold">
                  {journal.cred_code === cash &&
                  journal.trx_type !== "Mutasi Kas"
                    ? journal.debt.acc_name
                    : journal.debt_code === cash &&
                      journal.trx_type !== "Mutasi Kas"
                    ? journal.cred.acc_name
                    : `${journal.cred.acc_name} -> ${journal.debt.acc_name}`}
                </span>
                <span className="italic font-bold text-slate-600">
                  {journal.status === 2 ? "(Belum diambil)" : ""}
                </span>
              </td>
              <td className="p-4">
                {new Intl.NumberFormat().format(journal.amount)}
              </td>
              <td className="p-4">
                {new Intl.NumberFormat().format(journal.fee_amount)}
              </td>
              <td className="text-center p-4">
                <div className="flex gap-1 items-center justify-center">
                  <Link
                    href={`/journal/edit/${journal.id}`}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => deleteJournal(journal.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Paginator links={journals} />
    </>
  );
}
