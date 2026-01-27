import { Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, Divider, FormControlLabel, InputAdornment, TextField, Typography } from "@mui/material";
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react"
import { updateEmployee, verifyManager } from "../services/EmployeeService";

export const EmployeeModificationDialog = ({employee, setEmployee, open, onClose, onSuccess, roles})=>{

    const [requestDto, setRequestDto] = useState({})
    const [searchLoading, setSearchLoading] = useState(false);
    const [managerExists, setManagerExists] = useState(false);
    const [loading, setLoading] = useState(false);
    /**
     * 
     * @param {*} e 
     */
    const handleChange = (e)=>{
        const {name, value} = e.target;
        // update the employee details only visually
        setEmployee((prev)=>(
            {...prev, [name] : value}
        ))
        // update the request dto
        setRequestDto((prev)=>(
            {...prev, [name] : value}
        ))
    }
    /**
     * 
     * @param {*} roleName 
     */
    const handleRoleChange = (roleName)=>{
        const updatedRoles = employee?.roles.includes(roleName) ? employee?.roles.filter((r)=> r!== roleName) : [...employee.roles, roleName];
        setEmployee((prev)=>(
            {...prev, roles : updatedRoles}
        ))
        setRequestDto((prev)=>(
            {...prev, roles : updatedRoles}
        ))
        
    }
    /**
     * 
     * @param {*} e 
     */
    const handleBalanceChange = (e)=>{
        const {name, value} = e.target;

        setEmployee((prev)=>(
            {...prev, balanceDetails : {
                ...prev.balanceDetails, [name] : Math.max(0, Number(value))
            }}
        ))
        setRequestDto((prev)=>(
            {...prev, employeeBalance : {
                ...prev.employeeBalance, [name] : Math.max(0, Number(value))
            }}
        ))
    }
    /**
     * 
     */
    const handleSubmit = async()=>{
        try{
            setLoading(true);
            
            const res = await updateEmployee(
                employee?.employeeId, requestDto
            );
            if(res === 200){
                open = false;
                onSuccess();
            }
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(!requestDto.managerName){
            setManagerExists(null);
            return;
        }
        const timeOut = setTimeout(async ()=>{
            try{
                setSearchLoading(true);
                const res = await verifyManager(requestDto?.managerName);
                setManagerExists(res === true);
            }catch(err){
                setManagerExists(false);
            }finally{
                setSearchLoading(false);
            }
        })

        return ()=> clearTimeout(timeOut);
    },[requestDto.managerName])

    return(
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogContent>
                <Box display="grid" gap={2} mt={1}>
                    <Typography fontWeight={600}>Informations personnelles</Typography>
                        <TextField label="Prénom" name="firstName" value={employee?.firstName} onChange={handleChange} required />
                        <TextField label="Nom" name="lastName" value={employee?.lastName} onChange={handleChange} required />
                        <TextField label="Matriculation" name="matriculation" value={employee?.matriculation} onChange={handleChange} required />
                        <TextField label="Entité" name="entity" onChange={handleChange} InputLabelProps={{ shrink: true }} value={employee?.entity} required />
                        <TextField label="Poste" name="occupation" onChange={handleChange} InputLabelProps={{ shrink: true }} value={employee?.occupation} required />
                        <TextField label="Date de joindre" type="date" InputLabelProps={{ shrink: true }} variant="outlined" name="joinDate" onChange={handleChange} required />
                        <TextField label="E-mail" type="email" name="email" autoComplete={false} onChange={handleChange} value={employee?.email} required />
                        <TextField label="Mot de passe" type="password" name="password" onChange={handleChange} value={""} required />
                        <TextField
                            label="Manager"
                            name="managerName"
                            onChange={handleChange}
                            required
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  {searchLoading && <CircularProgress size={18} />}
                                  {managerExists === true && <CheckCircle color="green" size={18} />}
                                  {managerExists === false && <XCircle color="red" size={18} />}
                                </InputAdornment>
                              ),
                            }}
                            helperText={
                              managerExists === false
                                ? "Ce manager n'existe pas"
                                : " "
                            }
                          />
                        <Box>
                            <Typography fontWeight={600}>Rôles</Typography>
                            {roles.map((role) => (
                              <FormControlLabel
                                key={role.id}
                                control={
                                  <Checkbox
                                    checked={requestDto?.roles?.includes(role.name)}
                                    onChange={() => handleRoleChange(role.name)}
                                  />
                                }
                                label={role.label}
                              />
                            ))}
                        </Box>
                        <Divider />
                        <Typography fontWeight={600}>Solde du collaborateur</Typography>
                        <TextField label="Année" name="year" type="number"
                            value={employee?.balanceDetails?.year}
                            onChange={handleBalanceChange}
                          />
                        <TextField label="Solde annuel" name="annualBalance" type="number"
                            value={employee?.balanceDetails?.annualBalance}
                            onChange={handleBalanceChange}
                        />
                        
                        <TextField label="Solde cumulé" name="accumulatedBalance" type="number"
                            value={employee?.balanceDetails?.accumulatedBalance}
                            onChange={handleBalanceChange}
                        />
                        
                        <TextField label="Solde utilisé" name="usedBalance" type="number"
                            value={employee?.balanceDetails?.usedBalance}
                            onChange={handleBalanceChange}
                        />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Annuler</Button>
                <Button onClick={handleSubmit}>
                    {loading ? <CircularProgress size={22}/> : "Modifier"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}