import { useNavigate, useParams } from "react-router-dom";
import { Tab } from "@headlessui/react";
import MassExamCreate from "../../../ui/MassExam/MassExamCreate";
import MassExamTime from "../../../ui/MassExam/MassExamTime";
import { useState } from "react";
import { useUser } from "../../../contexts/UserContext";
import MassExamAssigend from "../../../ui/MassExam/MassExamAssigend";
import toast from "react-hot-toast";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const MassExam = () => {
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState([]);
  const [skgId , setSkgId ] = useState([])
  const { user } = useUser();
  
  let tabs = {
    مشخصات: (
      <MassExamCreate
        onNext={() => handleNextTab()}
        setSelectedProject={setSelectedProject}
        selectedProject={selectedProject}
        setSkgId={setSkgId}
      />
    ),
    زمانبندی: (
      <MassExamTime
        selectedProject={selectedProject}
        onNext={() => handleNextTab()}
      />
    ),
    اختصاص: (
      <MassExamAssigend
        selectedProject={selectedProject}
        onNext={() => handleNextTab()}
        skgId={skgId}
      />
    ),
  };

  const handleNextTab = () => {
    if (selectedIndex < Object.keys(tabs).length - 1) {
      setSelectedIndex(selectedIndex + 1);
    } else {
      navigate("/dashboard/exams-management");
    }
  };


  return (
    <div className="w-full sm:px-0">
      <div className="flex items-center mb-4">
        <div className="text-2xl font-black text-gray-600">
          تعریف{" "}
          {user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
            ?.fieldValue
            ? user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
                ?.fieldValue
            : "ارزیابی"}{" "}
          جمعی
        </div>
        <div className="w-5"></div>
        <button
          type="button"
          className="btn-primary w-fit !mb-0"
          onClick={() => navigate("/dashboard/exams-management")}
        >
          لیست{" "}
          {user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
            ?.fieldValue
            ? user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
                ?.fieldValue
            : "ارزیابی"}{" "}
          ها
        </button>
      </div>
      <Tab.Group
        selectedIndex={selectedIndex}
        onChange={(index) => {
          // if (selectedIndex === 0 && selectedProject.length === 0 ) {
          //   toast.error('برای دسترسی به صفحات بعدی اطلاعات را تکمیل کنید')
          //   return;
          // }
          setSelectedIndex(index);
        }}
      >
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
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </div>
      </Tab.Group>
    </div>
  );
};

export default MassExam;
