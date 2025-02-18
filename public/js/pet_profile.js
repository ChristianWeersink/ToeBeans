document.addEventListener('DOMContentLoaded', async () =>{
    const user = getCookie("user");
    const newPetForm = document.getElementById("newPetForm");
    const newPetButton = document.getElementById("newPetButton");
    const submitFormButton = document.getElementById("add-pet-button");
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
    })
    submitFormButton.addEventListener("click", (event) =>{
        event.preventDefault();
        newPetForm.hidden = true;
        newPetButton.hidden = false;
    })

});