import { AuthAPI } from "../apis/AuthAPI"

export const authenticate = async(loginDto) =>{
    return await AuthAPI.post("",loginDto);
    //return res.data;
}

export const reActivateAccount = async(email) =>{
    const response = await AuthAPI.post("re-activate-account", null, {
        params : {
            email : email
        }
    });
    return response.status;
}