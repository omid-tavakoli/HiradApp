import PropTypes from "prop-types";
import Logo from "../../assets/images/hirad-logo.png";

const AuthLayout = ({ children, title }) => {
  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-2 sm:px-6 py-12 lg:px-8 bg-gray-50">
      <div className="bg-white p-8 shadow-lg rounded-lg sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto  w-auto h-[8rem]"
            src={Logo}
            alt="هیراد لوگو"
          />
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="text-gray-900 font-bold mb-4">{title}</div>
          {children}
        </div>
      </div>
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.any,
  title: PropTypes.string,
};

export default AuthLayout;
