import useApi from "../../../hooks/useApi";
import { useUser } from "../../../contexts/UserContext";
import DataTable from "../../../ui/table/DataTable";
import BeatLoaderLoading from "../../../ui/element/loading/BeatLoader";
import { useState, useEffect } from "react";
import getColumns from "../../../utils/models/column/ExamsReview";
import { createColumnHelper } from "@tanstack/react-table";
import {
  ClipboardDocumentListIcon,
  EyeIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import ModalAction from "../../../ui/ModalAction";
import ShowExam from "../../../ui/components/exams/exam-doing/ShowExam";

const Exams = () => {
  const { user } = useUser();
  const [list, setList] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);

  const columnHelper = createColumnHelper();
  const columns = getColumns();

  const request = useApi();

  useEffect(() => {
    user && getList();
  }, [user]);

  const getList = async () => {
    try {
      const { data } = await request.apiCall(
        "get",
        `Exam/GetList/${user?.subSysId}`
      );

      setList(data);
    } catch (error) {
      console.log(error);
    }
  };
  const additionalColumn = columnHelper.accessor("defaultSubSysKind", {
    header: () => "عملیات",
    cell: (info) => (
      <div className="w-full flex">
        {info.row.original.canStart && (
          <button
            onClick={() => handleShow(info.row.original.id)}
            className=" w-full flex justify-center rounded-md bg-white p-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          >
            <EyeIcon className="w-4 h-4 ml-1" />
            <span>
              شروع{" "}
              {user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
                ?.fieldValue
                ? user?.role?.listSystemSet?.filter(
                    (item) => item.number == 4
                  )[0]?.fieldValue
                : "ارزیابی"}
            </span>
          </button>
        )}
        {info.row.original.isFinished ? (
          <div className="flex">
            <button
              onClick={() => handleReview(info.row.original.id)}
              className=" w-full flex justify-center rounded-md bg-white p-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto mr-3"
            >
              <ClipboardDocumentListIcon className="w-4 h-4 ml-1" />
              <span>بازبینی</span>
            </button>
            <button
              onClick={() => handleReview(info.row.original.id)}
              className=" w-full flex justify-center rounded-md bg-white p-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto mr-3"
            >
              <CheckIcon className="w-4 h-4 ml-1" />
              <span>تایید</span>
            </button>
            <button
              onClick={() => handleReview(info.row.original.id)}
              className=" w-full flex justify-center rounded-md bg-white p-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto mr-3"
            >
              <XMarkIcon className="w-4 h-4 ml-1" />
              <span>رد</span>
            </button>
          </div>
        ) : (
          <span className="flex items-center  w-fit bg-primary-100 text-primary-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
            {user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
              ?.fieldValue
              ? user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
                  ?.fieldValue
              : "گزارش"}{" "}
            تمام نشده
          </span>
        )}
      </div>
    ),
  });
  const handleShow = async (id) => {
    try {
      const { data } = await request.apiCall("get", `exam/get/${id}`);

      setModalContent({
        title: `شروع ${
          user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
            ?.fieldValue
            ? user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
                ?.fieldValue
            : "ارزیابی"
        } ${data?.title}`,
        children: <ExamShowInfo data={data} />,
      });
      setShowModal(true);
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const handleReview = async (id) => {
    try {
      const { data } = await request.apiCall("get", `Exam/ShowResult/${id}`);
      setModalContent({
        title: `بازبینی ${
          user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
            ?.fieldValue
            ? user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
                ?.fieldValue
            : "ارزیابی"
        } ${data?.title}`,
        children: <ShowExam exam={data} />,
      });
      setShowModal(true);
    } catch (error) {
      console.log("ERR", error);
    }
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
        در این صفحه میتوانید لیست{" "}
        {user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
              ?.fieldValue
          : "ارزیابی"}{" "}
        ها را مشاهده کنید
      </span>
      {request.loading && (
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

export default Exams;
