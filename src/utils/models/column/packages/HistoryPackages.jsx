import { createColumnHelper } from "@tanstack/react-table";
import { digitsEnToFa } from "@persian-tools/persian-tools";
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

  columnHelper.accessor("startDate", {
    header: () => "تاریخ شروع ارائه پکیج",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("endDate", {
    header: () => "تاریخ پایان ارائه پکیج",
    cell: (info) => info.getValue(),
  }),
];

export default columns;
