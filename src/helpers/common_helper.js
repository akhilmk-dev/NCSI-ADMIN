    export const addMinutesToTime = (timeString, minutesToAdd) => {
        // Split the time string into hours and minutes
        const [hours, minutes] = timeString?.split(':')?.map(Number);
        
        // Create a Date object based on the current date but with the selected time
        const date = new Date();
        date.setHours(hours, minutes); // Set the time
    
        // Add the estimated time (in minutes) to the Date object
        date.setMinutes(date.getMinutes() + minutesToAdd);
    
        // Format the result back to HH:mm format
        const endTime = date.toTimeString().slice(0, 5);
        return endTime;
    };