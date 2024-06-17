import { Link } from "@inertiajs/react";
import Paginator from "../../Components/Paginator";

export default function JournalTable({ journals, cash }) {
  return (
    <>
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
            <tr key={journal.id} className="odd:bg-white even:bg-blue-50">
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
                  {/* Example of Link usage in Next.js */}
                  {/* <Link href={`/journal/${journal.id}`} >
          <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Show</a>
        </Link> */}
                  <Link
                    href={`/journal/edit/${journal.id}`}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                  >
                    Edit
                  </Link>
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
