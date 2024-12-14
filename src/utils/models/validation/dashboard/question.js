import * as yup from "yup";

export const getSchema = (type) => {
  switch (type) {
    case "int":
      return yup.object().shape({
        title: yup.string().required("عنوان را وارد کنید"),
        score: yup
          .number()
          .transform((value, originalValue) =>
            originalValue === "" ? undefined : value
          )
          .typeError("عدد وارد کنید")
          .required("نمره سوال وارد کنید"),
        checkQuantity: yup
          .number()
          .integer()
          .transform((value, originalValue) =>
            originalValue === "" ? undefined : value
          )
          .typeError("عدد وارد کنید"),
        hasAttach: yup
          .number()
          .integer()
          .transform((value, originalValue) =>
            originalValue === "" ? undefined : value
          )
          .typeError("عدد وارد کنید"),
        editable: yup.boolean(),
        min: yup
          .number()
          .integer()
          .transform((value, originalValue) =>
            originalValue === "" ? undefined : value
          )
          .typeError("عدد وارد کنید"),
        max: yup
          .number()
          .integer()
          .transform((value, originalValue) =>
            originalValue === "" ? undefined : value
          )
          .typeError("عدد وارد کنید"),
        assume: yup
          .number()
          .integer()
          .transform((value, originalValue) =>
            originalValue === "" ? undefined : value
          )
          .typeError("عدد وارد کنید"),
        description: yup.string(),
      });

    case "choice":
      return yup.object().shape({
        title: yup.string().required("عنوان را وارد کنید"),
        score: yup
          .number()
          .transform((value, originalValue) =>
            originalValue === "" ? undefined : value
          )
          .typeError("عدد وارد کنید")
          .required("نمره سوال وارد کنید"),
        checkQuantity: yup
          .number()
          .integer()
          .transform((value, originalValue) =>
            originalValue === "" ? undefined : value
          )
          .typeError("عدد وارد کنید"),
        hasAttach: yup
          .number()
          .integer()
          .transform((value, originalValue) =>
            originalValue === "" ? undefined : value
          )
          .typeError("عدد وارد کنید"),
        editable: yup.boolean(),
        answers: yup
          .array()
          .of(
            yup.object().shape({
              title: yup.string().required("متن جواب الزامی است"),
              score: yup
                .number()
                .transform((value, originalValue) =>
                  originalValue === "" ? undefined : value
                )
                .typeError("عدد وارد کنید")
                .required("نمره جواب الزامی است"),
            })
          )
          .min(1, "حداقل یک جواب باید وارد شود")
          .when("$isSubmitted", {
            is: true,
            then: yup.array().min(1, "حداقل یک جواب باید وارد شود"),
          }),
        description: yup.string(),
      });

    default:
      return yup.object().shape({
        title: yup.string().required("عنوان را وارد کنید"),
        score: yup
          .number()
          .transform((value, originalValue) =>
            originalValue === "" ? undefined : value
          )
          .typeError("عدد وارد کنید")
          .required("نمره سوال وارد کنید"),
        checkQuantity: yup
          .number()
          .integer()
          .transform((value, originalValue) =>
            originalValue === "" ? undefined : value
          )
          .typeError("عدد وارد کنید"),
        hasAttach: yup
          .number()
          .integer()
          .transform((value, originalValue) =>
            originalValue === "" ? undefined : value
          )
          .typeError("عدد وارد کنید"),
        editable: yup.boolean(),
        description: yup.string(),

      });
  }
};
