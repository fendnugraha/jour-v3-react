import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import Modal from "@/Components/Modal";
import CreateTransfer from "./Journal/CreateTransfer";
import JournalTable from "./Journal/JournalTable";
import CreateCashWithdrawal from "./Journal/CreateCashWithdrawal";
import Dropdown from "@/Components/Dropdown";

export default function Dashboard({ auth, title, charts, journals }) {
  let [isOpenCreateTransfer, setIsOpenCreateTransfer] = useState(false);
  let [isOpenCreateCashWithdrawal, setIsOpenCreateCashWithdrawal] =
    useState(false);

  function closeModal() {
    setIsOpenCreateTransfer(false);
    setIsOpenCreateCashWithdrawal(false);
  }

  function openModalCreateTransfer() {
    setIsOpenCreateTransfer(true);
  }

  function openModalCreateCashWithdrawal() {
    setIsOpenCreateCashWithdrawal(true);
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          {title}
        </h2>
      }
    >
      <Head title="Dashboard" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <button
            onClick={openModalCreateTransfer}
            className="w-full sm:w-40 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mr-2"
          >
            Transfer Uang
          </button>
          <Modal
            show={isOpenCreateTransfer}
            onClose={closeModal}
            title={"Create Transfer"}
          >
            <CreateTransfer charts={charts} />
          </Modal>
          <button
            onClick={openModalCreateCashWithdrawal}
            className="w-full sm:w-40 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mr-2"
          >
            Tarik Tunai
          </button>
          <Modal
            show={isOpenCreateCashWithdrawal}
            onClose={closeModal}
            title={"Create CashWithdrawal"}
          >
            <CreateCashWithdrawal charts={charts} />
          </Modal>
          <button
            onClick={openModalCreateCashWithdrawal}
            className="w-full sm:min-w-40 sm:max-w-fit bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 mr-2"
          >
            Voucher & Deposit
          </button>
          <button
            onClick={openModalCreateCashWithdrawal}
            className="w-full sm:min-w-40 sm:max-w-fit bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4 mr-2"
          >
            Kas Keluar
          </button>

          <JournalTable journals={journals} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
