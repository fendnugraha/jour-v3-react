import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function CreateUser() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
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
    post(route("setting.user.store"), {
      onSuccess: () => {
        setIsNotify("User created successfully");
      },

      onError: () => {
        setIsNotify("Something went wrong");
      },
    });
  };

  useEffect(() => {
    return () => {
      reset("password", "password_confirmation");
    };
  }, []);

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
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          <p className="text-red-500">{errors.email}</p>
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={(e) => setData("password", e.target.value)}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          <p className="text-red-500">{errors.password}</p>
        </div>

        <div className="mb-6">
          <label
            htmlFor="password_confirmation"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Confirm Password
          </label>
          <input
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            onChange={(e) => setData("password_confirmation", e.target.value)}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
          <p className="text-red-500">{errors.password_confirmation}</p>
        </div>

        <button
          type="submit"
          disabled={processing}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {processing ? "Processing..." : "Create User"}
        </button>
      </form>
    </>
  );
}
