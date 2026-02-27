import { useEffect, useState } from "react";
import "../styles/ProfileManagement.css";
import { CircularProgress, IconButton, Paper } from "@mui/material";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getEmployee, updatePassword, uploadProfilePicture } from "../services/EmployeeService";

const Section = ({ title, children }) => (
  <div className="profile-section">
    <h3>{title}</h3>
    <div className="profile-view-grid">{children}</div>
  </div>
);

const Field = ({ label, value }) => (
  <div className="profile-field">
    <span className="label">{label}</span>
    <span className="value">{value || "-"}</span>
  </div>
);

const ProfileHeader = ({ employee }) => {
  if (!employee) return null;

  const hasProfilePic =
    employee.profilePictureUrl &&
    employee.profilePictureUrl.trim() !== "";

  return (
    <div className="profile-header">
      {hasProfilePic ? (
        <img
          src={`/api/profile-picture/${employee.profilePictureUrl}`}
          alt="Profile"
          className="profile-avatar"
        />
      ) : (
        <ProfilePictureUploader employeeId={employee.id} />
      )}
    </div>
  );
};
const ProfilePictureUploader = ({ employeeId }) => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    try{
      const formData = new FormData();
      formData.append("multipartFile", file);
      const res = await uploadProfilePicture(formData)
    }catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
};

const PasswordManagement = ({employeeDetails}) =>{
  const [currentPasssword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");

  const [show, setShow] = useState({
    current : false,
    next : false,
    confirm : false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isPasswordValid = ()=>{
    return newPassword === newPasswordConfirmation;
  }

  const clearFields = () =>{
    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordConfirmation("");
  }

  const handleSave = async() =>{
    try{
      const email = employeeDetails?.email;
      const request = {
        oldPassword : currentPasssword,
        newPassword : newPassword
      }
      setLoading(true);
      const res = await updatePassword(email, request);
      setSuccess(true);
      clearFields();
    }catch(err){
      console.log(err);
      setError(err);
    }finally{
      setLoading(false);
    }
  }

  return(
    <Paper style={{padding : 20}}>
      {loading && (
        <CircularProgress/>
      )}
      {!loading && (
        <div>
          <h3 className="mb-4">Sécurité du compte</h3>
          <div className="mb-3">
            <label className="form-label">Mot de passe actuel</label>
            <input 
            name="currentPassword"
            value={currentPasssword}
            className="form-control" 
            type={show.current ? "text" : "password"}
            onChange={(e)=> setCurrentPassword(e.target.value)}
            />
            <IconButton onClick={()=> setShow((prev)=>({
              ...prev, current : !prev.current
            }))}>{!show.current ? <VisibilityIcon/> : <VisibilityOffIcon/>}</IconButton>
          </div>

      <div className="mb-3">
        <label className="form-label">Nouveau mot de passe</label>
        <input 
          name="newPassword"
          value={newPassword}
          className="form-control" 
          type={show.next ? "text" : "password"}
          onChange={(e)=> setNewPassword(e.target.value)}
        />
        <IconButton onClick={()=> setShow((prev)=>({
          ...prev, next : !prev.next
        }))}>{!show.next ? <VisibilityIcon/> : <VisibilityOffIcon/>}</IconButton>
      </div>

      <div className="mb-3">
        <label className="form-label">Confirmation du nouveau mot de passe</label>
        <input 
          name="confirmPassword"
          value={newPasswordConfirmation}
          className="form-control" 
          type={show.confirm ? "text" : "password"}
          onChange={(e)=> setNewPasswordConfirmation(e.target.value)}
        />
        <IconButton onClick={()=> setShow((prev)=>({
          ...prev, confirm : !prev.confirm
        }))}>{!show.confirm ? <VisibilityIcon/> : <VisibilityOffIcon/>}</IconButton>
      </div>
      {!isPasswordValid() && (
        <p style={{color : "red"}}>Les mots de passe ne correspondent pas</p>
      )}

      <div className="d-flex justify-content-end mt-3">
        <button className="btn btn-primary px-4" onClick={handleSave} disabled={!isPasswordValid()}>
          Sauvegarder
        </button>
      </div>
        </div>
      )}
    </Paper>
  )
}


const PersonalDetails = ({ data }) => (
  <Section title="Informations personnelles">
    <Field label="Nom" value={data?.lastName} />
    <Field label="Prénom" value={data?.firstName} />
    <Field label="Date de naissance" value={data?.birthDate?.toString()} />
    <Field label="Nationalité" value={data?.nationality} />
    <Field label="CIN" value={data?.cin} />
    <Field label="Situation familiale" value={data?.familyStatus} />
    <Field label="Nombre d’enfants" value={data?.numberOfChildren} />
    <Field label="Adresse" value={data?.address} />
  </Section>
);

const ProfessionalDetails = ({ data }) => (
  <Section title="Informations professionnelles">
    <Field label="Matricule interne" value={data?.matriculation} />
    <Field label="Poste / Fonction" value={data?.occupation} />
    <Field label="Département / Direction" value={data?.department} />
    <Field label="Manager direct" value={data?.managerName} />
    <Field label="Date d’embauche" value={data?.joinDate} />
    <Field label="Site" value={data?.site} />
    <Field label="Téléphone pro" value={data?.professionalPhoneNumber} />
    <Field label="Fixe pro" value={data?.professionalFixedPhoneNumber} />
    <Field label="Extension" value={data?.extension} />
    <Field label="Email pro" value={data?.professionalEmail} />
  </Section>
);

const SocialDetails = ({ data }) => (
  <Section title="Informations administratives & sociales">
    <Field label="N° CNSS" value={data?.cnssNumber} />
    <Field label="N° CIMR" value={data?.cimrNumber} />
    <Field label="Mutuelle / Assurance santé" value={data?.insuranceNumber} />
  </Section>
);

const ContactDetails = ({ data }) => (
  <Section title="Urgence & contact">
    <Field label="Personne à contacter" value={data?.emergencyContactName} />
    <Field label="Lien de parenté" value={data?.relationship} />
    <Field label="Téléphone d’urgence" value={data?.emergencyPhone} />
  </Section>
);

export const ProfileManagement = () => {
  const [employeeDetails, setEmployeeDetails] = useState(null);

  const fetchEmployeeDetails = async() =>{
    const authUserEmail = JSON.parse(localStorage.getItem("userDetails"))?.email
    try{
      const res = await getEmployee(authUserEmail);
      console.log(res);
      setEmployeeDetails(res);
    }catch(err){
      console.log(err);
    }
    finally{
      console.log(employeeDetails);
      console.log(authUserEmail);
    }
  }
  useEffect(()=>{
    fetchEmployeeDetails();
  },[])
  return (
    <div className="profile-container">
      <ProfileHeader employee={employeeDetails} />
      <PersonalDetails data={employeeDetails} />
      <ProfessionalDetails data={employeeDetails?.professionalDetails} />
      <SocialDetails data={employeeDetails?.socialDetails} />
      <ContactDetails data={employeeDetails?.contactDetails} />
      <PasswordManagement/>
    </div>
  );
};
