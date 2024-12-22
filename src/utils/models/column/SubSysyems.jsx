import { createColumnHelper } from "@tanstack/react-table";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { PhotoIcon } from "@heroicons/react/24/outline";
const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("id", {
    header: () => "#",
    cell: (info) => digitsEnToFa(info.row.index + 1),
  }),
  columnHelper.accessor("title", {
    header: () => "عنوان",
    cell: (info) => (
      <>
        <div className="flex flex-row items-center">
          {info.row.original.logoFile ? (
            <Img src={info.row.original.logoFile} className="w-8 h-8" />
          ) : (
            <PhotoIcon className="w-8 h-8 text-gray-300" aria-hidden="true" />
          )}
          <span className="mr-2">{info.getValue()}</span>
        </div>
      </>
    ),
  }),
  columnHelper.accessor("subTypes", {
    header: () => "نوع زیر سیستم",
    cell: (info) => (
      <div className="flex flex-col text-xs space-y-1">
        {info.getValue().map((item, index) => (
          <span key={index}>{item.name}</span>
        ))}
      </div>
    ),
  }),
  columnHelper.accessor("needToFill", {
    header: () => "مشخصات",
    cell: (info) =>
      !info.getValue() ? (
        <span className="w-fit bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
          تکمیل
        </span>
      ) : (
        <span className="w-fit bg-primary-100 text-primary-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
          عدم تکمیل
        </span>
      ),
  }),
  columnHelper.accessor("city", {
    header: () => "شهر",
    cell: (info) => (info.getValue() ? info.getValue() : "ثبت نشده است"),
  }),
  columnHelper.accessor("color", {
    header: () => "رنگ",
    cell: (info) => (info.getValue() ? info.getValue() : "ثبت نشده است"),
  }),
  columnHelper.accessor("startDate", {
    header: () => "تاریخ شروع",
    cell: (info) => digitsEnToFa(info.getValue()),
  }),
  columnHelper.accessor("endDate", {
    header: () => "تاریخ پایان",
    cell: (info) => info.getValue() && digitsEnToFa(info.getValue()),
  }),
];

export default columns;
