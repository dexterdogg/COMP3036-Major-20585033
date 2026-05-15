//Class/Object to hold event information for search results
//Mainly for formatting purposes + rendering cleaner
export class Event {
    constructor(id, name, description, timestampStart, timestampEnd, location, category, participants) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.date = convertDateToString(timestampStart);
        this.schedule = convertTo12HourFormat(timestampStart) + ' - ' + convertTo12HourFormat(timestampEnd);
        this.location = location;
        this.category = category;
        this.participants = participants
    }
}

//Reference for DATE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
function convertTo12HourFormat(date) {
    let hours = date.getHours();
    hours = String(hours).padStart(2, '0');
    let minutes = date.getMinutes();
        minutes = String(minutes).padStart(2, '0');
        let suffix = 'AM';
        if (hours >= 12) {
            hours -= 12;
            suffix = 'PM';
        }
        return hours + ':' + minutes + ' ' + suffix;
}

    //Reference for DATE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    function convertDateToString(date) {
        let dayNumber = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th', '31st'];
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let dayInt = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();

        return dayNumber[dayInt] + ' ' + months[month] + ' ' + year;
    }