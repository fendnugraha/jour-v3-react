import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import Modal from "@/Components/Modal";
import CreateTransfer from "./Journal/CreateTransfer";
import JournalTable from "./Journal/JournalTable";

export default function Dashboard({ auth, title, charts }) {
  let [isOpenCreateTransfer, setIsOpenCreateTransfer] = useState(false);

  function closeModal() {
    setIsOpenCreateTransfer(false);
    setIsOpenCreateTransfer(false);
  }

  function openModalCreateTransfer() {
    setIsOpenCreateTransfer(true);
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

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <button
            onClick={openModalCreateTransfer}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Transfer
          </button>
          <Modal
            show={isOpenCreateTransfer}
            onClose={closeModal}
            title={"Create Transfer"}
          >
            <CreateTransfer charts={charts} />
          </Modal>
          <JournalTable />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
