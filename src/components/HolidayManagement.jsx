import { useEffect, useState } from "react"
import {  CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { HolidayUpdateDialog } from "../dialogs/HolidayUpdateDialog";
import { mapHolidayStatus } from "../utils/HolidayStatusMapper";
import { LocalDateTimeMapper } from "../utils/LocalDateTimeMapper";
import { getAllHolidays } from "../services/HolidayService";

export const HolidayManagement = ()=>{

    const [holidays, setHolidays] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedHoliday, setSelectedHoliday] = useState(null);
    const [holidayUpdateDialogOpen, setHolidayUpdateDialogOpen] = useState(false);

    /**
     * 
     */
    const fetchHolidays = async()=>{
        try {
            setLoading(true);
            const response = await getAllHolidays();
            setHolidays(response?.holidays);
            setTotalCount(response?.totalCount);
        }catch (err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    const handleOpenEditHoliday = (holiday)=>{
        setSelectedHoliday(holiday);
        setHolidayUpdateDialogOpen(true);
    }

    const handleCloseEditHoliday = ()=>{
        setSelectedHoliday(null);
        setHolidayUpdateDialogOpen(false);
    }
    useEffect(()=>{
        fetchHolidays();
    },[])
    return(
       <Paper sx={{p:2}}>

        {loading && holidays.length === 0 && (
            <CircularProgress/>
        )}

        {!loading && holidays.length !== 0 && (
            <>
              <Table className="table table-striped">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell><b>Date de début</b></TableCell>
                        <TableCell><b>Date de fin</b></TableCell>
                        <TableCell><b>Nombre de jours</b></TableCell>
                        <TableCell><b>Dernier changement</b></TableCell>
                        <TableCell><b>Status</b></TableCell>
                        <TableCell><b>Actions</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {holidays.map((h)=> {
                        const {label, color} = mapHolidayStatus(h?.status);
                        return(
                        <TableRow key={h?.id}>
                            <TableCell>{h?.name}</TableCell>
                            <TableCell>{LocalDateTimeMapper(h?.startDate)}</TableCell>
                            <TableCell>{LocalDateTimeMapper(h?.endDate)}</TableCell>
                            <TableCell>{h?.leaveDays}</TableCell>
                            <TableCell>{LocalDateTimeMapper(h?.lastUpdate)}</TableCell>
                            <TableCell>
                                <span className={`badge ${color}`}>{label}</span>
                            </TableCell>
                            <TableCell>
                                <Tooltip title="Modifier">
                                    <IconButton onClick={()=> handleOpenEditHoliday(h)}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Supprimer">
                                    <IconButton color="error">
                                        <DeleteForeverIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                        )
                    })}
                </TableBody>
                <div className="col-xl-12 d-flex" style={{
                    justifyContent : "end"
                }}>
                    <p>Total: {totalCount} jours</p>
                </div>
              </Table>
            </>
        )}
        <HolidayUpdateDialog 
        open={holidayUpdateDialogOpen} 
        holiday={selectedHoliday} 
        onSuccess={fetchHolidays}
        onClose={handleCloseEditHoliday}/>
       </Paper>
    )
}