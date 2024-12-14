import { useEffect, useState } from "react";
import DataTable from "../../ui/table/DataTable";
import BeatLoaderLoading from "../../ui/element/loading/BeatLoader";
import useApi from "../../hooks/useApi";
import columns from "../../utils/models/column/Types";
import ModalAction from "../../ui/ModalAction";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import DynamicForm from "../../ui/forms/dynamic-form/DynamicForm";
import typeFields from "../../utils/models/fields/dashboard/type";
import typeSchema from "../../utils/models/validation/dashboard/type";

const Types = () => {
  const [list, setList] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);

  const request = useApi();
  const requestGetlist = useApi();

  useEffect(() => {
    getListData();
  }, []);

  const getListData = async () => {
    try {
      const { data } = await requestGetlist.apiCall("get", "SubType/GetList");
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id) => {
    const targetItem = list.find((item) => item.id == id);

    setModalContent({
      title: "حذف نوع سیستم",
      onSubmitTitle: "حذف",
      onSubmit: () => onDelete(id),
      children: (
        <div>
          آیا از حذف نوع سیستم{" "}
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
      const response = await request.apiCall("delete", `SubType/Delete/${id}`);
      if (response?.isSuccess) {
        toast.success("نوع سیستم با موفقیت حذف شد");
        getListData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const handleEdit = (id) => {
    const targetItem = list.find((item) => item.id == id);
    
    setModalContent({
      title: "ویرایش نوع سیستم",
      children: (
        <DynamicForm
          fields={typeFields}
          validationSchema={typeSchema}
          defaultValues={targetItem}
          loading={request.loading}
          onSubmitTitle={"ویرایش"}
          onSubmit={(formData, id) => onEdit(formData, id)}
          onClose={() => setShowModal(false)}
          id={id}
        />
      ),
    });
    setShowModal(true);
  };

  const onEdit = async (formData, id) => {
    try {
      const response = await request.apiCall("post", `SubType/Edit`, {
        ...formData,
        id: id,
      });
      if (response?.isSuccess) {
        toast.success("نوع سیستم با موفقیت ویرایش شد");
        getListData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const handleAdd = () => {
    setModalContent({
      title: "افزودن نوع سیستم",
      children: (
        <DynamicForm
          fields={typeFields}
          validationSchema={typeSchema}
          defaultValues={{}}
          loading={request.loading}
          onSubmitTitle={"افزودن"}
          onSubmit={(formData) => onAdd(formData)}
          onClose={() => setShowModal(false)}
        />
      ),
    });
    setShowModal(true);
  };

  const onAdd = async (formData) => {
    try {
      const response = await request.apiCall(
        "post",
        `SubType/Create`,
        formData
      );
      if (response?.isSuccess) {
        toast.success("نوع سیستم با موفقیت اضافه  شد");
        getListData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const actionsList = [
    {
      title: "ویرایش",
      icon: <PencilIcon className="ml-1 h-4 w-4" aria-hidden="true" />,
      handleClick: (id) => handleEdit(id),
    },
    {
      title: "حذف",
      icon: <TrashIcon className="ml-1 h-4 w-4" aria-hidden="true" />,
      handleClick: (id) => handleDelete(id),
    }
  ];

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-2xl font-black text-gray-600 mb-4">
        نوع های سیستم
      </div>

      <button type="button" className="w-fit btn-primary" onClick={handleAdd}>
        افزودن سیستم
      </button>
      {list ? (
        <DataTable columns={columns} data={list} actions={actionsList} />
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

export default Types;
