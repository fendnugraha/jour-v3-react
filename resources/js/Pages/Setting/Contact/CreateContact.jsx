import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function CreateContact() {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    type: "",
    description: "",
  });
  const [isNotify, setIsNotify] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    post(route("setting.contact.store")),
      {
        onSuccess: () => {
          setIsNotify("Contact created successfully");
        },
        onError: () => {
          setIsNotify("Something went wrong");
        },
      };
  };

  useEffect(() => {
    if (isNotify) {
      setTimeout(() => {
        setIsNotify(false);
      }, 3000);
    }
  }, [isNotify]);

  useEffect(() => {
    setData({
      name: "",
      type: "",
      description: "",
    });
  }, [processing]);

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
            htmlFor="type"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Type
          </label>
          <select
            name="type"
            value={data.type}
            onChange={(e) => setData("type", e.target.value)}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">Select Type</option>
            <option value="Customer">Customer</option>
            <option value="Supplier">Supplier</option>
          </select>
          <p className="text-red-500">{errors.type}</p>
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Description
          </label>
          <textarea
            name="description"
            value={data.description}
            onChange={(e) => setData("description", e.target.value)}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          <p className="text-red-500">{errors.description}</p>
        </div>

        <button
          type="submit"
          disabled={processing}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-slate-500 disabled:cursor-not-allowed"
        >
          {processing ? "Processing..." : "Submit"}
        </button>
      </form>
    </>
  );
}
