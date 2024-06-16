import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function CreateTransfer({ charts }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    date_issued: new Date().toISOString().slice(0, 16),
    cred_code: "",
    amount: "",
    fee_amount: "",
    custName: "",
    description: "",
  });

  const [isNotify, setIsNotify] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    post(route("journal.transfer.store"), {
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
      {isNotify && (
        <div
          className="bg-green-300 py-2 px-4 rounded-md text-green-800 fixed bottom-4 right-5 z-[1000]"
          role="alert"
        >
          {isNotify}
        </div>
      )}
      <form onSubmit={submit}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2 items-center">
          <label htmlFor="date_issued" className="block ">
            Tanggal
          </label>
          <div className="col-span-2">
            <input
              type="datetime-local"
              id="date_issued"
              name="date_issued"
              value={new Date().toISOString().slice(0, 16)}
              onChange={(e) => setData("date_issued", e.target.value)}
              className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
            />
            <small className="text-red-500">{errors.date_issued}</small>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2 items-center">
          <label htmlFor="cred_code" className="block ">
            Rekening
          </label>
          <div className="col-span-2">
            <select
              id="cred_code"
              name="cred_code"
              value={data.cred_code}
              onChange={(e) => setData("cred_code", e.target.value)}
              className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
            >
              <option value="">--Pilih Rekening--</option>
              {charts.map((chart) => (
                <option key={chart.acc_code} value={chart.acc_code}>
                  {chart.acc_name}
                </option>
              ))}
            </select>
            <small className="text-red-500">{errors.cred_code}</small>
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
              placeholder="Jumlah Transfer"
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2 items-center">
          <label htmlFor="custName" className="block ">
            Atas Nama
          </label>
          <div className="col-span-2">
            <input
              type="text"
              id="custName"
              name="custName"
              value={data.custName}
              onChange={(e) => setData("custName", e.target.value)}
              className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
              placeholder="Atas Nama"
            />
            <small className="text-red-500">{errors.custName}</small>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2 items-center">
          <label htmlFor="description" className="block ">
            Deskripsi
          </label>
          <div className="col-span-2">
            <textarea
              type="text"
              id="description"
              name="description"
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
              placeholder="Deskripsi (Optional)"
            />
            <small className="text-red-500">{errors.description}</small>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-400"
        >
          {processing ? "Loading..." : "Submit"}
        </button>
      </form>
    </>
  );
}
