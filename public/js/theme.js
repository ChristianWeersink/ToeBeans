document.addEventListener("DOMContentLoaded", async () =>{
    const user = getCookie("user");
    const userId = user.user_id;
    if(!user){
        return;
    }
    try{
        // Theme
            const res = await fetch(`/settings/gettheme`);
            const d = await res.json();
            setCookie("theme", d.theme.selected_theme, 1);
            console.log(d.theme.selected_theme);
            //const chosenTheme = localStorage.getItem("themeselect");
    
            //debug
            //console.log("Theme saving", chosenTheme)
            localStorage.setItem("theme", d.theme.selected_theme);
            //debug
            console.log("Saved theme:", localStorage.getItem("theme")); 
            updateThemeBanner(d.theme.selected_theme);
        } catch (error) {
            console.error("Error " + error);
        }
}); 


function updateThemeBanner(theme) {
    //debug
    console.log("Theme function", theme);

    const themes = {
        default: { img1: "/img/transparent.png", img2: "/img/transparent.png"},
        dog: { img1: '/img/dog_1.png', img2: "/img/dog_2.png"},
        cat: { img1: '/img/cat_1.png', img2: "/img/cat_2.png"},
        fish: { img1: '/img/fish_1.png', img2: "/img/fish_2.png"},
        bird: { img1: '/img/bird_1.png', img2: "/img/bird_2.png"},
        smallpet: { img1: '/img/smallpet_1.png', img2: "/img/smallpet_2.png"}
    };
    const banner = document.getElementById("themebanner");
  
    const divTheme = document.querySelectorAll(".divboxes");
    console.log(divTheme); // Should work if elements are added dynamically


    //debug
    if (!banner) {
        console.error("Banner not found");
    }
    if (!divTheme) {
        console.error("Divs not found!");
    }
    const pics = themes[theme];

    //debug
    if (!pics) {
        console.error("Theme not found");
        return;
    }
    console.log("Applying images:", pics.img1, pics.img2);

    // Dynamically style background based on theme chosen
    banner.style.background = `url('${pics.img1}'), url('${pics.img2}')`;
    banner.style.backgroundSize = "auto 100%";
    banner.style.backgroundPosition = "0 0, 30% 0";
    banner.style.backgroundRepeat = "repeat-x";

    if (pics.img1 == "img/dog_1.png") {
        banner.style.backgroundColor = "#89b388";
        divTheme.forEach(div => {
            div.style.backgroundColor = "#89b388"
        })
    }
    else if (pics.img1 == "img/cat_1.png") {
        banner.style.backgroundColor = "##cac2f0"
        divTheme.forEach(div => {
            div.style.backgroundColor = "#cac2f0"
        })
    }
    else if (pics.img1 == "img/fish_1.png") {
        banner.style.backgroundColor = "#a8e8f7"
        divTheme.forEach(div => {
            div.style.backgroundColor = "#a8e8f7"
        })
    }

    else if (pics.img1 == "img/bird_1.png") {
        banner.style.backgroundColor = "#f7efa8"
        divTheme.forEach(div => {
            div.style.backgroundColor = "#f7efa8"
        })
    }

    else if (pics.img1 == "img/smallpet_1.png") {
        banner.style.backgroundColor = "#fcf0f1"
        divTheme.forEach(div => {
            div.style.backgroundColor = "#fcf0f1"
        })
    }

    else {
        divTheme.forEach(div => {
            div.style.backgroundColor = "#DEE3DE"
        })
    }

    
}