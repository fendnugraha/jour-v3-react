import { useForm } from "@inertiajs/react";
import { parse } from "postcss";
import { useEffect, useState } from "react";

export default function CreateBankTransfer({ charts, hq, warehouses }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so we add 1
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

  const { data, setData, post, processing, errors, reset } = useForm({
    date_issued: formattedDate,
    debt_code: "",
    cred_code: "",
    amount: "",
    description: "",
    warehouse_id: "",
  });

  const [isNotify, setIsNotify] = useState(false);
  const [branchAccountId, setBranchAccountId] = useState(1);

  const hqAccount = hq.filter((account) => account.warehouse_id === 1);

  useEffect(() => {
    setBranchAccountId(parseInt(data.warehouse_id));
  }, [data]);

  const branchAccount = hq.filter(
    (account) => account.warehouse_id === branchAccountId
  );

  const submit = (e) => {
    e.preventDefault();
    post(route("journal.mutation.store"), {
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
              value={data.date_issued}
              onChange={(e) => setData("date_issued", e.target.value)}
              className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
            />
            <small className="text-red-500">{errors.date_issued}</small>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2 items-center">
          <label htmlFor="warehouse" className="block ">
            Gudang (Cabang)
          </label>
          <div className="col-span-2">
            <select
              id="warehouse"
              name="warehouse"
              value={data.warehouse_id}
              onChange={(e) => setData("warehouse_id", e.target.value)}
              className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
            >
              <option value="">--Pilih gudang--</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
            <small className="text-red-500">{errors.warehouse}</small>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2 items-center">
          <label htmlFor="cred_code" className="block ">
            Dari (Pusat)
          </label>
          <div className="col-span-2">
            <select
              id="cred_code"
              name="cred_code"
              value={data.cred_code}
              onChange={(e) => setData("cred_code", e.target.value)}
              className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
            >
              <option value="">--Pilih sumber dana--</option>
              {hqAccount.map((ha) => (
                <option key={ha.id} value={ha.acc_code}>
                  {ha.acc_name}
                </option>
              ))}
            </select>
            <small className="text-red-500">{errors.cred_code}</small>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2 items-center">
          <label htmlFor="debt_code" className="block ">
            Ke (Cabang)
          </label>
          <div className="col-span-2">
            <select
              id="debt_code"
              name="debt_code"
              value={data.debt_code}
              onChange={(e) => setData("debt_code", e.target.value)}
              className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
            >
              <option value="">--Pilih tujuan mutasi--</option>
              {branchAccount.map((br) => (
                <option key={br.id} value={br.acc_code}>
                  {br.acc_name}
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
          <div className="col-span-1">
            <input
              type="number"
              id="amount"
              name="amount"
              value={data.amount}
              onChange={(e) => setData("amount", e.target.value)}
              className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
            />
            <small className="text-red-500">{errors.amount}</small>
          </div>
          <h1 className="text-lg font-bold text-red-500">
            Rp {new Intl.NumberFormat().format(data.amount)}
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2 items-center">
          <label htmlFor="description" className="block ">
            Deskripsi
          </label>
          <div className="col-span-2">
            <textarea
              id="description"
              name="description"
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
            />
            <small className="text-red-500">{errors.description}</small>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2 items-center">
          <div className="col-span-1">
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-slate-500"
            >
              {processing ? "Loading..." : "Simpan"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
