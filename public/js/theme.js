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
        default: { img1: "img/transparent.png", img2: "img/transparent.png"},
        dog: { img1: 'img/dog_1.png', img2: "img/dog_2.png"},
        cat: { img1: 'img/cat_1.png', img2: "img/cat_2.png"},
        fish: { img1: 'img/fish_1.png', img2: "img/fish_2.png"},
        bird: { img1: 'img/bird_1.png', img2: "img/bird_2.png"},
        smallpet: { img1: 'img/smallpet_1.png', img2: "img/smallpet_2.png"}
    };
    const banner = document.getElementById("themebanner");

    //debug
    if (!banner) {
        console.error("Banner not found");
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
    banner.style.backgroundPosition = "0 0, 50% 0";
    banner.style.backgroundRepeat = "repeat-x";
}