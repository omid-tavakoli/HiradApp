import { createColumnHelper } from "@tanstack/react-table";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { PhotoIcon } from "@heroicons/react/24/outline";
const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("id", {
    header: () => "#",
    cell: (info) => digitsEnToFa(info.row.index + 1),
  }),
  columnHelper.accessor("name", {
    header: () => "نام کاربر",
    cell: (info) => (
      <>
        <div className="flex flex-row items-center">
          {info.row.original.pic ? (
            <Img src={info.row.original.logoFile} className="w-8 h-8" />
          ) : (
            <PhotoIcon className="w-8 h-8 text-gray-300" aria-hidden="true" />
          )}
          <span className="mr-2">{info?.getValue()}</span>
          <span className="mr-2">{info?.row.original.family}</span>
        </div>
      </>
    ),
  }),

  columnHelper.accessor("mobile", {
    header: () => "موبایل",
    cell: (info) => digitsEnToFa(info.getValue()),
  }),
  columnHelper.accessor("role", {
    header: () => "نقش",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: () => "وضعیت پروفایل",
    cell: (info) =>  
    info.getValue() == 1  ?  (
      <span className="w-fit bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
           تکمیل 
      </span>
    ) :
    info.getValue() == 4  && (
      <span className="w-fit bg-primary-100 text-primary-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
       عدم تکمیل
      </span>
    ) 
  }),
 
  columnHelper.accessor("userName", {
    header: () => "نام کاربری",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("nationalCode", {
    header: () => "کد ملی",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("address", {
    header: () => "آدرس",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("birthDate", {
    header: () => "تاریخ تولد",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: () => "ایمیل",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("family", {
    header: () => "نام خانوادگی",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("registerDate", {
    header: () => "تاریخ عضویت",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("userId", {
    header: () => "ایدی کاربر",
    cell: (info) => info.getValue(),
  }),
];

export default columns;
