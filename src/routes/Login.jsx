import { useState } from "react";
import Cookies from "js-cookie";
import {
  Alert,
  CircularProgress,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import logo from "../logo.png";
import background from "../0002.jpg";
import "../styles/AdminLogin.css";
import { authenticate } from "../services/AuthService";

export const AdminLoginPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccessMessage, setLoginSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loginDto, setLoginDto] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginDto((prev) => ({ ...prev, [name]: value }));
  };

  const postAuthentication = ({ token, userDetails }) => {
    const accessToken = token?.accessToken;

    Cookies.set("accessToken", accessToken, {
      expires: 1,
      secure: false,
      sameSite: "Lax",
    });

    localStorage.setItem("userDetails", JSON.stringify(userDetails));

    setLoginSuccessMessage("Connexion réussie, redirection...");

    setTimeout(() => navigate("/"), 1200);
  };

  const handleSubmit = async () => {
    if (!loginDto.email || !loginDto.password) {
      setLoginError("Veuillez saisir vos identifiants");
      return;
    }

    try {
      setLoading(true);
      setLoginError("");
      
      const res = await authenticate(loginDto);

      const userDetails = res?.data?.userDetails;
      const token = res?.data?.bearerToken;

      if (!userDetails?.roles?.includes("ADMIN")) {
        setLoginError("Accès refusé : Portail réservé aux administrateurs");
        return;
      }

      postAuthentication({ token, userDetails });
      
    } catch (err) {
      setLoginError(
        err?.response?.data?.message || "Identifiants incorrects"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page" style={{
        backgroundImage: `url(${background})`,
      }}>
      <div className="admin-login-card">
        <div className="admin-login-header">
          <img src={logo} alt="logo" />
          <h2>Administration</h2>
          <p>Accès sécurisé à la plateforme RH</p>
        </div>

        {loginError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loginError}
          </Alert>
        )}

        {loginSuccessMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {loginSuccessMessage}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Adresse e-mail"
          name="email"
          value={loginDto.email}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Mot de passe"
          name="password"
          type={showPassword ? "text" : "password"}
          value={loginDto.password}
          onChange={handleChange}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <button
          className="admin-login-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Connexion sécurisée"
          )}
        </button>

        <div className="admin-login-footer">
          <a href="#">Mot de passe oublié ?</a>
        </div>
      </div>
    </div>
  );
};
