export const LocalDateTimeMapper = (value) => {
    if (!value) return "";

    // Remove timezone if exists (e.g. 2025-12-04T10:45:32.000Z → 2025-12-04T10:45:32.000)
    const clean = value.replace("Z", "");

    const [datePart, timePartRaw] = clean.split("T");
    const [year, month, day] = datePart.split("-");

    // French date: dd/MM/yyyy
    const formattedDate = `${day}/${month}/${year}`;

    if (!timePartRaw) {
        // It's a LocalDate
        return formattedDate;
    }

    // LocalDateTime
    const timeWithoutMs = timePartRaw.split(".")[0]; // remove milliseconds
    const [hour, minute] = timeWithoutMs.split(":");

    const formattedTime = `${hour}:${minute}`;

    return `${formattedDate} à ${formattedTime}`;
};
