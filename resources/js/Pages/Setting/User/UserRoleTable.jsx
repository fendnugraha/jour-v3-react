import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function UserRoleTable({ user, warehouses }) {
  const [currentUser, setCurrentUser] = useState("");
  const updateUserRole = (warehouseId, role) => {
    router.post("/update-user-role", {
      userId: user.id,
      warehouseId: warehouseId,
      role: role,
    });
  };
  return (
    <div className="grid grid-cols-2 gap-3 p-3">
      <div>
        <table className="table-auto w-full mb-2">
          <thead className="bg-white text-blue-950 text-sm">
            <tr className="border-b">
              <th className="p-4">Role Name</th>
              <th>Checked</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-4">Administrator</td>
              <td className="text-center">
                <input
                  type="checkbox"
                  value={"Administrator"}
                  onClick={(e) =>
                    updateUserRole(user.roles.warehouse_id, e.target.value)
                  }
                  defaultChecked={
                    user.roles.role === "Administrator" ? true : false
                  }
                />
              </td>
            </tr>
            <tr className="border-b">
              <td className="p-4">Kasir</td>
              <td className="text-center">
                <input
                  type="checkbox"
                  value={"Kasir"}
                  onClick={(e) =>
                    updateUserRole(user.roles.warehouse_id, e.target.value)
                  }
                  defaultChecked={user.roles.role === "Kasir" ? true : false}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <table className="table-auto w-full mb-2">
          <thead className="bg-white text-blue-950 text-sm">
            <tr className="border-b">
              <th className="p-4">Warehouse Name</th>
              <th>Checked</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.data.map((warehouse) => (
              <tr
                key={warehouse.id}
                className="border-b odd:bg-white even:bg-blue-50"
              >
                <td className="p-4">{warehouse.name}</td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    value={warehouse.id}
                    onClick={(e) =>
                      updateUserRole(e.target.value, user.roles.role)
                    }
                    defaultChecked={
                      user.roles.warehouse_id === warehouse.id ? true : false
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
