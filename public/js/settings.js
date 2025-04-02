document.addEventListener('DOMContentLoaded', async () => {
    console.log("running");
    const favourites = document.getElementById("favourites");
    const user = getCookie("user");
    if(!user){
        setCookie("message", "You need to be signed in to access this page.", 1);
        window.location.href = "/sign_in";
    }
    const userId = user.user_id;
    await formatFavourites(userId);
    

    

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
            showToast("Vet successfully removed from favourites.", "Success!");
            document.getElementById(`fav-${placeId}`).remove();
            const remainingFavourites = document.querySelectorAll('.favVet');
            if (remainingFavourites.length === 0) {
                document.getElementById('favourites').classList.add("remove_hbar");
                document.getElementById('favourites').innerHTML = `
                    <div><p>No favourites. Try finding your perfect vet on the <a href="/map"><u>map</u>.</a></p></div>
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
    const themebanner = document.getElementById("themebanner");
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
            themebanner.style.transition = "background 0.5s ease-in-out";
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

document.addEventListener("DOMContentLoaded", () => {
    const deleteButton = document.getElementById("delete_account");

    deleteButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const confirmed = confirm(
            "WARNING: This is a permanent action.\nAll your pets, personal data, and associated QR codes will be permanently deleted.\nDo you really want to delete your account?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch("/settings", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (data.success) {
                alert(data.message);
                window.location.href = "/sign_in"; // redirect after deletion
            } else {
                alert("Error: " + data.message);
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("An error occurred while trying to delete your account.");
        }
    });
});



// params container is the favourite container to populate, place id is the place detail to add to the container
async function fetchAndRenderVetDetails(container, placeId) {
    const { Place } = await google.maps.importLibrary("places");

    try {
        const place = new Place({ id: placeId });
        await place.fetchFields({
            fields: [
                'displayName',
                'formattedAddress',
                'regularOpeningHours',
                'websiteURI',
            ]
        });

        const website = place.websiteURI
            ? `<div>Website: <a href='${place.websiteURI}'>${place.websiteURI}</a></div>`
            : `<div>Website: Website Unavailable</div>`;

        container.innerHTML = `
            <div>Name: ${place.displayName}</div>
            <div>Address: ${place.formattedAddress}</div>
            ${website}
            <div><input type='submit' data-place-id='${placeId}' value='Remove from Favourites' class='btn btn-danger mt-3 del-favourites-btn'></div>
            <hr>
        `;
    } catch (err) {
        console.error("Failed to fetch place details:", err);
        container.innerHTML = `<div>Error loading vet details</div>`;
    }
}


async function formatFavourites(userId){
    var favVets = await getFavourites(userId);
    const favourites = document.getElementById("favourites");
    favourites.innerHTML = "";
    if(!favVets){
        favourites.innerHTML = `<div><p>No favourites. Try finding your perfect vet on the <a href="/map"><u>map</u>.</a></p></div>`;
        favourites.classList.add("remove_hbar");
        return;
    }
    for (const favourite of favVets.favourites) {
        const container = document.createElement("div");
        container.classList.add("favVet");
        container.id = `fav-${favourite.place_id}`;
        container.innerHTML = `
            <hr>
            <div>Loading vet details...</div>
        `;
        favourites.appendChild(container);
    
        // Fetch and populate the vet details after rendering
        fetchAndRenderVetDetails(container, favourite.place_id);
    }
}