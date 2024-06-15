import Paginator from "@/Components/Paginator";
import { router } from "@inertiajs/react";
import { useState } from "react";

export default function WhBankList({ warehouse, cashbanks }) {
  const [accountId, setAccountId] = useState("");

  const updateBankList = (accountId) => {
    router.post("/setting/warehouse/updatebanklist", {
      accountId: accountId,
      warehouseId: warehouse.id,
    });
  };

  return (
    <>
      <h1 className="text-xl font-semibold mb-2">Bank List</h1>
      <table className="table-auto w-full mb-2">
        <thead className="bg-white text-blue-950 text-sm">
          <tr className="border-b">
            <th className="p-4">Account Name</th>
            <th>Checked</th>
          </tr>
        </thead>
        <tbody>
          {cashbanks.data.map((cashbank) => (
            <tr
              key={cashbank.id}
              className="odd:bg-white even:bg-blue-50 text-xs text-sky-950 hover:bg-slate-500 hover:text-white"
            >
              <td className="p-4">{cashbank.acc_name}</td>
              <td className="text-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600 disabled:bg-slate-500 disabled:text-slate-500"
                  value={cashbank.id}
                  name="checked"
                  onClick={(e) => updateBankList(e.target.value)}
                  defaultChecked={cashbank.warehouse_id === 0 ? false : true}
                  disabled={
                    cashbank.warehouse_id === warehouse.id ||
                    cashbank.warehouse_id === 0
                      ? false
                      : true
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Paginator links={cashbanks} />
    </>
  );
}
