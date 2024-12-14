import { createColumnHelper } from "@tanstack/react-table";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { PhotoIcon } from "@heroicons/react/24/outline";
import Img from "../../../../ui/element/Img";

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
            <Img src={info.row.original.pic} className="w-8 h-8" />
          ) : (
            <PhotoIcon className="w-8 h-8 text-gray-300" aria-hidden="true" />
          )}
          <span className="mr-2">{info?.getValue()}</span>
          <span className="mr-2">{info?.row.original.family}</span>
        </div>
      </>
    ),
  }),

  columnHelper.accessor("subSysName", {
    header: () => "زیر سیستم",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("mobile", {
    header: () => "موبایل",
    cell: (info) => digitsEnToFa(info.getValue()),
  }),
  columnHelper.accessor("role", {
    header: () => "نقش",
    cell: (info) => info.getValue(),
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
  columnHelper.accessor("telephone", {
    header: () => "تلفن",
    cell: (info) => info.getValue(),
  }),
];

export default columns;
