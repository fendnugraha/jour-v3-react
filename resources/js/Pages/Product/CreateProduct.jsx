import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
export default function CreateProduct() {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [isNotify, setIsNotify] = useState(false);
  const { success } = usePage().props;

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.id]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    router.post("/product/store", values, {
      onSuccess: () => {
        setIsNotify("Product created successfully");
        setValues({
          name: "",
          description: "",
          price: "",
        });
      },
      onError: () => {
        setIsNotify("Something went wrong");
      },
    });
  };
  return (
    <div>
      {isNotify && (
        <div
          className="bg-green-300 py-2 px-4 rounded-md text-green-800 fixed bottom-4 right-5 z-[1000]"
          role="alert"
        >
          {isNotify}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="name"
            className="block font-medium text-sm text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={values.name}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block font-medium text-sm text-gray-700"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            value={values.description}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label
            htmlFor="price"
            className="block font-medium text-sm text-gray-700"
          >
            Price
          </label>
          <input
            type="text"
            id="price"
            value={values.price}
            onChange={handleChange}
            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
