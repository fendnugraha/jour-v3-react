import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function EditProduct({ auth, product }) {
  const { data, setData, put, processing, errors, reset } = useForm({
    name: product.name,
    cost: product.cost,
    price: product.price,
  });
  const [isNotify, setIsNotify] = useState(false);
  useEffect(() => {
    if (isNotify) {
      setTimeout(() => {
        setIsNotify(false);
      }, 3000);
    }
  }, [isNotify]);

  const submit = (e) => {
    e.preventDefault();
    put(route("setting.product.update", product.id), {
      onSuccess: () => {
        setIsNotify("Product updated successfully");
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
            <span className="text-orange-500">{product.name}</span>
          </h2>
        }
      >
        <Head title="Setting" />
        <div className="py-6">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <Link
              as="button"
              href={route("setting.product")}
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
                    htmlFor="cost"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Cost
                  </label>
                  <input
                    type="text"
                    name="cost"
                    value={data.cost}
                    onChange={(e) => setData("cost", e.target.value)}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                  />
                  <p className="text-red-500">{errors.cost}</p>
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="price"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Price
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={data.price}
                    onChange={(e) => setData("price", e.target.value)}
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                  />
                  <p className="text-red-500">{errors.price}</p>
                </div>

                <button
                  type="submit"
                  className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                  {processing ? "Processing..." : "Update"}
                </button>
              </form>
            </div>
            {isNotify && (
              <div
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <strong className="font-bold">Success!</strong>
                <span className="block sm:inline">{isNotify}</span>
              </div>
            )}
          </div>
        </div>
      </AuthenticatedLayout>
    </>
  );
}
