import { Event } from "./Event.js";
import { getParticipantCount } from "../../models/eventModels.js";

export async function filter_events(events, query, categories){
    //categories can be {undefined, "a string", an array}
    const categorySelected = !!categories;     
    const queryExists = !!query;

    //find all events matching query
    const results = [];
    for (const event of events) {

        const participantCount = await getParticipantCount(event.id);
        let stringMatch = false;
        if (queryExists){
            //turn both to lowercase to ignore case sensitivity
            let eventName = event.name.toLowerCase();
            let userInput = query.toLowerCase();
            //Condition for input match
            stringMatch = eventName.includes(userInput);
        }

        //Condition for category match
        let categoryMatch = false;
        if (categorySelected)
            categoryMatch = categories.includes(event.category)
        
        //Path 1 -> Nothing inputted: Get ALL
        if (!categorySelected && !queryExists){             
            results.push(new Event(event.id, event.name, event.description, event.start_time, event.end_time, event.location, event.category, participantCount));

        //Path 2 -> String found: filter by searched
        } else if (!categorySelected && queryExists){       
            if (stringMatch)
                results.push(new Event(event.id, event.name, event.description, event.start_time, event.end_time, event.location, event.category, participantCount));
        
        //Path 3 -> Category found: filter by category
        } else if (categorySelected && !queryExists){
            if (categoryMatch)
                results.push(new Event(event.id, event.name, event.description, event.start_time, event.end_time, event.location, event.category, participantCount));

        //Path 4 -> String + Category found: filter by both
        } else {
            if (categoryMatch && stringMatch)
                results.push(new Event(event.id, event.name, event.description, event.start_time, event.end_time, event.location, event.category, participantCount));
        }
    }
    return results
}

//References used:

//for loop iterable ->https://www.w3schools.com/js/js_iterables.asp
//search a part of a string from a bigger string -> https://www.w3schools.com/jsref/jsref_search.asp
