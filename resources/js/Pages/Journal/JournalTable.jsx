import { Link, router, usePage } from "@inertiajs/react";
import Paginator from "../../Components/Paginator";
import { useEffect, useState } from "react";

export default function JournalTable({ journals, cash, warehouses }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so we add 1
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

  const [search, setSearch] = useState("");
  const [isTaken, setIsTaken] = useState("");
  const [isFree, setIsFree] = useState("");
  const [startDate, setStartDate] = useState(formattedDate);
  const [endDate, setEndDate] = useState(formattedDate);
  const [selectWarehouse, setSelectWarehouse] = useState("");
  const [perPage, setPerPage] = useState(5);

  const [isNotify, setIsNotify] = useState("");

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
            className="w-full rounded-lg"
          />
          <input
            type="datetime-local"
            name="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-lg"
          />
          <select
            name="is_taken"
            value={isTaken}
            onChange={(e) => setIsTaken(e.target.value)}
            className="w-40 rounded-lg"
          >
            <option value="">Semua</option>
            <option value="1">Diambil</option>
            <option value="2">Belum diambil</option>
          </select>
          <select
            name="is_free"
            value={isFree}
            className="w-40 rounded-lg"
            onChange={(e) => setIsFree(e.target.value)}
          >
            <option value="">Semua</option>
            <option value="1">Free</option>
            <option value="0">Paid</option>
          </select>
        </div>
        <div className="flex gap-2 mb-2">
          <input
            type="search"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg"
            placeholder="Search..."
          />
          <select
            name="warehouse"
            className="w-full rounded-lg"
            onChange={(e) => setSelectWarehouse(e.target.value)}
            value={selectWarehouse}
          >
            <option value="">Semua</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>

          <select
            name="perPage"
            className="w-30 rounded-lg"
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
            className="w-72 bg-slate-800 text-white rounded-lg"
          >
            Search
          </button>
        </div>
      </form>

      <table className="table-auto w-full text-xs mb-2">
        <thead className="bg-white text-blue-950">
          <tr className="border-b-2">
            <th className="p-4">ID</th>
            <th>Waktu</th>
            <th>Keterangan</th>
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
              <td className="text-center p-4">{index + 1}</td>
              <td className="text-center p-4">{journal.date_issued}</td>
              <td className="p-4">
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
                <div className="flex gap-3 items-center justify-center">
                  <Link
                    href={`/journal/edit/${journal.id}`}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteJournal(journal.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                  >
                    Delete
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
