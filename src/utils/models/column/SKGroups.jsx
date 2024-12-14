import { createColumnHelper } from "@tanstack/react-table";
import { digitsEnToFa } from "@persian-tools/persian-tools";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("id", {
    header: () => "#",
    cell: (info) => digitsEnToFa(info.row.index + 1),
  }),
  columnHelper.accessor("title", {
    header: () => "عنوان",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("subSyskindName", {
    header: () => "دسته بندی",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("description", {
    header: () => "توضیحات",
    cell: (info) => info.getValue(),
  }),
];

export default columns;
