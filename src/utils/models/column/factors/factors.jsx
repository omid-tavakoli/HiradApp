import { createColumnHelper } from "@tanstack/react-table";
import { addCommas, digitsEnToFa } from "@persian-tools/persian-tools";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("id", {
    header: () => "#",
    cell: (info) => digitsEnToFa(info.row.index + 1),
  }),
  columnHelper.accessor("packageName", {
    header: () => "نام پکیج",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("price", {
    header: () => "مبلغ",
    cell: (info) => digitsEnToFa(addCommas(info.getValue())),
  }),
  columnHelper.accessor("paymentStatus", {
    header: () => "وضعیت",
    cell: (info) =>  info.getValue() == 1  ? (
      <span className="w-fit bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
            در انتظار تایید و پرداخت  
      </span>
    )  : info.getValue() == 2  ?(
      <span className="w-fit bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
       لغو شده
      </span>
    )
    : info.getValue() == 4  ?(
      <span className="w-fit bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
      پرداخت شده 
      </span>
    ) : ''
  }),
];

export default columns;
