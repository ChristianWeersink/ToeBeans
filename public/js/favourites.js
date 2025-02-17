// Enter user id get all of their favourite vets
async function getFavourites(userId){
    try {
        const res = await fetch(`/favourites?userId=${encodeURIComponent(userId)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
    
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    
        const data = await res.json(); // Convert response to JSON
        return data;
    } catch (error) {
        console.error("Error fetching favourites:", error);
    }
}

// enter place id and user id and add a favourite vet
async function addToFavourites(placeId, userId){
    console.log(placeId);
    console.log(userId);
    try {
        const res = await fetch("/favourites", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({placeId, userId})
        });
        const formrslt = await res.json();
        //Sign up is successful
        if (formrslt.success) {
            return message;
        }
        else {
            return message;
        }
    }
    catch (error) {
        console.log(error);
    }
}

//put in a place id and a user id and delete the favourited place from the favourites table
async function deleteFromFavourites(placeId, userId){
    try {
        const res = await fetch(`/favourites?userId=${encodeURIComponent(userId)}&placeId=${encodeURIComponent(placeId)}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const formrslt = await res.json();
        if (formrslt.success) {
            console.log("Successfully deleted from favourites.");
            return formrslt;
        }
        else {
            return formrslt;
        }
    }
    catch (error) {
        console.log(error);
        return error;
    }
}



//put in a user and a place and see if the user has favourited the place or not
async function isFavourited(userId, placeId) {
    const favourites = await getFavourites(userId);

    if (!favourites || typeof favourites.favourites !== "object") {
        return false; // no favourites found
    }

    // Convert object to array if necessary
    const favouriteArray = Array.isArray(favourites.favourites) 
        ? favourites.favourites 
        : Object.values(favourites.favourites);

    const isFavourite = favouriteArray.some(fav => fav.place_id === placeId); 
    
    console.log(isFavourite ? "true" : "false");
    return isFavourite;
}