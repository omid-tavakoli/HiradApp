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
  columnHelper.accessor("color", {
    header: () => "رنگ",
    cell: (info) => info.getValue(),
  }),

  columnHelper.accessor("description", {
    header: () => "توضیحات",
    cell: (info) => info.getValue(),
  }),
];

export default columns;
