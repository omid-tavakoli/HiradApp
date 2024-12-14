import { createColumnHelper } from "@tanstack/react-table";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { useUser } from "../../../contexts/UserContext";

const getColumns = () => {
  const columnHelper = createColumnHelper();
  const { user } = useUser();

  return [
  columnHelper.accessor("id", {
    header: () => "#",
    cell: (info) => digitsEnToFa(info.row.index + 1),
  }),
  columnHelper.accessor("title", {
    header: () => "عنوان",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("subProjectTitle", {
    header: () => `${user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue: 'پروژه'}`,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("eventTime", {
    header: () => `زمان ${user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'}`,
    cell: (info) => {
      const [date, time] = info.getValue().split(" ");
      return digitsEnToFa(date);
    },
  }),
  columnHelper.accessor("testDuration", {
    header: () => `مدت زمان ${user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'}`,
    cell: (info) => digitsEnToFa(info.getValue()),
  }),
  columnHelper.accessor("isFinished", {
    header: () => "وضعیت",
    cell: (info) =>
      info.getValue() ? (
        <span className="w-fit bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
          انجام شده
        </span>
      ) : (
        <span className="w-fit bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
          انجام نشده
        </span>
      ),
  }),
  columnHelper.accessor("filled", {
    header: () => "وضعیت",
    cell: (info) =>
      info.getValue() ? (
        <span className="w-fit bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
          تکمیل
        </span>
      ) : (
        <span className="w-fit bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
          عدم تکمیل
        </span>
      ),
  }),
  columnHelper.accessor("all", {
    header: () => "وضغیت استفاده همه",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("canStart", {
    header: () => "قابل استفاده بودن",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("isFinal", {
    header: () => "نهایی بودن",
    cell: (info) => info.getValue(),
  }),
];
}

export default getColumns;