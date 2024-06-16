import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import ProductTable from "./ProductTable";
import { useState } from "react";
import Modal from "@/Components/Modal";
import CreateProduct from "./CreateProduct";

export default function ProductIndex({ auth, title, products }) {
  const [isOpenCreateProduct, setIsOpenCreateProduct] = useState(false);
  function closeModal() {
    setIsOpenCreateProduct(false);
  }

  function openModalCreateProduct() {
    setIsOpenCreateProduct(true);
  }
  return (
    <>
      <AuthenticatedLayout
        user={auth.user}
        header={
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            {title}
          </h2>
        }
      >
        <Head title={title} />
        <div className="py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <button
              onClick={openModalCreateProduct}
              className="bg-sky-900 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded-lg mb-3 mr-3"
            >
              Add Product
            </button>
            <Modal
              show={isOpenCreateProduct}
              onClose={closeModal}
              title={"Create User"}
            >
              <CreateProduct />
            </Modal>
            <ProductTable products={products} />
          </div>
        </div>
      </AuthenticatedLayout>
    </>
  );
}
