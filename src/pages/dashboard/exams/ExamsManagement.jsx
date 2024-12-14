import { useNavigate } from "react-router-dom";
import DataTable from "../../../ui/table/DataTable";
import BeatLoaderLoading from "../../../ui/element/loading/BeatLoader";
import useApi from "../../../hooks/useApi";
import { useState, useEffect, useMemo } from "react";
import { useUser } from "../../../contexts/UserContext";
import getColumns from "../../../utils/models/column/ExamManagement";
import { createColumnHelper } from "@tanstack/react-table";
import { EyeIcon } from "@heroicons/react/24/outline";
import ExamLock from "../../../ui/components/exams/ExamLock";

const ExamsManagement = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const { user } = useUser();
  const columnHelper = createColumnHelper();
  const requestGetlist = useApi();
  const baseColumns = getColumns();
  const columns = useMemo(
    () => [
      ...baseColumns,
      columnHelper.accessor("isLock", {
        header: () => "فعال/غیرفعال",
        cell: (info) => (
          <ExamLock
            targetItem={info.row.original}
            updateList={() => getListData()}
          />
        ),
      }),
      columnHelper.accessor("actions", {
        header: () => "عملیات",
        cell: (info) => (
          <button
            onClick={() => handleShow(info.row.original.id)}
            className="w-full flex justify-center rounded-md bg-white p-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          >
            <EyeIcon className="w-4 h-4 ml-1" />
            <span>مشاهده و تغییرات</span>
          </button>
        ),
      }),
    ],
    []
  );

  useEffect(() => {
    if (user) getListData();
  }, [user]);

  const getListData = async () => {
    if (user?.subSysId) {
      try {
        const { data } = await requestGetlist.apiCall(
          "get",
          `Exam/GetList/${user.subSysId}`
        );
        setList(data);
      } catch (error) {
        console.log(error);
      }
    } else {
      getListData();
    }
  };

  const handleRedirectExamCreate = () => {
    navigate("create");
  };
  const handleRedirectMassExamCreate = () => {
    navigate("mass-create");
  };
  const handleShow = (id) => {
    navigate(`${id}`);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-2xl font-black text-gray-600 mb-4">
        {user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
              ?.fieldValue
          : "ارزیابی"}{" "}
        ها
      </div>
      <span className="text-gray-500">
        در این صفحه لیست{" "}
        {user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
              ?.fieldValue
          : "ارزیابی"}{" "}
        های تعریف شده را میتوانید ببینید و با زدن دکمه افزودن{" "}
        {user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
              ?.fieldValue
          : "ارزیابی"}{" "}
        ،{" "}
        {user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
              ?.fieldValue
          : "ارزیابی"}{" "}
        جدید ایجاد کنید. جهت مشاهده جزئیات و ثبت تغییرات هر{" "}
        {user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
              ?.fieldValue
          : "ارزیابی"}{" "}
        روی دکمه مشاهده و تغییرات آن کلیک کنید.
      </span>
      <div className="flex gap-x-2">
        <button
          type="button"
          className="btn-primary w-fit"
          onClick={handleRedirectExamCreate}
        >
          افزودن{" "}
          {user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
            ?.fieldValue
            ? user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
                ?.fieldValue
            : "ارزیابی"}
        </button>
        <button
          type="button"
          className="btn-primary w-fit"
          onClick={handleRedirectMassExamCreate}
        >
          افزودن{" "}
          {user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
            ?.fieldValue
            ? user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
                ?.fieldValue
            : "ارزیابی"}{" "}
          جمعی
        </button>
      </div>
      {requestGetlist.loading && (
        <div className="w-full flex justify-center">
          <BeatLoaderLoading size={50} />
        </div>
      )}
      {list ? (
        <DataTable columns={columns} data={list} />
      ) : (
        <div className="flex justify-center text-primary-600 text-2xl pt-6">
          داده ای یافت نشد
        </div>
      )}
    </div>
  );
};

export default ExamsManagement;
