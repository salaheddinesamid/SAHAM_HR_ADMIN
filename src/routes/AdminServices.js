import { EmployeeManagement } from "../components/EmployeeManagement";
import { HolidayManagement } from "../components/HolidayManagement";
import { PayrollManagement } from "../components/PayrollManagement";
import { ProfileManagement } from "../components/ProfileManagement";

export const adminServices = [
    { id : 1, name : "Gestion des collaborateurs", view: <EmployeeManagement/>},
    { id : 2, name : "Gestion des jours feriés", view: <HolidayManagement/>},
    { id : 3, name : "Gestion des Bulletin de paie ", view : <PayrollManagement/>},
    { id : 4, name : "Profil", view : <ProfileManagement/>}
];