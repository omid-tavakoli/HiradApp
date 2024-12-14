import { useEffect, useState } from "react";
import DataTable from "../../ui/table/DataTable";
import BeatLoaderLoading from "../../ui/element/loading/BeatLoader";
import useApi from "../../hooks/useApi";
import columns from "../../utils/models/column/Contractors";
import ModalAction from "../../ui/ModalAction";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import DynamicForm from "../../ui/forms/dynamic-form/DynamicForm";
import contractorFields from "../../utils/models/fields/dashboard/contractor";
import contractorSchema from "../../utils/models/validation/dashboard/contractor";
import { useUser } from "../../contexts/UserContext";

const Contractors = () => {
  const [list, setList] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);

  const request = useApi();
  const requestGetlist = useApi();

  const { user } = useUser();

  useEffect(() => {
    user && getListData();
  }, [user]);

  const getListData = async () => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        `Contractor/GetList?subSysId=${user?.subSysId}`
      );
      setList(data);
    } catch (error) {
      console.log(error);
 
    }
  };

  const handleDelete = (id) => {
    const targetItem = list.find((item) => item.id == id);

    setModalContent({
      title: `حذف ${user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'}`,
      onSubmitTitle: "حذف",
      onSubmit: () => onDelete(id),
      children: (
        <div>
          آیا از حذف {user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'}{" "}
          <span className="font-bold">{`${targetItem?.companyCode}`}</span>{" "}
          مطمئن هستید؟
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
        `Contractor/Delete?id=${id}`
      );
      if (response?.isSuccess) {
        toast.success(`${user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'} با موفقیت حذف شد`);
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
      title: `ویرایش ${user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'}`,
      onSubmitTitle: "ویرایش",
      children: (
        <DynamicForm
          fields={contractorFields}
          validationSchema={contractorSchema}
          defaultValues={targetItem}
          loading={request.loading}
          onSubmitTitle={"ویرایش"}
          onSubmit={(formData, id) => onEdit(formData, id)}
          onClose={() => setShowModal(false)}
          id={id}
        />
      ),
      id: id,
    });
    setShowModal(true);
  };

  const onEdit = async (formData, id) => {
    try {
      const response = await request.apiCall("post", `Contractor/Edit`, {
        ...formData,
        id: id,
        SubSysId: user?.subSysId,
      });
      if (response?.isSuccess) {
        toast.success(`${user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'} با موفقیت ویرایش شد`);
        getListData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const handleAdd = (id) => {
    setModalContent({
      title: `افزودن ${user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'}`,
      children: (
        <DynamicForm
          fields={contractorFields}
          validationSchema={contractorSchema}
          defaultValues={{}}
          loading={request.loading}
          onSubmitTitle={"افزودن"}
          onSubmit={(formData) => onAdd(formData)}
          onClose={() => setShowModal(false)}
        />
      ),
      id: id,
    });
    setShowModal(true);
  };

  const onAdd = async (formData) => {
    try {
      const response = await request.apiCall("post", `Contractor/Create`, {
        ...formData,
        subSysId: user?.subSysId,
      });
      if (response?.isSuccess) {
        toast.success(`${user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'} با موفقیت اضافه  شد`);
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
      <div className="text-2xl font-black text-gray-600 mb-4">{user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'}ها </div>

      <button type="button" className="w-fit btn-primary" onClick={handleAdd}>
        افزودن {user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'}
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

export default Contractors;
