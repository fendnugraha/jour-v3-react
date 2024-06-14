import Modal from "@/Components/Modal";
import Paginator from "@/Components/Paginator";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import CreateAccount from "./CreateAccount";
import EditAccount from "./EditAccount";

export default function AccountTable({
  chartofaccounts,
  auth,
  filters,
  accounts,
}) {
  const [search, setSearch] = useState("");
  const [accountId, setAccountId] = useState("");
  //   console.log(chartofaccounts);
  let [isOpenCreateAccount, setIsOpenCreateAccount] = useState(false);
  let [isOpenEditAccount, setIsOpenEditAccount] = useState(false);
  const [isNotify, setIsNotify] = useState(false);
  const openModalCreateAccount = () => {
    setIsOpenCreateAccount(true);
  };

  const openModalEditAccount = (accountId) => {
    setIsOpenEditAccount(true);
    setAccountId(accountId);
  };

  const closeModal = () => {
    setIsOpenCreateAccount(false);
    setIsOpenEditAccount(false);
  };
  const doSearchData = (e) => {
    e.preventDefault();
    router.get("/setting/account", { search }, { preserveState: true });
  };

  useEffect(() => {
    if (isNotify) {
      setTimeout(() => {
        setIsNotify(false);
      }, 3000);
    }
  }, [isNotify]);

  const handleDelete = (accountId) => {
    if (confirm("Are you sure you want to delete this account?")) {
      router.delete(`/setting/account/${accountId}`, {
        onSuccess: () => {
          setIsNotify("Account deleted successfully");
        },
      });
    }
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
      {isNotify && (
        <div
          className="bg-green-300 py-2 px-4 rounded-md text-green-800 fixed bottom-4 right-5 z-[1000]"
          role="alert"
        >
          {isNotify}
        </div>
      )}
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <button
            onClick={openModalCreateAccount}
            className="bg-sky-900 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded-lg mb-3"
          >
            Create Account
          </button>
          <Modal
            show={isOpenCreateAccount}
            onClose={closeModal}
            title={"Create Account"}
          >
            <CreateAccount accounts={accounts} />
          </Modal>
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-3">
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
                  <th className="p-4">ID</th>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Starting Balance</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {chartofaccounts.data.map((account, index) => (
                  <tr
                    className="odd:bg-white even:bg-blue-50 text-xs text-sky-950 hover:bg-slate-500 hover:text-white"
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
                      <button
                        onClick={() => openModalEditAccount(account.id)}
                        className="bg-yellow-300 px-2 py-1 rounded-lg hover:bg-yellow-200 transition ease-out"
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-400 px-2 py-1 rounded-lg ml-2 hover:bg-red-300 text-white transition ease-out"
                        onClick={() => handleDelete(account.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Paginator links={chartofaccounts} />

            <Modal
              show={isOpenEditAccount}
              onClose={closeModal}
              title={"Edit Account"}
            >
              <EditAccount
                accountId={accountId}
                chartofaccounts={chartofaccounts}
              />
            </Modal>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
