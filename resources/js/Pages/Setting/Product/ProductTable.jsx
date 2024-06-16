import Paginator from "@/Components/Paginator";
import {
  EyeIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function ProductTable({ products }) {
  const [search, setSearch] = useState("");
  const [isNotify, setIsNotify] = useState(false);

  const doSearchData = (e) => {
    e.preventDefault();
    router.get("/setting/product", { search }, { preserveState: true });
  };

  const deleteProduct = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      router.delete(`/setting/product/${id}`, {
        onSuccess: () => {
          setIsNotify("Product deleted successfully");
        },
      });
    }
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
      <div className="mb-2 grid grid-cols-2 gap-3">
        <div></div>
        <form onSubmit={doSearchData}>
          <div className="flex">
            <input
              type="search"
              placeholder="Search..."
              className="w-full rounded-s-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="w-20 bg-slate-600 text-white flex justify-center items-center rounded-e-lg hover:bg-slate-500"
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
      <table className="table-auto w-full mb-2">
        <thead className="bg-white text-sky-950 text-sm">
          <tr className="border-b-2">
            <th className="p-3">No</th>
            <th className="p-3">Name</th>
            <th className="p-3">Cost</th>
            <th className="p-3">Price</th>
            <th className="p-3">Sold</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.data.map((product, index) => (
            <tr
              key={product.id}
              className="border-b odd:bg-white even:bg-blue-50 text-xs text-sky-950 hover:bg-slate-500 hover:text-white"
            >
              <td className="text-center p-3">{index + 1}</td>
              <td className="p-3">{product.name}</td>
              <td className="p-3">{product.cost}</td>
              <td className="p-3">{product.price}</td>
              <td className="p-3">{product.sold}</td>
              <td className="p-3 flex gap-2 items-center justify-center">
                <Link
                  href={route("setting.product.edit", product.id)}
                  className="bg-yellow-300 hover:bg-yellow-200 text-slate-800 font-bold py-1 px-2 rounded-md"
                >
                  <EyeIcon className="w-6 h-6" />
                </Link>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-2 rounded-md"
                >
                  <TrashIcon className="w-6 h-6" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Paginator links={products} />
    </>
  );
}
