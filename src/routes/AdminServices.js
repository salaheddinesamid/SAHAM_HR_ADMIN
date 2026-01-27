import { EmployeeManagement } from "../components/EmployeeManagement";
import { HolidayManagement } from "../components/HolidayManagement";
import { PayrollManagement } from "../components/PayrollManagement";

export const adminServices = [
    { id : 1, name : "Gestion des collaborateurs", view: <EmployeeManagement/>},
    { id : 2, name : "Gestion des jours feriés", view: <HolidayManagement/>},
    { id : 3, name : "Gestion des Bulletin de paie ", view : <PayrollManagement/>}
];