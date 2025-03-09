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
        console.log("Selected pet allergy id: "+ pet_allergy);
        // Simple Validation
        const errors = [];

        if (!pet_name) errors.push("Pet name is required.");
        if (!pet_age || isNaN(pet_age) || pet_age <= 0) errors.push("Pet age must be a valid number.");
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



    const editPetForm = document.getElementById("editPetForm");
    const editPetModal = new bootstrap.Modal(document.getElementById("editPetModal"));

    document.querySelectorAll(".edit-pet-btn").forEach(button => {
        button.addEventListener("click", () => {
            const petId = button.getAttribute("data-pet-id");
            const currentHomeVetId = button.getAttribute("data-home-vet-id");
            // Populate the form with pet details
            document.getElementById("edit_pet_id").value = button.getAttribute("data-pet-id");
            document.getElementById("edit_pet_name").value = button.getAttribute("data-pet-name");
            document.getElementById("edit_pet_breed").value = button.getAttribute("data-pet-breed");
            document.getElementById("edit_pet_age").value = button.getAttribute("data-pet-age");
            document.getElementById("edit_pet_allergies").value = button.getAttribute("data-pet-allergy");
            document.getElementById("edit_pet_other").value = button.getAttribute("data-pet-other");
            document.getElementById("edit_home_vet").value = button.getAttribute("data-home-vet");
            loadFavourites(userId, currentHomeVetId);

            // Show the modal
            editPetModal.show();
        });
    });


});

// Fetch favourites from the backend and populate dropdown
async function loadFavourites(userId, selectedVetId = "") {
    try {
        const response = await fetch(`/favourites/names?userId=${userId}`);
        const data = await response.json();
        
        const homeVetDropdown = document.getElementById("home_vet"); // Add Pet Dropdown
        const editVetDropdown = document.getElementById("edit_home_vet"); // Edit Pet Dropdown

        if (data.success && data.favourites.length > 0) {
            homeVetDropdown.innerHTML = ""; // Clear existing options
            editVetDropdown.innerHTML = "";

            // Add "None" option
            const noneOption = document.createElement("option");
            noneOption.value = "";
            noneOption.innerHTML = "None";
            homeVetDropdown.appendChild(noneOption);
            editVetDropdown.appendChild(noneOption);

            // Populate with favorite vets
            data.favourites.forEach(vet => {
                const option = document.createElement("option");
                option.value = vet.place_id;
                option.textContent = vet.name;

                const editOption = option.cloneNode(true); // Clone for the edit dropdown

                // Automatically select the vet if it matches `selectedVetId`
                if (selectedVetId && vet.place_id === selectedVetId) {
                    editOption.selected = true;
                }

                homeVetDropdown.appendChild(option);
                editVetDropdown.appendChild(editOption);
            });

        } else {
            homeVetDropdown.innerHTML = `<option value="">No favourite vets found</option>`;
            editVetDropdown.innerHTML = `<option value="">No favourite vets found</option>`;
        }
    } catch (error) {
        console.error("Error fetching favourites:", error);
        homeVetDropdown.innerHTML = `<option value="">Error loading favourites</option>`;
        editVetDropdown.innerHTML = `<option value="">Error loading favourites</option>`;
    }
}


// Handle Edit Form Submission
editPetForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const errorContainer = document.getElementById("edit_error_container");

    const petId = document.getElementById("edit_pet_id").value;

    const pet_name = document.getElementById("edit_pet_name").value;
    const pet_breed = document.getElementById("edit_pet_breed").value;
    const pet_age = document.getElementById("edit_pet_age").value;
    const pet_allergy = document.getElementById("edit_pet_allergies").value;
    const pet_other = document.getElementById("edit_pet_other").value;
    const pet_homevet_id = document.getElementById("edit_home_vet").value;
    const pet_photo = document.getElementById("edit_pet_photo").files[0]; // Get file
    console.log("Selected homevet id: "+pet_homevet_id);
    // Simple Validation
    const errors = [];

    if (!pet_name) errors.push("Pet name is required.");
    if (!pet_age || isNaN(pet_age) || pet_age <= 0) errors.push("Pet age must be a valid number.");
    if (pet_photo && !["image/jpeg", "image/png", "image/webp"].includes(pet_photo.type)) {
        errors.push("Pet photo must be a JPG, PNG, or WebP image.");
    }

    if (errors.length > 0) {
        errorContainer.innerHTML = `<div class="alert alert-danger">${errors.join("<br>")}</div>`;
        return;
    }

    const formData = new FormData();
    formData.append("pet_name", pet_name);
    formData.append("pet_breed", pet_breed);
    formData.append("pet_age", pet_age);
    formData.append("pet_allergy", pet_allergy);
    formData.append("pet_other", pet_other);
    formData.append("pet_homevet_id", pet_homevet_id);
    if (pet_photo) {
        formData.append("pet_photo", pet_photo);
    }



    const response = await fetch(`/pet_profile/${petId}`, {
        method: "PUT",
        body: formData,
    });

    if (response.ok) {
        alert("Pet updated successfully!");
        window.location.reload();
    } else {
        alert("Failed to update pet.");
    }
});


// DELETE METHOD
document.querySelectorAll(".delete-pet-btn").forEach(button => {
    button.addEventListener("click", async () => {
        const petId = button.getAttribute("data-pet-id");
        const petPhotoUrl = button.getAttribute("data-pet-photo");
        console.log(petPhotoUrl);
        let petPhotoPath = petPhotoUrl ? petPhotoUrl.split("/user-images/")[1] : null;
        console.log(petPhotoPath);

        if (!confirm("Are you sure you want to delete this pet? This action cannot be undone.")) {
            return; // Stop if user cancels
        }
        
        try {
            const response = await fetch(`/pet_profile/${petId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pet_photo: petPhotoPath }) // Send pet photo URL for deletion
            });

            if (response.ok) {
                alert("Pet deleted successfully!");
                window.location.reload();
            } else {
                alert("Failed to delete pet.");
            }
        } catch (error) {
            console.error("Error deleting pet:", error);
            alert("An error occurred while deleting the pet.");
        }
    });

    
});