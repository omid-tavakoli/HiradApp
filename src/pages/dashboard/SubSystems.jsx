import { useEffect, useState } from "react";
import DataTable from "../../ui/table/DataTable";
import BeatLoaderLoading from "../../ui/element/loading/BeatLoader";
import useApi from "../../hooks/useApi";
import columns from "../../utils/models/column/SubSysyems";
import { createColumnHelper } from "@tanstack/react-table";
import IsLockSubSystem from "../../ui/components/sub-systems/IsLockSubSystem";

const SubSystems = () => {
  const [list, setList] = useState([]);
  const request = useApi();
  const columnHelper = createColumnHelper();
  useEffect(() => {
    fetchData()
  } , [])
  const fetchData = async () => {
    try {
      const { data } = await request.apiCall("get", "SubSys/GetList");
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const isItemExist = columns.some((item) => item.accessorKey === "isLock");
    !isItemExist &&
      columns.push(
        columnHelper.accessor("isLock", {
          header: () => "فعال/غیرفعال",
          cell: (info) => (
            <IsLockSubSystem
              targetItem={info.row.original}
              updateList={() => fetchData()}
            />
          ),
        })
      );
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-2xl font-black text-gray-600 mb-4">زیر سیستم ها</div>

      {request.loading ? (
        <div className="w-full flex justify-center">
          <BeatLoaderLoading size={50} />
        </div>
      ) : (
        <DataTable columns={columns} data={list} />
      )}
    </div>
  );
};

export default SubSystems;
