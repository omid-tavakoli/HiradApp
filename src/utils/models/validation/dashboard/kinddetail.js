import * as yup from "yup";

export const getSchema = (type) => {
  switch (type) {
    case "int":
      return yup.object().shape({
        title: yup.string().required("عنوان را وارد کنید"),
        min: yup
          .number()
          .integer()
          .typeError("عدد وارد کنید")
          .required(" کمترین وارد کنید"),
        max: yup
          .number()
          .integer()
          .typeError("عدد وارد کنید")
          .required(" بیشترین وارد کنید"),
        assume: yup
          .number()
          .integer()
          .typeError("عدد وارد کنید")
          .required("پاسخ پیش فرض وارد کنید"),
      });

    case "choice":
      return yup.object().shape({
        title: yup.string().required("عنوان  الزامی است"),
        testKindDetailDtos: yup
          .array()
          .of(
            yup.object().shape({
              title: yup.string().required("متن جواب الزامی است"),
            })
          )
          .min(2, "حداقل دو جواب باید وارد شود")
          .when("$isSubmitted", {
            is: true,
            then: yup.array().min(2, "حداقل یک جواب باید وارد شود"),
          }),
      });

    default:
      return yup.object().shape({
        title: yup.string().required("عنوان را وارد کنید"),
      });
  }
};
