import { createColumnHelper } from "@tanstack/react-table";
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("id", {
    header: () => "#",
    cell: (info) => digitsEnToFa(info.row.index + 1),
  }),
  
  columnHelper.accessor("name", {
    header: () => "نام",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("subTypeTitle", {
    header: () => "نوع سازمان",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("price", {
    header: () => "مبلغ",
    cell: (info) => digitsEnToFa(addCommas(info.getValue())),
  }),
  columnHelper.accessor("smsQuantity", {
    header: () => "تعداد پیامک",
    cell: (info) => digitsEnToFa(info.getValue()),
  }),
  columnHelper.accessor("emailQuantity", {
    header: () => "تعداد ایمیل",
    cell: (info) => digitsEnToFa(info.getValue()),
  }),
  columnHelper.accessor("userQuantity", {
    header: () => "تعداد کاربر",
    cell: (info) => digitsEnToFa(info.getValue()),
  }),
  columnHelper.accessor("dayQuantity", {
    header: () => "تعداد روزها",
    cell: (info) => digitsEnToFa(info.getValue()),
  }),
  columnHelper.accessor("projectQuantity", {
    header: () => "تعداد پروژ ها",
    cell: (info) => digitsEnToFa(info.getValue()),
  }),
  columnHelper.accessor("examQuantity", {
    header: () => `تعداد آزمون`,
    cell: (info) => digitsEnToFa(info.getValue()),
  }),
  columnHelper.accessor("startDate", {
    header: () => "تاریخ شروع",
    cell: (info) => digitsEnToFa(info.getValue()),
  }),
  columnHelper.accessor("endDate", {
    header: () => "تاریخ پایان",
    cell: (info) => digitsEnToFa(info.getValue()),
  }),
  columnHelper.accessor("description", {
    header: () => "توضیحات",
    cell: (info) => digitsEnToFa(info.getValue()),
  }),
];

export default columns;