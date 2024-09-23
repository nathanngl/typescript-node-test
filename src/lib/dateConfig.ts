import Holidays from "date-holidays";

const startHour = +process.env.START_HOUR;
const endHour = +process.env.END_HOUR; 
const breakTime = +process.env.BREAK_HOUR;

async function checkWorkingDaysAndTimes (date:string|null, time:string|null) {
    const checkDate = new Date(date);
    
    // check weekend
    if ([0, 6].includes(checkDate.getDay())) {
        console.log('weekend');
        return false;
    }
    
    // check public holiday
    const hd = new Holidays('SG');
    if (hd.isHoliday(checkDate)) {
        console.log('holiday');
        return false;
    }

    const checkTime = +time.substring(0,2);
    switch (true) {
        case (checkTime < startHour && checkTime > endHour):
            console.log('operational hour');
            return false;
        case (checkTime === breakTime):
            console.log('break hour');
            return false;
        default:
            return true;
    }
}

export { checkWorkingDaysAndTimes };
