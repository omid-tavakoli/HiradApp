import { useEffect, useState } from "react";
import DataTable from "../../../ui/table/DataTable";
import BeatLoaderLoading from "../../../ui/element/loading/BeatLoader";
import useApi from "../../../hooks/useApi";
import columns from "../../../utils/models/column/packages/SystemPackages";
import ModalAction from "../../../ui/ModalAction";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import DynamicForm from "../../../ui/forms/dynamic-form/DynamicForm";
import packageFields from "../../../utils/models/fields/dashboard/package";
import packageSchema from "../../../utils/models/validation/dashboard/package";

const SystemPackages = () => {
  const [list, setList] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);
  const [subTypeList, setSubTypeList] = useState([]);

  const request = useApi();
  const requestGetlist = useApi();

  useEffect(() => {
    getListData();
    getSubTypes();
  }, []);

const getSubTypes = async () => {
  try {
    const { data } = await request.apiCall("get", `SubType/GetList`);
    const options = data.map((item) => ({
      label: item?.title,
      value: item?.id,
    }));
    setSubTypeList(options);
  } catch (error) {
    console.log(error);
  }
};

  const getListData = async () => {
    try {
      const { data } = await requestGetlist.apiCall("get", "Package/GetList");
      setList(data);
    } catch (error) {
      console.log(error);
 
    }
  };

  const handleDelete = (id) => {
    const targetItem = list.find((item) => item.id == id);

    setModalContent({
      title: "حذف پکیج",
      onSubmitTitle: "حذف",
      onSubmit: () => onDelete(id),
      children: (
        <div>
          آیا از حذف پکیج{" "}
          <span className="font-bold">{`${targetItem?.name}`}</span> مطمئن
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
        `Package/Delete?id=${id}`
      );
      if (response?.isSuccess) {
        toast.success("پکیج با موفقیت حذف شد");
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
      title: "ویرایش پکیج",
      onSubmitTitle: "ویرایش",
      children: (
        <DynamicForm
          fields={packageFields}
          validationSchema={packageSchema}
          defaultValues={targetItem}
          loading={request.loading}
          onSubmitTitle={"ویرایش"}
          onSubmit={(formData, id) => onEdit(formData, id)}
          onClose={() => setShowModal(false)}
          id={id}
          SubTypes={subTypeList}
        />
      ),
      id: id,
    });
    setShowModal(true);
  };

  const onEdit = async (formData, id) => {
    try {
      const response = await request.apiCall("post", `Package/Edit`, {
        ...formData,
        id: id,
      });
      if (response?.isSuccess) {
        toast.success("پکیج با موفقیت ویرایش شد");
        getListData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const handleAdd = (id) => {
    setModalContent({
      title: "افزودن پکیج",
      children: (
        <DynamicForm
          fields={packageFields}
          validationSchema={packageSchema}
          defaultValues={{}}
          loading={request.loading}
          onSubmitTitle={"افزودن"}
          onSubmit={(formData) => onAdd(formData)}
          onClose={() => setShowModal(false)}
          SubTypes={subTypeList}
        />
      ),
      id: id,
    });
    setShowModal(true);
  };

  const onAdd = async (formData) => {
    try {
      const response = await request.apiCall(
        "post",
        `Package/Create`,
        formData
      );
      if (response?.isSuccess) {
        toast.success("پکیج با موفقیت اضافه  شد");
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
    },
  ];
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-2xl font-black text-gray-600 mb-4">
        پکیج های سیستم
      </div>

      <button type="button" className="btn-primary w-fit" onClick={handleAdd}>
        افزودن پکیج
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

export default SystemPackages;
