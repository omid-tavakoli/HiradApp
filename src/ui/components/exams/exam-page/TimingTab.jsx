import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import useApi from "../../../../hooks/useApi";
import { useUser } from "../../../../contexts/UserContext";
import toast from "react-hot-toast";
import { Box } from "@mui/material";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian_fa from "react-date-object/locales/persian_fa";
import persian from "react-date-object/calendars/persian";
import transition from "react-element-popper/animations/transition";
import "../../../../assets/styles/datePicker.css";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import SelectboxForm from "../../../element/SelectboxForm";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import BeatLoaderLoading from "../../../element/loading/BeatLoader";

const schema = yup.object().shape({
  startDate: yup.string(),
  endDate: yup.string(),
  eventTime: yup.string(),
  // testDuration: yup.string(),
  repetitionType: yup.object().shape({
    value: yup.string().required(),
  }),
  repetitionNumber: yup.string(),
});

const TimingTab = ({ onNext, examId, examTitle , projectId, skGroupIds , isFinal ,all , showQuestionScore}) => {
  const [timingInfo, setTimingInfo] = useState({});
  const [showToContractor, setShowToContractor] = useState(false);
  const [repetitionTypeOption , setRepetitionTypeOption] = useState([
    { label: "بدون تکرار", value: "NoRepetition", id: 0 },
    { label: "روزانه", value: "Daily", id: 1 },
    { label: "هفتگی", value: "Weekly", id: 2 },
    { label: "ماهیانه", value: "Monthly", id: 3 },
    { label: "سالیانه", value: "Yearly", id: 4 },
  ]);

  const requestGetExam = useApi();
  const request = useApi();
  const {user} = useUser()
  const {
    handleSubmit,
    control,
    reset,
    watch,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getTiming();
  }, []);

  useEffect(() => {
    examId && reset(timingInfo);
  }, [timingInfo, reset]);

  const getTiming = async () => {
    try {
      const { data } = await requestGetExam.apiCall(
        "get",
        `Exam/GetExamDate/${examId}`
      );

      const toDateObjectFromTime = (value) => {
        const [hour, minute] = value.split(":");
        return new DateObject().set({ hour, minute });
      };
        
      const defaultValues = {
        title: examTitle,
        startDate: data.startDate ? new DateObject(data.startDate) : null,
        endDate: data.endDate ? new DateObject(data.endDate) : null,
        eventTime: data.eventTime || null,
        testDuration: toDateObjectFromTime(data.testDuration || "0:0"),
        repetitionType: repetitionTypeOption.filter(
          (item) => item.id == data?.repetitionType
        )[0],
        showToContractor: data?.showEventTimeToContractors,
      };
      setShowToContractor(data?.showEventTimeToContractors)
      setTimingInfo(defaultValues);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitForm = async (data) => {
    !data.type && onSubmit(data);
  };

  const onSubmit = async (data) => {
    const formatDateTime = (dateTime, time) => {
      const date = new DateObject(dateTime).format("YYYY/MM/DD"); 
      return `${date} ${time}`;
    };
  
    const reqData = {
      id: examId,
      startDate: formatDateTime(data.eventTime, data.startDate),
      endDate: formatDateTime(data.eventTime, data.endDate),
      eventTime: data.eventTime || null,
      testDuration: data.endDate,
      repetitionType: data.repetitionType.id,
      showToContractor: showToContractor,
      showQuestionScore: showQuestionScore,
      title: examTitle,
      subProjectId: projectId,
      skGroupIds: skGroupIds,
      isFinal: isFinal,
      all: all,
    };
  
    try {
      const response = await request.apiCall("post", "Exam/Edit", reqData);
      if (response?.isSuccess) {
        toast.success("زمان بندی با موفقیت ثبت شد");
        onNext();
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  return (
    <>
      {!request.loading ? (
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="sm:grid sm:grid-cols-2 sm:gap-x-4 sm:gap-y-2"
        >
          <div className="mb-2 space-y-2">
            <label htmlFor="title" className="text-xs text-gray-600 mb-2">
              تاریخ  شروع {user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'}
            </label>
            <Controller
              control={control}
              name={"eventTime"}
              rules={{ required: true }}
              render={({
                field: { onChange, value },
              }) => (
                <>
                  <DatePicker
                    animations={[transition()]}
                    inputClass="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                    value={value || ""}
                    format="YYYY/MM/DD"
                    onChange={(date) => {
                      onChange(date?.isValid ? date : "");
                    }}
                    locale={persian_fa}
                    calendar={persian}
                    calendarPosition="bottom-right"
                  />
                </>
              )}
            />
            {errors.eventTime && (
              <p className="text-primary-600 text-xs">{errors.eventTime.message}</p>
            )}
          </div>
          <div className="mb-2 space-y-2">
          <label htmlFor="title" className="text-xs text-gray-600 mb-2">
            تاریخ  پایان {user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'}
          </label>
          <Controller
            control={control}
            name={"eventTimeEnd"}
            rules={{ required: true }}
            render={({
              field: { onChange, value },
            }) => (
              <>
                <DatePicker
                  animations={[transition()]}
                  inputClass="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                  value={value || ""}
                  format="YYYY/MM/DD"
                  onChange={(date) => {
                    onChange(date?.isValid ? date : "");
                  }}
                  locale={persian_fa}
                  calendar={persian}
                  calendarPosition="bottom-right"
                />
              </>
            )}
          />
          {errors.eventTime && (
            <p className="text-primary-600 text-xs">{errors.eventTime.message}</p>
          )}
        </div>
          {/* <div className="mb-2 space-y-2">
            <label htmlFor="title" className="text-xs text-gray-600 mb-2">
              مدت زمان {user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'}
            </label>
            <Controller
              control={control}
              name={"testDuration"}
              rules={{ required: true }}
              render={({
                field: { onChange, value }, 
              }) => (
                <>
                  <DatePicker
                    animations={[transition()]}
                    inputClass="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                    value={value || ""}
                    disableDayPicker
                    format="HH:mm"
                    plugins={[<TimePicker hideSeconds position="bottom" />]}
                    onChange={(date) => {
                      onChange(date?.isValid ? date : "");
                    }}
                    locale={persian_fa}
                    calendar={persian}
                    calendarPosition="bottom-right"
                  />
                </>
              )}
            />
            {errors.testDuration && (
              <p className="text-primary-600 text-xs">
                {errors.testDuration.message}
              </p>
            )}
          </div> */}
          <div className="mb-2 space-y-2">
            <label htmlFor="title" className="text-xs text-gray-600 mb-2">
              آغاز دوره زمانی {user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'}
            </label>
            <Controller
              control={control}
              name={"startDate"}
              rules={{ required: true }}
              render={({
                field: { onChange, value },
              }) => (
                <>
                  <DatePicker
                    animations={[transition()]}
                    inputClass="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                    value={value || ""}
                    disableDayPicker
                    format="HH:mm"
                    plugins={[<TimePicker hideSeconds position="bottom" />]}
                    onChange={(date) => {
                      onChange(date?.isValid ? date : "");
                    }}
                    locale={persian_fa}
                    calendar={persian}
                    calendarPosition="bottom-right"
                  />
                </>
              )}
            />
            {errors.startDate && (
              <p className="text-primary-600 text-xs">{errors.startDate.message}</p>
            )}
          </div>
          <div className="mb-2 space-y-2">
            <label htmlFor="title" className="text-xs text-gray-600 mb-2">
              پایان دوره زمانی {user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'}
            </label>
            <Controller
              control={control}
              name={"endDate"}
              rules={{ required: true }}
              render={({
                field: { onChange, value }, 
              }) => (
                <>
                  <DatePicker
                    animations={[transition()]}
                    inputClass="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                    value={value || ""}
                    disableDayPicker
                    format="HH:mm"
                    plugins={[<TimePicker hideSeconds position="bottom" />]}
                    onChange={(date) => {
                      onChange(date?.isValid ? date : "");
                    }}
                    locale={persian_fa}
                    calendar={persian}
                    calendarPosition="bottom-right"
                  />
                </>
              )}
            />
            {errors.endDate && (
              <p className="text-primary-600 text-xs">{errors.endDate.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="repetitionType"
              className="text-xs text-gray-600 mb-4"
            >
              تکرار {user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'}
            </label>
            <Controller
              name="repetitionType"
              control={control}
              render={({ field }) => (
                <SelectboxForm
                  field={field}
                  options={repetitionTypeOption}
                />
              )}
            />

            {errors.repetitionType && (
              <div className="text-primary-600 text-xs">
                لطفا نوع تکرار را مشخص کنید
              </div>
            )}
          </div>
          {!(watch("repetitionType")?.value == "NoRepetition") && (
          <div className="space-y-2">
            <label
              htmlFor="repetitionNumber"
              className="text-xs text-gray-600 mb-4"
            >
              تعداد تکرار
            </label>
            <input
              type="number"
              {...register("repetitionNumber")}
              className="input-primary"
            />
            {errors.repetitionNumber && (
              <p className="text-primary-600 text-xs">
                {errors.repetitionNumber.message}
              </p>
            )}
          </div>
        )}
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                type="checkbox"
                name="all"
                checked={showToContractor}
                onChange={(e) => setShowToContractor(e.target.checked)}
              />
            }
            label={
              <div className="text-sm">مشاهده زمان {user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'} توسط {user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'}</div>
            }
          />
        </form>
      ) : (
        <div className="w-full flex justify-center">
          <BeatLoaderLoading />
        </div>
      )}
        <div className="flex justify-end ">
      <button
        onClick={handleSubmit(handleSubmitForm)}
        className="btn-primary mt-4"
      >
        ثبت تغییرات
      </button>

        </div>
    </>
  );
};

export default TimingTab;
