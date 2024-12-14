import { useUser } from "../../../../contexts/UserContext";
import DataTable from "../../../table/DataTable";
const ShowExam = ({ exam }) => {
  const {user} = useUser()
  const data = exam?.questions.map((item, index) => ({
    id: index + 1,
    questionTitle: item.title,
    userAnswer: item.userScore || "N/A",
    subProjectIdentity: exam.subProjectIdentity,
    score: exam.score,
    startPeriod: exam.startPeriod,
    endPeriod: exam.endPeriod,
  }));

  const columns = [
    { header: () => "سوال", accessorKey: "questionTitle" },
    { header: () => "جواب", accessorKey: "userAnswer" },
    { header: () => "امتیاز", accessorKey: "score" },
    { header: () => `${user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue: 'پروژه'}`, accessorKey: "subProjectIdentity" },
    { header: () => "شروع", accessorKey: "startPeriod" },
    { header: () => "پایان", accessorKey: "endPeriod" },
  ];  

  return (
    <div className="flex flex-col space-y-2 text-sm">
      <div className="flex justify-between">
        <div>
          <span> {user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue: 'پروژه'} :</span>
          <span>{exam.subProjectIdentity}</span>
        </div>
        <div>
          <span>امتیاز کسب شده :</span>
          <span>{exam.score}</span>
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          <span> تاریخ شروع:</span>
          <span>{exam.startPeriod}</span>
        </div>
        <div className="flex gap-x-2">
          <span> تاریخ پایان:</span>
          <span>{exam.startPeriod}</span>
        </div>
      </div>
      {data.length != 0  ? (
        <DataTable
          data={data}
          columns={columns}
          title={`جزئیات ${user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'}`}
          countColumns={1}
        />
      ): ''}
    </div>
  );
};

export default ShowExam;
