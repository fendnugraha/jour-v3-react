import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import UserRoleTable from "./UserRoleTable";

export default function EditUser({ auth, user, warehouses }) {
  return (
    <>
      <AuthenticatedLayout
        user={auth.user}
        header={
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Setting - Edit User{" "}
            <span className="text-orange-500">{user.name}</span>
          </h2>
        }
      >
        <Head title="Setting" />
        <div className="py-6">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <Link
              as="button"
              href={route("setting.user")}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded mb-3"
            >
              Kembali
            </Link>
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <UserRoleTable user={user} warehouses={warehouses} />
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    </>
  );
}
