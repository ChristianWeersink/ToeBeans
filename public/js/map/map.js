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
let markers = []; // Store all map markers
let searchCenter = {lat: 1 , lng: 1};


// This function will be called once the Google Maps API is loaded
function initMap() {
    try {
        loadMap();
    }
    catch(e){
        console.log(e);
    }
    
}

// Search for nearby vet offices
async function nearbySearch(center) {
    try{
        const service = new google.maps.places.PlacesService(vetMap);
        markers.forEach(marker => marker.setMap(null)); // Remove markers from the map
        markers = [];
    
        // Create the text search query string
        const query = `${searchTerm} veterinary office`;
        const bounds = new google.maps.LatLngBounds();
        const northEast = google.maps.geometry.spherical.computeOffset(center, radius, 45); // 45 degrees for NE corner
        const southWest = google.maps.geometry.spherical.computeOffset(center, radius, 225); // 225 degrees for SW corner

        bounds.extend(northEast);
        bounds.extend(southWest);
        var fields = ['location', 'id',];
        // check if the user wants only open locations
        const request = {
            textQuery: query,  // The query string is used here for text search
            fields: fields, // You can include additional fields based on your need
            maxResultCount: maxResults,
            includedType: "veterinary_care",
            locationRestriction: bounds,
            isOpenNow: openNow,
        };
        const { Place } = await google.maps.importLibrary("places");
    
        const { places } = await Place.searchByText(request);
    
            if (places.length > 0) {
                const bounds = new google.maps.LatLngBounds();
                places.forEach((place) => {
                    // Use AdvancedMarkerElement for nearby places
                    const marker = new google.maps.marker.AdvancedMarkerElement({
                        map: vetMap,
                        position: place.location,
                        id: place.id,
                        gmpClickable: true,
                    });
                    markers.push(marker); // store the marker to delete later
                    marker.addListener("click", ({ domEvent, latLng }) => {
                        const { target } = domEvent;
                        const placeDetail = fetchPlaceDetails(place);
                      });
                    
                    bounds.extend(place.location);
                });
                // Extend the map screen to fit user and add user marker to the map
                bounds.extend(center);
                addUserMarker(center);
                vetMap.fitBounds(bounds);
            } else {
                setMap(mapZoom, center);
                alert("No vets found in this area");
            }
    }
    catch(e){
        console.log(e)
    }
};

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
    markerDiv.innerText = ''; // Initial for "User"
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
        setCookie("user", "true", 1);
}

// Calculate distance
function calculateDistance(userLat, userLng, targetLat, targetLng) {
    const R = 6371; // Radius of the Earth in km
    const dLat = toRadians(targetLat - userLat);
    const dLng = toRadians(targetLng - userLng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(userLat)) * Math.cos(toRadians(targetLat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var num = R * c;
    num = Math.round(num * 100) / 100;
    return num; // Distance in km
}
// Helper function to convert degrees to radians
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

async function searchByLocation() {
    const locationInput = document.getElementById("location").value;
    try {
        const geocoder = new google.maps.Geocoder();
        
        geocoder.geocode({ address: locationInput }, async (results, status) => {
            if (status === "OK") {
                const newCenter = results[0].geometry.location;
                searchCenter.lat = newCenter.lat(); // set search center to the new center so distance can be calc'd
                searchCenter.lng = newCenter.lng();
                console.log(newCenter);
                // Move the map to the new location
                vetMap.setCenter(newCenter);
                vetMap.setZoom(13); // Adjust zoom level for city-wide searches

                // Perform a search at the new location
                await nearbySearch(newCenter);
                addUserMarker(newCenter);
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    } catch (error) {
        console.log("Error in geocoding:", error);
    }
}


document.getElementById("locationBox").addEventListener("change", () => {
    if (document.getElementById("locationBox").checked) {
        document.getElementById("location").removeAttribute("hidden");
    } else {
        document.getElementById("location").setAttribute("hidden", "true");
    }
});


function executeSearch() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                // Get user location 
                userLatLng = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                // retrieve search term, radius, and openNow status
                searchTerm = document.getElementById("type").value;
                radius = document.getElementById("radius").value;
                openNow = document.getElementById("openNow").checked;

                // If the search term is "any", we want to make it empty
                if (searchTerm === "any") {
                    searchTerm = "";
                }

                // search by location if the box is checked to do a text search
                if(document.getElementById("locationBox").checked){
                    searchByLocation();
                }
                else{
                    searchCenter = userLatLng;
                    nearbySearch(searchCenter);
                }
                
            },
            function (error) {
                alert("Error getting user location: " + error.message);
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}