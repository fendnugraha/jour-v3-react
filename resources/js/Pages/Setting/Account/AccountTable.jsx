import Paginator from "@/Components/Paginator";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

export default function AccountTable({ accounts, auth }) {
  const [search, setSearch] = useState("");
  //   console.log(accounts);
  const handleSubmit = (e) => {
    e.preventDefault();
    route.get("/account", { search }, { replace: true });
  };
  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Setting - Chart of Account
        </h2>
      }
    >
      <Head title="Setting" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-2">
            <form onSubmit={handleSubmit}>
              <TextInput
                type="search"
                placeholder="Search..."
                className="w-full"
                onChange={handleChange}
              />
              <PrimaryButton>Search</PrimaryButton>
            </form>
          </div>
          <table className="table-auto w-full mb-2">
            <thead className="bg-white text-blue-950 text-sm">
              <tr className="border-b">
                <th className="p-4">ID</th>
                <th>Code</th>
                <th>Name</th>
                <th>Type</th>
                <th>Starting Balance</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {accounts.data.map((account, index) => (
                <tr
                  className="border-b odd:bg-white even:bg-blue-100 text-xs"
                  key={index}
                >
                  <td className="p-3">{account.id}</td>
                  <td className="p-3">{account.acc_code}</td>
                  <td className="p-3">{account.acc_name}</td>
                  <td className="p-3">{account.account.name}</td>
                  <td className="text-right p-3">
                    {Intl.NumberFormat().format(account.st_balance)}
                  </td>
                  <td className="text-center">
                    <button className="mr-2">Edit</button>
                    <button>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Paginator links={accounts} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
