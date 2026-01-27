import { AuthAPI } from "../apis/AuthAPI"

export const authenticate = async(loginDto) =>{
    return await AuthAPI.post("",loginDto);
    //return res.data;
}