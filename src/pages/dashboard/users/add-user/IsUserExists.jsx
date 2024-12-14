import toast from "react-hot-toast";
import useApi from "../../../../hooks/useApi";
import { useUser } from "../../../../contexts/UserContext";

const IsUserExists = ({ data, fetchData, onClose }) => {
  const request = useApi();
  const { user } = useUser();

  const handleAddUser = async () => {
    const dataSent = {
      userId: data?.id,
      subSysId: user?.subSysId,
      roleId : data?.role
    };

    try {
      const { data } = await request.apiCall(
        "post",
        `User/AddSubUser`,
        dataSent
      );
      toast.success("کاربر با موفقیت اضافه شد");
      fetchData();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <span className="text-sm text-gray-700">
        {`شخص مورد نظر شما در سیستم `}
        <strong>
          {data.family && `با نام ${data.name + " " + data.family}`}
        </strong>

        {`موجود است. از اضافه کردن این شخص اطمینان دارید؟`}
      </span>

      <div className=" px-4 pt-3 sm:flex sm:flex-row sm:justify-center sm:px-6">
        <button
          type="button"
          className="btn-primary !m-0 sm:!ml-4"
          onClick={handleAddUser}
        >
          تایید
        </button>
        <button
          type="button"
          className="btn-secondary !m-0"
          onClick={onClose}
        >
          بستن
        </button>
      </div>
    </>
  );
};

export default IsUserExists;
