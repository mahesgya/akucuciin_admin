import { useState, useEffect } from "react";
import { FaHome, FaStore, FaUsers, FaShoppingCart, FaBars, FaTimes, FaSignOutAlt, FaCamera, FaUserTie } from "react-icons/fa";
import { useNavigate, useLocation, matchPath } from "react-router-dom";


import Cookies from "js-cookie";
import Swal from "sweetalert2";

import authService from "../../services/auth.service";
import DriverPage from "../driver";
import HomePage from "../home";
import LaundryTable from "../laundry";
import CustomerTable from "../customer";
import OrderTable from "../order";
import FotoPage from "../photo";
import FotoDetailPage from "../../components/laundry.foto";

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");

  const menuMapping = {
    "/dashboard": "Home",
    "/dashboard/mitralaundry": "Laundry Partners",
    "/dashboard/customer": "Customer",
    "/dashboard/order": "Order",
    "/dashboard/foto": "Foto Laundry",
    "/dashboard/driver": "Driver",
  };

  const [activeMenu, setActiveMenu] = useState(menuMapping[location.pathname] || "Home");

  useEffect(() => {
    const refreshAuthToken = async () => {
      await authService.refreshUser(refreshToken, navigate);
    };

    refreshAuthToken();

    const interval = setInterval(refreshAuthToken, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fotoMatch = matchPath("/dashboard/foto/:idLaundry", location.pathname);

    if (fotoMatch) {
      setActiveMenu("Foto Laundry");
    } else {
      setActiveMenu(menuMapping[location.pathname] || "Home");
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await authService.logoutAdmin(refreshToken);
    navigate("/login");
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);

    switch (menu) {
      case "Laundry Partners":
        navigate("/dashboard/mitralaundry");
        break;
      case "Customer":
        navigate("/dashboard/customer");
        break;
      case "Order":
        navigate("/dashboard/order");
        break;
      case "Foto Laundry":
        navigate("/dashboard/foto");
        break;
      case "Driver":
        navigate("/dashboard/driver");
        break;
      default:
        navigate("/dashboard");
    }
  };

  const renderContent = () => {
    const fotoMatch = matchPath("/dashboard/foto/:idLaundry", location.pathname);

    if (fotoMatch) {
      const idLaundry = fotoMatch.params.idLaundry;
      return <FotoDetailPage idLaundry={idLaundry} />;
    }

    switch (location.pathname) {
      case "/dashboard/mitralaundry":
        return <LaundryTable />;
      case "/dashboard/customer":
        return <CustomerTable />;
      case "/dashboard/order":
        return <OrderTable />;
      case "/dashboard/foto":
        return <FotoPage />;
      case "/dashboard/driver":
        return <DriverPage />;
      default:
        return <HomePage />;
    }
  };

  if (!accessToken) {
    Swal.fire({
      icon: "error",
      title: "Anda Belum Login",
      text: "Silahkan Melakukan Login Terlebih Dahulu.",
      confirmButtonText: "Coba Lagi",
      confirmButtonColor: "#d33",
      showCloseButton: true,
    });
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-200 via-white to-gray-100 text-gray-700">
      {!isOpen && (
        <div className="block w-14 min-h-screen bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 flex items-start justify-center">
          <button onClick={toggleSidebar} className="p-3 text-md text-white lg:text-2xl">
            <FaBars />
          </button>
        </div>
      )}

      <div className={`transform ${isOpen ? "translate-x-0 block top-0 left-0 min-h-screen pb-8 bg-white w-[40vh] transition-transform duration-300 z-50 shadow-xl" : "hidden"}`}>
        <div className="font-quick p-6 text-center flex flex-row items-center justify-center space-x-2 font-bold text-lg md:text-2xl lg:text-2xl">
          <img src="/images/LogoAkucuciin.png" alt="" className="w-25 lg:w-[200px]" />
          {isOpen && (
            <button onClick={toggleSidebar} className="text-md text-indigo-500 lg:text-2xl">
              <FaTimes />
            </button>
          )}
        </div>

        <nav className="flex-1 p-1  space-y-4 w-full flex flex-col justify-center items-center lg:p-4">
          {[
            { name: "Home", path: "/dashboard", icon: <FaHome className="text-sm md:text-xl lg:text-2xl mr-3" /> },
            { name: "Order", path: "/dashboard/order", icon: <FaShoppingCart className="text-sm md:text-xl lg:text-2xl mr-3" /> },
            { name: "Laundry Partners", path: "/dashboard/mitralaundry", icon: <FaStore className="text-lg md:text-xl lg:text-2xl mr-3" /> },
            { name: "Foto Laundry", path: "/dashboard/foto", icon: <FaCamera className="text-sm md:text-xl lg:text-2xl mr-3" /> },
            { name: "Customer", path: "/dashboard/customer", icon: <FaUsers className="text-sm md:text-xl lg:text-2xl mr-3" /> },
            { name: "Driver", path: "/dashboard/driver", icon: <FaUserTie className="text-sm md:text-xl lg:text-2xl mr-3" /> },
          ].map((menu) => (
            <button
              key={menu.name}
              className={`text-sm lg:text-xl w-full font-medium font-quick flex items-center p-1 lg:p-3 rounded-md transition-all
        ${activeMenu === menu.name ? "bg-indigo-500 text-white" : "bg-none text-gray-700 hover:bg-gray-100"}`}
              onClick={() => handleMenuClick(menu.name)}
            >
              {menu.icon} {menu.name}
            </button>
          ))}

          <button onClick={handleLogout} className="font-semibold w-full flex items-center p-1 lg:p-3 rounded-md text-sm lg:text-xl bg-transparent text-red-600 hover:bg-red-600 hover:text-white mt-4 transition-all">
            <FaSignOutAlt className=" text-sm md:text-xl lg:text-2xl mr-3 transition-all" />
            Logout
          </button>
        </nav>

        <div className="p-4 text-center mt-auto">
          <p className="text-sm text-gray-400 font-quick">&copy; 2024 Admin Akucuciin</p>
        </div>
      </div>

      {isOpen && <div className="fixed inset-0 bg-black opacity-50 md:hidden" onClick={toggleSidebar}></div>}

      <div className="flex-1">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
