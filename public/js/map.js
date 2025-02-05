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

/*Steps: 
(frontend)get users location
(frontend)Get search params
(frontend)Send search to backend using fetch
(backend) check if search params are in the database (check user latlng but also within 500m or so depending on how the map feels)
(backend) return the stored latlngs and location id's if they are there
(backend) if only id's are there in the search term, do a call for the locations of each id and then store and return them
(backend) make a back-end call to the google places api to get place ids and latlngs and return them to the front end
(backend) store the search in the database with the place ids and latlngs (latlng for 30 days only)
(frontend) Add the markers to the map with the id attached
(frontend) Add a click event for the markers to make a front end api call to bring up details including add to favourites functionality
*/
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
        id: placeId.id,
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
    displayPlaceDetails(place);
}

// Display the clicked on markers place details in the panel dedicated for results.
function displayPlaceDetails(place){
    const detailContainer = document.getElementById('results-panel');
    // check if website exists and if it does add the content dynamically into the content
    const signedIn = getCookie("user");
    const favourites = signedIn? `<input type='submit' id='add-favourites-btn' value='Add to Favourites' class='btn btn-success mt-3'>` : "";
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

// Add this once, outside the displayPlaceDetails function
document.getElementById('results-panel').addEventListener('click', function(event) {
    if (event.target && event.target.id === 'add-favourites-btn') {
        const placeId = event.target.getAttribute('data-place-id');
        addToFavourites(placeId); // You'd need to pass or fetch the correct place info here
    }
});


function addToFavourites(place){
    console.log("hello world!");
}

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


