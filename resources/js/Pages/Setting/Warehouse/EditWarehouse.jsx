import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import WhBankList from "./WhBankList";

export default function EditWarehouse({
  auth,
  warehouse,
  chartofaccounts,
  cashbanks,
}) {
  const [value, setValue] = useState({
    name: "",
    chart_of_account_id: "",
    location: "",
  });

  const [isNotify, setIsNotify] = useState(false);
  const [loading, setLoading] = useState(false);
  const { errors } = usePage().props;
  const { flash } = usePage().props;

  useEffect(() => {
    setValue({
      name: warehouse.name,
      chart_of_account_id: warehouse.chart_of_account_id,
      location: warehouse.location,
    });
  }, [warehouse]);

  useEffect(() => {
    if (isNotify) {
      setTimeout(() => {
        setIsNotify(false);
      }, 3000);
    }
  }, [isNotify]);

  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    router.put(`/setting/warehouse/${warehouse.id}`, value, {
      onSuccess: () => {
        setIsNotify("Warehouse updated successfully");
        setLoading(false);
      },
      onError: () => {
        setIsNotify("Failed to update warehouse");
        setLoading(false);
      },
    });
  };
  return (
    <>
      {isNotify && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded fixed bottom-4 right-3"
          role="alert"
        >
          <span className="block sm:inline">{isNotify}</span>
        </div>
      )}
      <AuthenticatedLayout
        user={auth.user}
        header={
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Setting - Edit Warehouse{" "}
            <span className="text-orange-500">{warehouse.name}</span>
          </h2>
        }
      >
        <Head title="Setting" />
        <div className="py-6">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={value.name}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Warehouse Name"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Chart of Account
                    </label>
                    <select
                      id="chart_of_account_id"
                      name="chart_of_account_id"
                      onChange={handleChange}
                      value={value.chart_of_account_id}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                      {chartofaccounts.map((chartofaccount) => (
                        <option
                          key={chartofaccount.id}
                          value={chartofaccount.id}
                        >
                          {chartofaccount.acc_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900">
                      Location
                    </label>
                    <textarea
                      type="text"
                      id="location"
                      name="location"
                      value={value.location}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Warehouse Location"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="text-white mr-1 bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                  >
                    Update
                  </button>
                  <Link href={route("setting.warehouse.index")}>
                    <button className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                      Kembali
                    </button>
                  </Link>
                </form>
              </div>
              <div>
                <WhBankList warehouse={warehouse} cashbanks={cashbanks} />
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    </>
  );
}
