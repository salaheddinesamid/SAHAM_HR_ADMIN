export const mapEmployeeFamilyStatus = (status)=>{
    switch(status){
        case "MARRIED":
            return "Marié(e)"
        case "SINGLE":
            return "Célibataire"
    }
}