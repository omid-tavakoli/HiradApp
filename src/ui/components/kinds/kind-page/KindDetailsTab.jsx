import useApi from "../../../../hooks/useApi";
import AddKindDetailsForm from "../KindCreateStepper/forms/AddKindDetailsForm";
import { useState, useEffect } from "react";
import ModalAction from "../../../ModalAction";
import { TrashIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import BeatLoaderLoading from "../../../element/loading/BeatLoader";

const KindDetailsTab = ({ kindId }) => {
  const [list, setList] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);

  const requestGetlist = useApi();
  const request = useApi();

  useEffect(() => {
    getListData();
  }, []);

  const getListData = async () => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        `Project/GetKindDetailList/${kindId}`
      );
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = (id) => {
    setModalContent({
      title: "افزودن سربرگ",
      children: (
        <AddKindDetailsForm
          kindId={kindId}
          onSubmitTitle={"افزودن"}
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
      const response = await request.apiCall(
        "post",
        `Project/AddKindDetail`,
        data
      );
      if (response?.isSuccess) {
        getListData();
        setShowModal(false);
        toast.success("سربرگ با موفقیت اضافه شد");
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const handleDelete = (id) => {
    const targetItem = list.find((item) => item.id == id);
    setModalContent({
      title: "حذف سربرگ",
      onSubmitTitle: "حذف",
      onSubmit: () => onDelete(id),
      children: (
        <div>
          آیا از حذف سربرگ{" "}
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
        `Project/DeleteKindDetail/${id}`
      );
      if (response?.isSuccess) {
        toast.success("سربرگ با موفقیت حذف شد");
        getListData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const { data } = await request.apiCall(
        "get",
        `Project/GetKindDetail/${id}`
      );

      setModalContent({
        title: "ویرایش سربرگ",
        children: (
          <AddKindDetailsForm
            kindId={kindId}
            onSubmitTitle={"ویرایش"}
            defaultValues={data}
            onClose={() => setShowModal(false)}
            setShowModal={setShowModal}
            reFetch={() => getListData()}
            onSubmit={(formData, id) => onEdit(formData, id)}
            id={id}
          />
        ),
      });
      setShowModal(true);
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const onEdit = async (formData, id) => {
    try {
      const response = await request.apiCall("post", `Project/EditKindDetail`, {
        ...formData,
        id: id,
      });
      if (response?.isSuccess) {
        toast.success("سربرگ با موفقیت ویرایش شد");
        getListData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };
  return (
    <>
      <button
        type="button"
        className="btn-primary flex flex-row"
        onClick={() => handleAdd()}
      >
        <PlusIcon className="w-4 h-4 ml-1" />
        افزودن سربرگ
      </button>

      <div className="mt-4 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
        <div className="block w-full px-4 py-2 text-gray-800 bg-gray-200 border-b border-gray-200 rounded-t-lg cursor-pointer">
          سربرگ ها
        </div>

        {requestGetlist.loading ? (
          <div className="w-full flex justify-center">
            <BeatLoaderLoading />
          </div>
        ) : !list?.length == 0 ? (
          list?.map((item) => (
            <div
              key={item.id}
              className=" flex flex-row justify-between items-center  w-full px-4 py-2  gap-x-1 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:text-primary-700 "
            >
              <div className="flex flex-row items-center">
                {item.title}
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
            سربرگی ثبت نشده است
          </span>
        )}
      </div>

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

export default KindDetailsTab;
