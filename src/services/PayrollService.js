import { PayrollAPI } from "../apis/PayrollAPI"
/**
 * Fetch all the payroll history from the server
 * @returns 
 */
export const getAllPayrollHistory = async() =>{
    const res = await PayrollAPI.get("/history/get_all");
    return res.data;
}
/**
 * Upload a new payroll for each month of the year
 * @param {*} requestDto 
 * @returns 
 */
export const uploadPayroll = async (month, year, requestDto)=>{
    const res = await PayrollAPI.post("/new", requestDto, {
        params : {
            month : month,
            year : year
        }
    });
    return res.status;
}
export const getPayrollsOverview = async(year) =>{
    const res = await PayrollAPI.get("overview", {
        params : {
            year : year,
            matriculation : "10001"
        }
    })
    return res.data;
}