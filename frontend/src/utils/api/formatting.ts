// convert from string format '2024-06-11T06:10:59' to milliseconds
export const convertDateToMilliseconds = (date: string): number => {
    return new Date(date).getTime();
}