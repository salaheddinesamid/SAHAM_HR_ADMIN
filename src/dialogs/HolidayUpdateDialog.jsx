import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { updateHoliday } from "../services/HolidayService";

export const HolidayUpdateDialog = ({holiday, open, onClose, onSuccess})=>{
    const [requestDto, setRequestDto] = useState({
        name : "",
        startDate : "",
        endDate : "",
        leaveDays : 0
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    /**
     * 
     * @param {*} e 
     */
    const handleChange = (e)=>{
        let {name, value} = e.target;
        if(name === "leaveDays"){
            value = parseInt(value); // parse the value into a integer
        }
        setRequestDto((prev)=>(
            {...prev, [name] : value}
        ))
    }

    /**
     * 
     */
    const handleSubmit = async()=>{
        try{
            setLoading(true);
            const res = await updateHoliday(requestDto?.name,requestDto);
            console.log(requestDto);
            setSuccess(true);
            setTimeout(()=>{
                onSuccess();
            }, 3000)
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
            cleanDto();
            onClose();
        }
    }

    const cleanDto = ()=>{
        setRequestDto({
            name : "",
            date : "",
            leaveDays : 0
        })
    }

    useEffect(()=>{
        setRequestDto({
            name : holiday?.name,
            date : holiday?.date,
            leaveDays : holiday?.leaveDays
        })
    },[holiday])

    return(
        <Dialog open={open} fullWidth>
            <DialogTitle></DialogTitle>
            <DialogContent>
                <Box display="grid" gap={2} mt={1}>
                    <TextField label="Nom de jour ferié" type="text" value={requestDto.name} onChange={handleChange}/>
                    <TextField label="Date de début" type="date" InputLabelProps={{ shrink: true }} name="startDate" value={requestDto.startDate} onChange={handleChange}/>
                    <TextField label="Date de fin" type="date" InputLabelProps={{ shrink: true }} name="endDate" value={requestDto.endDate} onChange={handleChange}/>
                    <TextField label="Nombre des jours" type="number" value={requestDto.leaveDays} name="leaveDays" onChange={handleChange}/>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Annuler</Button>
                <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                >
                    {loading ? <CircularProgress size={22} /> : "Modifier"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}