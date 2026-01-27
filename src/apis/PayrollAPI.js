import axios from "axios";
import Cookies from "js-cookie";
import handleExpiredJWT from "../utils/JwtExpirationHandler";
export const PayrollAPI = axios.create({
    baseURL : `${process.env.REACT_APP_SERVER_URL}/api/v1/payrolls`,
    timeout : 10000,
    withCredentials : true
})
// Add HTTP request configurations:
PayrollAPI.interceptors.request.use(
    (config)=>{
        const accessToken = Cookies.get("accessToken");
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config;
    },
    (error)=> Promise.reject(error)
);
// Handle the HTTP response

PayrollAPI.interceptors.response.use(
    (response) => response,
    // Handle Error response:
    (error) =>{
        if (error.response.status === 401){
            handleExpiredJWT();
        }
    }
)