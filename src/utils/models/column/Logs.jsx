import { createColumnHelper } from "@tanstack/react-table";
import { digitsEnToFa } from "@persian-tools/persian-tools";
const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("id", {
    header: () => "#",
    cell: (info) => digitsEnToFa(info.row.index + 1),
  }),
  columnHelper.accessor("action", {
    header: () => "عمل",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("tableName", {
    header: () => "نام جدول",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("ip", {
    header: () => "ای پی",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("date", {
    header: () => "تاریخ",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("userName", {
    header: () => "کاربر",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("beforeChange", {
    header: () => "قبل تغییر",
    cell: (info) => info.getValue(),
  }),
];

export default columns;
