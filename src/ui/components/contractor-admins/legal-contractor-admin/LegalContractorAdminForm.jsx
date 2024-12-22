import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import IsNotCompanyExists from "./IsNotCompanyExists";
import IsCompanyExists from "./IsCompanyExists";
import useApi from "../../../../hooks/useApi";

const schema = yup.object().shape({
  LegalId: yup.string().required("شناسه حقوقی شرکت را وارد کنید"),
});

const RealContractorAdminForm = ({ onClose, setModalContent, projectId,refetch }) => {
  const request = useApi();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSubmitForm = async (data) => {
    if (!data.type) {
      isUserExists(data);
    }
  };

  const isUserExists = async (data) => {
    try {
      const { data: company } = await request.apiCall(
        "get",
        `Contractor/Get/0?companyCode=${data?.LegalId}`
      );

      if (company) {
        setModalContent({
          title: "افزودن کاربر",
          children: (
            <IsCompanyExists
              name={company?.companyName}
              companyCode={company?.companyCode}
              projectId={projectId}
              onClose={onClose}
              setModalContent={setModalContent}
              refetch={refetch}
            />
          ),
        });
      }
    } catch (error) {
      error?.response?.status === 404 &&
        setModalContent({
          title: "افزودن کاربر",
          children: (
            <IsNotCompanyExists
              companyCode={data?.LegalId}
              onClose={onClose}
              projectId={projectId}
              setModalContent={setModalContent}
              refetch={refetch}
            />
          ),
        });
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <form onSubmit={handleSubmit(handleSubmitForm)} className="">
          <div className="mb-2 space-y-2">
            <label htmlFor="LegalId" className="text-xs text-gray-600 mb-4">
              شناسه حقوقی شرکت
            </label>
            <input
              type="text"
              {...register("LegalId")}
              className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
            />
            {errors.LegalId && (
              <p className="text-primary-600 text-xs">{errors.LegalId.message}</p>
            )}
          </div>
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
      </div>
    </>
  );
};

export default RealContractorAdminForm;
