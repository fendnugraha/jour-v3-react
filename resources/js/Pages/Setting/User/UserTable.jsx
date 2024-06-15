import { EyeIcon } from "@heroicons/react/24/outline";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function UserTable({ users }) {
  const [search, setSearch] = useState("");
  const doSearchData = (e) => {
    e.preventDefault();
    router.get("/setting/user", { search }, { preserveState: true });
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
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.data.map((user, index) => (
            <tr
              key={user.id}
              className="odd:bg-white even:bg-blue-50 text-xs text-sky-950 hover:bg-slate-500 hover:text-white"
            >
              <td className="p-3">{index + 1}</td>
              <td className="">{user.name}</td>
              <td className="">{user.email}</td>
              <td className="p-3 flex gap-2 items-center justify-center">
                <Link
                  href={route("setting.user.edit", user.id)}
                  className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-1 px-2 rounded-md"
                >
                  <EyeIcon className="size-5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
