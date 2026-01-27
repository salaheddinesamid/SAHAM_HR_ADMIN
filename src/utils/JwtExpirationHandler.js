import Cookies from "js-cookie";

/**
 * 
 */
const handleExpiredJWT = ()=>{
    // Remove the access token from the cookie
    Cookies.remove("accessToken");

    // redirection to login page
    window.location.href = "/";
}

export default handleExpiredJWT;