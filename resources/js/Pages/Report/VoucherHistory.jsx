import Paginator from "@/Components/Paginator";

export default function VoucherHistory({ sales, salesGroup }) {
  const formatNumber = (num) => {
    return new Number(num).toLocaleString("id-ID");
  };

  return (
    <div className="w-full bg-white p-3 rounded-lg">
      <h1 className="my-3 font-bold">
        History Penjualan Voucher & Kartu Perdana
      </h1>
      <table className="table-auto w-full text-xs mb-2">
        <thead className="bg-white text-blue-950">
          <tr className="border-b">
            <th className="text-left p-3">Product</th>
            <th className="text-center">Qty</th>
            <th className="text-center">Jual</th>
            <th className="text-center">Modal</th>
            <th className="text-center">Fee</th>
          </tr>
        </thead>

        <tbody>
          {sales.data.map((sale) => (
            <tr
              key={sale.id}
              className="border border-slate-100 odd:bg-white even:bg-blue-50"
            >
              <td className="p-3">{sale.product.name}</td>
              <td className="text-center">{sale.quantity}</td>
              <td className="text-center">
                {formatNumber(sale.price)}{" "}
                <span className="text-slate-500">
                  ({formatNumber(sale.price * sale.quantity)})
                </span>
              </td>
              <td className="text-center">
                {formatNumber(sale.product.cost)}{" "}
                <span className="text-slate-500">
                  ({formatNumber(sale.product.cost * sale.quantity)})
                </span>
              </td>
              <td className="text-center">
                {formatNumber(
                  sale.price * sale.quantity - sale.product.cost * sale.quantity
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Paginator links={sales} />
      <h1 className="my-3 font-bold">
        Total Penjualan Voucher & Kartu Perdana
      </h1>
      <table className="table-auto w-full text-xs mb-2">
        <thead className="bg-white text-blue-950">
          <tr className="border-b">
            <th className="text-left p-3">Product</th>
            <th className="text-center">Qty</th>
            <th className="text-center">Jual</th>
            <th className="text-center">Modal</th>
            <th className="text-center">Fee</th>
          </tr>
        </thead>
        <tbody>
          {salesGroup.data.map((sg, i) => (
            <tr
              key={i}
              className="border border-slate-100 odd:bg-white even:bg-blue-50"
            >
              <td className="p-3">{sg.product.name}</td>
              <td className="text-center">{sg.quantity}</td>
              <td className="text-center">{formatNumber(sg.total_price)}</td>
              <td className="text-center">{formatNumber(sg.total_cost)}</td>
              <td className="text-center">
                {formatNumber(sg.total_price - sg.total_cost)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Paginator links={salesGroup} />
    </div>
  );
}
