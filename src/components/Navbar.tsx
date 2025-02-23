import { Menubar } from "primereact/menubar";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/components/navbar.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      label: "Form Builder",
      icon: "pi pi-pencil",
      command: () => navigate("/"),
      className: location.pathname === "/" ? "active-menu-item" : "",
    },
    {
      label: "Preview Form",
      icon: "pi pi-eye",
      command: () => navigate("/preview"),
      className: location.pathname === "/preview" ? "active-menu-item" : "",
    },
  ];

  return (
    <Menubar model={items} className="shadow-2 av-menu-bar p-3 " />
  );
};

export default Navbar;
