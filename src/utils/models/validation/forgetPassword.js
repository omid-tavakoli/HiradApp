import * as yup from "yup";
const forgetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required("لطفا رمز عبور را وارد کنید")
    .min(8, "رمز عبور را به درستی وارد کنید"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "تایید رمز عبور مطابقت ندارد"),
});

export default forgetPasswordSchema;
