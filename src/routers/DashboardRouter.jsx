import Profile from "../pages/dashboard/Profile";
import SendNotification from "../pages/dashboard/SendNotification";
import Logs from "../pages/dashboard/Logs";
import Factors from "../pages/dashboard/factors/Factors";
import BuyPackage from "../pages/dashboard/package/BuyPackage";
import SystemPackages from "../pages/dashboard/package/SystemPackages";
import HistoryPackages from "../pages/dashboard/package/HistoryPackages";
import Types from "../pages/dashboard/Types";
import SubSystems from "../pages/dashboard/SubSystems";
import UsersSystem from "../pages/dashboard/users/UsersSystem";
import Zones from "../pages/dashboard/Zones";
import Formulas from "../pages/dashboard/Formulas";
import Kinds from "../pages/dashboard/kinds/Kinds";
import KindCreate from "../pages/dashboard/kinds/KindCreate";
import KindPage from "../pages/dashboard/kinds/KindPage";
import Projects from "../pages/dashboard/projects/Projects";
import ProjectCreate from "../pages/dashboard/projects/ProjectCreate";
import ProjectPage from "../pages/dashboard/projects/ProjectPage";
import SKGroups from "../pages/dashboard/SKGroup/SKGroups";
import SKGroupsCreate from "../pages/dashboard/SKGroup/SKGroupsCreate";
import SKGroupPage from "../pages/dashboard/SKGroup/SKGroupPage";
import ExamsManagement from "../pages/dashboard/exams/ExamsManagement";
import ExamCreate from "../pages/dashboard/exams/ExamCreate";
import ExamPage from "../pages/dashboard/exams/ExamPage";
import Exams from "../pages/dashboard/exams/Exams";
import ExamsReview from "../pages/dashboard/exams/ExamsReview";
import Access from "../pages/dashboard/Access";
import SettingsSubSystem from "../pages/dashboard/Settings/SettingsSubSystem";
import SettingsSystem from "../pages/dashboard/Settings/SettingsSystem";
import UsersSubSystem from "../pages/dashboard/users/UsersSubSystem";
import Dashboard from "../pages/dashboard/Dashboard";
import SubSystemProfile from "../pages/dashboard/SubSystemProfile";
import ContractorProfile from "../pages/dashboard/ContractorProfile";
import ExamDoing from "../pages/dashboard/exams/ExamDoing";
import PaymentResult from "../pages/dashboard/PaymentResult";
import SubmitPayment from '../pages/dashboard/SubmitPayment/SubmitPayment';
import MassExam from '../pages/dashboard/exams/MassExam';
import AllSms from "../pages/dashboard/AllSms";
const dashboardRoter = [
  {
    element: <Dashboard />,
    path: "",
    requiredPermission: "User-FillProfile",
  },
  {
    element: <Profile />,
    path: "profile",
    requiredPermission: "User-FillProfile",
  },
  {
    element: <SendNotification />,
    path: "send-notification",
    requiredPermission: "Notification-Add",
  },
  {
    element: <Logs />,
    path: "logs",
    requiredPermission: "Log-GetList",
  },
  {
    element: <Factors />,
    path: "factors",
    requiredPermission: "Factor-GetList",
  },
  {
    element: <BuyPackage />,
    path: "packages/buy",
    requiredPermission: "Package-Buy",
  },
  {
    element: <SystemPackages />,
    path: "packages/systems-package",
    requiredPermission: "Package-GetList",
  },
  {
    element: <HistoryPackages />,
    path: "packages/history",
    requiredPermission: "Package-GetSubSysPackageList",
  },
  {
    element: <Types />,
    path: "types",
    requiredPermission: "SubType-GetList",
  },
  {
    element: <SubSystems />,
    path: "sub-systems",
    requiredPermission: "SubSys-GetList",
  },
  {
    element: <UsersSystem />,
    path: "system/users",
    requiredPermission: "User-GetList",
  },
  {
    element: <Zones />,
    path: "zones",
    requiredPermission: "Zone-GetList",
  },
  {
    element: <Formulas />,
    path: "formulas",
    requiredPermission: "CalculationFormula-GetList",
  },
  {
    element: <Kinds />,
    path: "kinds",
    requiredPermission: "SubSysKind-GetList",
  },
  {
    element: <KindCreate />,
    path: "kinds/create",
    requiredPermission: "SubSysKind-Create",
  },
  {
    element: <KindPage />,
    path: "kinds/:kindId",
    requiredPermission: "SubSysKind-Get",
  },
  {
    element: <Projects />,
    path: "projects",
    requiredPermission: "Project-GetList",
  },
  {
    element: <ProjectCreate />,
    path: "projects/create",
    requiredPermission: "Project-Create",
  },
  {
    element: <ProjectPage />,
    path: "projects/:projectId",
    requiredPermission: "Project-Get",
  },
  {
    element: <SKGroups />,
    path: "sk-groups",
    requiredPermission: "SKGroup-GetList",
  },
  {
    element: <SKGroupsCreate />,
    path: "sk-groups/create/:selectdSubKindId",
    requiredPermission: "SKGroup-Create",
  },
  {
    element: <SKGroupPage />,
    path: "sk-groups/:skgroupId",
    requiredPermission: "SKGroup-Get",
  },

  {
    element: <ExamsManagement />,
    path: "exams-management",
    requiredPermission: "Exam-GetList",
  },
  {
    element: <ExamCreate />,
    path: "exams-management/create",
    requiredPermission: "Exam-Create",
  },
  {
    element: <MassExam />,
    path: "exams-management/mass-create",
    requiredPermission: "ExamMass-Create",
  },
  {
    element: <ExamPage />,
    path: "exams-management/:examId",
    requiredPermission: "Exam-Get",
  },
  {
    element: <Exams />,
    path: "exams",
    requiredPermission: "Exam-GetExamListByUserId",
  },
  {
    element: <ExamsReview />,
    path: "exams-review",
    requiredPermission: "Exam-GetExamListByUserId",
  },
  {
    element: <Access />,
    path: "access",
    requiredPermission: "Role-GetList",
  },
  {
    element: <SettingsSystem />,
    path: "settings-system",
    requiredPermission: "SystemSet-GetList",
  },
  {
    element: <SettingsSubSystem />,
    path: "settings",
    requiredPermission: "SubSystemSet-GetList",
  },
  {
    element: <UsersSubSystem />,
    path: "users",
    requiredPermission: "User-GetAllSubUser",
  },
  {
    element: <SubSystemProfile />,
    path: "system-profile",
    requiredPermission: "SubSys-Get",
  },
  {
    element: <ContractorProfile />,
    path: "contractor-profile",
    requiredPermission: "Contractor-Get",
  },
  {
    element: <ExamDoing />,
    path: "exam/doing/:examId",
    requiredPermission: "Question-UserAnswerQuestion",
  },
  {
    element: <PaymentResult />,
    path: "payment-result",
  },
  {
    element: <SubmitPayment />,
    path: "submit-payment",
    requiredPermission: "Factor-GetListPayment",
  },
  {
    element: <AllSms />,
    path: "sms",
    requiredPermission: "sms",
  },
];

export default dashboardRoter;
