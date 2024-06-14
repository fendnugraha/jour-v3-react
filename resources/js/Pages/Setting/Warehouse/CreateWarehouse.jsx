import { router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function CreateWarehouse({ chartofaccounts }) {
  const [value, setValue] = useState({
    code: "",
    name: "",
    location: "",
    chart_of_account_id: "",
  });
  const [isNotify, setIsNotify] = useState(false);
  const [loading, setLoading] = useState(false);
  const { errors } = usePage().props;
  const { flash } = usePage().props;

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
    router.post("/setting/warehouse", value, {
      onFinish: () => {
        setIsNotify(flash.message);
        setLoading(false);
        setValue({
          code: "",
          name: "",
          location: "",
          chart_of_account_id: "",
        });
      },
      onError: () => {
        setIsNotify(flash.error);
        setLoading(false);
      },
    });
  };
  return (
    <>
      {isNotify && (
        <div
          className="bg-green-300 py-2 px-4 rounded-md text-green-800 fixed bottom-4 right-5 z-[1000]"
          role="alert"
        >
          {isNotify}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label htmlFor="code" className="block">
            Kode
          </label>
          <input
            max={3}
            type="text"
            name="code" // Add name attribute to input
            className="w-full border rounded-lg p-2"
            value={value.code}
            onChange={handleChange}
            placeholder="Contoh:PLS"
          />
          {errors.code && <div className="text-red-500">{errors.code}</div>}
        </div>
        <div className="mb-2">
          <label htmlFor="name" className="block">
            Nama Cabang
          </label>
          <input
            type="text"
            name="name" // Add name attribute to input
            className="w-full border rounded-lg p-2"
            value={value.name}
            onChange={handleChange}
          />
          {errors.name && <div className="text-red-500">{errors.name}</div>}
        </div>
        <div className="mb-2">
          <label htmlFor="chart_of_account_id" className="block">
            Akun
          </label>
          <select
            name="chart_of_account_id" // Add name attribute to select
            className="w-full border rounded-lg p-2" // Add className attribute to select
            value={value.chart_of_account_id}
            onChange={handleChange}
          >
            <option value="">Pilih Akun</option>
            {chartofaccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.acc_name}
              </option>
            ))}
          </select>
          {errors.chart_of_account_id && (
            <div className="text-red-500">{errors.chart_of_account_id}</div>
          )}
        </div>
        <div className="mb-2">
          <label htmlFor="location" className="block">
            Lokasi
          </label>
          <textarea
            type="text"
            name="location" // Add name attribute to input
            className="w-full border rounded-lg p-2"
            value={value.location}
            onChange={handleChange}
          />
          {errors.location && (
            <div className="text-red-500">{errors.location}</div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
    </>
  );
}
