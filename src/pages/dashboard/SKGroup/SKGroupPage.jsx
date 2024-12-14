import { useNavigate, useParams } from "react-router-dom";
import { Tab } from "@headlessui/react";
import InfoTab from "../../../ui/components/SKGroups/SKG-page/InfoTab";
import QuestionsTab from "../../../ui/components/SKGroups/SKG-page/QuestionsTab";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SKGroupPage = () => {
  const navigate = useNavigate();

  let { skgroupId } = useParams();

  let tabs = {
    مشخصات: <InfoTab skgroupId={skgroupId} />,
    سوالات: <QuestionsTab skgroupId={skgroupId} />,
  };
  return (
    <div className="w-full sm:px-0">
      <div className="flex items-center mb-4">
        <div className="text-2xl font-black text-gray-600">
          ویرایش دسته بندی سوالات
        </div>
        <div className="w-5"></div>
        <button
          type="button"
          className="btn-primary w-fit !mb-0"
          onClick={() => navigate("/dashboard/sk-groups")}
        >
          لیست دسته بندی سوالات
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

export default SKGroupPage;
