import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  Box,
  Tooltip,
  Typography,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { NewEmployeeDialog } from "../dialogs/NewEmployeeDialog";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from "@mui/icons-material/Add";
import { getAllEmployees } from "../services/EmployeeService";
import { EmployeeModificationDialog } from "../dialogs/EmployeeModification";
import { Info } from "lucide-react";
import { EmployeeDetailsDialog } from "../dialogs/EmployeeDetailsDialog";

const roles = [
    { id: 1, name: "ADMIN", label: "Admin" },
    { id: 2, name: "EMPLOYEE", label: "Collaborateur" },
    { id: 3, name: "MANAGER", label: "Manager" },
    { id: 4, name: "HR", label: "RH" },
];

export const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  // Employee Details
  const [detailsDialgOpen, setDetailsDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  // New Employee
  const [openDialog, setOpenDialog] = useState(false);
  // Update employee dialog
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleOpenUpdateDialog = (employee)=>{
    setSelectedEmployee(employee);
    setOpenUpdateDialog(true);
  }

  const handleCloseUpdateDialog = ()=>{
    setSelectedEmployee(null);
    setOpenUpdateDialog(false);
  }
  // handle close the employee details dialog
  const handleCloseDetailsDialog = ()=>{
    setCurrentEmployee(null);
    setDetailsDialogOpen(false);
  }

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getAllEmployees(page, pageSize);
      setEmployees(res?.content || []);
      setTotalElements(res?.totalElements || 0);
      console.log(res?.content)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, pageSize]);

  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Ajouter
        </Button>
      </Box>


      {loading && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      )}


      {!loading && employees.length === 0 && (
        <Typography align="center" color="text.secondary">
          Aucun collaborateur trouvé
        </Typography>
      )}


      {!loading && employees.length > 0 && (
        <>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Matricule</b></TableCell>
                <TableCell><b>Nom & Prénom</b></TableCell>
                <TableCell><b>Poste</b></TableCell>
                <TableCell><b>Entité</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.employeeId} hover>
                  <TableCell>{employee.professionalDetails?.matriculation}</TableCell>
                  <TableCell>{employee.fullName}</TableCell>
                  <TableCell>{employee?.professionalDetails?.occupation}</TableCell>
                  <TableCell>{employee?.professionalDetails?.entity}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Modifier" onClick={()=> handleOpenUpdateDialog(employee)}>
                      <IconButton>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Off-boarding">
                      <IconButton color="error">
                        <LogoutIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="info" onClick={()=> {
                        setCurrentEmployee(employee)
                        setDetailsDialogOpen(true);
                    }}>
                        <IconButton>
                            <Info/>
                        </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            rowsPerPageOptions={[10, 30, 40]}
            count={totalElements}
            rowsPerPage={pageSize}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setPageSize(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </>
      )}
      <EmployeeDetailsDialog 
      open={detailsDialgOpen} 
      onClose={handleCloseDetailsDialog}
      employee={currentEmployee}/>
      <NewEmployeeDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSuccess={fetchEmployees}
      />
      <EmployeeModificationDialog
      open={openUpdateDialog} 
      onClose={handleCloseUpdateDialog}
      employee={selectedEmployee} 
      roles={roles}
      onSuccess={fetchEmployees}
      setEmployee={setSelectedEmployee}/>
    </Paper>
  );
};
