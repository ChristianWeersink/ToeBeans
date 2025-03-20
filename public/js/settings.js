document.addEventListener('DOMContentLoaded', async () => {
    console.log("running");
    const favourites = document.getElementById("favourites");
    const user = getCookie("user");
    if(!user){
        setCookie("message", "You need to be signed in to access this page.", 1);
        window.location.href = "/sign_in";
    }
    const userId = user.user_id;
    const formattedFavourites = await formatFavourites(userId);
    favourites.innerHTML = formattedFavourites;
    

    

    try{
    // Theme
        const res = await fetch(`/settings/gettheme`);
        const d = await res.json();
        setCookie("theme", d.theme.selected_theme, 1);
        console.log(d.theme.selected_theme);

        localStorage.setItem("theme", d.theme.selected_theme);

        updateThemeBanner(d.theme.selected_theme);
        document.getElementById("theme").value = d.theme.selected_theme;
    } catch (error) {
        console.error("Error getting theme");
    }

    

})

async function formatFavourites(userId){
    var favVets = await getFavourites(userId);
    var favouriteContent = "";
    const { Place } = await google.maps.importLibrary("places");
    if(!favVets) {
        return `<div><p>No favourites. Try finding your perfect vet on the <a href="/map">map.</a></p></div>`
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
                    <div><p>No favourites. Try finding your perfect vet on the <a href="/map">map.</a></p></div>
                `;
            }
        } else {
            console.error("Failed to delete favourite");
        }
    }
});

// Theme Changes

document.getElementById("themeform").addEventListener("submit", async function (event) {
    event.preventDefault();

    const themes = {
        default: { img1: "img/transparent.png", img2: "img/transparent.png"},
        dog: { img1: 'img/dog_1.png', img2: "img/dog_2.png"},
        cat: { img1: 'img/cat_1.png', img2: "img/cat_2.png"},
        fish: { img1: 'img/fish_1.png', img2: "img/fish_2.png"},
        bird: { img1: 'img/bird_1.png', img2: "img/bird_2.png"},
        smallpet: { img1: 'img/smallpet_1.png', img2: "img/smallpet_2.png"}
    };
    const themeselect = document.getElementById("theme").value;
    const errormsg = document.getElementById("errormsg");

    try {

        const res = await fetch("/settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({theme: themeselect}),
        });
        const themerslt = await res.json();

        //Theme change success
        if (themerslt.success) {
            localStorage.setItem("theme", themeselect);
            updateThemeBanner(themeselect);
            errormsg.innerHTML = "Theme changed successfully!";
        }
        else {
            errormsg.innerHTML = "Theme change unsuccessful";
        }
    
    }
    catch (error) {
        console.error("Error! Can't update theme", error);
    }
})

// document.getElementById("delete_account").addEventListener("submit", async function (event) {
    
// })
