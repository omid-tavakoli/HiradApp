import { useEffect, useState } from "react";
import DataTable from "../../../ui/table/DataTable";
import BeatLoaderLoading from "../../../ui/element/loading/BeatLoader";
import useApi from "../../../hooks/useApi";
import columns from "../../../utils/models/column/users/UsersSubSystem";
import { createColumnHelper } from "@tanstack/react-table";
import IsLockUser from "../../../ui/components/users/IsLockUser";
import {
  EyeIcon,
  TrashIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import ModalAction from "../../../ui/ModalAction";
import ShowUser from "../../../ui/components/users/ShowUser";
import { useUser } from "../../../contexts/UserContext";
import CheckUser from "./add-user/CheckUser";
import RoleForm from "../../../ui/components/access/RoleForm";
import toast from "react-hot-toast";

const UsersSubSystem = () => {
  const [list, setList] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);
  const request = useApi();
  const columnHelper = createColumnHelper();
  const { user } = useUser();

  const fetchData = async () => {
    try {
      const { data } = await request.apiCall(
        "get",
        `User/GetAllSubUser/${user?.subSysId}`
      );
      const listFilterd = data.filter((item) => item.userId !== user.userId);
      setList(listFilterd);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (role) => {
    let id = 0;
    switch (role) {
      case "ContractorAdmin":
        id = 4153;
        break;
      case "Contractor":
        id = 4154;
        break;
      case "Supervisor":
        id = 4155;
        break;
      case "User":
        id = 4156;
        break;
    }
    try {
      const { data } = await request.apiCall("get", `Role/Get/${id}`);
      setModalContent({
        title: "ویرایش نقش",
        children: (
          <RoleForm
            onSubmitTitle={"ویرایش"}
            onSubmit={(formData) => onEdit(formData, id)}
            onClose={() => setShowModal(false)}
            loading={request.loading}
            defaultValues={data}
          />
        ),
      });
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const onEdit = async (formData, id) => {
    try {
      const response = await request.apiCall("post", `Role/Edit`, {
        ...formData,
        id: id,
      });
      if (response?.isSuccess) {
        toast.success("نقش با موفقیت ویرایش شد");
        fetchData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const handleShow = (user) => {
    setModalContent({
      title: "مشاهده کاربر",
      onSubmit: false,
      children: <ShowUser user={user} />,
    });
    setShowModal(true);
  };

  const handleCheckUser = () => {
    setModalContent({
      title: "افزودن مدیر زیر سیستم",
      children: (
        <CheckUser
          onClose={() => setShowModal(false)}
          setModalContent={setModalContent}
          fetchData={() => fetchData()}
        />
      ),
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const targetItem = list.find((item) => item.id == id);
    setModalContent({
      title: "حذف کاربر",
      onSubmitTitle: "حذف",
      onSubmit: () => onDelete(id),
      children: (
        <div>
          آیا از حذف کاربر{" "}
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
        `User/RemoveUserFromSubSystem`,
        { userId: id, subSysId: user.subSysId }
      );
      if (response?.isSuccess) {
        toast.success("کاربر با موفقیت حذف شد");
        fetchData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const additionalColumns = [
    columnHelper.accessor("isLock", {
      header: () => "فعال/غیرفعال",
      cell: (info) => (
        <IsLockUser targetItem={info.row.original} updateList={fetchData} />
      ),
    }),
    columnHelper.accessor("actions", {
      header: () => "عملیات",
      cell: (info) => (
        <div className="flex gap-x-2">
          <button
            onClick={() => handleShow(info.row.original)}
            className=" w-full flex justify-center rounded-md bg-white p-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          >
            <EyeIcon className="w-4 h-4 ml-1" />
            <span>مشاهده</span>
          </button>
          <button
            onClick={() => handleEdit(info.row.original.role)}
            className=" w-full flex justify-center rounded-md bg-white p-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          >
            <AdjustmentsHorizontalIcon className="w-4 h-4 ml-1" />
            <span>تغییر سطح دسترسی</span>
          </button>
          <button
            onClick={() => handleDelete(info.row.original.userId)}
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
        مدیریت کاربران
      </div>
      <span className="mr-2  text-gray-500">
        لیست کاربرانی که قبلا به سیستم اضافه شده در این صفحه قابل مشاهده است
        برای مشاهده جزییات بیشتر در مورد هر کاربر بر روی دکمه مشاهده کلیک
        کنید،برای مدیریت دسترسی کاربر به منو ها بر روی دکمه تغیر دسترسی کلیک
        کنید،در صورتی که بخواهید از ورود کاربر به برنامه بصورت موقت جلوگیری کنید
        میتوانید از دکمه غیرفعال استفاده کنید. چناچه میخوایید کاربر جدیدی اضافه
        کنید بر روی دکمه افزودن کاربر سازمان کلیک کنید و در پنجره باز شده شماره
        تلفن همراه کاربر مورد نظر را وارد کنید تا لینک دعوت برایشان ارسال
        گردد.برای حذف کاربر از زیر سیستم خود از دکمه حذف میتوانید استفاده
        کنید.(توجه! در صورتی میتوانید کاربری را حذف نمایید که کاربر فعالیتی
        انجام نداده باشد)
      </span>
      <button
        type="button"
        onClick={() => handleCheckUser()}
        className="btn-primary w-fit"
      >
        افزودن مدیر زیر سیستم سازمان
      </button>
      {request.loading ? (
        <div className="w-full flex justify-center">
          <BeatLoaderLoading size={50} />
        </div>
      ) : list ? (
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

export default UsersSubSystem;
