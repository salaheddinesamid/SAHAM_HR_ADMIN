import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Chip,
  Divider,
  Box,
  Card,
  CardContent,
  Tooltip,
  IconButton
} from "@mui/material";
import { X } from "lucide-react";

export const EmployeeDetailsDialog = ({ employee, open, onClose }) => {

  if (!employee) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            {employee.fullName}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose} // This is crucial!
            sx={{ color: (theme) => theme.palette.grey[500] }}>
                <X />
            </IconButton>
        </DialogTitle>

      <DialogContent>
        <Section title="Informations personnelles">
          <Grid container spacing={2}>
            <Info label="Nom" value={employee?.lastName} />
            <Info label="Prénom" value={employee?.firstName} />
            <Info label="CIN" value={employee?.cin} />
            <Info label="Nationalité" value={employee?.nationality} />
            <Info label="Date de naissance" value={employee?.birthDate} />
            <Info label="Email" value={employee.email} />

            <Info label="Situation Familiale" value={employee.familyStatus} />
            <Info label="Matricule" value={employee.matriculation} />
          </Grid>
        </Section>

        <Section title="Informations professionnelles">
          <Grid container spacing={2}>
            <Info label="Entité" value={employee.entity} />
            <Info label="Poste" value={employee.occupation} />
            <Info label="Manager" value={employee.managerName || "-"} />
            <Info label="Date d’embauche" value={employee.joinDate} />
          </Grid>
        </Section>
        {employee.balanceDetails && (
          <Section title="Solde de congé">
            <Grid container spacing={2}>
              <BalanceCard label="Annuel" value={employee.balanceDetails.annualBalance} />
              <BalanceCard label="Utilisé" value={employee.balanceDetails.usedBalance} />
              <BalanceCard label="Actuel" value={employee.balanceDetails.currentBalance} />
              <BalanceCard label="Restant" value={employee.balanceDetails.reminderBalance} />
            </Grid>
          </Section>
        )}

      </DialogContent>
    </Dialog>
  );
};
const Section = ({ title, children }) => (
  <Box mb={3}>
    <Typography variant="subtitle1" fontWeight={600} mb={1}>
      {title}
    </Typography>
    <Divider sx={{ mb: 2 }} />
    {children}
  </Box>
);
const Info = ({ label, value }) => (
  <Grid item xs={12} sm={6}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={500}>
      {value || "-"}
    </Typography>
  </Grid>
);
const BalanceCard = ({ label, value }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Card variant="outlined">
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h6" fontWeight={600}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
);
