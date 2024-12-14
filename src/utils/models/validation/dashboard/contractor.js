import * as yup from "yup";
const contractorSchema = yup.object().shape({
  companyName: yup
    .string()
    .required("لطفا نام شرکت را وارد کنید"),
  companyCode: yup
    .string()
    .required("لطفا کد شرکت را وارد کنید"),
  telephone: yup
    .string()
    .required("لطفا شماره تلفن را وارد کنید")
    .matches(/^(\+98|0)?9\d{9}$/i, "شماره تلفن معتبر نیست"),
  address: yup
    .string()
    .min(2, "خیلی کوتاه است!")
    .max(50, "خیلی طولانی است!")
    .required("لطفا آدرس را وارد کنید"),
  ceoName: yup
    .string()
    .required("لطفا نام مدیر عامل را وارد کنید"),
  ceoFamily: yup
    .string()
    .required("لطفا نام خانوادگی مدیر عامل را وارد کنید"),
  ceoNationalCode: yup
    .string()
    .required("لطفا کد ملی را وارد کنید")
    .matches(/^[0-9]{10}$/, "کد ملی معتبر نیست"),
  mobile: yup
    .string()
    .required("لطفا شماره موبایل را وارد کنید")
    .matches(/^(\+98|0)?9\d{9}$/i, "شماره موبایل معتبر نیست"),
});

export default contractorSchema;
