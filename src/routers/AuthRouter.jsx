import PreLogin from "../pages/auth/PreLogin";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgetPassword from "../pages/auth/ForgetPassword";
import VerificationCode from "../pages/auth/VerificationCode";
import Invite from "../pages/auth/Invite/Invite";

const authRoter = [
  {
    element: <PreLogin />,
    path: "/",
  },
  {
    element: <Login />,
    path: "/auth/login",
  },
  {
    element: <Register />,
    path: "/auth/register",
  },
  {
    element: <ForgetPassword />,
    path: "/auth/forget-password",
  },
  {
    element: <VerificationCode />,
    path: "/auth/verification-code",
  },
  {
    element: <Invite />,
    path: "/auth/invite/:nationalCode",
  },
];

export default authRoter;
