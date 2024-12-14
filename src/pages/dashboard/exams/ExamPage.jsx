import { useNavigate, useParams } from "react-router-dom";
import { Tab } from "@headlessui/react";
import InfoTab from "../../../ui/components/exams/exam-page/InfoTab";
import TimingTab from "../../../ui/components/exams/exam-page/TimingTab";
import AssignedTab from "../../../ui/components/exams/exam-page/AssignedTab";
import { useState } from "react";
import { useUser } from "../../../contexts/UserContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ExamPage = () => {
  const navigate = useNavigate();

  let { examId } = useParams();
  const [kindId, setKindId] = useState();
  const [projectId, setProjectId] = useState();
  const [skGroupIds, setSkGroupIds] = useState();
  const [all, setAll] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [showQuestionScore, setShowQuestionScore] = useState(false);
  const [examTitle, setExamTitle] = useState();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const {user} = useUser()
  let tabs = {
    مشخصات: (
      <InfoTab
        examId={examId}
        setKindId={setKindId}
        setProjectId={setProjectId}
        setExamTitle={setExamTitle}
        setSkGroupIds={setSkGroupIds}
        setAll={setAll}
        setIsFinal={setIsFinal}
        setSelectedIndex={setSelectedIndex}
        setShowQuestionScore={setShowQuestionScore}
      />
    ),
    زمانبندی: (
      <TimingTab
        examId={examId}
        examTitle={examTitle}
        projectId={projectId}
        skGroupIds={skGroupIds}
        isFinal={isFinal}
        all={all}
        showQuestionScore={showQuestionScore}
      />
    ),
    اختصاص: (
      <AssignedTab examId={examId} kindId={kindId} projectId={projectId} />
    ),
  };

  const handleNextTab = () => {
    if (selectedIndex < Object.keys(tabs).length - 1) {
      setSelectedIndex(selectedIndex + 1);
    } else {
      navigate("/dashboard/exams-management");
    }
  };

  const handlePreviousTab = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  return (
    <div className="w-full sm:px-0">
      <div className="flex items-center mb-4">
        <div className="text-2xl font-black text-gray-600">ویرایش {user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'}</div>
        <div className="w-5"></div>
        <button
          type="button"
          className="btn-primary w-fit !mb-0"
          onClick={() => navigate("/dashboard/exams-management")}
        >
          لیست {user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'} ها
        </button>
      </div>
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <div className="flex flex-col">
          <Tab.List className="flex flex-row space-x-3 space-x-reverse rounded-xl p-1">
            {Object.keys(tabs).map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    "rounded-lg p-2 text-sm text-right ",
                    " focus:outline-none ",
                    selected
                      ? "btn-primary"
                      : "btn-primary !bg-inherit !text-gray-700 !shadow-none"
                  )
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2 basis-4/5">
            {Object.values(tabs).map((posts, idx) => (
              <Tab.Panel
                key={idx}
                className={classNames(
                  "rounded-xl bg-white shadow-sm p-4 h-full w-full"
                )}
              >
                {posts}
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handlePreviousTab}
                    disabled={selectedIndex === 0}
                  >
                    قبلی
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleNextTab}
                    disabled={
                      selectedIndex === Object.keys(tabs).length - 1 && false
                    }
                  >
                    {selectedIndex === Object.keys(tabs).length - 1
                      ? "اتمام فرایند"
                      : "بعدی"}
                  </button>
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </div>
      </Tab.Group>
    </div>
  );
};

export default ExamPage;
