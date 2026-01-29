import axios from "axios";
import Cookies from "js-cookie";
import handleExpiredJWT from "../utils/JwtExpirationHandler";

export const HolidaysAPI = axios.create({
    baseURL : `${process.env.REACT_APP_SERVER_URL}/api/v1/holidays`,
    timeout : 10000
})

HolidaysAPI.interceptors.request.use(
    (config)=>{
        const token = Cookies.get("accessToken");
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error)=> Promise.reject(error)
);

HolidaysAPI.interceptors.response.use(
    (response)=> response,
    (error)=>{
        if (error.response.errorCode === "JWT_EXPIRED"){
            handleExpiredJWT();
        }
        return Promise.reject(error);
    }
)