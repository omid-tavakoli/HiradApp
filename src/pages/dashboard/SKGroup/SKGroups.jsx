import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DataTable from "../../../ui/table/DataTable";
import BeatLoaderLoading from "../../../ui/element/loading/BeatLoader";
import useApi from "../../../hooks/useApi";
import { useState, useEffect } from "react";
import { useUser } from "../../../contexts/UserContext";
import columns from "../../../utils/models/column/SKGroups";
import { createColumnHelper } from "@tanstack/react-table";
import { EyeIcon } from "@heroicons/react/24/outline";
import ComboBox from "../../../ui/element/ComboBox";

const SKGroups = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [subKinds, setSubKinds] = useState([]);
  const [selectdSubKind, setSelectedSubKind] = useState();
  const { user } = useUser();
  const columnHelper = createColumnHelper();

  const requestGetlist = useApi();
  const requestGetSubKinds = useApi();

  const additionalColumn = columnHelper.accessor("actions", {
    header: () => "عملیات",
    cell: (info) => (
      <button
        onClick={() => handleShow(info.row.original.id)}
        className=" w-full flex justify-center rounded-md bg-white p-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
      >
        <EyeIcon className="w-4 h-4 ml-1" />
        <span>مشاهده و ثبت تغییرات</span>
      </button>
    ),
  });

  useEffect(() => {
    if (user) getSubKinds();
  }, [user]);

  useEffect(() => {
    if (selectdSubKind) getListData();
  }, [selectdSubKind]);

  const getListData = async () => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        `SKGroup/GetList/${user?.subSysId}/${selectdSubKind}`
      );
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getSubKinds = async () => {
    try {
      const { data } = await requestGetSubKinds.apiCall(
        "get",
        `SubSysKind/GetList/${user?.subSysId}`
      );
      if (data == null) {
        toast.error(
          `در قسمت تعارف اولیه سیستم ${
            user?.role?.listSystemSet?.filter((item) => item.number == 11)[0]
              ?.fieldValue
              ? user?.role?.listSystemSet?.filter(
                  (item) => item.number == 11
                )[0]?.fieldValue
              : "زیرمجموعه"
          } تعریف کنید`
        );
        return;
      }
      setSubKinds(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRedirectKindCreate = () => {
    navigate(`create/${selectdSubKind}`);
  };

  const handleShow = (id) => {
    navigate(`${id}`);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-2xl font-black text-gray-600 mb-4">
        دسته بندی سوالات
      </div>
      <span className="mr-2 text-gray-500">
        در این صفحه با انتخاب{" "}
        {user?.role?.listSystemSet?.filter((item) => item.number == 11)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 11)[0]
              ?.fieldValue
          : "زیرمجموعه"}{" "}
        مورد نظر میتوان لیست دسته بندی سوالات های تعریف شده برای آن {" "}
        {user?.role?.listSystemSet?.filter((item) => item.number == 11)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 11)[0]
              ?.fieldValue
          : "زیرمجموعه"}{" "}
        را ببینید و جهت مشاهده جزئیات و ثبت تغییرات هر دسته بندی سوال روی دکمه
        مشاهده و تغییرات آن کلیک کنید. با زدن دکمه افزودن دسته بندی ، دسته بندی
        جدیدی برای{" "}
        {user?.role?.listSystemSet?.filter((item) => item.number == 11)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 11)[0]
              ?.fieldValue
          : "زیرمجموعه"}{" "}
        مورد نظر ایجاد کنید.
      </span>
      <button
        type="button"
        className="w-fit btn-primary"
        onClick={handleRedirectKindCreate}
      >
        افزودن دسته بندی
      </button>

      <div className="mb-2 space-y-2 col-span-2">
        <label className="text-xs text-gray-600 mb-4">
          {user?.role?.listSystemSet?.filter((item) => item.number == 11)[0]
            ?.fieldValue
            ? user?.role?.listSystemSet?.filter((item) => item.number == 11)[0]
                ?.fieldValue
            : "زیرمجموعه"}{" "}
          مورد نظر را انتخاب کنید
        </label>
        <ComboBox
          options={subKinds?.map((item) => ({
            label: item?.title,
            value: item?.id,
          }))}
          onChange={(item) => setSelectedSubKind(item.value)}
        />
      </div>

      {requestGetlist.loading && (
        <div className="w-full flex justify-center">
          <BeatLoaderLoading size={50} />
        </div>
      )}
      {requestGetlist.error && (
        <div className="flex justify-center text-primary-600 text-2xl pt-6">
          داده ای یافت نشد
        </div>
      )}
      {!!list?.length && (
        <DataTable columns={[...columns, additionalColumn]} data={list} />
      )}
    </div>
  );
};

export default SKGroups;
