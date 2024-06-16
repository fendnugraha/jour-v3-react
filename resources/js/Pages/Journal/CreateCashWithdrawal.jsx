import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function CreateCashWithdrawal({ charts }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    date_issued: new Date().toISOString().slice(0, 16),
    debt_code: "",
    amount: "",
    fee_amount: "",
    description: "",
    is_taken: false,
  });

  const [isNotify, setIsNotify] = useState(false);
  //   console.log(data);

  const submit = (e) => {
    e.preventDefault();
    post(route("journal.cash-withdrawal.store"), {
      onSuccess: () => {
        setIsNotify("Journal created successfully");
        reset();
      },
      onError: () => {
        setIsNotify("Something went wrong");
      },
    });
  };

  useEffect(() => {
    if (isNotify) {
      setTimeout(() => {
        setIsNotify(false);
      }, 3000);
    }
  }, [isNotify]);

  return (
    <>
      <form onSubmit={submit}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2 items-center">
          <label htmlFor="date_issued" className="block ">
            Tanggal
          </label>
          <div className="col-span-2">
            <input
              type="datetime-local"
              name="date_issued"
              id="date_issued"
              className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
              value={data.date_issued}
              onChange={(e) => setData("date_issued", e.target.value)}
            />
            <small className="text-red-500">{errors.date_issued}</small>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2 items-center">
          <label htmlFor="debt_code" className="block ">
            Rekening
          </label>
          <div className="col-span-2">
            <select
              id="debt_code"
              name="debt_code"
              value={data.debt_code}
              onChange={(e) => setData("debt_code", e.target.value)}
              className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
            >
              <option value="">--Pilih Rekening--</option>
              {charts.map((chart) => (
                <option key={chart.acc_code} value={chart.acc_code}>
                  {chart.acc_name}
                </option>
              ))}
            </select>
            <small className="text-red-500">{errors.debt_code}</small>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2 items-center">
          <label htmlFor="amount" className="block ">
            Jumlah
          </label>
          <div className="col-span-2">
            <input
              type="number"
              id="amount"
              name="amount"
              value={data.amount}
              onChange={(e) => setData("amount", e.target.value)}
              className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
              placeholder="Jumlah Penarikan"
            />
            <small className="text-red-500">{errors.amount}</small>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2 items-center">
          <label htmlFor="fee_amount" className="block ">
            Biaya Admin
          </label>
          <div className="col-span-2">
            <input
              type="number"
              id="fee_amount"
              name="fee_amount"
              value={data.fee_amount}
              onChange={(e) => setData("fee_amount", e.target.value)}
              className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
              placeholder="Biaya Admin"
            />
            <small className="text-red-500">{errors.fee_amount}</small>
          </div>
        </div>
        <div className="mb-2">
          <label htmlFor="description" className="block">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={data.description}
            onChange={(e) => setData("description", e.target.value)}
            className="w-full border rounded-lg p-2"
            placeholder="Keterangan (Optional)"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_taken"
              name="is_taken"
              checked={data.is_taken}
              onChange={(e) => setData("is_taken", e.target.checked)}
              className="w-5 h-5 accent-green-400"
            />
            <label htmlFor="is_taken" className="">
              Belum diambil
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400"
        >
          {processing ? "Loading..." : "Submit"}
        </button>
      </form>
      {isNotify && (
        <div
          className="bg-green-300 py-2 px-4 rounded-md text-green-800 fixed bottom-4 right-5 z-[1000]"
          role="alert"
        >
          {isNotify}
        </div>
      )}
    </>
  );
}
