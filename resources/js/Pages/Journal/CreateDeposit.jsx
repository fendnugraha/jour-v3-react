import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function CreateDeposit() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so we add 1
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

  const { data, setData, post, processing, errors, reset } = useForm({
    date_issued: formattedDate,
    cost: "",
    price: "",
    description: "",
  });

  const [isNotify, setIsNotify] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    post(route("journal.deposit.store"), {
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
          <label htmlFor="cost" className="block ">
            Cost
          </label>
          <div className="col-span-1">
            <input
              type="number"
              id="cost"
              name="cost"
              value={data.cost}
              onChange={(e) => setData("cost", e.target.value)}
              className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
              placeholder="Harga beli"
            />
            <small className="text-red-500">{errors.cost}</small>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2 items-center">
          <label htmlFor="price" className="block ">
            Price
          </label>
          <div className="col-span-">
            <input
              type="number"
              id="price"
              name="price"
              value={data.price}
              onChange={(e) => setData("price", e.target.value)}
              className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
              placeholder="Harga jual"
            />
            <small className="text-red-500">{errors.price}</small>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2 items-center">
          <label htmlFor="description" className="block ">
            Description
          </label>
          <div className="col-span-2">
            <textarea
              type="text"
              id="description"
              name="description"
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
              placeholder="Description"
            />
            <small className="text-red-500">{errors.description}</small>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {processing ? "Saving..." : "Save"}
        </button>
      </form>
    </>
  );
}
