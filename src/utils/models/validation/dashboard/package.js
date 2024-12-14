import * as yup from "yup";
const packageSchema = yup.object().shape({
  name: yup
    .string()
    .required("لطفا نام پکیج را وارد کنید")
    .min(2, "خیلی کوتاه است!")
    .max(50, "خیلی طولانی است!"),
  price: yup.string().required("لطفا قیمت را وارد کنید"),
  subtypeid: yup.string().required("لطفا سازمان را وارد کنید"),
  smsQuantity: yup
    .string()
    .required("لطفا تعداد پیامک قابل ارسال را وارد کنید"),
  emailQuantity: yup
    .string()
    .required("لطفا تعداد ایمیل قابل ارسال را وارد کنید"),
  userQuantity: yup.string().required("لطفا تعداد کاربر ممکن را وارد کنید"),
  dayQuantity: yup
    .string()
    .required("لطفا تعداد تعداد روزهای فعال بودن را وارد کنید"),
  projectQuantity: yup
    .string()
    .required("لطفا تعداد پروژه های ممکن را وارد کنید"),
  startDate: yup.string().required("لطفا تاریخ شروع را وارد کنید"),
  endDate: yup.string().required("لطفا تاریخ پایان را وارد کنید"),

  description: yup.string().required("لطفا توضیحات را وارد کنید"),
});

export default packageSchema;
