import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import Modal from "@/Components/Modal";
import CreateTransfer from "./Journal/CreateTransfer";
import JournalTable from "./Journal/JournalTable";
import CreateCashWithdrawal from "./Journal/CreateCashWithdrawal";
import Dropdown from "@/Components/Dropdown";
import CreateVoucher from "./Journal/CreateVoucher";
import CreateDeposit from "./Journal/CreateDeposit";
import CreateMutation from "./Journal/CreateMutation";
import CreateExpense from "./Journal/CreateExpense";
import CreateAdminFee from "./Journal/CreateAdminFee";
import CashBankBalance from "./Journal/CashBankBalance";

export default function Dashboard({
  auth,
  title,
  charts,
  journals,
  products,
  expenses,
  hq,
  cash,
  warehouses,
}) {
  let [isOpenCreateTransfer, setIsOpenCreateTransfer] = useState(false);
  let [isOpenCreateCashWithdrawal, setIsOpenCreateCashWithdrawal] =
    useState(false);
  let [isOpenCreateVoucher, setIsOpenCreateVoucher] = useState(false);
  let [isOpenCreateDeposit, setIsOpenCreateDeposit] = useState(false);
  let [isOpenCreateMutation, setIsOpenCreateMutation] = useState(false);
  let [isOpenCreateExpense, setIsOpenCreateExpense] = useState(false);
  let [isOpenCreateAdminFee, setIsOpenCreateAdminFee] = useState(false);
  function closeModal() {
    setIsOpenCreateTransfer(false);
    setIsOpenCreateCashWithdrawal(false);
    setIsOpenCreateVoucher(false);
    setIsOpenCreateDeposit(false);
    setIsOpenCreateMutation(false);
    setIsOpenCreateExpense(false);
    setIsOpenCreateAdminFee(false);
  }
  function openModalCreateTransfer() {
    setIsOpenCreateTransfer(true);
  }

  function openModalCreateCashWithdrawal() {
    setIsOpenCreateCashWithdrawal(true);
  }

  function openModalCreateVoucher() {
    setIsOpenCreateVoucher(true);
  }

  function openModalCreateDeposit() {
    setIsOpenCreateDeposit(true);
  }

  function openModalCreateMutation() {
    setIsOpenCreateMutation(true);
  }

  function openModalCreateExpense() {
    setIsOpenCreateExpense(true);
  }

  function openModalCreateAdminFee() {
    setIsOpenCreateAdminFee(true);
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          {title}
        </h2>
      }
    >
      <Head title="Dashboard" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex sm:flex-wrap flex-col sm:flex-row">
            <div>
              <button
                onClick={openModalCreateTransfer}
                className="w-full sm:w-40 bg-blue-500 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded mb-4 mr-2"
              >
                Transfer Uang
              </button>
              <Modal
                show={isOpenCreateTransfer}
                onClose={closeModal}
                title={"Create Transfer"}
              >
                <CreateTransfer charts={charts} />
              </Modal>
            </div>
            <div>
              <button
                onClick={openModalCreateCashWithdrawal}
                className="w-full sm:w-40 bg-blue-500 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded mb-4 mr-2"
              >
                Tarik Tunai
              </button>
              <Modal
                show={isOpenCreateCashWithdrawal}
                onClose={closeModal}
                title={"Create CashWithdrawal"}
              >
                <CreateCashWithdrawal charts={charts} />
              </Modal>
            </div>
            <Dropdown>
              <Dropdown.Trigger>
                <button className="w-full sm:min-w-40 sm:max-w-fit bg-green-500 hover:bg-green-700 text-white text-sm py-2 px-4 rounded mb-4 mr-2">
                  Voucher & Deposit
                </button>
              </Dropdown.Trigger>

              <Dropdown.Content align="left">
                <Dropdown.Button onClick={openModalCreateVoucher}>
                  Voucher & SP
                </Dropdown.Button>

                <Dropdown.Button onClick={openModalCreateDeposit}>
                  Deposit Dll
                </Dropdown.Button>
              </Dropdown.Content>
            </Dropdown>
            <Dropdown>
              <Dropdown.Trigger>
                <button className="w-full sm:min-w-40 sm:max-w-fit bg-red-500 hover:bg-red-700 text-white text-sm py-2 px-4 rounded mb-4 mr-2">
                  Kas Keluar
                </button>
              </Dropdown.Trigger>

              <Dropdown.Content align="">
                <Dropdown.Button onClick={openModalCreateMutation}>
                  Pengembalian Kas & Bank
                </Dropdown.Button>
                <Dropdown.Button onClick={openModalCreateExpense}>
                  Biaya Operasional
                </Dropdown.Button>
                <Dropdown.Button onClick={openModalCreateAdminFee}>
                  Biaya Admin Bank
                </Dropdown.Button>
              </Dropdown.Content>
            </Dropdown>
            <Modal
              show={isOpenCreateVoucher}
              onClose={closeModal}
              title={"Penjualan Voucher dan Kartu Perdana"}
            >
              <CreateVoucher products={products} />
            </Modal>
            <Modal
              show={isOpenCreateDeposit}
              onClose={closeModal}
              title={"Penjualan Deposit, Pulsa, Game, dll"}
            >
              <CreateDeposit charts={charts} />
            </Modal>
            <Modal
              show={isOpenCreateMutation}
              onClose={closeModal}
              title={"Mutasi Kas & Bank Ke Rek Penampung"}
            >
              <CreateMutation charts={charts} hq={hq} />
            </Modal>
            <Modal
              show={isOpenCreateExpense}
              onClose={closeModal}
              title={"BIaya Operasional Toko"}
            >
              <CreateExpense expenses={expenses} />
            </Modal>
            <Modal
              show={isOpenCreateAdminFee}
              onClose={closeModal}
              title={"Biaya Administrasi Bank"}
            >
              <CreateAdminFee charts={charts} />
            </Modal>
          </div>
          <JournalTable
            journals={journals}
            cash={cash}
            warehouses={warehouses}
          />
          <CashBankBalance />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
