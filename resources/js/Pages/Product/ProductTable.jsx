import Paginator from "@/Components/Paginator";
import { router } from "@inertiajs/react";
export default function ProductTable({ products, setIsNotify }) {
  const deleteProduct = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      router.post("/product/delete", { id: id });
      setIsNotify(true);
    }
  };

  return (
    <>
      <table className="table w-full text-xs">
        <thead className="border-b-2 bg-white text-sky-950">
          <tr>
            <th className="text-center p-4">Product Name</th>
            <th className="text-center p-4">Product Description</th>
            <th className="text-center p-4">Product Price</th>
            <th className="text-center p-4">Action</th>
          </tr>
        </thead>
        <tbody className="">
          {products.data.map((product) => (
            <tr
              key={product.id}
              className="border-b odd:bg-white even:bg-blue-50"
            >
              <td className="p-3">{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>
                <button
                  className="text-red-500"
                  onClick={() => deleteProduct(product.id)}
                >
                  Delete
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
