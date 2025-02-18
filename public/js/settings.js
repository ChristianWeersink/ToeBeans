document.addEventListener('DOMContentLoaded', async () => {
    const favourites = document.getElementById("favourites");
    const user = getCookie("user");
    if(!user){
        setCookie("message", "You need to be signed in to access this page.", 1);
        window.location.href = "/sign_in";
    }
    const userId = user.user_id;
    const formattedFavourites = await formatFavourites(userId);

    favourites.innerHTML = formattedFavourites;

})

async function formatFavourites(userId){
    var favVets = await getFavourites(userId);
    var favouriteContent = "";
    const { Place } = await google.maps.importLibrary("places");
    if(!favVets) {
        return `<div>No favourites. Try finding your perfect vet on the <a href="/map">map.</a></div>`
    }
    favVets = favVets.favourites;
    
    for (const favourite of favVets) {
        const place = new Place({
            id: favourite.place_id,
        });
        await place.fetchFields({
        fields: [
            'displayName',
            'formattedAddress',
            'nationalPhoneNumber',
            'regularOpeningHours',
            'websiteURI',
            ],
        });
        const website = place.websiteURI? `<div>Website: <a href='${place.websiteURI}'>${place.websiteURI}</a></div>` : `<div>Website: Website Unavailable</div>`
        favouriteContent += 
        `<div class='favVet' id='fav-${favourite.place_id}'>
            <hr>
            <div>Name: ${place.displayName}</div>
            <div>Address: ${place.formattedAddress}</div>
            <div>Phone: ${place.nationalPhoneNumber}</div>
            ${website}
            <div><input type='submit' data-place-id='${favourite.place_id}' value='Remove from Favourites' class='btn btn-danger mt-3 del-favourites-btn'></div>
        </div>`
    };
    return favouriteContent;
}


document.getElementById('favourites').addEventListener('click', async function(event) {
    if (event.target && event.target.classList.contains('del-favourites-btn')) {
        const button = event.target;
        const placeId = button.getAttribute('data-place-id');
        const userId = getCookie("user").user_id;
        
        if (!placeId || !userId) {
            console.error("Error: Missing place ID or user ID.");
            return;
        }

        console.log(`Deleting favourite: ${placeId}`); 

        const res = await deleteFromFavourites(placeId, userId);
        
        if (res.success) {
            document.getElementById(`fav-${placeId}`).remove();
            const remainingFavourites = document.querySelectorAll('.favVet');
            if (remainingFavourites.length === 0) {
                document.getElementById('favourites').innerHTML = `
                    <div>No favourites. Try finding your perfect vet on the <a href="/map">map.</a></div>
                `;
            }
        } else {
            console.error("Failed to delete favourite");
        }
    }
});
