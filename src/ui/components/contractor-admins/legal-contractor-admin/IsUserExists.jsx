import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useApi from "../../../../hooks/useApi";
import { useUser } from "../../../../contexts/UserContext";

const schema = yup.object().shape({
});

const IsUserExists = ({
  name,
  userId,
  onClose,
  companyCode,
  projectId,
  refetch,
}) => {
  const request = useApi();
  const { user } = useUser();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSubmitForm = async (formData) => {
    if (!formData.type) {
      handleAddUser(formData);
    }
  };

  const handleAddUser = async (formData) => {
    const dataSent = {
      legal: true,
      companyCode: companyCode,
      subSysId: user?.subSysId,
      admin: {
        projectId: projectId,
        userId: userId,
        startDate: formData.startDate,
        endDate: formData.endDate,
      },
    };

    try {
      const { data } = await request.apiCall(
        "post",
        `Contractor/CreateContractorAndAdmin`,
        dataSent
      );
      toast.success("کاربر با موفقیت اضافه شد");
      refetch();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <span className="text-sm text-gray-700">
        {`کاربر مورد نظر شما در سیستم به نام`}
        <strong> {`${name ? name : "ثبت نشده"}`} </strong>
        {`موجود است. از اضافه کردن این شخص اطمینان دارید؟`}
      </span>
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0 sm:space-x-2 sm:space-x-reverse"
      >
       
      </form>
      <div className=" px-4 pt-3 sm:flex sm:flex-row sm:justify-center sm:px-6">
        <button
          type="button"
          className="btn-primary !m-0 sm:!ml-4"
          onClick={handleSubmit(handleSubmitForm)}
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
