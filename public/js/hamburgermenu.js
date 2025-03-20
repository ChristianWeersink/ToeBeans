document.addEventListener("DOMContentLoaded", function () {
    const sideMenu = document.getElementById("hbmenuscreen");
    const hbButton = document.getElementById("hb-button");
    const hbClose = document.getElementById("hb-close");
    const user = getCookie("user");
    const signin = document.querySelectorAll(".signin");
    const signout = document.querySelectorAll(".signout");
    const profile = document.querySelectorAll(".profileshow");
    const pet = document.querySelectorAll(".petshow");
    const settings = document.querySelectorAll(".settingsshow");

    
    // Show or hide the hamburger menu sidebar on smaller screens
    hbButton.addEventListener("click", function() {
        sideMenu.classList.add("active");
    });

    hbClose.addEventListener("click", function() {
        sideMenu.classList.remove("active");
    })


    // Which buttons show depending on if user is signed in or not
    function showButtons(elements, shouldShow) {
        elements.forEach(element => {
            element.classList.toggle("hidden", !shouldShow);
        });
    }

    
    if(!user) {
        showButtons(signin, true);
        showButtons(signout, false);
        showButtons(profile, false);
        showButtons(pet, false);
        showButtons(settings, false);

    }
    else {
        showButtons(signin, false);
        showButtons(signout, true);
        showButtons(profile, true);
        showButtons(pet, true);
        showButtons(settings, true);
        
    }
});