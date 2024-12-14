const packageFields = [
  {
    type: "selectbox",
    label: "دسته سازمانی",
    name: "subtypeid",
  },
  {
    type: "text",
    label: "نام",
    name: "name",
  },
  {
    type: "number",
    label: "قیمت",
    name: "price",
  },
  {
    type: "number",
    label: "تعداد پیامک قابل ارسال",
    name: "smsQuantity",
  },
  {
    type: "number",
    label: "تعداد کاربر ممکن",
    name: "userQuantity",
  },
  {
    type: "number",
    label: "تعداد روزهای فعال بودن",
    name: "dayQuantity",
  },
  {
    type: "number",
    label: "تعداد پروژ های ممکن",
    name: "projectQuantity",
  },
  {
    type: "date",
    label: "تاریخ شروع ",
    name: "startDate",
  },
  {
    type: "date",
    label: "تاریخ پایان",
    name: "endDate",
  },
  {
    type: "number",
    label: "تعداد ایمیل قابل ارسال",
    name: "emailQuantity",
  },
  {
    type: "textarea",
    label: "توضیحات",
    name: "description",
    size: "col-span-2",
  },
];

export default packageFields;
