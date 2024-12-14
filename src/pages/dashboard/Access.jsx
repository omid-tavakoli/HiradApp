import { useEffect, useState } from "react";
import BeatLoaderLoading from "../../ui/element/loading/BeatLoader";
import useApi from "../../hooks/useApi";
import {
  PencilIcon,
  UserGroupIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useUser } from "../../contexts/UserContext";
import ModalAction from "../../ui/ModalAction";
import RoleForm from "../../ui/components/access/RoleForm";
import toast from "react-hot-toast";
import RoleUsers from "../../ui/components/access/RoleUsers";

const Access = () => {
  const [rolesList, setRolesList] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);

  const request = useApi();
  const { user } = useUser();

  useEffect(() => {
    user && getRolesData();
  }, [user]);

  const getRolesData = async () => {
    try {
      const { data } = await request.apiCall(
        "get",
        `Role/GetList?subSysId=${user?.subSysId}`
      );
      setRolesList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = () => {
    setModalContent({
      title: "افزودن نقش",
      children: (
        <RoleForm
          onSubmitTitle={"افزودن"}
          onSubmit={(formData) => onAdd(formData)}
          onClose={() => setShowModal(false)}
          loading={request.loading}
        />
      ),
    });
    setShowModal(true);
  };

  const onAdd = async (formData) => {
    try {
      const response = await request.apiCall("post", `Role/Create`, {
        ...formData,
        subSysId: user?.subSysId,
      });
      if (response?.isSuccess) {
        toast.success("نقش  با موفقیت اضافه  شد");
        getRolesData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const handleEdit = async (id) => {
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
        getRolesData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const handleDelete = (id, title) => {
    setModalContent({
      title: "حذف نقش",
      onSubmitTitle: "حذف",
      onSubmit: () => onDelete(id),
      children: (
        <div>
          آیا از حذف نقش <span className="font-bold">{`${title}`}</span> مطمئن
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
      const response = await request.apiCall("delete", `Role/Delete?id=${id}`);
      if (response?.isSuccess) {
        toast.success("نقش با موفقیت حذف شد");
        getRolesData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const handleChangeUsersList = async (id) => {
    try {
      const { data } = await request.apiCall(
        "get",
        `User/GetAllSubUser/${user?.subSysId}`
      );

      const options = data.map((item) => ({
        label: `${item.family ? item.name + " " + item.family : item.mobile}`,
        value: item?.userId,
      }));

      const { data: usersOfRole } = await request.apiCall(
        "get",
        `Role/GetUsersOfRole/${id}`
      );

      const defaultUsers = usersOfRole?.map((item) => ({
        label: `${item.family ? item.name + " " + item.family : item.mobile}`,
        value: item?.userId,
      }));
      setModalContent({
        title: "کاربران نقش",
        children: (
          <>
            <RoleUsers
              onSubmit={(list) => onChangeUsersList(list, id)}
              onClose={() => setShowModal(false)}
              data={options}
              val={defaultUsers ? defaultUsers : []}
              loading={request.loading}
              id={id}
            />
          </>
        ),
      });
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeUsersList = async (list, id) => {
    const dataSent = list?.map((item) => item.value);

    try {
      const response = await request.apiCall(
        "post",
        `Role/AssignRole?roleId=${id}`,
        dataSent ? dataSent : []
      );
      if (response?.isSuccess) {
        toast.success("اعضا نقش با موفقیت تغییر کرد");
        getRolesData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-2xl font-black text-gray-600 mb-4">نقش ها</div>
      <span className="mr-2 text-gray-500">
        عنوان نقش ها را در این صفحه مشاهده می کنید که برای هر کدام دکمه ای تحت
        عنوان ویرایش و کاربران وجود دارد چنانچه روی دکمه ویرایش کلیک کنید صفحه
        حق دسترسی باز می شود که با انتخاب هر مورد،دسترسی فعال و با برداشتن تیک
        دسترسی غیرفعال می شود.بعد از انجام تغییرات جهت ثبت آن دکمه ویرایش را
        بزنید.با کلیک بر روی دکمه کاربران،لیست کاربران آن نقش را مشاهده میکنید و
        قادر هستید کاربر جدید اضافه و یا حذف نمایید و سپس جهت ذخیره کردن ویرایش
        ها دکمه ثبت تغیرات را بزنید.
      </span>
      <button type="button" className="w-fit btn-primary" onClick={handleAdd}>
        افزودن
      </button>
      {request.loading ? (
        <div className="w-full flex justify-center">
          <BeatLoaderLoading size={50} />
        </div>
      ) : (
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {rolesList?.map((role) => (
            <div
              key={role.id}
              className="bg-white rounded-lg shadow-sm flex flex-col pt-4"
            >
              <div className="text-sm mb-2 px-4 ">
                {role.title}{" "}
                <span className="font-light">({role.subSysTitle})</span>
              </div>
              <div className="text-xs text-gray-600 font-medium px-4 ">
                {role.title === "ContractorAdmin"
                  ? user?.role?.listSystemSet?.filter(
                      (item) => item.number == 5
                    )[0]?.fieldValue2
                    ? user?.role?.listSystemSet?.filter(
                        (item) => item.number == 5
                      )[0]?.fieldValue2
                    : "پیمانکار"
                  : role.title === "Contractor"
                  ? user?.role?.listSystemSet?.filter(
                      (item) => item.number == 5
                    )[0]?.fieldValue2
                    ? user?.role?.listSystemSet?.filter(
                        (item) => item.number == 5
                      )[0]?.fieldValue2
                    : "پیمانکار"
                  : role.title === "Supervisor"
                  ? user?.role?.listSystemSet?.filter(
                      (item) => item.number == 5
                    )[0]?.fieldValue
                    ? user?.role?.listSystemSet?.filter(
                        (item) => item.number == 5
                      )[0]?.fieldValue
                    : "ناظر"
                  : role.displayName}
              </div>
              <div className="flex flex-row items-center mt-4 space-x-2 space-x-reverse border-t border-gray-200 p-4 ">
                <button
                  onClick={() => handleEdit(role.id)}
                  className="w-full cursor-pointer flex justify-center rounded-md bg-white p-1.5 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  <PencilIcon className="w-3 h-3 ml-1" />
                  <span className="text-xs">ویرایش</span>
                </button>
                <button
                  onClick={() => handleChangeUsersList(role.id)}
                  className="w-full cursor-pointer flex justify-center rounded-md bg-white p-1.5 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  <UserGroupIcon className="w-3 h-3 ml-1" />
                  <span className="text-xs">کاربران</span>
                </button>
                <button
                  onClick={() => handleDelete(role.id, role?.title)}
                  className="w-full cursor-pointer flex justify-center rounded-md bg-white p-1.5 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  <TrashIcon className="w-3 h-3 ml-1" />
                  <span className="text-xs">حذف</span>
                </button>
              </div>
            </div>
          ))}
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

export default Access;
