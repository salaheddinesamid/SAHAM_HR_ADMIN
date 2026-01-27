import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'

export const AdminProtectedRoute = ({children})=>{

    const userDetails = localStorage.getItem("userDetails");
    const userRoles = userDetails?.roles;
    const accessToken = Cookies.get("accessToken");

    const navigate = useNavigate();

    const isAdmin = (roles)=>{
        return roles?.includes("ADMIN");
    }

    useEffect(()=>{
        if(!userDetails && !accessToken){
            navigate('/login',{
                state : {
                    message : "",
                    from : window.location.pathname
                }
            })
        }
        if(isAdmin(userRoles)){
            window.alert("You are not authorized")
            navigate("/")
        }
    },[userDetails,accessToken,navigate]);

    return userDetails ? children : null;
}