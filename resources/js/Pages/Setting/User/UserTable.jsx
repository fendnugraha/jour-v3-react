import {
  EyeIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function UserTable({ users }) {
  const [search, setSearch] = useState("");
  const doSearchData = (e) => {
    e.preventDefault();
    router.get("/setting/user", { search }, { preserveState: true });
  };

  const deleteUser = (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      router.delete(`/setting/user/${id}`, {
        onSuccess: () => {
          setIsNotify("User deleted successfully");
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
              className="w-20 bg-slate-600 text-white flex justify-center items-center rounded-e-lg hover:bg-slate-500"
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
      <table className="table-auto w-full mb-2">
        <thead className="bg-white text-sky-950 text-sm">
          <tr className="border-b-2">
            <th className="p-3">No</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Created At</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.data.map((user, index) => (
            <tr
              key={user.id}
              className="odd:bg-white even:bg-violet-100 text-xs text-sky-950 hover:bg-slate-500 hover:text-white"
            >
              <td className="text-center p-2">{index + 1}</td>
              <td className="">{user.name}</td>
              <td className="">{user.email}</td>
              <td className="text-center">
                {new Date(user.created_at).toLocaleString("id-ID")}
              </td>
              <td className="p-2 flex gap-2 items-center justify-center">
                <Link
                  href={route("setting.user.edit", user.id)}
                  className="bg-yellow-300 hover:bg-yellow-200 text-slate-800 font-bold py-1 px-2 rounded-md"
                >
                  <EyeIcon className="size-5" />
                </Link>
                <button
                  className="bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-2 rounded-md"
                  onClick={() => deleteUser(user.id)}
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
