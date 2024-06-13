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
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Link
              class="text-2xl bg-sky-950 text-white p-4 shadow-300 h-30 sm:h-60 flex justify-center items-center rounded-xl hover:bg-sky-800 hover:text-5xl transition-all delay-300 duration-300 ease-out"
              href="/setting/user"
            >
              User
            </Link>
            <Link
              class="text-2xl bg-sky-950 text-white p-4 shadow-300 h-30 sm:h-60 flex justify-center items-center rounded-xl hover:bg-sky-800 hover:text-5xl transition-all delay-300 duration-300 ease-out"
              href={route("account.index")}
            >
              Account
            </Link>
            <Link
              class="text-2xl bg-sky-950 text-white p-4 shadow-300 h-30 sm:h-60 flex justify-center items-center rounded-xl hover:bg-sky-800 hover:text-5xl transition-all delay-300 duration-300 ease-out"
              href="/setting/warehouse"
            >
              Warehouse
            </Link>
            <Link
              class="text-2xl bg-sky-950 text-white p-4 shadow-300 h-30 sm:h-60 flex justify-center items-center rounded-xl hover:bg-sky-800 hover:text-5xl transition-all delay-300 duration-300 ease-out"
              href="/setting/contact"
            >
              Contact
            </Link>
            <Link
              class="text-2xl bg-sky-950 text-white p-4 shadow-300 h-30 sm:h-60 flex justify-center items-center rounded-xl hover:bg-sky-800 hover:text-5xl transition-all delay-300 duration-300 ease-out"
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
