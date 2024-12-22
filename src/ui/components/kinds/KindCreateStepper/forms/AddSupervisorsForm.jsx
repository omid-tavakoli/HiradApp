import { useState, useEffect, Fragment } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useApi from "../../../../../hooks/useApi";
import { useUser } from "../../../../../contexts/UserContext";
import { Controller } from "react-hook-form";
import "../../../../../assets/styles/datePicker.css";
import * as yup from "yup";
import SelectboxForm from "../../../../element/SelectboxForm";
import ModalAction from "../../../../ModalAction";
import CheckUser from "../../../../../pages/dashboard/users/add-user/CheckUser";

const AddSupervisorsForm = ({
  kindId,
  onSubmitTitle,
  onClose,
  onSubmit,
  defaultValues,
  id,
}) => {
  const [subUserList, setSubUserList] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);

  const requestGetlist = useApi();
  const { user } = useUser();

  const schema = yup.object().shape({
    userId: yup.object().shape({
      value: yup.string().required(),
    }),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    user && getListSubUser();
  }, []);

  const getListSubUser = async () => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        `User/GetAllSubUser/${user?.subSysId}`
      );

      setSubUserList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitForm = async (data) => {
    !data.type &&
      onSubmit(
        { ...data, userId: data?.userId?.value, subSysKindId: kindId },
        id
      );
  };

  const handleAddUser = () => {
    setModalContent({
      title: "افزودن کاربر",
      children: (
        <CheckUser
          onClose={() => setShowModal(false)}
          setModalContent={setModalContent}
          fetchData={() => getListSubUser()}
        />
      ),
    });
    setShowModal(true);
  };

  return (
    <>
      <div className="flex flex-col">
        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className="sm:grid sm:grid-cols-2 gap-4 text-right"
        >
          <div className="col-span-2 mb-2 space-y-2">
            <div className="flex flex-row justify-between items-center mb-4">
              <label htmlFor="userId" className="text-xs text-gray-600 ">
                کاربر
              </label>
              <div
                onClick={() => handleAddUser()}
                className="text-xs  text-primary-800 cursor-pointer"
              >
                افزودن
              </div>
            </div>

            <Controller
              name="userId"
              control={control}
              render={({ field }) => (
                <SelectboxForm
                field={field}
                  options={subUserList.map((item) => ({
                    label: `${
                      item.family ? item.name + " " + item.family : item.mobile
                    }`,
                    value: item?.userId,
                  }))}
                />
              )}
            />

            {errors.userId && (
              <div className="text-primary-600 text-xs">
                لطفا کاربر مورد نظر خود را مشخص کنید
              </div>
            )}
          </div>
        </form>

        <div className=" px-4 pt-4 sm:flex sm:flex-row sm:justify-center sm:px-6">
          <button
            type="submit"
            className="btn-primary w-fit"
            onClick={handleSubmit(onSubmitForm)}
          >
            {onSubmitTitle}
          </button>
          <button type="button" className="btn-secondary" onClick={onClose}>
            بستن
          </button>
        </div>
      </div>
      {showModal && modalContent && (
        <ModalAction
          {...modalContent}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default AddSupervisorsForm;
