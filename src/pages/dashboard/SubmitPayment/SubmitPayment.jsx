import { useEffect, useState } from "react";
import useApi from "../../../hooks/useApi";
import { createColumnHelper } from "@tanstack/react-table";
import BeatLoaderLoading from "../../../ui/element/loading/BeatLoader";
import DataTable from "../../../ui/table/DataTable";
import {
  EyeIcon,
  XCircleIcon,
  CheckIcon,
  ArchiveBoxXMarkIcon,
} from "@heroicons/react/24/outline";
import columns from "../../../utils/models/column/SubmitPayment";
import ModalAction from "../../../ui/ModalAction";
import SubmitPaymentDetails from "./SubmitPaymentDetails";
import toast from "react-hot-toast";

export default function SubmitPayment() {
  const [list, setList] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);

  const requestGetlist = useApi();
  const requestStatus = useApi();

  const columnHelper = createColumnHelper();

  useEffect(() => {
    getListData();
  }, []);

  const getListData = async () => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        "Factor/GetListPayment"
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
        "Factor/CancelPayment?id=" + id
      );
      console.log(response);
      if (response?.isSuccess) {
        toast.success("فاکتور لغو شد.");
        getListData();
        setShowModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const payFactor = async (id) => {
    try {
      const response = await requestStatus.apiCall(
        "post",
        "Factor/confirmationPayment?id=" + id
      );
      if (response?.isSuccess) {
        toast.success("وضعیت فاکتور به پرداخت شده تغییر یافت.");
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
              const { id, systemName } = info.row.original;
              setModalContent({
                title: "فاکتور " + systemName,
                children: <SubmitPaymentDetails data={info} />,
                id,
              });
              setShowModal(true);
            }}
            className=" w-full flex justify-center rounded-md bg-white p-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          >
            <EyeIcon className="w-4 h-4 ml-1" />
            <span>مشاهده</span>
          </button>
          {info.row.original.status != 4 && 
            <button
              onClick={() => {
                const { id, systemName } = info.row.original;
                setModalContent({
                  title: "فاکتور " + systemName,
                  children: (
                    <div>
                      فاکتور <span className="font-bold">{systemName}</span>{" "}
                      پرداخت شده است؟
                    </div>
                  ),
                  onSubmitTitle: "تایید",
                  onSubmit: () => payFactor(id),
                  loading: requestStatus.loading,
                  id,
                });
                setShowModal(true);
              }}
              className=" w-full flex justify-center rounded-md bg-white p-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto mr-3"
            >
              <CheckIcon className="w-4 h-4 ml-1" />
              <span>تایید</span>
            </button>
          }
          {info.row.original.status != 2 && 
            <button
              onClick={() => {
                const { id, systemName } = info.row.original;
                setModalContent({
                  title: "فاکتور " + systemName,
                  children: (
                    <div>
                      آیا از لغو فاکتور{" "}
                      <span className="font-bold"> {systemName}</span> مطمئن
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
          }
        </div>
      ),
    }),
  ];

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-2xl font-black text-gray-600 mb-4">فاکتورها</div>

      {list ? (
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
}
