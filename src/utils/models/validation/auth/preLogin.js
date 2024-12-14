import * as yup from "yup";
const preLoginSchema = yup.object().shape({
  mobile: yup
    .string()
    .required("لطفا شماره موبایل را وارد کنید")
    .matches(/^(\+98|0)?9\d{9}$/i, "شماره موبایل معتبر نیست"),
});

export default preLoginSchema;
