// ServiceContext.jsx
import { createContext, useContext, useState } from "react";
import { EmployeeManagement } from "../components/EmployeeManagement";

const ServiceContext = createContext();

export const useAdminService = () => useContext(ServiceContext);

export const AdminServiceProvider = ({ children }) => {
  // Set default service here
  const [selectedService, setSelectedService] = useState(
    {id : 1, name : "Gestion des collaborateurs", view: <EmployeeManagement/>}
);

  const selectService = (service) => {
    setSelectedService(service);
  };

  return (
    <ServiceContext.Provider value={{ selectedService, selectService }}>
      {children}
    </ServiceContext.Provider>
  );
};
