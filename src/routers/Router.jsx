import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import authRoter from "./AuthRouter";
import dashboardRoter from "./DashboardRouter";
import MainPage from "../pages/dashboard/MainPage";

const Router = () => {

  const routerList = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route>
          {authRoter.map((route, index) => (
            <Route element={route.element} path={route.path} key={index} />
          ))}
        </Route>


        <Route element={<MainPage />} path="dashboard">
          {dashboardRoter.map((route, index) => (
            <Route
              action={async () => {
                return console.log(route.path);
              }}
              element={
                route.element
              }
              path={route.path}
              key={index}
            />
          ))}
        </Route>
      </Route>
    )
  );

  return { routerList };
};

export default Router;
