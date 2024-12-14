import { useEffect, useState } from "react";
import DataTable from "../../../ui/table/DataTable";
import BeatLoaderLoading from "../../../ui/element/loading/BeatLoader";
import useApi from "../../../hooks/useApi";
import columns from "../../../utils/models/column/factors/factors";
import { useUser } from "../../../contexts/UserContext";
import FactorPage from "./FactorPage";
import { createColumnHelper } from "@tanstack/react-table";
import {
  CreditCardIcon,
  EyeIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import ModalAction from "../../../ui/ModalAction";
import toast from "react-hot-toast";

const SystemPackages = () => {
  const [list, setList] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);

  const requestGetlist = useApi();
  const requestStatus = useApi();
  const { user } = useUser();

  const columnHelper = createColumnHelper();

  useEffect(() => {
    if (user) getListData();
  }, [user]);

  const getListData = async () => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        "Factor/GetList?subSysId=" + user?.subSysId
      );
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const cancelFactor = async (id) => {
    try {
      const response = await requestStatus.apiCall(
        "post",
        "Factor/CancelFactor?id=" + id
      );
      if (response?.isSuccess) {
        toast.success("فاکتور لغو شد.");
        getListData();
        setShowModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const additionalColumns = [
    columnHelper.accessor("actions", {
      header: () => "عملیات",
      cell: (info) => (
        <div className="w-full flex">
          <button
            onClick={() => {
              const { id, packageName } = info.row.original;
              setModalContent({
                title: "فاکتور " + packageName,
                children: <FactorPage id={id} status={true} />,
                id,
              });
              setShowModal(true);
            }}
            className=" w-full flex justify-center rounded-md bg-white p-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          >
            <EyeIcon className="w-4 h-4 ml-1" />
            <span>مشاهده</span>
          </button>
          {info.row.original.paymentStatus !== 2 && (
            <button
              onClick={() => {
                const { id, packageName } = info.row.original;
                setModalContent({
                  title: "فاکتور " + packageName,
                  children: <FactorPage id={id} status={false} />,
                  id,
                });
                setShowModal(true);
              }}
              className=" w-full flex justify-center rounded-md bg-white p-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto mr-3"
            >
              <CreditCardIcon className="w-4 h-4 ml-1" />
              <span>پیش فاکتور و پرداخت</span>
            </button>
          )}
          {info.row.original.paymentStatus !== 2 && (
            <button
              onClick={() => {
                const { id, packageName } = info.row.original;
                setModalContent({
                  title: "فاکتور " + packageName,
                  children: (
                    <div>
                      آیا از لغو فاکتور{" "}
                      <span className="font-bold"> {packageName}</span> مطمئن
                      هستید؟
                    </div>
                  ),
                  onSubmitTitle: "لغو",
                  onSubmit: () => cancelFactor(id),
                  loading: requestStatus.loading,
                  id,
                });
                setShowModal(true);
              }}
              className=" w-full flex justify-center rounded-md bg-white p-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto mr-3"
            >
              <XCircleIcon className="w-4 h-4 ml-1" />
              <span>لغو</span>
            </button>
          )}
        </div>
      ),
    }),
  ];
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-2xl font-black text-gray-600 mb-4">فاکتورها</div>
      <span className="mr-2 text-gray-500">
        در این صفحه میتوانید لیست فاکتورهای پکیج های انتخاب شده را مشاهده کنید و
        پرداخت کنید و پس از پرداخت شناسه پرداخت را ثبت نمایید تا خرید نهایی
        شود.جهت مشاهده جزییات فاکتور روی دکمه مشاهده کلیک کنید.توجه داشته باشید
        فاکتور ها تا زمانی پرداخت انجام نشده است امکان لغو شدن دارند.
      </span>
      {list?.length ? (
        <DataTable columns={[...columns, ...additionalColumns]} data={list} />
      ) : (
        <div className="flex justify-center text-primary-600 text-2xl pt-6">
          داده ای یافت نشد
        </div>
      )}

      {requestGetlist.loading && (
        <div className="w-full flex justify-center">
          <BeatLoaderLoading size={50} />
        </div>
      )}

      {showModal && modalContent && (
        <ModalAction
          {...modalContent}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default SystemPackages;
