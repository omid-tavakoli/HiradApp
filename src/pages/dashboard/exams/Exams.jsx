import useApi from "../../../hooks/useApi";
import { useUser } from "../../../contexts/UserContext";
import DataTable from "../../../ui/table/DataTable";
import BeatLoaderLoading from "../../../ui/element/loading/BeatLoader";
import { useState, useEffect } from "react";
import getColumns from "../../../utils/models/column/Exams";
import { createColumnHelper } from "@tanstack/react-table";
import {
  EyeIcon,
  ArrowDownTrayIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import ModalAction from "../../../ui/ModalAction";
import ExamShowInfo from "../../../ui/components/exams/exam-doing/ExamShowInfo";
import ShowExam from "../../../ui/components/exams/exam-doing/ShowExam";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const Exams = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);
  const { user } = useUser();
  const columns = getColumns();
  const columnHelper = createColumnHelper();

  const request = useApi();

  useEffect(() => {
    user && getList();
  }, [user]);

  const getList = async () => {
    try {
      const { data } = await request.apiCall(
        "get",
        `Exam/GetExamListByUserId/${user?.userId}`
      );

      setList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetExamLocal = (id) => {
    const getExamAndQuestionList = async () => {
      try {
        const { data } = await request.apiCall(
          "get",
          `Question/GetExamQuestionList?examId=${id}`
        );
        localStorage.setItem(`Questions`, JSON.stringify(data));
        toast.success("سوال با موفقیت ذخیره شد");
      } catch (error) {
        console.log(error);
        toast.error("ذخیره‌سازی سوال با خطا مواجه شد");
      }
    };
    getExamAndQuestionList();
  };

  const additionalColumn = columnHelper.accessor("defaultSubSysKind", {
    header: () => "عملیات",
    cell: (info) => (
      <div className="w-full flex">
        {info.row.original.canStart ? (
          <div className="flex gap-x-2">
            <button
              onClick={() => handleShow(info.row.original.id)}
              className=" w-full flex justify-center rounded-md bg-white p-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              <EyeIcon className="w-4 h-4 ml-1" />
              <span>
                شروع{" "}
                {user?.role?.listSystemSet?.filter(
                  (item) => item.number == 4
                )[0]?.fieldValue
                  ? user?.role?.listSystemSet?.filter(
                      (item) => item.number == 4
                    )[0]?.fieldValue
                  : "ارزیابی"}
              </span>
            </button>
            <button
              onClick={() => handleSetExamLocal(info.row.original.id)}
              className=" w-full flex justify-center rounded-md bg-white p-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              <ArrowDownTrayIcon className="w-4 h-4 ml-1" />
              <span>بارگیری سوال</span>
            </button>
          </div>
        ) : info.row.original.isFinished ? (
          <button
            onClick={() => handleReview(info.row.original.id)}
            className=" w-full flex justify-center rounded-md bg-white p-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto mr-3"
          >
            <ClipboardDocumentListIcon className="w-4 h-4 ml-1" />
            <span>بازبینی</span>
          </button>
        ) : (
          <span className="w-fit bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
            نمیتوان شرکت کرد
          </span>
        )}
      </div>
    ),
  });

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

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-2xl font-black text-gray-600 mb-4">
        {user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
              ?.fieldValue
          : "ارزیابی"}{" "}
        های من
      </div>
      <span className="text-gray-500">
        در این صفحه میتوانید لیست{" "}
        {user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
              ?.fieldValue
          : "ارزیابی"}{" "}
        هایی باید انجام دهید را مشاهده کنید و برای شرکت در هر{" "}
        {user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
              ?.fieldValue
          : "ارزیابی"}{" "}
        روی دکمه شروع{" "}
        {user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
              ?.fieldValue
          : "ارزیابی"}{" "}
        کلیک کنید، با زدن روی دکمه بازبینی میتوان پاسخ های خود را مشاهده کنید{" "}
      </span>
      <button
        className="w-52 btn-primary"
        onClick={() => navigate(`/dashboard/exam/doing/0`)}
      >
        شرکت در{" "}
        {user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
              ?.fieldValue
          : "ارزیابی"}{" "}
        به صورت افلاین
      </button>
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
