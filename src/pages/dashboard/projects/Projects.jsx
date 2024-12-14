import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DataTable from "../../../ui/table/DataTable";
import BeatLoaderLoading from "../../../ui/element/loading/BeatLoader";
import useApi from "../../../hooks/useApi";
import { useState, useEffect } from "react";
import { useUser } from "../../../contexts/UserContext";
import getColumns from "../../../utils/models/column/Projects";
import { createColumnHelper } from "@tanstack/react-table";
import { EyeIcon } from "@heroicons/react/24/outline";

const Projects = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const { user } = useUser();
  const columnHelper = createColumnHelper();
  const columns = getColumns();
  const requestGetlist = useApi();
  const additionalColumn = columnHelper.accessor("actions", {
    header: () => "عملیات",
    cell: (info) => (
      <button
        onClick={() => handleShow(info.row.original.id)}
        className=" w-full flex justify-center rounded-md bg-white p-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
      >
        <EyeIcon className="w-4 h-4 ml-1" />
        <span>مشاهده و نغییرات</span>
      </button>
    ),
  });

  useEffect(() => {
    user && getListData();
  }, [user]);

  const getListData = async () => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        `Project/GetList?subSysId=${user?.subSysId}`
      );
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRedirectKindCreate = () => {
    navigate("create");
  };

  const handleShow = (id) => {
    navigate(`${id}`);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-2xl font-black text-gray-600 mb-4">
        {user?.role?.listSystemSet?.filter((item) => item.number == 2)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 2)[0]
              ?.fieldValue
          : "پروژه"}{" "}
        ها
      </div>
      <span className="mr-2 text-gray-500">
        در این صفحه لیست{" "}
        {user?.role?.listSystemSet?.filter((item) => item.number == 2)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 2)[0]
              ?.fieldValue
          : "پروژه"}{" "}
        های تعریف شده را میتوانید ببینید و با زدن دکمه افزودن{" "}
        {user?.role?.listSystemSet?.filter((item) => item.number == 2)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 2)[0]
              ?.fieldValue
          : "پروژه"}{" "}
        جدید ایجاد کنید.جهت مشاهده جزئیات و ثبت تغییرات هر{" "}
        {user?.role?.listSystemSet?.filter((item) => item.number == 2)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 2)[0]
              ?.fieldValue
          : "پروژه"}{" "}
        روی دکمه مشاهده و تغییرات آن کلیک کنید.
      </span>
      <button
        type="button"
        className="btn-primary w-fit"
        onClick={handleRedirectKindCreate}
      >
        افزودن{" "}
        {user?.role?.listSystemSet?.filter((item) => item.number == 2)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 2)[0]
              ?.fieldValue
          : "پروژه"}
      </button>

      {requestGetlist.loading && (
        <div className="w-full flex justify-center">
          <BeatLoaderLoading size={50} />
        </div>
      )}
      {list ? (
        <DataTable columns={[...columns, additionalColumn]} data={list} />
      ) : (
        <div className="flex justify-center text-primary-600 text-2xl pt-6">
          داده ای یافت نشد
        </div>
      )}
    </div>
  );
};

export default Projects;
