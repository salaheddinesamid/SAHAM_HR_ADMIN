import { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import logo from "../logo.png";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { motion, AnimatePresence } from "framer-motion";
import { adminServices } from "./AdminServices";
import { useAdminService } from "../context/ViewContext";
import { UserProfile } from "../components/UserProfile";
import { ProfileManagement } from "../components/ProfileManagement";

export const AdminDashboard = () => {
  const [openServices, setOpenServices] = useState([]);
  const { selectedService, selectService } = useAdminService();

  // Toggle open/close for sidebar sections
  const toggleService = (serviceName) => {
    setOpenServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((s) => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  // Auto-open parent section when a sub-service is selected
  useEffect(() => {
    if (selectedService?.parent) {
      setOpenServices((prev) =>
        prev.includes(selectedService.parent)
          ? prev
          : [...prev, selectedService.parent]
      );
    }
  }, [selectedService]);

  return (
    <div className="dashboard">
      <div className="left-side">
        <div className="left-side-header">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        <div className="left-side-services">
          {adminServices.map((s) => {
            const isOpen =
              openServices.includes(s.name) ||
              s.subServices?.some((sub) => sub.name === selectedService.name);

            return (
              <div key={s.id} className="service-item">
                <button
                  className="service-btn"
                  onClick={() => {
                    if (s.subServices) toggleService(s.name);
                    else selectService(s);
                  }}
                >
                  {s.name}
                  {s.subServices && (
                    <span className="chevron">
                      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && s.subServices && (
                    <motion.div
                      className="sub-services"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      {s.subServices.map((sub) => (
                        <button
                          key={sub.name}
                          className={`sub-service-btn ${
                            selectedService.name === sub.name ? "active" : ""
                          }`}
                          onClick={() => selectService({ ...sub, parent: s.name })}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
      <div className="right-side">
        <div className="right-side-header">
          <div className="header-left">
            <p className="page-title">
              {selectedService?.name !== "Home" ? selectedService.name : ""}
            </p>
          </div>
          <div className="header-right d-flex">
            <div className="notification">
              <NotificationsIcon />
            </div>  
              <UserProfile />
          </div>
        </div>

        <div className="right-side-content">{selectedService?.view}</div>
      </div>
    </div>
  );
};
