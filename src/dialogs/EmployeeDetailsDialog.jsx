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
  Avatar,
  Button,
  IconButton,
  Icon
} from "@mui/material";
import { X } from "lucide-react";
import "../styles/EmployeeDetailsDialog.css"
import { useState } from "react";
import { reActivateAccount } from "../services/AuthService";

const icons = {
  close: "M18 6L6 18M6 6l12 12",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  briefcase: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  calendar: "M3 9h18M7 3v3M17 3v3M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z",
  lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  refresh: "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  leaf: "M2 22 L12 12 M12 2 C12 2 22 8 22 16 C22 20.4 18.4 22 14 22 C9.6 22 6 18.4 6 14 C6 10 8 7 12 2",
  chevronRight: "M9 18l6-6-6-6",
};
const tabs = [
  { id: "personal", label: "Informations personnelles", icon: icons.user },
  { id: "professional", label: "Informations professionnelles", icon: icons.briefcase },
  { id: "social", label: "Administratif & Social", icon: icons.leaf },
  { id: "account", label: "Compte & Activité", icon: icons.settings },
  { id: "security", label: "Sécurité", icon: icons.lock },
  { id: "balance", label: "Solde de congé", icon: icons.calendar },
];

const InfoCard = ({ label, value, mono }) => (
  <div className="info-card">
    <div className="info-label">{label}</div>
    <div className={`info-value ${mono ? "mono" : ""} ${!value ? "empty" : ""}`}>
      {value || "Non renseigné"}
    </div>
  </div>
);


export const EmployeeDetailsDialog = ({ employee, open, onClose }) => {
  const [activationLoading, setActivationLoading] = useState(false);
  const [activationError, setActivationError] = useState("");
  
  const [activeTab, setActiveTab] = useState("personal")
  if (!employee) return null; 

  const emp = employee;
  const pd = emp.professionalDetails || {};
  const sd = emp.socialDetails || {};
  const bd = emp.balanceDetails;

  const handleActivateAccount = async() =>{
    try{
      setActivationLoading(true);
      const employeeEmail = employee?.professionalDetails?.professionalEmail
      const res = await reActivateAccount(employeeEmail);
    }catch(err){
      setActivationError(err);
      console.log(err);
    }finally{
      setActivationLoading(false)
    }
  }
  
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xl" style={{height : "90%"}}>
      <DialogTitle
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >

        <Box display="flex" alignItems="center" gap={2}>
          
          <Avatar sx={{ width: 56, height: 56 }}>
            {employee.firstName?.charAt(0)}
          </Avatar>

          <Box>
            <Typography variant="h5" fontWeight="bold">
              {employee.fullName}
            </Typography>

            <Box display="flex" gap={1} mt={0.5}>
              
              <Chip
                label={!employee.accountActive ? "Compte verrouillé" : "Compte actif"}
                color={!employee.accountActive ? "error" : "success"}
                size="small"
              />

              {employee.role && (
                <Chip
                  label={employee.role}
                  color="secondary"
                  size="small"
                />
              )}
            </Box>
          </Box>

        </Box>

        <IconButton onClick={onClose}>
          <X />
        </IconButton>

      </DialogTitle>

      <DialogContent>
        <div className="row">
          <div className="col-xl-3">
            {tabs.map(tab => (
              <div
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon path={tab.icon} size={15} />
                <span>{tab.label}</span>
              </div>
            ))}
          </div>
          <div className="col-xl-8">
            {activeTab === "personal" && (
              <Section title="Informations personnelles">
                <div className="info-grid">
                  <InfoCard label="Nom de famille" value={emp.lastName} />
                  <InfoCard label="Prénom" value={emp.firstName} />
                  <InfoCard label="CIN" value={emp.cin} mono />
                  <InfoCard label="Nationalité" value={emp.nationality} />
                  <InfoCard label="Date de naissance" value={emp.birthDate} />
                  <InfoCard label="Email personnel" value={emp.email} />
                  <InfoCard label="Situation familiale" value={emp.familyStatus} />
                  <InfoCard label="Nombre d'enfants" value={emp.numberOfChildren?.toString()} />
                  <InfoCard label="Adresse" value={emp.address} />
                </div>
              </Section>
            )}

            {activeTab === "professional" && (
              <Section title="Informations professionnelles">
                <div className="info-grid">
                  <InfoCard label="Matriculation" value={pd.matriculation} mono />
                  <InfoCard label="Entité / Département" value={pd.entity} />
                  <InfoCard label="Poste occupé" value={pd.occupation} />
                  <InfoCard label="Responsable N+1" value={pd.managerName} />
                  <InfoCard label="Tél. professionnel" value={pd.professionalPhoneNumber} />
                  <InfoCard label="Fixe professionnel" value={pd.professionalFixedPhoneNumber} />
                  <InfoCard label="Extension" value={pd.extension} mono />
                  <InfoCard label="Date d'embauche" value={pd.joinDate} />
                  <InfoCard label="Email professionnel" value={pd.professionalEmail} />
                </div>
              </Section>
            )}

            {activeTab === "social" && (
              <Section title="Informations administratives & sociales">
                <div className="info-grid">
                  <InfoCard label="Numéro CNSS" value={sd.cnssNumber} mono />
                  <InfoCard label="Numéro CIMR" value={sd.cimrNumber} mono />
                  <InfoCard label="N° Mutuelle / Assurance" value={sd.insuranceNumber} mono />
                </div>
              </Section>
            )}

            {activeTab === "account" && (
              <Section title="Compte & Activité">
                <div className="info-grid">
                  <InfoCard label="Nom d'utilisateur" value={emp.username} mono />
                  <InfoCard label="Dernière connexion" value={emp.lastLoginDate} />
                  <InfoCard label="Date de création" value={emp.createdAt} />
                  <InfoCard label="Dernière modification" value={emp.updatedAt} />
                  <InfoCard label="Modifié par" value={emp.updatedBy} />
                </div>
              </Section>
            )}

            {activeTab === "security" && (
              <Section title="Sécurité du compte">
                <div className="security-row">
                  <span className="security-key">Statut du compte</span>
                  <span className={`security-val ${emp.accountLocked ? "danger" : "safe"}`}>
                    {emp.accountLocked ? "🔒 Verrouillé" : "✓ Actif"}
                  </span>
                </div>
                <div className="security-row">
                  <span className="security-key">Tentatives de connexion échouées</span>
                  <span className={`security-val ${emp.failedLoginAttempts > 0 ? "danger" : "safe"}`}>
                    {emp.failedLoginAttempts ?? 0}
                  </span>
                </div>
                <div className="security-row">
                  <span className="security-key">Mot de passe modifié le</span>
                  <span className="security-val">{emp.passwordLastChanged || "—"}</span>
                </div>
              </Section>
            )}

            {activeTab === "balance" && bd && (
              <Section title={`Solde de congé — Exercice ${bd.year}`}>
                <div className="info-grid">
                  <div className="balance-card annual">
                    <div className="balance-number">{bd.annualBalance}<span className="balance-unit">j</span></div>
                    <div className="balance-label">Droit annuel</div>
                  </div>
                  <div className="balance-card used">
                    <div className="balance-number">{bd.usedBalance}<span className="balance-unit">j</span></div>
                    <div className="balance-label">Jours utilisés</div>
                  </div>
                  <div className="balance-card current">
                    <div className="balance-number">{bd.currentBalance}<span className="balance-unit">j</span></div>
                    <div className="balance-label">Solde actuel</div>
                  </div>
                  <div className="balance-card reminder">
                    <div className="balance-number">{bd.reminderBalance}<span className="balance-unit">j</span></div>
                    <div className="balance-label">Restant</div>
                  </div>
                </div>
              </Section>
            )}

            {activeTab === "balance" && !bd && (
              <div style={{ color: "var(--text-muted)", fontSize: 14, textAlign: "center", paddingTop: 40 }}>
                Aucune donnée de solde disponible.
              </div>
            )}
          </div>
        </div>
        <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>

          <Button variant="outlined">
            Réinitialiser mot de passe
          </Button>

          {!employee.accountActive && (
            <Button
            variant="contained"
            color={"warning"}
            onClick={handleActivateAccount}
          >
            Activer le compte
          </Button>
          )}
        </Box>

      </DialogContent>
    </Dialog>
  );
};

const Section = ({ title, children }) => (
  <Box mb={4}>
    <Typography variant="h6" fontWeight={600} mb={1}>
      {title}
    </Typography>
    <Divider sx={{ mb: 2 }} />
    {children}
  </Box>
);

const Info = ({ label, value }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>

    <Typography variant="body1" fontWeight={500}>
      {value || "-"}
    </Typography>
  </Grid>
);