
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  Paper,
  Grid,
  Stack,
  DialogTitle,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useEffect, useState } from "react";
import countries from "../nationalities.json"
import { addEmployee, getAllManagers, verifyManager } from "../services/EmployeeService";

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
const roles = [
    { id: 1, name: "ADMIN", label: "Admin" },
    { id: 2, name: "EMPLOYEE", label: "Collaborateur" },
    { id: 3, name: "MANAGER", label: "Manager" },
    { id: 4, name: "HR", label: "RH" },
];
const familySituation = [
    { id : 1, name : "SINGLE", label : "Célibataire"},
    { id : 2, name : "MARRIED" , label : "Marié(e)"},
];

const genders = [
    { id : 1, name : "MALE", label : "Homme"},
    { id : 2, name : "FEMALE" , label : "Femme"},
]

export const NewEmployeeDialog = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);

  const fetchManagers = async() =>{
    try{
      const res = await getAllManagers();
      console.log(res);
      setManagers(res);
    }catch(err){
      console.log(err);
    }
  }
  // Employee Request details:
  const [requestDto, setRequestDto] = useState({
    firstName: "",
    lastName: "",
    sex : "",
    cin : "",
    birthDate : "",
    familyStatus : "",
    numberOfChildren : 0,
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
    employeeSocialDetailsDto : {
      cnssNumber : "",
      cimrNumber : "",
      insuranceNumber : "",
      insuranceProvider : "SANLAM"
    },
    // Employee Contact Details
    employeeContactDetailsDto : {
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

  // Handle change personal details
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequestDto((prev) => ({ ...prev, [name]: value }));
  };
  // Handle change the balance
  const handleBalanceChange = (e) => {
    const { name, value } = e.target;
    setRequestDto((prev) => ({
      ...prev,
      employeeBalance: {
        ...prev.employeeBalance,
        [name]: Math.max(0, Number(value)),
      },
    }));
  };
  /**
   * Handle change the professional details
   * @param {*} e 
   */
  const handleProfessionalDetailsChange = (e) =>{
    const {name, value} = e.target;
    setRequestDto((prev)=>(
      {...prev, professionalDetailsDto : {
        ...prev.professionalDetailsDto, [name] : value
      }}
    ))
  }
  /**
   * Handle change the social details of the employee
   * @param {*} e 
   */
  const handleSocialDetailsChange = (e) =>{
    const {name, value} = e.target;
    setRequestDto((prev)=>(
      {...prev, employeeSocialDetailsDto : {
        ...prev.employeeSocialDetailsDto, [name] : value
      }}
    ))
  }

  /**
   * Handle change contact details
   * @param {*} e 
   */
  const handleContactDetailsChange = (e) =>{
    const {name, value} = e.target;
    setRequestDto((prev)=>(
      {...prev, employeeContactDetailsDto : {
        ...prev.employeeContactDetailsDto, [name] : value
      }}
    ))
  }

  const handleRoleChange = (roleName) => {
    setRequestDto((prev) => ({
      ...prev, // keep the previous objects
      roles: prev.roles.includes(roleName) // update the roles
        ? prev.roles.filter((r) => r !== roleName) // if the role already included, remove it
        : [...prev.roles, roleName], // otherwise, the new role will be pushed
    }));
  };

  // Check if the professional email is valid
  const isEmailValid = () =>{
    if(!requestDto?.professionalDetailsDto?.professionalEmail){
      return;
    }
    const splitEmail = requestDto?.professionalDetailsDto?.professionalEmail.split("@");
    if(splitEmail[1].toLocaleLowerCase() !== "saham.com"){
      return false;
    }
    return true;
  }
  // Check if the form is valid
  const isFormValid =
    requestDto.firstName &&
    requestDto.lastName &&
    requestDto.matriculation &&
    requestDto.entity &&
    requestDto.occupation &&
    requestDto.roles.length > 0 &&
    requestDto.professionalDetailsDto.managerId !== null &&
    requestDto.professionalDetailsDto.joinDate !== null &&
    requestDto.professionalDetailsDto.matriculation !== null


  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await addEmployee(requestDto);
      console.log(requestDto);
      onSuccess?.();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  
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
                <Select value={requestDto.sex} name="sex" onChange={handleChange} displayEmpty>
                  <MenuItem disabled value="">Genre</MenuItem>
                     {genders.map((g)=>(
                  <MenuItem value={g.name}>{g.label}</MenuItem>
                  ))}
                </Select>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField label="CIN" name="cin" value={requestDto.CIN} onChange={handleChange} fullWidth required />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Select
                value={requestDto?.nationality}
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
                <Select
                value={requestDto.familySituation || ""}
                name="familySituation"
                displayEmpty
                onChange={handleChange}>
                   <MenuItem disabled value="">
                     Situation Familiale
                   </MenuItem>
                  {familySituation.map((s) => (
                    <MenuItem key={s.name} value={s.name}>
                      {s.label}
                    </MenuItem>))}
                </Select>
              </Grid>
            </Grid>
          </Paper>
          
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography fontWeight={600} mb={2}>
              Informations professionnelles
            </Typography>
            
            <Grid container spacing={2}>
              {[
                ["Matriculation Interne", "matriculation"],
                ["Poste", "occupation"],
                ["Département", "department"],
                ["Entité", "entity"],
                ["Manager Direct", "managerName"],
                ["Date d’embauche", "joinDate"],
                ["Site", "site"],
                ["Téléphone pro", "professionalPhoneNumber"],
                ["Fixe pro", "professionalFixedPhoneNumber"],
                ["Extension", "extension"],
                ["Email pro", "professionalEmail"],
              ].map(([label, name]) => (
                label === "Manager Direct" ? 
                <FormControl sx={{ minWidth: 160 }}>
                  <InputLabel id="manager-label">Manager Direct</InputLabel>
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
                    {managers.map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        {m.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                 : label === "Département" ? 
                 <FormControl sx={{ minWidth: 140 }}>
                  <InputLabel id="department-label">Département</InputLabel>
                  <Select name="department" value={requestDto.professionalDetailsDto.department} onChange={handleProfessionalDetailsChange}>
                    <MenuItem disabled value="">Département</MenuItem>
                      {departments.map((d)=>(
                    <MenuItem value={d.value}>{d.label}</MenuItem>
                  ))}
                 </Select>
                 </FormControl>
                 : label === "Date d’embauche" ? 
                 <FormControl sx={{ minWidth: 140 }}>
                  <TextField
                  label="Date d’embauche"
                  name="joinDate"
                  onChange={handleProfessionalDetailsChange}
                  value={requestDto.professionalDetailsDto.joinDate}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required/>
                 </FormControl>
                  :
                 label === "Entité" ? 
                 <FormControl sx={{ minWidth: 140 }}>
                  <InputLabel id="entity-label">Entité</InputLabel>
                  <Select name="entity" value={requestDto.professionalDetailsDto.entity} onChange={handleProfessionalDetailsChange}>
                    <MenuItem disabled value="">Département</MenuItem>
                       {entities.map((e)=>(
                    <MenuItem value={e.value}>{e.label}</MenuItem>
                  ))}
                 </Select>
                 </FormControl>
                 : name === "professionalEmail" ? 
                 <FormControl sx={{ minWidth: 140 }}>
                  <TextField
                  label="Email professionelle"
                  name="professionalEmail"
                  onChange={handleProfessionalDetailsChange}
                  value={requestDto.professionalDetailsDto.professionalEmail}
                  type="email"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required/>
                  {!isEmailValid()  ? <p style={{color : 'red'}}>Veuillez saisir une adresse e-mail valide appartenant au domaine (SAHAM).</p> : null}
                 </FormControl>
                  :
                 <Grid item xs={12} md={12} key={name}>
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
                <TextField label="N° CNSS" fullWidth name="cnssNumber" value={requestDto.employeeSocialDetailsDto.cnssNumber} onChange={handleSocialDetailsChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="N° CIMR" fullWidth name="cimrNumber" value={requestDto.employeeSocialDetailsDto.cimrNumber} onChange={handleSocialDetailsChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Mutuelle / Assurance santé" fullWidth name="insuranceNumber" value={requestDto.employeeSocialDetailsDto.insuranceNumber} onChange={handleSocialDetailsChange}/>
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
                  checked={requestDto.roles.includes(role.name)}
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
                <TextField label="Personne à contacter en cas d’urgence" fullWidth name="personToCallInCaseOfEmergency" value={requestDto.employeeContactDetailsDto.personToCallInCaseOfEmergency} onChange={handleContactDetailsChange} />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField label="Téléphone d’urgence" fullWidth name="emergencyContactNumber" value={requestDto.employeeContactDetailsDto.emergencyContactNumber} onChange={handleContactDetailsChange} />
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Annuler
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!isFormValid}>
          {loading ? <CircularProgress size={22} /> : "Créer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
