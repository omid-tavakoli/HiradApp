import { useEffect, useState } from "react";
import DataTable from "../../ui/table/DataTable";
import BeatLoaderLoading from "../../ui/element/loading/BeatLoader";
import useApi from "../../hooks/useApi";
import columns from "../../utils/models/column/Zones";
import ModalAction from "../../ui/ModalAction";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useUser } from "../../contexts/UserContext";
import ZoneForm from "../../ui/forms/ZoneForm";
import { createColumnHelper } from "@tanstack/react-table";

const Zones = () => {
  const [list, setList] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);

  const request = useApi();
  const requestGetlist = useApi();
  const columnHelper = createColumnHelper();

  const { user } = useUser();

  useEffect(() => {
    user && getListData();
  }, [user]);

  const getListData = async () => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        `Zone/GetList/${user?.subSysId}`
      );
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = (id) => {
    const targetItem = list.find((item) => item.id == id);

    setModalContent({
      title: `حذف ${
        user?.role?.listSystemSet?.filter((item) => item.number == 8)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 8)[0]
              ?.fieldValue
          : "منطقه"
      }`,
      onSubmitTitle: "حذف",
      onSubmit: () => onDelete(id),
      children: (
        <div>
          آیا از حذف{" "}
          {user?.role?.listSystemSet?.filter((item) => item.number == 8)[0]
            ?.fieldValue
            ? user?.role?.listSystemSet?.filter((item) => item.number == 8)[0]
                ?.fieldValue
            : "منطقه"}{" "}
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
      const response = await request.apiCall("delete", `Zone/Delete/${id}`);
      if (response?.isSuccess) {
        toast.success(
          `${
            user?.role?.listSystemSet?.filter((item) => item.number == 8)[0]
              ?.fieldValue
              ? user?.role?.listSystemSet?.filter((item) => item.number == 8)[0]
                  ?.fieldValue
              : "منطقه"
          } با موفقیت حذف شد`
        );
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
      title: `ویرایش ${
        user?.role?.listSystemSet?.filter((item) => item.number == 8)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 8)[0]
              ?.fieldValue
          : "منطقه"
      }`,
      children: (
        <ZoneForm
          defaultValue={targetItem}
          onSubmitForm={(formData, id) => onEdit(formData, id)}
          onClose={() => setShowModal(false)}
          onSubmitTitle={"ویرایش"}
          loading={request.loading}
          id={id}
        />
      ),
    });
    setShowModal(true);
  };

  const onEdit = async (formData, id) => {
    try {
      const response = await request.apiCall("post", `Zone/Edit`, {
        ...formData,
        subSysId: user?.subSysId,
        id: id,
      });
      if (response?.isSuccess) {
        toast.success(
          `${
            user?.role?.listSystemSet?.filter((item) => item.number == 8)[0]
              ?.fieldValue
              ? user?.role?.listSystemSet?.filter((item) => item.number == 8)[0]
                  ?.fieldValue
              : "منطقه"
          } با موفقیت ویرایش شد`
        );
        getListData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const handleAdd = () => {
    setModalContent({
      title: `افزودن ${
        user?.role?.listSystemSet?.filter((item) => item.number == 8)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 8)[0]
              ?.fieldValue
          : "منطقه"
      }`,
      children: (
        <ZoneForm
          onSubmitForm={(formData) => onAdd(formData)}
          onClose={() => setShowModal(false)}
          onSubmitTitle={"افزودن"}
          loading={request.loading}
          defaultValues={{}}
        />
      ),
    });
    setShowModal(true);
  };

  const onAdd = async (formData) => {
    getListData();
    setShowModal(false);
    try {
      const response = await request.apiCall("post", `Zone/Create`, {
        ...formData,
        subSysId: user?.subSysId,
      });
      if (response?.isSuccess) {
        toast.success(
          `${
            user?.role?.listSystemSet?.filter((item) => item.number == 8)[0]
              ?.fieldValue
              ? user?.role?.listSystemSet?.filter((item) => item.number == 8)[0]
                  ?.fieldValue
              : "منطقه"
          } با موفقیت اضافه  شد`
        );
        getListData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };
  const additionalColumns = [
    columnHelper.accessor("actions", {
      header: () => "عملیات",
      cell: (info) => (
        <div className="flex gap-x-2">
          <button
            onClick={() => {
              const { id } = info.row.original;
              handleEdit(id);
            }}
            className="w-full cursor-pointer flex justify-center rounded-md bg-white p-1.5 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          >
            <PencilIcon className="w-3 h-3 ml-1" />
            <span className="text-xs">ویرایش</span>
          </button>
          <button
            onClick={() => {
              const { id } = info.row.original;
              handleDelete(id);
            }}
            className=" w-full flex justify-center rounded-md bg-white p-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          >
            <TrashIcon className="w-4 h-4 ml-1" />
            <span>حذف</span>
          </button>
        </div>
      ),
    }),
  ];
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-2xl font-black text-gray-600 mb-4">
        {user?.role?.listSystemSet?.filter((item) => item.number == 8)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 8)[0]
              ?.fieldValue
          : "مناطق"}{" "}
        ها
      </div>
      <span className="text-gray-500">
        در این صفحه لیست{" "}
        {user?.role?.listSystemSet?.filter((item) => item.number == 8)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 8)[0]
              ?.fieldValue
          : "منطقه ها"}{" "}
        تعریف شده را میتوانید ببینید و با زدن دکمه افزودن
        {user?.role?.listSystemSet?.filter((item) => item.number == 8)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 8)[0]
              ?.fieldValue
          : "منطقه"}{" "}
        میتوان مکان جدیدی را تعریف نمایید و با زدن دکمه ویرایش قادر خواهید بود
        عنوان ،استان و شهر را ویرایش نمایید.
      </span>
      <button type="button" className="w-fit btn-primary" onClick={handleAdd}>
        افزودن{" "}
        {user?.role?.listSystemSet?.filter((item) => item.number == 8)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 8)[0]
              ?.fieldValue
          : "منطقه"}
      </button>

      {requestGetlist.loading && (
        <div className="w-full flex justify-center">
          <BeatLoaderLoading size={50} />
        </div>
      )}
      {list ? (
        <DataTable columns={[...columns, ...additionalColumns]} data={list} />
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

export default Zones;
