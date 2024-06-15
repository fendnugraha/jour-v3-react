import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import ProductTable from "./ProductTable";

export default function ProductIndex({ auth, title, products }) {
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
            <ProductTable products={products} />
          </div>
        </div>
      </AuthenticatedLayout>
    </>
  );
}
