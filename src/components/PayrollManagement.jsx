import { Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react"
import { mapPayrollStatus } from "../utils/PayrollUtils";
import { NewPayrollDialog } from "../dialogs/NewPayrollDialog";
import { Add } from "@mui/icons-material";
import { LocalDateTimeMapper } from "../utils/LocalDateTimeMapper";
import { getAllPayrollHistory } from "../services/PayrollService";

export const PayrollManagement = ()=>{
    const [payrollsHistory, setPayrollsHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newPayrollDialogOpen, setNewPayrollDialogOpen] = useState(false);

    const fetchEmployeePayrollHistory = async ()=>{
        try{
            setLoading(true);
            const res = await getAllPayrollHistory();
            setPayrollsHistory(res);
        }catch (err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    const handleOpenNewPayrollDialog = () =>{
        setNewPayrollDialogOpen(true);
    }
    const handleCloseNewPayrollDialog = () =>{
        setNewPayrollDialogOpen(false);
    }

    useEffect(()=>{
        fetchEmployeePayrollHistory();
    },[])
    return(
        <Paper sx={{p:2}}>
            <Box>
                <Button 
                onClick={handleOpenNewPayrollDialog} 
                variant="contained" 
                startIcon={<Add/>}>Ajouter</Button>
            </Box>
            <Table className="table table-striped mt-3">
                <TableHead>
                    <TableRow>
                        <TableCell><b>ID de l'execution</b></TableCell>
                        <TableCell><b>Mois</b></TableCell>
                        <TableCell><b>Année</b></TableCell>
                        <TableCell><b>Date de l'execution</b></TableCell>
                        <TableCell><b>Nombre de pages traités</b></TableCell>
                        <TableCell><b>Nombre d'operations réussi</b></TableCell>
                        <TableCell><b>Nombre d'operations échoué</b></TableCell>
                        <TableCell><b>Status</b></TableCell>
                    </TableRow>
                </TableHead>
                {loading && payrollsHistory.length === 0 && (
                    <CircularProgress/>
                )}
                {!loading && payrollsHistory.length !== 0 && (
                    <TableBody>
                        {payrollsHistory.map((history) =>(
                            <TableRow>
                                <TableCell>{history?.payrollHistoryId}</TableCell>
                                <TableCell>{history?.payrollMonth}</TableCell>
                                <TableCell>{history?.payrollYear}</TableCell>
                                <TableCell>{LocalDateTimeMapper(history?.executionDate)}</TableCell>
                                <TableCell>{history?.totalPayrolls}</TableCell>
                                <TableCell style={{ color : "green", fontWeight : "bold"}}>{history?.succeededPayrolls}</TableCell>
                                <TableCell style={{ color : "red", fontWeight : "bold"}}>{history?.failedPayrolls}</TableCell>
                                <TableCell>{(()=>{
                                    const {label, bgColor} = mapPayrollStatus(history?.status)
                                    return <span className={`badge ${bgColor}`}>{label}</span>
                                })}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                )}
                
            </Table>
            <NewPayrollDialog 
            open={newPayrollDialogOpen} 
            onClose={handleCloseNewPayrollDialog}/>
        </Paper>
    )
}