import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function UserRoleTable({ user, warehouses }) {
  const [isNotify, setIsNotify] = useState("");
  const updateUserRole = (warehouseId, role) => {
    router.post(
      "/update-user-role",
      {
        userId: user.id,
        warehouseId: warehouseId,
        role: role,
      },
      {
        onSuccess: () => setIsNotify("User role updated successfully"),
      }
    );
  };

  useEffect(() => {
    setIsNotify("");
  }, [user]);

  return (
    <div className="grid grid-cols-2 gap-3 p-3">
      {isNotify && (
        <div
          className="bg-green-300 py-2 px-4 rounded-md text-green-800 fixed bottom-4 right-5 z-[1000]"
          role="alert"
        >
          {isNotify}
        </div>
      )}
      <div>
        <div className="mb-3">
          <label htmlFor="role" className="block mb-2">
            Role Name
          </label>
          <select
            name="role"
            value={user.roles.role}
            className="w-full rounded-lg"
            onChange={(e) =>
              updateUserRole(user.roles.warehouse_id, e.target.value)
            }
          >
            <option value={"Administrator"}>Administrator</option>
            <option value={"Kasir"}>Kasir</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="warehouse" className="block mb-2">
            Warehouse
          </label>
          <select
            name="warehouse"
            value={user.roles.warehouse_id}
            className="w-full rounded-lg"
            onChange={(e) => updateUserRole(e.target.value, user.roles.role)}
          >
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
