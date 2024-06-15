import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import ContactTable from "./ContactTable";

export default function ContactIndex({ auth, title, contacts }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          {title}
        </h2>
      }
    >
      <Head title="Setting" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <ContactTable contacts={contacts} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
