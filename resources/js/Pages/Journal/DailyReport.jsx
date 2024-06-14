import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
export default function DailyReport({ auth }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Report - Daily Report
        </h2>
      }
    >
      <Head title="Setting" />
      <h1>Daily Report</h1>
    </AuthenticatedLayout>
  );
}
