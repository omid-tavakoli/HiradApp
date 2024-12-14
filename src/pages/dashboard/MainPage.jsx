import { useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Footer from "../../ui/layout/dashboard/header/Footer";
import Header from "../../ui/layout/dashboard/header/Header";
import Sidebar from "../../ui/layout/dashboard/sidebar/Sidebar"
import toast from "react-hot-toast";

const MainPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user?.status && user?.status === 4 && location.pathname !== "/profile") {
      navigate("profile");
      toast.error("پروفایل خود را تکمیل کنید");
    }
  }, [user?.status, location.pathname, navigate]);

  return (
    <div className="flex flex-row bg-white">
      <Sidebar />
      <div className="w-full lg:pr-[250px] ">
        <Header />
        <main className="min-h-screen px-2 pt-8 md:p-8 rounded-tr-[2.5rem] bg-gray-100">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainPage;
