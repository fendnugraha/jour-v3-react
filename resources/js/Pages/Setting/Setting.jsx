import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Setting({ auth }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Setting
        </h2>
      }
    >
      <Head title="Setting" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Link
              className="text-3xl text-slate-500 h-30 sm:h-60 flex justify-center items-center bg-white border-gray-200 shadow-md border rounded-xl hover:text-5xl hover:border-sky-950 hover:text-sky-950 transition-all duration-300 ease-out"
              href="/setting/user"
            >
              User
            </Link>
            <Link
              className="text-3xl text-slate-500 h-30 sm:h-60 flex justify-center items-center bg-white border-gray-200 shadow-md border rounded-xl hover:text-5xl hover:border-sky-950 hover:text-sky-950 transition-all duration-300 ease-out"
              href={route("setting.account.index")}
            >
              Account
            </Link>
            <Link
              className="text-3xl text-slate-500 h-30 sm:h-60 flex justify-center items-center bg-white border-gray-200 shadow-md border rounded-xl hover:text-5xl hover:border-sky-950 hover:text-sky-950 transition-all duration-300 ease-out"
              href={route("setting.warehouse.index")}
            >
              Warehouse
            </Link>
            <Link
              className="text-3xl text-slate-500 h-30 sm:h-60 flex justify-center items-center bg-white border-gray-200 shadow-md border rounded-xl hover:text-5xl hover:border-sky-950 hover:text-sky-950 transition-all duration-300 ease-out"
              href="/setting/contact"
            >
              Contact
            </Link>
            <Link
              className="text-3xl text-slate-500 h-30 sm:h-60 flex justify-center items-center bg-white border-gray-200 shadow-md border rounded-xl hover:text-5xl hover:border-sky-950 hover:text-sky-950 transition-all duration-300 ease-out"
              href="/setting/product"
            >
              Product
            </Link>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
