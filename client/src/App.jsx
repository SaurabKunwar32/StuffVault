import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import RegistrationForm from "./Forms/Register";
import MainView from "./Component/MainView.jsx";
import Login from "./Forms/Login";
import VerifyOtp from "./Forms/VerifyOtp.jsx";
import UsersPage from "./Component/UsersPage.jsx";
import Settings from "./Component/Settings.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainView />
  },
  {
    path: "/register",
    element: <RegistrationForm />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/verify",
    element: <VerifyOtp />,
  },
  {
    path: "/users",
    element: <UsersPage />,
  },
  {
    path: "/setting",
    element: <Settings />,
  },
  {
    path: "/directory/:dirId",
    element: <MainView />,
  },
  // Catch-all route for invalid paths
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
])


const App = () => {
  return <RouterProvider router={router} />;
};


export default App;