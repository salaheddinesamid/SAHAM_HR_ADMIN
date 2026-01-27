import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, styled, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { payrollDateParser } from "../utils/PayrollUtils";
import { CloudUpload } from "lucide-react";
import axios from "axios";
import LinearWithValueLabel from "../components/PercentageProgress";

export const NewPayrollDialog = ({open, onClose, onSuccess})=>{
    // Selected month of the payroll
    const [selectedMonth, setSelectedMonth] = useState(0);
    // Selected year of the payroll
    const [selectedYear, setSelectedYear] = useState(0);
    const [payrollFile, setPayrollFile] = useState(null);
    const [progress, setProgress] = useState(0);
    /**
     * 
     * @param {*} e 
     */
    const handleDateChange = (e) =>{
        const date = e.target.value;
        const {year, month, day} = payrollDateParser(date);
        setSelectedMonth(month);
        setSelectedYear(year);
    }
    /**
     * Handle Payroll file change
     * @param {*} e 
     */
    const handleFileChange = (e) =>{
        const file = e.target.files[0];
        setPayrollFile(file);
    }
    /**
     * 
     */
    const handleSubmit = async() =>{
        try{
            setProgress(0);
            // construct key-value request body
            const month = parseInt(selectedMonth);
            const year = parseInt(selectedYear);
            const formData = new FormData();
            formData.append("file", payrollFile);
            
            await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/api/v1/payrolls/upload`,
                formData,
                {
                    params: {
                        month: month,
                        year: year,
                },
                onUploadProgress: (event) => {
                    if (!event.total) return;
                    const percent = Math.round((event.loaded * 80) / event.total);
                    setProgress(percent);
                },
            });
            setProgress(100);
        }catch (err){
            console.log(err);
        }
    }
    const DocumentUploader = ()=>{
        const VisuallyHiddenInput = styled("input")({
            clip: "rect(0 0 0 0)",
            clipPath: "inset(50%)",
            height: 1,
            overflow: "hidden",
            position: "absolute",
            bottom: 0,
            left: 0,
            whiteSpace: "nowrap",
            width: 1
        });

        return (
            <div className="row mb-3">
                <div className="col-xl-12">
                    <Button style={{
                        marginBottom : 30
                    }}
                    component = "label"
                    variant="contained"
                    startIcon = {<CloudUpload/>}
                    fullWidth
                    >
                        Veuillez uploader la fiche des Bulletins de paie
                        <VisuallyHiddenInput type="file" accept=".pdf" onChange={handleFileChange}/>
                    </Button>
                    {payrollFile && (
                        <Typography>
                            Selected File : {payrollFile.name}
                        </Typography>
                    )}
                </div>
            </div>
        )
    }
    return(
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle>Nouvelle Fiche des Bulettins de paie</DialogTitle>
            <DialogContent>
                <Box display="grid" gap={2} mt={1}>
                    <Typography></Typography>
                    <TextField label="Selectionnez la date" type="date" InputLabelProps={{shrink : true}} onChange={handleDateChange}/>
                    <DocumentUploader/>
                </Box>
                <Box>
                    <LinearWithValueLabel progress={progress}/>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Annuler</Button>
                <Button onClick={handleSubmit}>Valider</Button>
            </DialogActions>
        </Dialog>
    )
}