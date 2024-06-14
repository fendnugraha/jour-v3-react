import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import WarehouseTable from "./WarehouseTable";
import CreateWarehouse from "./CreateWarehouse";
import { useState } from "react";
import Modal from "@/Components/Modal";
import CreateAccount from "../Account/CreateAccount";

export default function Warehouse({
  auth,
  warehouses,
  accounts,
  chartofaccounts,
}) {
  const [isOpenCreateWarehouse, setIsOpenCreateWarehouse] = useState(false);
  const [isOpenCreateAccount, setIsOpenCreateAccount] = useState(false);
  function closeModal() {
    setIsOpenCreateWarehouse(false);
    setIsOpenCreateAccount(false);
  }

  function openModalCreateWarehouse() {
    setIsOpenCreateWarehouse(true);
  }

  function openModalCreateAccount() {
    setIsOpenCreateAccount(true);
  }

  return (
    <>
      <AuthenticatedLayout
        user={auth.user}
        header={
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Setting - Warehouse
          </h2>
        }
      >
        <Head title="Setting" />
        <div className="py-6">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <button
              onClick={openModalCreateWarehouse}
              className="bg-sky-900 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded-lg mb-3 mr-3"
            >
              Create Warehouse
            </button>
            <Modal
              show={isOpenCreateWarehouse}
              onClose={closeModal}
              title={"Create Warehouse"}
            >
              <CreateWarehouse chartofaccounts={chartofaccounts} />
            </Modal>
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
            <WarehouseTable warehouses={warehouses} />
          </div>
        </div>
      </AuthenticatedLayout>
    </>
  );
}
