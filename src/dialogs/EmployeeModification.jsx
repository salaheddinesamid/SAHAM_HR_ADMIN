import { Alert, Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, Grid,  InputLabel,  MenuItem, Paper, Select, Snackbar, Stack, TextField, Typography } from "@mui/material";
import countries from "../nationalities.json"
import { useEffect, useState } from "react"
import { getAllManagers, updateEmployee} from "../services/EmployeeService";
import { CheckIcon, TriangleAlert } from "lucide-react";

const departments = [
    { id : 1, label : "Département financier", value : "FINANCE_DEPARTMENT"},
    { id : 2, label : "Département juridique", value : "LEGAL_DEPARTMENT" },
    { id : 3, label : "Département informatique", value : "IT"},
    { id : 4, label : "Département ressources humaines", value : "HUMAN_RESOURCES_DEPARTMENT" },
    { id : 5, label : "Opérations", value : "OPERATIONS"},
    { id : 6, label : "Asset management", value : "ASSET_MANAGEMENT" },
    { id : 7, label : "Cabinet du DG", value : "CEO_OFFICE" },
    { id : 8, label : "Surveillance bancaire", value : "BANKING_SUPERVISION" },
]
const entities  = [
    { id : 1, label : "SAHAM Horizon", value : "SAHAM_HORIZON"},
    { id : 2, label : "SAHAM Finances", value : "SAHAM_FINANCES"},
    { id : 3, label : "SAHAM Foundation", value : "SAHAM_FOUNDATION"}
]

export const EmployeeModificationDialog = ({employee, setEmployee, open, onClose, onSuccess, roles})=>{
  // List of managers
  const [managers, setManagers] = useState([]);  
  const [requestDto, setRequestDto] = useState({
        firstName: "",
        lastName:"",
        cin : "",
        birthDate : "",
        familyStatus : "",
        numberOfChildren : "",
        nationality : "",
        roles: [],
        // Employee Professional Details
        professionalDetailsDto : {
            matriculation : "",
            occupation : "",
            department : "",
            entity : "",
            managerId : null,
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
  // Request payload
  const [payload, setPayload] = useState({})
  // Update request status
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState(null);
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
     * Handle change the personal details
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
        setPayload((prev)=>({
          ...prev, [name] : value
        }))
    }
    /**
     * Handle change the roles
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
     * Handle change the balance details
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

    // Filter the updated fields in the social details
    const filterSocialDetails = () =>{
      const dto = requestDto?.socialDetailsDto || {};
      const socialDetails = employee?.socialeDetails || {};
      
      const filteredDto = Object.fromEntries(
        Object.entries(dto).filter(
          ([key, value]) => value !== socialDetails[key]
        )
      );
      if (Object.keys(filteredDto).length > 0) {
        setPayload((prev) => ({
          ...prev,
          socialDetailsDto: filteredDto
        }));
      }
    }
    // Filter the updatde fields in the professional details
    const filterProfessionalDetails = () => {
      const dto = requestDto?.professionalDetailsDto || {};
      const professionalDetails = employee?.professionalDetails || {};
      
      const filteredDto = Object.fromEntries(
        Object.entries(dto).filter(
          ([key, value]) => value !== professionalDetails[key]
        )
      );
      if (Object.keys(filteredDto).length > 0) {
        setPayload((prev) => ({
          ...prev,
          professionalDetailsDto: filteredDto
        }));
      }
      
    };
    /**
     * Submit the request to the server
     */
    const handleSubmit = async () => {
  try {
    setLoading(true);

    const res = await updateEmployee(employee?.employeeId, payload);

    if (res === 200) {
      setUpdateSuccess(true);

      // Wait 3.5 seconds before closing
      setTimeout(() => {
        onSuccess();
        onClose();
        setUpdateSuccess(false); // reset AFTER closing
      }, 3500);
    }

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
    useEffect(()=>{
      setRequestDto(
        {
        firstName: employee?.firstName,
        lastName: employee?.lastName,
        cin : employee?.cin,
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
            joinDate : employee?.professionalDetails.joinDate,
            site : employee?.professionalDetails.site,
            professionalPhoneNumber : employee?.professionalDetails.professionalPhoneNumber,
            professionalEmail : "",
            professionalFixedPhoneNumber : employee?.professionalDetails.professionalFixedPhoneNumber,
            extension : employee?.professionalDetails.extension
        },
        // Employee Social Details
        socialDetailsDto : {
            cnssNumber : employee?.socialDetails?.cnssNumber,
            cimrNumber : employee?.socialDetails?.cimrNumber,
            insuranceNumber : employee?.socialDetails?.insuranceNumber,
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
        }
        }
      )
    },[employee])

    useEffect(()=>{
        fetchManagers();
    },[])

    useEffect(()=>{
      // filter the request dto
      filterProfessionalDetails();
      filterSocialDetails();
    },[requestDto])

    useEffect(()=>{
      console.log(payload);
    },[payload])

   return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <Snackbar
        open={updateSuccess}
        autoHideDuration={4000}
        onClose={() => setUpdateSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          icon={<CheckIcon fontSize="inherit" />}
          sx={{ width: '100%' }}
        >
         Les informations ont été modifiées.
        </Alert>
      </Snackbar>
      <Snackbar
        open={error !== null}
        autoHideDuration={4000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="error" 
          icon={<TriangleAlert fontSize="inherit"/>}
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
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
                <TextField label="CIN" name="CIN" value={requestDto.cin} onChange={handleChange} fullWidth required />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Select
                value={employee?.nationality}
                onChange={handleChange}
                name="nationality"
                displayEmpty
                >
                  <MenuItem disabled>
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
                <select
                className="form-select"
                style={{ fontSize: "12px" }}
                value={requestDto.familyStatus || ""}
                name="familyStatus"
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
                  : name === "department" ? 
                  <FormControl sx={{ minWidth: 140 }}>
                    <InputLabel id="department-label">Département</InputLabel>
                    <Select name="department" value={requestDto.professionalDetailsDto.department} onChange={handleProfessionalDetailsChange}>
                      <MenuItem disabled value="">Département</MenuItem>
                      {departments.map((d)=>(
                        <MenuItem value={d.value}>{d.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  : name === "entity" ? 
                  <FormControl sx={{ minWidth: 140 }}>
                    <InputLabel id="entity-label">Entité</InputLabel>
                    <Select name="entity" value={requestDto.professionalDetailsDto.entity} onChange={handleProfessionalDetailsChange}>
                      <MenuItem disabled value="">Département</MenuItem>
                      {entities.map((e)=>(
                        <MenuItem value={e.value}>{e.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                 : <Grid item xs={12} md={12} key={name}>
                  <TextField
                  label={label}
                  name={name}
                  value={requestDto.professionalDetailsDto[name]}
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
                <TextField label="N° CNSS" fullWidth name="cnssNumber" value={requestDto?.socialDetailsDto?.cnssNumber} onChange={handleSocialDetailsChange} />
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
          {loading ? <CircularProgress size={22} /> : "Modifier"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}