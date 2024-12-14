import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./contexts/UserContext";
import Router from "./routers/Router";

function App() {
  const { routerList } = Router();
  return (
    <>
      <UserProvider>
        <RouterProvider router={routerList} />
        <Toaster />
      </UserProvider>
    </>
  );
}

export default App;
