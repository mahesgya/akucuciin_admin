import RootRedirect from "./hooks/root.redirect";
import AdminDashboard from "./pages/main/index";
import LoginAdmin from "./pages/login/index";

const Routess = [
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/login",
    element: <LoginAdmin />,
  },
  {
    path: "/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/dashboard/:idLaundry",
    element: <AdminDashboard />,
  },
  {
    path: "/dashboard/foto/:idLaundry",
    element: <AdminDashboard />,
  },
 
];

export default Routess;
