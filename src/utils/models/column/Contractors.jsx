import { createColumnHelper } from "@tanstack/react-table";
import { digitsEnToFa } from "@persian-tools/persian-tools";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("id", {
    header: () => "#",
    cell: (info) => digitsEnToFa(info.row.index + 1),
  }),
  columnHelper.accessor("companyName", {
    header: () => "نام شرکت",
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor("ceoName", {
    header: () => "مدیر عامل",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("mobile", {
    header: () => "موبایل",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("companyCode", {
    header: () => "کد شرکت",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("telephone", {
    header: () => "تلفن",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name", {
    header: () => "نام",
    cell: (info) => info.getValue(),
  }),
  
  columnHelper.accessor("registerDate", {
    header: () => "تاریخ عضویت",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("address", {
    header: () => "آدرس",
    cell: (info) => info.getValue(),
  }),
];

export default columns;
