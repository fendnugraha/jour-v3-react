import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function EditAccount({ chartofaccounts, accountId }) {
  const [value, setValue] = useState({
    account: "",
    name: "",
    st_balance: "",
  });
  const findAccount = () =>
    chartofaccounts.data.find((account) => account.id === accountId);
  useEffect(() => {
    if (findAccount()) {
      setValue({
        account: findAccount().account_id,
        name: findAccount().acc_name,
        st_balance: findAccount().st_balance,
      });
    }
  }, [findAccount()]);
  //   console.log(findAccount());
  const [isNotify, setIsNotify] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    router.put(`/setting/account/${accountId}`, value, {
      onSuccess: () => {
        setIsNotify("Account updated successfully");
        setValue({
          account: "",
          name: "",
          st_balance: "",
        });
      },
      onError: () => {
        setIsNotify("Failed to update account" + e);
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
            <label htmlFor="name" className="block">
              Nama Account
            </label>
            <input
              type="text"
              name="name" // Add name attribute to input
              className="w-full border rounded-lg p-2"
              value={value.name}
              onChange={handleChange}
              autoFocus
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
