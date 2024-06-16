export default function JournalTable() {
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
        <tbody></tbody>
      </table>
    </>
  );
}
