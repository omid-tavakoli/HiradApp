import * as yup from "yup";
const loginSchema = yup.object().shape({
  password: yup.string().required("لطفا رمز عبور را وارد کنید"),
});

export default loginSchema;
