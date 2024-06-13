import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function CreateAccount({ accounts }) {
  const [value, setValue] = useState({
    account: "",
    name: "",
    st_balance: "",
  });

  const [isNotify, setIsNotify] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    router.post("/setting/account", value, {
      onSuccess: () => {
        setIsNotify("Account created successfully");
        setValue({
          account: "",
          name: "",
          st_balance: "",
        });
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

  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
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
        <div className="">
          <div className="mb-2">
            <label htmlFor="account" className="block">
              Type Account
            </label>
            <select
              name="account" // Add name attribute to select
              className="w-full border rounded-lg p-2"
              autoFocus
              value={value.account} // Add value attribute to select
              onChange={handleChange}
            >
              <option value="">--Pilih Type Account--</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label htmlFor="name" className="block">
              Nama Account
            </label>
            <input
              type="text"
              name="name" // Add name attribute to input
              className="w-full border rounded-lg p-2"
              value={value.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="st_balance" className="block">
              Saldo Awal
            </label>
            <input
              type="number"
              name="st_balance" // Add name attribute to input
              className="w-full border rounded-lg p-2"
              value={value.st_balance}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg"
          >
            Simpan
          </button>
        </div>
      </form>
    </>
  );
}
