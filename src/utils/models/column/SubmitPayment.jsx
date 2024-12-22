
  import { createColumnHelper } from "@tanstack/react-table";
import { digitsEnToFa } from "@persian-tools/persian-tools";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("id", {
    header: () => "#",
    cell: (info) => digitsEnToFa(info.row.index + 1),
  }),
  columnHelper.accessor("systemName", {
    header: () => "نام سازمان",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("paymentCode", {
      header: () => "شناسه پرداخت",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("date", {
      header: () => "تاریخ",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("status", {
      header: () => "وضعیت",
      cell: (info) =>  info.getValue() == 1  ? (
        <span className="w-fit bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
              در انتظار تایید و پرداخت  
        </span>
      )  : info.getValue() == 2  ?(
        <span className="w-fit bg-primary-100 text-primary-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
         لغو شده
        </span>
      )
      : info.getValue() == 4  ?(
        <span className="w-fit bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
        پرداخت شده 
        </span>
      ) :
       info.getValue() == 0  ?(
        <span className="w-fit bg-yellow-100 text-yellow-600 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
        در انتظار تایید
        </span>
      ) : ''
    }),
    columnHelper.accessor("trackingCode", {
      header: () => "کد رهگیری",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("nationalcode", {
      header: () => "کد ملی",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: () => "نام",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("family", {
      header: () => "نام خانوادگی",
      cell: (info) => info.getValue(),
    }),
    
];

export default columns;
