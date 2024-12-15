import { useEffect, useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  addDays,
  isBefore,
  parse,
} from "date-fns-jalali";

import { digitsEnToFa } from "@persian-tools/persian-tools";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { HubConnectionBuilder } from "@microsoft/signalr";
import "../../../assets/styles/table.css";
import { useUser } from "../../../contexts/UserContext";
import useApi from "../../../hooks/useApi";
import ModalAction from "../../ModalAction";
import ExamsShowInfo from "../exams/exam-doing/ExamsShowInfo";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [exams, setExams] = useState([]);
  const [connection, setConnection] = useState(null);

  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { user } = useUser();

  const request = useApi();

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(import.meta.env.VITE_API_URL + "calendar")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection.on("SendExamNotificationToUser", (exams) => {
        setExams((prev) => [...prev, exams]);
      });
      connection
        .start()
        .then(() => {
          connection.invoke("startMessaging", user?.userId);
        })
        .catch((e) => console.log("Connection failed: ", e));
      return () => {
        connection.stop();
      };
    }
  }, [connection]);

  useEffect(() => {
    if (user?.subSysId) getCalendar();
  }, [user]);

  const getCalendar = async () => {
    try {
      const { data } = await request.apiCall(
        "get",
        `Calendar/GetList/${user.subSysId}`
      );
      setExams(data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-row justify-between items-center p-4">
        <button onClick={previousMonth}>
          <ChevronRightIcon className="w-5 h-5 text-gray-700 hover:text-primary-700 transition-colors ml-2" />
        </button>
        <span className="text-gray-700 ">
          {digitsEnToFa(format(currentDate, "MMMM yyyy"))}
        </span>
        <button onClick={nextMonth}>
          <ChevronLeftIcon className="w-5 h-5 text-gray-700 hover:text-primary-700 transition-colors" />
        </button>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    const daysOfWeek = [
      "شنبه",
      "یکشنبه",
      "دوشنبه",
      "سه شنبه",
      "چهارشنبه",
      "پنجشنبه",
      "جمعه",
    ];
    return daysOfWeek.map((day) => (
      <th
        className="border border-slate-200 text-xs py-2 font-medium  text-gray-500  text-center"
        key={day}
      >
        {day}
      </th>
    ));
  };

  const getExams = (date) =>
    exams.filter((exam) => format(date, "yyyy/MM/dd HH:mm") === exam.eventTime);

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const eventTime = "1403/08/02 00:00";
    const eventDate = parse(eventTime, "yyyy/MM/dd HH:mm", new Date());
    const now = new Date(); // زمان فعلی

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const clonedDay = day;
        const dayExams = getExams(day);

        days.push(
          <td
            key={day}
            className={`relative border border-slate-200 p-4 text-slate-500 text-center ${
              !isSameMonth(day, monthStart)
                ? "disabled bg-gray-50"
                : `hover:bg-red-100 cursor-pointer ${
                    isSameDay(day, currentDate) ? "selected" : ""
                  } ${isSameDay(day, new Date()) ? "bg-red-50" : ""}`
            }`}
            onClick={() => {
              handleDayClick(clonedDay, dayExams);
            }}
          >
            <div className="flex flex-col items-center">
              <span className="absolute top-1 left-1">
                <PlusIcon width={10} height={10} />
              </span>
              <span className="absolute bottom-1 right-1 text-[10px]">
                تعداد{" "}
                {user?.role?.listSystemSet?.filter(
                  (item) => item.number === 4
                )[0]?.fieldValue || "ارزیابی"}{" "}
                : {dayExams.length}
              </span>
              <span>{digitsEnToFa(formattedDate)}</span>
              <div className="flex">
                {dayExams.map((exam, index) => {
                  const examDate = parse(
                    exam.eventTime,
                    "yyyy/MM/dd HH:mm",
                    new Date()
                  );
                  const isPast = isBefore(examDate, now); 
                  const isToday = isSameDay(examDate, now);

                  return (
                    <span
                      key={index}
                      className={`w-2.5 h-2.5 text-xs ${
                        isToday
                          ? "bg-primary-500" 
                          : isPast
                          ? "bg-yellow-500" 
                          : "bg-blue-500"
                      } border-2 border-white rounded-full`}
                    ></span>
                  );
                })}
              </div>
            </div>
          </td>
        );
        day = addDays(day, 1);
      }
      rows.push(<tr key={day}>{days}</tr>);
      days = [];
    }

    return <tbody className="bg-white text-right">{rows}</tbody>;
  };

  const handleDayClick = (date, exams) => {
    setModalContent({
      title: `${
        user?.role?.listSystemSet?.filter((item) => item.number === 4)[0]
          ?.fieldValue || "ارزیابی"
      } های ${format(date, "yyyy/MM/dd")}`,
      children: <ExamsShowInfo data={exams} date={date} />,
    });
    setShowModal(true);
  };

  return (
    <>
      <div className="calendar relative bg-white rounded-md sm:mx-8">
        {renderHeader()}

        <div className="relative rounded-xl">
          <div className="relative rounded-xl">
            <div className="shadow-sm  my-8 overflow-auto  table-scrollbar">
              <table className="table-auto min-w-full text-xs whitespace-nowrap text-right">
                <thead>
                  <tr>{renderDaysOfWeek()}</tr>
                </thead>
                {renderCells()}
              </table>
            </div>
          </div>
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
}

export default Calendar;
