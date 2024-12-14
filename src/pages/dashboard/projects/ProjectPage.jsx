import { useNavigate, useParams } from "react-router-dom";
import { Tab } from "@headlessui/react";
import InfoTab from "../../../ui/components/projects/project-page/InfoTab";
import FillKindDetailsTab from "../../../ui/components/projects/project-page/FillKindDetailsTab";
import KindDetailsTab from "../../../ui/components/projects/project-page/KindDetailsTab";
import ConnectorTab from "../../../ui/components/projects/project-page/ConnectorTab";

import { useState } from "react";
import { useUser } from "../../../contexts/UserContext";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProjectPage = () => {
  const navigate = useNavigate();

  const [kindId, setKindId] = useState(345);
  let { projectId } = useParams();
  const {user} = useUser()
  const connector = `تخصیص ${user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'}`
  let tabs = {
    "مشخصات": <InfoTab projectId={projectId} setKindId={setKindId} />,
    "سربرگ ها": <KindDetailsTab projectId={projectId} kindId={kindId} />,
    "پر کردن سربرگ ها": (<FillKindDetailsTab projectId={projectId} kindId={kindId} />),
    [connector]: <ConnectorTab projectId={projectId} />,
  };
  return (
    <div className="w-full sm:px-0">
      <div className="flex items-center mb-4">
        <div className="text-2xl font-black text-gray-600">ویرایش {user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue: 'پروژه'}</div>
        <div className="w-5"></div>
        <button
          type="button"
          className="btn-primary w-fit !mb-0"
          onClick={() => navigate("/dashboard/projects")}
        >
          لیست {user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue: 'پروژه'} ها
        </button>
      </div>
      <Tab.Group>
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
                      : 
                        "btn-primary !bg-inherit !text-gray-700 !shadow-none"
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
                className={classNames("rounded-xl bg-white p-4 h-full w-full")}
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

export default ProjectPage;
