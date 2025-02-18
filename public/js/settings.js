// Themes

const themes = {
    default: { img1: "img/transparent.png", img2: "img/transparent.png"},
    dog: { img1: 'img/dog_1.png', img2: "img/dog_2.png"},
    cat: { img1: 'img/cat_1.png', img2: "img/cat_2.png"},
    fish: { img1: 'img/fish_1.png', img2: "img/fish_2.png"},
    bird: { img1: 'img/bird_1.png', img2: "img/bird_2.png"},
    smallpet: { img1: 'img/smallpet_1.png', img2: "img/smallpet_2.png"}
};



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

    // Theme
    const chosenTheme = localStorage.getItem("theme");
    updateThemeBanner(chosenTheme);

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

// Theme Changes

function themebannerupdate(theme) {
    const banner = document.getElementById("themebanner");
    const pics = themes[theme];

    // Dynamically style background based on theme chosen
    banner.style.background = `url('${pics[0]}'), url('${pics[1]}')`;
    banner.style.backgroundSize = "auto 100%";
    banner.style.backgroundRepeat = "repeat-x";
}




document.getElementById("themeform").addEventListener("submit", async function (event) {
    event.preventDefault();

    const theme = document.getElementById("theme").value;
})
