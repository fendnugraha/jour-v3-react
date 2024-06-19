import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import DailyDashboard from "../Report/DailyDashboard";
import MutationHistory from "../Report/MutationHistory";
export default function DailyReport({ auth, data, charts, trx, hq }) {
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
      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <DailyDashboard data={data} />
          <MutationHistory
            data={data}
            charts={charts}
            journals={trx}
            warehouses={data.warehouses}
            hq={hq}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
