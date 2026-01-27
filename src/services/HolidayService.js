import { HolidaysAPI } from "../apis/HolidaysAPI"
/**
 * Fetching all the holidays stored in the system
 * @returns 
 */
export const getAllHolidays = async()=>{
    const response = await HolidaysAPI.get("get_all");
    return response.data;
}
/**
 * Updating the holiday details.
 * @param {*} name 
 * @param {*} requestDto 
 * @returns 
 */
export const updateHoliday = async(name, requestDto)=>{
    const repsonse = await HolidaysAPI.put(`/update/${name}`, requestDto);
    return repsonse.status;
}
/**
 * Add new holiday to the system.
 * @param {*} requestDto 
 * @returns 
 */
export const addHoliday = async(requestDto)=>{
    const response = await HolidaysAPI.post("new",requestDto);
    return response.status;
}