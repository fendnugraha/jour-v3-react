import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function EditContact({ auth, contact }) {
  const { data, setData, put, processing, errors, reset } = useForm({
    name: contact.name,
    type: contact.type,
    description: contact.description,
  });

  const [isNotify, setIsNotify] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    put(route("setting.contact.update", contact.id), {
      onSuccess: () => {
        setIsNotify("Contact updated successfully");
      },
      onError: () => {
        setIsNotify("Something went wrong");
      },
    });
  };
  return (
    <>
      <AuthenticatedLayout
        user={auth.user}
        header={
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Setting - Edit Contact{" "}
            <span className="text-orange-500">{contact.name}</span>
          </h2>
        }
      >
        <Head title="Setting" />
        <div className="py-6">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <Link
              as="button"
              href={route("setting.contact")}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md mb-3"
            >
              Kembali
            </Link>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white p-5">
              <form onSubmit={submit}>
                <div className="mb-6">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                  />
                  <p className="text-red-500">{errors.name}</p>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="type"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Type
                  </label>
                  <select
                    name="type"
                    value={data.type}
                    onChange={(e) => setData("type", e.target.value)}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Supplier">Supplier</option>
                  </select>
                  <p className="text-red-500">{errors.type}</p>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                  />
                  <p className="text-red-500">{errors.description}</p>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-slate-500 disabled:cursor-not-allowed"
                >
                  {processing ? "Processing..." : "Update"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    </>
  );
}
