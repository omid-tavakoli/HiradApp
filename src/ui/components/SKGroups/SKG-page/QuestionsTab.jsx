import useApi from "../../../../hooks/useApi";
import AddQuestionForm from "../createStepper/forms/AddQuestionForm";
import { useState, useEffect } from "react";
import ModalAction from "../../../ModalAction";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import Question from "../../exams/exam-doing/Question";

const questionType = [
  { name: "Int ", title: "عددی", id: 1, type: "int" },
  { name: "Text ", title: "متن", id: 2, type: "text" },
  { name: "Document", title: "پیوست سند", id: 3, type: "document" },
  { name: "Choice ", title: "تستی", id: 4, type: "choice" },
  { name: "Date ", title: "تاریخ", id: 5, type: "date" },
];

const QuestionsTab = () => {
  const [list, setList] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);
  let { skgroupId } = useParams();

  const requestGetlist = useApi();
  const request = useApi();

  useEffect(() => {
    getListData();
  }, []);

  const getListData = async () => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        `Question/GetList?Filters=SKGroupId==${skgroupId}`
      );
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = (id) => {
    setModalContent({
      title: "افزودن سوال",
      children: (
        <AddQuestionForm
          skgroupId={skgroupId}
          onSubmitTitle={"ثبت"}
          onClose={() => setShowModal(false)}
          setShowModal={setShowModal}
          reFetch={() => getListData()}
          onSubmit={(formData) => onAdd(formData)}
          defaultValues={{}}
        />
      ),
      id: id,
    });
    setShowModal(true);
  };

  const onAdd = async (data) => {
    try {
      const response = await request.apiCall("post", `Question/Create`, data);
      if (response?.isSuccess) {
        getListData();
        setShowModal(false);
        toast.success("سوال با موفقیت اضافه شد");
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const handleDelete = (id) => {
    const targetItem = list.find((item) => item.id == id);
    setModalContent({
      title: "حذف سوال",
      onSubmitTitle: "حذف",
      onSubmit: () => onDelete(id),
      children: (
        <div>
          آیا از حذف سوال{" "}
          <span className="font-bold">{`${targetItem?.title}`}</span> مطمئن
          هستید؟
        </div>
      ),
      id: id,
      loading: request.loading,
    });
    setShowModal(true);
  };

  const onDelete = async (id) => {
    try {
      const response = await request.apiCall(
        "delete",
        `Question/Delete?id=${id}`
      );
      if (response?.isSuccess) {
        toast.success("سوال با موفقیت حذف شد");
        getListData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        `Question/Get/${id}`
      );
      setModalContent({
        title: "ویرایش سوال",
        children: (
          <AddQuestionForm
            skgroupId={skgroupId}
            onSubmitTitle={"ثبت"}
            onClose={() => setShowModal(false)}
            setShowModal={setShowModal}
            reFetch={() => getListData()}
            onSubmit={(formData) => onEdit(formData, id)}
            defaultValues={data}
          />
        ),
        id: id,
      });
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const onEdit = async (formData, id) => {
    try {
      const response = await request.apiCall("post", `Question/Edit`, {
        ...formData,
        id: id,
      });
      if (response?.isSuccess) {
        toast.success("سوال با موفقیت ویرایش شد");
        getListData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const handlePreview = () => {
    setModalContent({
      title: "پیش نمایش",
      children: (
        <>
          <div className="text-center text-sm text-red-500">
            این فرم صرفا جنبه پیش نمایش دارد.
          </div>
          {list.map((item) => (
            <div className="my-3">
              <Question key={item.id} data={item} />
            </div>
          ))}
        </>
      ),
    });
    setShowModal(true);
  };

  return (
    <>
      <button
        type="button"
        className="btn-primary flex flex-row"
        onClick={() => handleAdd()}
      >
        <PlusIcon className="w-4 h-4 ml-1" />
        افزودن سوال
      </button>

      <div className="mt-3 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
        <div className="block w-full px-4 py-2 text-gray-800 bg-gray-200 border-b border-gray-200 rounded-t-lg cursor-pointer">
          سوالات
        </div>

        {!list?.length == 0 ? (
          list?.map((item) => (
            <div
              key={item.id}
              className=" flex flex-row justify-between items-center  w-full px-4 py-2  gap-x-1 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:text-primary-700 "
            >
              <div className="flex flex-row items-center">
                <div className="ml-2">{item.title}</div> 
                <div className="bg-primary-100 text-primary-800 text-xs px-1 py-0.5 h-5 rounded">
                  {questionType.find((kind) => kind.id == item.type)?.title}
                </div>
              </div>
              <div className="flex flex-row items-center">
                <button
                  onClick={() => handleEdit(item.id)}
                  className="flex items-center text-xs ml-2 bg-gray-200 p-1 rounded"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center text-xs ml-2 bg-gray-200 p-1 rounded"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <span className="text-xs block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:text-primary-700">
            سوالی ثبت نشده است
          </span>
        )}
      </div>

      {!!list.length && (
        <button
          type="button"
          className="btn-primary flex flex-row mt-3"
          onClick={() => handlePreview()}
        >
          پیش نمایش
        </button>
      )}

      {showModal && modalContent && (
        <ModalAction
          {...modalContent}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default QuestionsTab;
