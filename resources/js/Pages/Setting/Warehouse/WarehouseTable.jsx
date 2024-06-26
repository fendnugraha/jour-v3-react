import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function WarehouseTable({ warehouses }) {
  const [search, setSearch] = useState("");
  const [isNotify, setIsNotify] = useState(false);
  const doSearchData = (e) => {
    e.preventDefault();
    router.get("/setting/warehouse", { search }, { preserveState: true });
  };

  const deleteWarehouse = (id) => {
    if (confirm("Are you sure you want to delete this warehouse?")) {
      router.delete(`/setting/warehouse/${id}`, {
        onSuccess: () => {
          setIsNotify("Warehouse deleted successfully");
        },
      });
    }
  };
  return (
    <>
      <div className="mb-2 grid grid-cols-2 gap-3">
        <div></div>
        <form onSubmit={doSearchData}>
          <div className="flex">
            <input
              type="search"
              placeholder="Search..."
              className="w-full rounded-s-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="w-40 bg-slate-600 text-white rounded-e-lg hover:bg-slate-500"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      <table className="table-auto w-full mb-2">
        <thead className="bg-white text-blue-950 text-sm">
          <tr className="border-b">
            <th className="p-4">No</th>
            <th>Name</th>
            <th>Location</th>
            <th>Account</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {warehouses.data.map((warehouse, index) => (
            <tr
              className="odd:bg-white even:bg-blue-50 text-xs text-sky-950 hover:bg-slate-500 hover:text-white"
              key={warehouse.id}
            >
              <td className="text-center p-3">{index + 1}</td>
              <td className="p-3">{warehouse.name}</td>
              <td className="p-3">{warehouse.location}</td>
              <td className="p-3">{warehouse.chart_of_account.acc_name}</td>
              <td className="text-center p-3 flex gap-2 items-center">
                <Link
                  href={route("setting.warehouse.edit", warehouse.id)}
                  className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-1 px-2 rounded-md"
                >
                  <EyeIcon className="size-5" />
                </Link>
                <button
                  className="bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-2 rounded-md"
                  onClick={() => deleteWarehouse(warehouse.id)}
                >
                  <TrashIcon className="size-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
