import { Link } from "@inertiajs/react";
import Paginator from "../../Components/Paginator";

export default function JournalTable({ journals }) {
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
            <tr
              key={journal.id}
              className="odd:bg-white even:bg-blue-50 text-xs text-sky-950 hover:bg-slate-500 hover:text-white"
            >
              <td className="text-center p-4">{index + 1}</td>
              <td className="text-center p-4">{journal.date_issued}</td>
              <td className="p-4">{journal.description}</td>
              <td className="p-4">
                {new Intl.NumberFormat().format(journal.amount)}
              </td>
              <td className="p-4">
                {new Intl.NumberFormat().format(journal.fee_amount)}
              </td>
              <td className="p-4">
                <div className="flex gap-3">
                  {/* <Link
                    href={route("journal.show", journal.id)}
                    as="button"
                    method="get"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Show
                  </Link>
                  <Link
                    href={route("journal.edit", journal.id)}
                    as="button"
                    method="get"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Edit
                  </Link> */}
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
