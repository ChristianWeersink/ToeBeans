let vetMap; // Declare map globally
let userMarker; // Global user marker
const defaultLatLng = { lat: 43.897095, lng: -78.865791 };
let userLatLng;
// Parameters to change using user input/UI elements
let radius = 10000; // search radius this will be a variable later
let searchTerm = "exotic";
let openNow = false;
const maxResults = 10; //1-20 results
const mapZoom = 12; //zoom value for the map
const mapContainer = document.getElementById('map');
let markers = []; // Store all map markers for removal 
let searchCenter = {lat: 1 , lng: 1}; // default search center, this gets changed when the user searches for a location


// This function will be called once the Google Maps API is loaded
function initMap() {
    try {
        loadMap();
    }
    catch(e){
        console.log(e);
    }
    
}

// Add "You Are Here" marker using AdvancedMarkerElement
function addUserMarker(userLatLng) {
    if (userMarker) {
        // If the marker already exists, update its position
        userMarker.position = userLatLng;
    } else {
        // Create a new marker
        userMarker = new google.maps.marker.AdvancedMarkerElement({
            map: vetMap,
            position: userLatLng,
            title: 'You Are Here',
            content: createCustomMarkerContent(), // Optional: Create a custom HTML content
        });
    }
}

// Customer marker for you are here
function createCustomMarkerContent() {
    const markerDiv = document.createElement('div');
    markerDiv.style.backgroundColor = '#4285F4'; // Google blue
    markerDiv.style.borderRadius = '50%';
    markerDiv.style.width = '20px';
    markerDiv.style.height = '20px';
    markerDiv.style.display = 'flex';
    markerDiv.style.justifyContent = 'center';
    markerDiv.style.alignItems = 'center';
    markerDiv.style.color = 'white';
    markerDiv.style.fontSize = '12px';
    markerDiv.innerText = ''; //
    return markerDiv;
}
// Set map variable to specified zoom and center position zoom, int and center latlng
function setMap(zoom, center){
    vetMap = new google.maps.Map(mapContainer, {
        center: center,
        zoom: zoom,
        mapId: "a4767227d798f20e",
        scrollwheel: true, // Enable scroll wheel zoom
        gestureHandling: 'greedy',
    })
}
// On search button click get users location, add that to the map, get search params from the form, do a search in the database to see if this has been searched in this area before, if it has load the results from the database. if the search is new for this area, search for the nearby vets, and display those markers on the page. Store the search in the database.

document.getElementById("search").addEventListener("click", () => {
    executeSearch();
});
document.getElementById("radius").addEventListener("change" ,() =>{
    // only execute search if there is already a search, so the search happens when the user might expect, not before
    if(markers.length > 0){
        executeSearch();
    } 
});
document.getElementById("type").addEventListener("change" ,() =>{
    // only execute search if there is already a search, so the search happens when the user might expect, not before
    if(markers.length > 0){
        executeSearch();
    } 
});
document.getElementById("openNow").addEventListener("change" ,() =>{
    // only execute search if there is already a search, so the search happens when the user might expect, not before
    if(markers.length > 0){
        executeSearch();
    } 
});


// Get detailed place information based on place id. This info is used for display on the side panel for when a marker is clicked
async function fetchPlaceDetails(placeId) {
    const { Place } = await google.maps.importLibrary("places");
    const place = new Place({
        id: placeId,
    });
    await place.fetchFields({
        fields: [
            'displayName',
            'formattedAddress',
            'nationalPhoneNumber',
            'regularOpeningHours',
            'websiteURI',
            'location',
        ],
    });
    await displayPlaceDetails(place);
}

// Display the clicked on markers place details in the panel dedicated for results.
async function displayPlaceDetails(place){
    const detailContainer = document.getElementById('results-panel');
    // check if website exists and if it does add the content dynamically into the content
    const user = getCookie("user");
    const placeId = getCookie("selectedPlace").id;
    var favourites = ``;
    if(user){
        console.log("user id:" + user.user_id + "\n place id: "+ placeId);
        if(await isFavourited(user.user_id, placeId)){
            favourites = `<input type='submit' id='del-favourites-btn' value='Remove from Favourites' class='btn btn-danger mt-3'>
            <div class="fa-3x " id="loading-spinner" hidden>
      <i class="fa-solid fa-spinner fa-spin-pulse"></i>
  </div>`;
        }
        else {
            favourites = `<input type='submit' id='add-favourites-btn' value='Add to Favourites' class='btn btn-success mt-3'>
            <div class="fa-3x" id="loading-spinner" hidden>
      <i class="fa-solid fa-spinner fa-spin-pulse"></i>
  </div>`;
        }
    }
    const website = place.websiteURI? `<p>Website: <a href='${place.websiteURI}' target='blank'>${place.websiteURI}</a></p>` : "";
    const distance = calculateDistance(searchCenter.lat, searchCenter.lng, place.location.lat(), place.location.lng());
    var hours = "";
    place.regularOpeningHours? place.regularOpeningHours.weekdayDescriptions.forEach( day =>{
        hours += `<br>${day}`;
    }) : hours = 'Hours Unavailable.';
    // Content to display
    const content = `
    <h2>${place.displayName}</h2>
    <p>Address: ${place.formattedAddress}</p>
    <p>Phone Number: ${place.nationalPhoneNumber}</p>
    <p>Open Hours: ${hours}</p>
    ${website}
    <p>Distance: ${distance} KM</p>
    ${favourites}
    `;
    detailContainer.innerHTML = content;
}



// Add to favourites button event
document.getElementById('results-panel').addEventListener('click', async function(event) {
    if (event.target && event.target.id === 'add-favourites-btn') {
        const button = event.target;
        const originalText = button.value; 
        const spinner = document.getElementById("loading-spinner");
        spinner.hidden = false;
        button.hidden = true;
        button.disabled = true; // Disable button while processing
        const placeId = getCookie("selectedPlace").id; //Get the place id from cookies - saved on click in search.js
        const userId = getCookie("user").user_id;
        const res = await addToFavourites(placeId, userId);
        await fetchPlaceDetails(placeId); 
    }

});

// Remove from favourites button event
document.getElementById('results-panel').addEventListener('click', async function(event) {
    if (event.target && event.target.id === 'del-favourites-btn') {
        const button = event.target;
        const originalText = button.value; 
        const spinner = document.getElementById("loading-spinner");
        spinner.hidden = false;
        button.hidden = true;
        button.disabled = true; // Disable button while processing
        const placeId = getCookie("selectedPlace").id; //Get the place id from cookies - saved on click in search.js
        const userId = getCookie("user").user_id;
        const res = await deleteFromFavourites(placeId, userId);
        await fetchPlaceDetails(placeId);
    }
});


// Loads the map and initial markers, as well as gets users position
function loadMap(){
    if (!mapContainer) return; // Check if the map container exists
        // Fallback to default location if geolocation is not supported
        setMap(mapZoom, defaultLatLng);
}

document.getElementById("locationBox").addEventListener("change", () => {
    if (document.getElementById("locationBox").checked) {
        document.getElementById("location").removeAttribute("hidden");
    } else {
        document.getElementById("location").setAttribute("hidden", "true");
    }
});