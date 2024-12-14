import { useState } from "react";

const SelectFilter = ({
  columnFilters,
  setColumnFilters,
  selectColumnFilters,
}) => {
  const filterName =
    columnFilters?.find((f) => f.id === selectColumnFilters)?.value || "";

  const onFilterChange = (id, value) => {
    setColumnFilters((prev) =>
      prev.filter((f) => f.id !== id).concat({ id, value })
    );
  };

  return (
    <input
      value={filterName}
      onChange={(e) => onFilterChange(selectColumnFilters, e.target.value)}
      placeholder="جستجو ..."
      className="bg-white border border-gray-100 text-gray-900 rounded-l-lg focus:outline-0 focus:border-gray-300 block p-2 w-30 text-xs"
    />
  );
};

export default SelectFilter;
