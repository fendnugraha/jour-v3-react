export default function DailyDashboard({ data }) {
  const formatNumber = (num) => {
    return new Number(num).toLocaleString("id-ID");
  };
  return (
    <div className="relative">
      <div className="absolute left-4 bottom-3"></div>
      <div className="flex flex-col sm:flex-row justify-start items-center gap-2 mb-3 w-full">
        <div className="w-full">
          <select className="text-sm border rounded-lg p-2 w-full">
            <option value="">-- Pilih Cabang --</option>
            <option value="All">All</option>
            {data.warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col sm:flex-row justify-start gap-2 items-center w-full">
          <input
            type="datetime-local"
            className="w-full text-sm border rounded-lg p-2"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-start gap-2 items-center w-full">
          <label htmlFor="to" className="tex-xs">
            s/d
          </label>
          <input
            type="datetime-local"
            className="w-full text-sm border rounded-lg p-2"
          />
        </div>
      </div>
      <div className="min-h-[28rem] grid grid-cols-1 sm:grid-cols-5 sm:grid-rows-4 gap-1 sm:gap-3">
        <div className="bg-gray-800 w-full h-full p-3 rounded-lg sm:rounded-3xl flex flex-col gap-6 items-center justify-center col-span-2 row-span-2">
          <div className="flex gap-2 flex-col justify-center items-center">
            <h4 className="text-md sm:text-xl font-bold text-white">
              Saldo Kas Tunai
            </h4>
            <h1 className="text-2xl sm:text-4xl font-black text-yellow-300">
              {formatNumber(data.totalCash)}
            </h1>
          </div>
          <div className="flex w-full flex-col items-center">
            <h4 className="text-sm text-white">Total Uang</h4>
            <h1 className="text-lg font-bold text-green-200">
              {formatNumber(data.totalCash + data.totalBank)}
            </h1>
          </div>
        </div>
        <div className="bg-gray-800 w-full h-full p-3 rounded-lg sm:rounded-3xl flex flex-col gap-2 items-center justify-center col-span-2 row-span-2">
          <h4 className="text-md sm:text-xl font-bold text-white">
            Voucher & SP
          </h4>
          <h1 className="text-2xl sm:text-4xl font-black text-yellow-300">
            {formatNumber(data.totalVoucher)}
          </h1>
        </div>
        <div className="bg-violet-700 rounded-lg sm:rounded-3xl w-full h-full p-3 flex flex-col gap-1 items-center justify-center">
          <h4 className="text-md sm:text-xl text-white">Saldo Bank</h4>
          <h1 className="text-2xl font-extrabold text-white">
            {formatNumber(data.totalBank)}
          </h1>
        </div>
        <div className="bg-orange-500 rounded-lg sm:rounded-3xl w-full h-full p-3 flex flex-col gap-1 items-center justify-center">
          <h4 className="text-md sm:text-xl text-white">Fee (Admin)</h4>
          <h1 className="text-2xl font-extrabold text-white">
            {formatNumber(data.totalFee)}
          </h1>
        </div>
        <div className="bg-gray-800 w-full h-full p-3 rounded-lg sm:rounded-3xl flex flex-col gap-4 sm:gap-6 items-center justify-center col-span-2 row-span-2">
          <div className="flex gap-2 flex-col justify-center items-center">
            <h4 className="text-md sm:text-xl font-bold text-white">
              Laba (Profit)
            </h4>
            <h1 className="text-2xl sm:text-4xl font-black text-yellow-300">
              {formatNumber(data.profit)}
            </h1>
          </div>
          <div className="flex gap-2 w-full justify-evenly">
            <div>
              <h4 className="text-xs text-white">Transfer Uang</h4>
              <h1 className="text-sm font-bold text-white">
                {formatNumber(data.totalTransfer)}
              </h1>
            </div>
            <div>
              <h4 className="text-xs text-white">Tarik Tunai</h4>
              <h1 className="text-sm font-bold text-white">
                {formatNumber(data.totalCashWithdrawal)}
              </h1>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 w-full h-full p-3 rounded-lg sm:rounded-3xl flex flex-col gap-2 items-center justify-center col-span-2 row-span-2">
          <h4 className="text-md sm:text-xl font-bold text-white">Deposit</h4>
          <h1 className="text-2xl sm:text-4xl font-black text-yellow-300">
            {formatNumber(data.totalCashDeposit)}
          </h1>
        </div>
        <div className="bg-red-600 rounded-lg sm:rounded-3xl w-full h-full p-3 flex flex-col gap-1 items-center justify-center">
          <h4 className="text-md sm:text-xl text-white">Biaya</h4>
          <h1 className="text-2xl font-extrabold text-white">
            {formatNumber(-data.totalExpense)}
          </h1>
        </div>
        <div className="bg-gray-700 rounded-lg sm:rounded-3xl w-full h-full p-3 flex flex-col gap-1 items-center justify-center">
          <h4 className="text-md sm:text-xl text-white">Transaksi</h4>
          <h1 className="text-2xl font-extrabold text-white">
            {formatNumber(data.salesCount)}
          </h1>
        </div>
      </div>
    </div>
  );
}
