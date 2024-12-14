import * as yup from "yup";
const typeSchema = yup.object().shape({
  title: yup
    .string()
    .min(2, "خیلی کوتاه است!")
    .max(50, "خیلی طولانی است!")
    .required("لطفا نام نوع سیستم را وارد کنید"),
  description: yup.string().required("لطفا توضیحات را وارد کنید"),
  color: yup.string().required("لطفا رنگ را وارد کنید"),
  logoFile: yup
    .mixed()
    .required("لطفا فایل لوگو را آپلود کنید")
    .test(
      "fileSize",
      "حجم فایل باید کمتر از یک مگابایت باشد",
      (value) => value && value.size < 1048567
    )
    .test(
      "fileType",
      "لطفا فابل image  اپلود کنید",
      (value) => value && value.type && value.type.startsWith("image/")
    ),
});

export default typeSchema;
