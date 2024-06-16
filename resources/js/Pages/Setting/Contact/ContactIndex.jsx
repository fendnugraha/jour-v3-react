import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import ContactTable from "./ContactTable";
import { useState } from "react";
import Modal from "@/Components/Modal";
import CreateContact from "./CreateContact";

export default function ContactIndex({ auth, title, contacts }) {
  const [isOpenCreateContact, setIsOpenCreateContact] = useState(false);
  function closeModal() {
    setIsOpenCreateContact(false);
  }

  function openModalCreateContact() {
    setIsOpenCreateContact(true);
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
      <Head title="Setting" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <button
            onClick={openModalCreateContact}
            className="bg-sky-900 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded-lg mb-3 mr-3"
          >
            Add Contact
          </button>
          <Modal
            show={isOpenCreateContact}
            onClose={closeModal}
            title={"Create User"}
          >
            <CreateContact />
          </Modal>
          <ContactTable contacts={contacts} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
