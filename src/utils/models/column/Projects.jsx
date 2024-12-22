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
      header: () => `${user?.role?.listSystemSet?.filter(item => item.number == 7 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 7 )[0]?.fieldValue : 'عنوان'}`,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("subSysKindName", {
      header: () => `${user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue : 'زیرمجموعه'}`,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("filled", {
      header: () => "وضعیت",
      cell: (info) =>
        info.getValue() ? (
          <span className="w-fit bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
            تکمیل
          </span>
        ) : (
          <span className="w-fit bg-primary-100 text-primary-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
            عدم تکمیل
          </span>
        ),
    }),
    columnHelper.accessor("startDate", {
      header: () => `${user?.role?.listSystemSet?.filter(item => item.number == 9 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 9 )[0]?.fieldValue : 'تاریخ شروع'}`,
      cell: (info) => (info.getValue() ? info.getValue() : "ثبت نشده است"),
    }),
    columnHelper.accessor("endDate", {
      header: () => `${user?.role?.listSystemSet?.filter(item => item.number == 10 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 10 )[0]?.fieldValue : 'تاریخ پایان'}`,
      cell: (info) => (info.getValue() ? info.getValue() : "ثبت نشده است"),
    }),
    columnHelper.accessor("identity", {
      header: () => `${user?.role?.listSystemSet?.filter(item => item.number == 6 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 6 )[0]?.fieldValue : 'شناسه'}`,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("zone", {
      header: () => `${user?.role?.listSystemSet?.filter(item => item.number == 8 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 8 )[0]?.fieldValue : 'منطفه'}`,
      cell: (info) => info.getValue(),
    }),
  ];
};

export default getColumns;
