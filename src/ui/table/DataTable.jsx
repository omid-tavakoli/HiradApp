import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import "../../assets/styles/table.css";
import tableBackground from "../../assets/images/grid.svg";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  TableCellsIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import SelectFilter from "./SelectFilter";
import { useMemo } from "react";

import ExcelJS from "exceljs";

const DataTable = ({
  data,
  columns,
  title,
  countColumns = 4,
  actions = null,
}) => {
  const [selectColumnFilters, setSelectColumnFilters] = useState();
  const [columnFilters, setColumnFilters] = useState([]);
  const [showPDF, setShowPDF] = useState(false);

  const memoizedColumns = useMemo(() => columns, []);
  const [dataPdf, setDataPdf] = useState(data);
  const table = useReactTable({
    data,
    columns: memoizedColumns,
    debugAll: false,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });

  const componentRef = useRef();

  useEffect(() => {
    if (showPDF) {
      window.print();
      setTimeout(() => {
        setShowPDF(false);
      }, 1);
    }
  }, [showPDF]);
  const exportTypes = {
    pdf: () => {
      const filteredRows = table
        .getFilteredRowModel()
        .rows.map((row) => row.original);
      setDataPdf(filteredRows);
      setShowPDF(true);
      setTimeout(() => {
        setShowPDF(false);
      }, 1000);
    },
    excel: () => {
      const filteredRows = table
        .getFilteredRowModel()
        .rows.map((row) => row.original);

      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Hirad";
      workbook.created = new Date();

      const sheet = workbook.addWorksheet(title || "sheet 1");

      const excelColumnsWithoutActions = columns.filter(
        (item) => item.accessorKey !== "actions"
      );
      const excelColumns = excelColumnsWithoutActions.map((c) => ({
        header: c.header()?.toString() || "",
        key: c.accessorKey,
      }));

      sheet.columns = excelColumns;

      sheet.addRows(
        filteredRows.map((row) =>
          excelColumns.reduce(
            (prev, cur) => ({
              ...prev,
              [cur.key]: row[cur.key]?.value
                ? row[cur.key].value
                : row[cur.key],
            }),
            {}
          )
        )
      );

      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.xlsx");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });
    },
  };

  const exportData = (type) => {
    exportTypes[type]();
  };
  return (
    <>
      <div className="flex flex-col print:hidden">
        <div className="flex flex-row justify-between items-center mb-4">
          <div className="flex">
            <select
              className="bg-white border border-gray-100 text-gray-900 rounded-r-lg focus:outline-0 focus:border-gray-300 block  w-28 pr-7 text-xs"
              value={selectColumnFilters}
              onChange={(e) => setSelectColumnFilters(e.target.value)}
            >
              {table.getAllLeafColumns().map((column) => {
                return (
                  <option
                    key={column.columnDef.accessorKey}
                    value={column.columnDef.accessorKey}
                  >
                    {column.columnDef.header()}
                  </option>
                );
              })}
            </select>
            <SelectFilter
              columnFilters={columnFilters}
              setColumnFilters={setColumnFilters}
              selectColumnFilters={selectColumnFilters}
            />
          </div>

          <div>
            <button
              className="btn-secondary size-15"
              title="دانلود خروجی اکسل"
              onClick={() => {
                exportData("excel");
              }}
            >
              <TableCellsIcon className="w-5 h-5" />
            </button>
            <button
              className="btn-secondary size-15"
              title="دانلود خروجی pdf"
              onClick={() => {
                exportData("pdf");
              }}
            >
              <DocumentIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="relative bg-slate-50 rounded-xl">
          <div
            className="absolute inset-0 bg-grid-slate-100"
            style={{
              backgroundPosition: "10px 10px",
              backgroundImage: `url(${tableBackground})`,
            }}
          ></div>

          <div className="relative rounded-xl">
            <div className="shadow-sm  my-8 overflow-auto  table-scrollbar">
              <table
                ref={componentRef}
                className="table-auto min-w-full text-xs whitespace-nowrap text-right"
              >
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers
                        .filter(
                          (header, index) =>
                            index <= countColumns ||
                            header.id === "isLock" ||
                            header.id === "actions" ||
                            header.id === "defaultSubSysKind"
                        )
                        .map((header) => (
                          <th
                            key={header.id}
                            onClick={header.column.getToggleSortingHandler()}
                            className="border-b text-sm font-medium p-4 pr-8 pt-0 pb-3 text-slate-400"
                          >
                            <div className="flex items-center">
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                              {
                                {
                                  asc: (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="w-4 h-4 mr-1"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4.5 15.75l7.5-7.5 7.5 7.5"
                                      />
                                    </svg>
                                  ),
                                  desc: (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="w-4 h-4 mr-1"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                      />
                                    </svg>
                                  ),
                                }[header.column.getIsSorted() ?? null]
                              }
                            </div>
                          </th>
                        ))}
                      {actions && (
                        <th className="border-b text-sm font-medium p-4 pr-8 pt-0 pb-3 text-slate-400">
                          عملیات
                        </th>
                      )}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white text-right">
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row
                        .getVisibleCells()
                        .filter(
                          (cell, index) =>
                            index <= countColumns ||
                            cell.column.id === "isLock" ||
                            cell.column.id === "actions" ||
                            cell.column.id === "defaultSubSysKind"
                        )
                        .map((cell) => (
                          <td
                            key={cell.id}
                            className="border-b border-slate-200  p-4 pr-8 text-slate-500"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      {actions && (
                        <td className="border-b flex gap-x-2 border-slate-200 p-4 pr-8 text-slate-500">
                          {actions.map((item, key) => (
                            <button
                              key={key}
                              onClick={() => item.handleClick(row.original.id)}
                              className=" w-full flex justify-center rounded-md bg-white p-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            >
                              {item.icon}
                              <span>{item.title}</span>
                            </button>
                          ))}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-xl"></div>
        </div>
        <div>
          <div className="flex items-center gap-2 mt-4">
            <div className="flex flex-row bg-white rounded-md border">
              <div className=" flex items-center border-l">
                <button
                  className={`${
                    !table.getCanPreviousPage() && "text-gray-500"
                  } p-2`}
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
                <button
                  className={`${
                    !table.getCanNextPage() && "text-gray-500"
                  } p-2`}
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-1 px-2 text-xs">
                <div>صفحه</div>
                <strong>
                  {table.getState().pagination.pageIndex + 1} از{" "}
                  {table.getPageCount()}
                </strong>
              </div>
            </div>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="bg-white rounded-md border outline-0 text-xs w-[90px] h-9 pr-7"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  نمایش {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {showPDF && (
        <div className="absolute top-0 right-0 w-full h-full bg-white z-50 !m-0">
          <table className="table-auto min-w-full text-xs whitespace-nowrap text-right">
            <thead>
              <tr>
                {columns
                  .filter((c) => c.accessorKey !== "actions")
                  .map((column, i) => (
                    <th
                      key={i}
                      className="border-b text-sm font-medium p-4 pr-8 pt-0 pb-3 text-slate-400"
                    >
                      <div className="flex items-center">{column.header()}</div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="bg-white text-right">
              {dataPdf.map((row) => (
                <tr key={row.id}>
                  {columns
                    .filter((c) => c.accessorKey !== "actions")
                    .map((column, i) => (
                      <td
                        key={row.id + "" + i}
                        className="border-b border-slate-200  p-4 pr-8 text-slate-500"
                      >
                        {row[column.accessorKey]}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default DataTable;
