import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Modal from "@/Components/Modal";
import CreateUser from "./CreateUser";
import UserTable from "./UserTable";

export default function UserIndex({ auth, title, users }) {
  const [isOpenCreateUser, setIsOpenCreateUser] = useState(false);
  function closeModal() {
    setIsOpenCreateUser(false);
  }

  function openModalCreateUser() {
    setIsOpenCreateUser(true);
  }

  return (
    <>
      <AuthenticatedLayout
        user={auth.user}
        header={
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            {title}
          </h2>
        }
      >
        <Head title={title} />
        <div className="py-6">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <button
              onClick={openModalCreateUser}
              className="bg-sky-900 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded-lg mb-3 mr-3"
            >
              Create User
            </button>
            <Modal
              show={isOpenCreateUser}
              onClose={closeModal}
              title={"Create User"}
            >
              <CreateUser />
            </Modal>
            <UserTable users={users} />
          </div>
        </div>
      </AuthenticatedLayout>
    </>
  );
}
