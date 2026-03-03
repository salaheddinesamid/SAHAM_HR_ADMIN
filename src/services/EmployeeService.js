import EmployeeApi from "../apis/EmployeeAPI"
/**
 * Fetch employee details.
 * @param {*} token 
 * @param {*} email 
 * @returns 
 */
export const getEmployee = async(email)=>{
    const response = await EmployeeApi.get(`/profile/get?email=${email}`);
    return response.data;
}
/**
 * Fetch manager's subordinates.
 * @param {*} email 
 * @returns 
 */
export const getSubordinates = async(email)=>{
    const response = await EmployeeApi.get("subordinates",{
        params : {
            managerEmail : email
        }
    });
    return response.data;
}

/**
 * 
 * @param {*} page 
 * @param {*} size 
 * @returns 
 */
export const getAllEmployees = async(page, size)=>{
    const response = await EmployeeApi.get("get_all",{
        params : {
            pageNumber : page,
            pageSize : size
        }
    });
    return response.data;
}
/**
 * 
 * @param {*} request 
 * @returns 
 */
export const addEmployee = async(request)=>{
    const res = await EmployeeApi.post("/new", request);
    return res.status;
}
/**
 * 
 * @param {*} managerName 
 * @returns 
 */

/**
 * 
 * @param {*} employeeId 
 * @param {*} requestDto 
 * @returns 
 */
export const updateEmployee = async(employeeId, requestDto)=>{
    const response = await EmployeeApi.patch(`update/${employeeId}`, requestDto);
    return response.status;
}
export const verifyManager = async(managerName)=>{
    const response = await EmployeeApi.get("managers/verify", {
        params : {
            fullName : managerName
        }
    });

    return response.data;
}

export const getAllManagers = async()=>{
    const response = await EmployeeApi.get("managers/get_all");
    return response.data;
}

/**
 * 
 * @param {*} email 
 * @param {*} request 
 * @returns 
 */
export const updatePassword = async(email, request) =>{
    const response = await EmployeeApi.put("update/password", request, {
        params : {
            email : email
        }
    });
    return response.status;
}

/**
 * 
 * @param {*} image 
 * @returns 
 */
export const uploadProfilePicture = async(image) =>{
    const response = await EmployeeApi.patch("update/profile-picture/", image, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    });
    return response.status;
}