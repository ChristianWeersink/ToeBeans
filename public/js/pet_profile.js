document.addEventListener('DOMContentLoaded', async () =>{
    const user = getCookie("user");
    const newPetForm = document.getElementById("newPetForm");
    const newPetButton = document.getElementById("newPetButton");
    const submitFormButton = document.getElementById("add-pet-button");
    const errorContainer = document.createElement("div");
    errorContainer.className = "error-container";
    newPetForm.appendChild(errorContainer); // Add error container to form
    if(!user){
        setCookie("message", "You need to be signed in to access this page.", 1);
        window.location.href = "/sign_in";
    }
    const userId = user.user_id;
    
    // Show the form and hide the button on click Remember to add the button back after the form is submitted
    newPetButton.addEventListener("click", (event) =>{
        event.preventDefault();
        newPetForm.hidden = false;
        newPetButton.hidden = true;
        
        loadFavourites(userId);
    });
    // Handle form submission
    submitFormButton.addEventListener("click", async (event) => {
        event.preventDefault();

        // Clear previous errors
        errorContainer.innerHTML = "";

        const pet_name = document.getElementById("pet_name").value;
        const pet_breed = document.getElementById("pet_breed").value;
        const pet_age = document.getElementById("pet_age").value;
        const pet_allergy = document.getElementById("pet_allergies").value;
        const pet_other = document.getElementById("pet_other").value;
        const pet_homevet_id = document.getElementById("home_vet").value;
        const pet_photo = document.getElementById("pet_photo").files[0]; // Get file

        // Simple Validation
        const errors = [];

        if (!pet_name) errors.push("Pet name is required.");
        if (!pet_breed) errors.push("Pet breed is required.");
        if (!pet_age || isNaN(pet_age) || pet_age <= 0) errors.push("Pet age must be a valid number.");
        if (!pet_homevet_id) errors.push("Please select a home vet.");
        if (pet_photo && !["image/jpeg", "image/png", "image/webp"].includes(pet_photo.type)) {
            errors.push("Pet photo must be a JPG, PNG, or WebP image.");
        }

        if (errors.length > 0) {
            errorContainer.innerHTML = `<div class="alert alert-danger">${errors.join("<br>")}</div>`;
            return;
        }
    
        const formData = new FormData();
        formData.append("user_id", userId);
        formData.append("pet_name", pet_name);
        formData.append("pet_breed", pet_breed);
        formData.append("pet_age", pet_age);
        formData.append("pet_allergy", pet_allergy);
        formData.append("pet_other", pet_other);
        formData.append("pet_homevet_id", pet_homevet_id);
        if (pet_photo) {
            formData.append("pet_photo", pet_photo);
        }

        try {
            submitFormButton.disabled = true; // Disable button while submitting
            submitFormButton.value = "Submitting..."; 

            const response = await fetch("/pet_profile", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "An unknown error occurred.");
            }

            // Show success message
            errorContainer.innerHTML = `<div class="alert alert-success">Pet added successfully!</div>`;

            setTimeout(() => {
                window.location.reload(); // Reload the page after success
            }, 1500);

        } catch (error) {
            errorContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
            console.error("Form submission error:", error);
        } finally {
            submitFormButton.disabled = false; 
            submitFormButton.value = "Add Pet"; 
        }
    });





    // Fetch favourites from the backend and populate dropdown
    async function loadFavourites(userId) {
        try {
            const response = await fetch(`/favourites/names?userId=${userId}`);
            const data = await response.json();
            
            const homeVetDropdown = document.getElementById("home_vet"); // Select element

            if (data.success && data.favourites.length > 0) {
                homeVetDropdown.innerHTML = ""; // Clear existing options

                data.favourites.forEach(vet => {
                    const option = document.createElement("option");
                    option.value = vet.place_id;
                    option.textContent = vet.name;
                    homeVetDropdown.appendChild(option);
                });
            } else {
                homeVetDropdown.innerHTML = `<option value="">No favourite vets found</option>`;
            }
        } catch (error) {
            console.error("Error fetching favourites:", error);
            homeVetDropdown.innerHTML = `<option value="">Error loading favourites</option>`;
        }
    }
});

