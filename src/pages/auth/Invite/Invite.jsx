import AuthLayout from "../../../ui/layout/AuthLayout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import preLoginSchema from "../../../utils/models/validation/auth/preLogin";
import NumberInput from "../../../ui/element/input/NumberInput";
import useApi from "../../../hooks/useApi";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import BeatLoaderLoading from "../../../ui/element/loading/BeatLoader";
import { useState, useEffect } from "react";

const Invite = () => {
  const [mobile, setMobile] = useState();

  let { nationalCode } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(preLoginSchema),
  });

  const { error, apiCall, loading } = useApi();
  const reqGetMobile = useApi();

  useEffect(() => {
    getMobile();
  }, []);

  const getMobile = async () => {
    const { data } = reqGetMobile.apiCall(
      "get",
      `User/GetByNationalCode?nationalCode=${nationalCode}`
    );
  };

  const onSubmit = async (formData) => {
    if (!formData.type) {
      try {
        const { data } = await apiCall("POST", "User/PreLogin", formData);

        const dataTransfer = {
          mobile: formData.mobile,
          userId: data?.userId,
        };

        if (data?.userId) {
          navigate("/auth/login", {
            state: dataTransfer,
          });
        } else {
          const { data } = await apiCall(
            "POST",
            "User/SendVerificationCodeSms",
            { mobile: formData.mobile }
          );
          toast.success(
            `کد تایید برای شماره موبایل ${digitsEnToFa(
              formData?.mobile
            )} ارسال گردید`
          );
          navigate("/auth/verification-code", {
            state: formData.mobile,
          });
        }
      } catch (error) {
        console.error("ERROR API", error);
      }
    }
  };

  return (
    <AuthLayout title={"دعوت به عضویت"}>
      {!reqGetMobile.loading && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          
          <NumberInput
            name={"mobile"}
            label={"شماره موبایل"}
            placeholder={"لطفا شماره موبایل خود را وارد کنید"}
            register={register}
            error={errors["mobile"] && errors["mobile"].message}
          />

          {!loading ? (
            <button
              type="submit"
              onClick={onSubmit}
              className="!mt-6 bg-primary-900 text-white py-3 px-4 rounded-xl font-bold hover:bg-primary-800"
              disabled={loading}
            >
              ورود
            </button>
          ) : (
            <div className="w-full flex justify-center">
              <BeatLoaderLoading size={20} />
            </div>
          )}
        </form>
      )}
    </AuthLayout>
  );
};

export default Invite;
