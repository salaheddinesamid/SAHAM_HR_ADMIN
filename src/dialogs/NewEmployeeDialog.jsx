import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Box,
  Divider,
  InputAdornment,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { addEmployee, verifyManager } from "../services/EmployeeService";

export const NewEmployeeDialog = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [managerExists, setManagerExists] = useState(null);

  const [requestDto, setRequestDto] = useState({
    firstName: "",
    lastName: "",
    matriculation: "",
    entity: "",
    occupation: "",
    managerName: "",
    joinDate : "",
    roles: [],
    employeeBalance: {
      year: new Date().getFullYear(),
      annualBalance: 0,
      accumulatedBalance: 0,
      usedBalance: 0,
    },
  });

  const roles = [
    { id: 1, name: "ADMIN", label: "Admin" },
    { id: 2, name: "EMPLOYEE", label: "Collaborateur" },
    { id: 3, name: "MANAGER", label: "Manager" },
    { id: 4, name: "HR", label: "RH" },
  ];


  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequestDto((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleRoleChange = (roleName) => {
    setRequestDto((prev) => ({
      ...prev, // keep the previous objects
      roles: prev.roles.includes(roleName) // update the roles
        ? prev.roles.filter((r) => r !== roleName) // if the role already included, remove it
        : [...prev.roles, roleName], // otherwise, the new role will be pushed
    }));
  };

  useEffect(() => {
    if (!requestDto.managerName) {
      setManagerExists(null);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const res = await verifyManager(requestDto.managerName);
        setManagerExists(res === true);
      } catch {
        setManagerExists(false);
      } finally {
        setSearchLoading(false);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [requestDto.managerName]);

  //const isPasswordValid = 

  const isFormValid =
    requestDto.firstName &&
    requestDto.lastName &&
    requestDto.matriculation &&
    requestDto.entity &&
    requestDto.occupation &&
    requestDto.roles.length > 0 &&
    managerExists === true;


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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Box display="grid" gap={2} mt={1}>

          <Typography fontWeight={600}>Informations personnelles</Typography>

          <TextField label="Prénom" name="firstName" onChange={handleChange} required />
          <TextField label="Nom" name="lastName" onChange={handleChange} required />
          <TextField label="Matriculation" name="matriculation" onChange={handleChange} required />
          <TextField label="Entité" name="entity" onChange={handleChange} required />
          <TextField label="Poste" name="occupation" onChange={handleChange} required />
          <TextField label="Date de joindre" type="date" InputLabelProps={{ shrink: true }} variant="outlined" name="joinDate" onChange={handleChange} required />
          <TextField label="E-mail" type="email" name="email" onChange={handleChange} required />
          <TextField label="Mot de passe" type="password" name="password" onChange={handleChange} required />
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
                    checked={requestDto.roles.includes(role.name)}
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
            value={requestDto.employeeBalance.year}
            onChange={handleBalanceChange}
          />
          <TextField label="Solde annuel" name="annualBalance" type="number"
            value={requestDto.employeeBalance.annualBalance}
            onChange={handleBalanceChange}
          />
          <TextField label="Solde cumulé" name="accumulatedBalance" type="number"
            value={requestDto.employeeBalance.accumulatedBalance}
            onChange={handleBalanceChange}
          />
          <TextField label="Solde utilisé" name="usedBalance" type="number"
            value={requestDto.employeeBalance.usedBalance}
            onChange={handleBalanceChange}
          />

        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isFormValid || loading}
        >
          {loading ? <CircularProgress size={22} /> : "Créer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
