export const mapHolidayStatus = (status)=> {
    switch(status){
        case 'CONFIRMED':
            return {label : "Confirmé", color: "bg-success"}
        case 'PENDING':
            return {label : "En attent de confirmation", color : "bg-warning text-dark"}
        default:
            return null;
    }
}