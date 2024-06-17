import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function CreateVoucher({ products }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so we add 1
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

  const { data, setData, post, processing, errors, reset } = useForm({
    date_issued: formattedDate,
    product_id: "",
    qty: 1,
    description: "",
    price: "",
  });

  const [isNotify, setIsNotify] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    post(route("journal.voucher.store"), {
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

  useEffect(() => {
    if (data.product_id) {
      const product = products.find(
        (product) => product.id === parseInt(data.product_id)
      );
      setData("price", product.price);
    }
  }, [data.product_id, products]);

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
          <label htmlFor="product_id" className="block ">
            Product
          </label>
          <div className="col-span-2">
            <select
              id="product_id"
              name="product_id"
              value={data.product_id}
              onChange={(e) => setData("product_id", e.target.value)}
              className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            <small className="text-red-500">{errors.product_id}</small>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2 items-center">
          <label htmlFor="qty" className="block ">
            Quantity
          </label>
          <div className="col-span-1">
            <input
              type="number"
              id="qty"
              name="qty"
              value={data.qty}
              onChange={(e) => setData("qty", e.target.value)}
              className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
            />
            <small className="text-red-500">{errors.qty}</small>
          </div>
          {data.qty > 1 && (
            <small>
              x {new Intl.NumberFormat().format(data.price)} ={" Rp. "}
              <span className="text-red-500 font-bold">
                {new Intl.NumberFormat().format(data.price * data.qty)}
              </span>
            </small>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2 items-center">
          <label htmlFor="price" className="block ">
            Price
          </label>
          <div className="col-span-1">
            <input
              type="number"
              id="price"
              name="price"
              value={data.price}
              onChange={(e) => setData("price", e.target.value)}
              className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
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
              onChange={(e) => setData("description", e.target.value)}
              className="w-full border rounded-lg p-2 outline-none focus:border-blue-500"
              placeholder="Note: (Optional)"
            />
            <small className="text-red-500">{errors.description}</small>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 my-2 items-center">
          <button
            type="submit"
            disabled={processing}
            className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600"
          >
            {processing ? "Loading..." : "Simpan"}
          </button>
        </div>
      </form>
    </>
  );
}
