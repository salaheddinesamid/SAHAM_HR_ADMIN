import { Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, Grid,  MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import countries from "../nationalities.json"
import { useEffect, useState } from "react"
import { getAllManagers, updateEmployee} from "../services/EmployeeService";


export const EmployeeModificationDialog = ({employee, setEmployee, open, onClose, onSuccess, roles})=>{

    const [requestDto, setRequestDto] = useState({
        firstName: employee?.firstName,
        lastName: employee?.lastName,
        CIN : employee?.CIN,
        birthDate : employee?.birthDate,
        familyStatus : employee?.familyStatus,
        numberOfChildren : employee?.numberOfChildren,
        nationality : employee?.nationality,
        roles: employee?.roles,
        // Employee Professional Details
        professionalDetailsDto : {
            matriculation : employee?.professionalDetails?.matriculation,
            occupation : employee?.professionalDetails?.occupation,
            department : employee?.professionalDetails?.department,
            entity : employee?.professionalDetails?.entity,
            managerId : employee?.professionalDetails.managerId,
            joinDate : "",
            site : '',
            professionalPhoneNumber : "",
            professionalEmail : "",
            professionalFixedPhoneNumber : "",
            extension : ""
        },
        // Employee Social Details
        socialDetailsDto : {
            cnssNumber : "",
            cimrNumber : "",
            insuranceNumber : "",
            insuranceProvider : "SANLAM"
        },
        // Employee Contact Details
        contactDetailsDto : {
            personToCallInCaseOfEmergency : "",
            emergencyContactNumber : ""
        },
        // Employee Balance Details
        employeeBalance: {
            year: new Date().getFullYear(),
            annualBalance: 0,
            accumulatedBalance: 0,
            usedBalance: 0,
        },
    });

    const familySituation = [
        { id : 1, name : "SINGLE", label : "Célibataire"},
        { id : 1, name : "MARRIED" , label : "Marié(e)"},
    ]

    const handleProfessionalDetailsChange = (e) =>{
        const {name, value} = e.target;
        setRequestDto((prev)=>({
            ...prev, professionalDetailsDto : {
                ...prev.professionalDetailsDto, [name] : value
            }
        }))
    }
    const handleSocialDetailsChange = (e) =>{
        const {name, value} = e.target;
        setRequestDto((prev)=>({
            ...prev, socialDetailsDto : {
                ...prev.socialDetailsDto, [name] : value
            }
        }))
    }
    const handleContactDetailsChange = (e) =>{
        const {name, value} = e.target;
        setRequestDto((prev)=>({
            ...prev, contactDetailsDto : {
                ...prev.contactDetailsDto, [name] : value
            }
        }))
    }
    const [updatedFields, setUpdatedFields] = useState({});
    const [managers, setManagers] = useState([]);
    const [error, setError] = useState("");
    const [udpateSuccess, setUpdateSuccess] = useState(); 
    const [loading, setLoading] = useState(false);

    const fetchManagers = async() =>{
        try {
            const res = await getAllManagers();
            setManagers(res);
        }catch (err){
            console.log(err);
        }finally{
            
        }
    }
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
            //const request = requestDto.
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
        fetchManagers();
    },[])

   return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>On-boarding</DialogTitle>
      <DialogContent sx={{ bgcolor: "#f7f8fa" }}>
        <Stack spacing={3} mt={1}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography fontWeight={600} mb={2}>
              Informations personnelles
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField label="Prénom" name="firstName" value={requestDto.firstName} onChange={handleChange} fullWidth required />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField label="Nom" name="lastName" value={requestDto.lastName} onChange={handleChange} fullWidth required />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField label="CIN" name="CIN" value={requestDto.CIN} onChange={handleChange} fullWidth required />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Select
                value={requestDto.nationality}
                onChange={handleChange}
                name="nationality"
                displayEmpty
                >
                  <MenuItem disabled value="">
                  Nationalité
                </MenuItem>
                {countries.map((c)=>(
                  <MenuItem key={c.code} value={c.name}>{c.name}</MenuItem>
                ))}
                </Select>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                label="Date de naissance"
                name="birthDate"
                onChange={handleChange}
                value={requestDto.birthDate}
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                required/>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField 
                label="Nombre d’enfants" 
                type="number" name="numberOfChildren" 
                fullWidth 
                value={requestDto.numberOfChildren} 
                onChange={(e)=> setRequestDto((prev)=> ({...prev, ["numberOfChildren"] : parseInt(e.target.value)}))} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                label="Nombre d’enfants" 
                type="number" name="numberOfChildren" 
                fullWidth 
                value={requestDto.numberOfChildren} 
                onChange={(e)=> setRequestDto((prev)=> ({...prev, ["numberOfChildren"] : parseInt(e.target.value)}))} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <select
                className="form-select"
                style={{ fontSize: "12px" }}
                value={requestDto.familySituation || ""}
                name="familySituation"
                onChange={handleChange}>
                  <option value="">Situation familiale</option>
                  {familySituation.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.label}
                    </option>))}
                </select>
              </Grid>
            </Grid>
          </Paper>
          
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography fontWeight={600} mb={2}>
              Informations professionnelles
            </Typography>
            
            <Grid container spacing={2}>
              {[
                ["Poste", "occupation"],
                ["Département", "department"],
                ["Entité", "entity"],
                ["Manager Direct", "managerName"],
                ["Site", "site"],
                ["Téléphone pro", "professionalPhoneNumber"],
                ["Fixe pro", "professionalFixedPhoneNumber"],
                ["Extension", "extension"],
                ["Email pro", "professionalEmail"],
              ].map(([label, name]) => (
                label === "Manager Direct" ? 
                  <Select
                  fullWidth
                  value={requestDto.professionalDetailsDto.managerId || ""}
                  name="managerId"
                  onChange={(e) => {
                    setRequestDto(prev => ({
                      ...prev,
                      professionalDetailsDto: {
                        ...prev.professionalDetailsDto,
                        managerId: e.target.value
                      }
                    }));
                  }}>
                    <MenuItem value="">
                      <em>Select the Manager</em>
                    </MenuItem>
                    {managers.map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        {m.fullName}
                      </MenuItem>
                    ))}
                  </Select>

                 : <Grid item xs={12} md={12} key={name}>
                  <TextField
                  label={label}
                  name={name}
                  fullWidth
                  required
                  onChange={handleProfessionalDetailsChange}/>
                </Grid>
              ))}
            </Grid>
          </Paper>
          
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography fontWeight={600} mb={2}>
              Informations administratives & sociales
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField label="N° CNSS" fullWidth name="cnssNumber" value={requestDto.socialDetailsDto.cnssNumber} onChange={handleSocialDetailsChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="N° CIMR" fullWidth name="cimrNumber" value={requestDto.socialDetailsDto.cimrNumber} onChange={handleSocialDetailsChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Mutuelle / Assurance santé" fullWidth name="insuranceNumber" value={requestDto.socialDetailsDto.insuranceNumber} onChange={handleSocialDetailsChange}/>
              </Grid>
            </Grid>
          </Paper>
          
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography fontWeight={600} mb={1}>
              Rôles
            </Typography>
            
            <Stack direction="row" spacing={2} flexWrap="wrap">
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
            </Stack>
          </Paper>
          
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography fontWeight={600} mb={2}>
              Solde du collaborateur
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField label="Année" type="number" fullWidth name="year" value={requestDto.employeeBalance.year} onChange={handleBalanceChange} />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <TextField label="Solde annuel" type="number" fullWidth name="annualBalance" value={requestDto.employeeBalance.annualBalance} onChange={handleBalanceChange}/>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <TextField label="Solde cumulé" type="number" fullWidth name="accumulatedBalance" value={requestDto.employeeBalance.accumulatedBalance} onChange={handleBalanceChange}/>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField label="Solde utilisé" type="number" fullWidth name="usedBalance" value={requestDto.employeeBalance.usedBalance} onChange={handleBalanceChange}/>
              </Grid>
            </Grid>
          </Paper>
          
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography fontWeight={600} mb={2}>
              Urgence & contact
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField label="Personne à contacter en cas d’urgence" fullWidth name="personToCallInCaseOfEmergency" value={requestDto.contactDetailsDto.personToCallInCaseOfEmergency} onChange={handleContactDetailsChange} />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField label="Téléphone d’urgence" fullWidth name="emergencyContactNumber" value={requestDto.contactDetailsDto.emergencyContactNumber} onChange={handleContactDetailsChange} />
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Annuler
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {loading ? <CircularProgress size={22} /> : "Créer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}