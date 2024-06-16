import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function CreateProduct() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    cost: "",
    price: "",
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
    post(route("setting.product.store"), {
      onSuccess: () => {
        setIsNotify("Product created successfully");
      },

      onError: () => {
        setIsNotify("Something went wrong");
      },
    });
  };

  useEffect(() => {
    setData({
      name: "",
      cost: "",
      price: "",
    });
  }, [processing]);

  return (
    <>
      {isNotify ? <p className="text-green-500">{isNotify}</p> : null}
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
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
            type="number"
            name="cost"
            value={data.cost}
            onChange={(e) => setData("cost", e.target.value)}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
            type="number"
            name="price"
            value={data.price}
            onChange={(e) => setData("price", e.target.value)}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          <p className="text-red-500">{errors.price}</p>
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          {processing ? "Saving..." : "Save"}
        </button>
      </form>
    </>
  );
}
