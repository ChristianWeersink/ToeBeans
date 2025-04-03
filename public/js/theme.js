document.addEventListener("DOMContentLoaded", async () =>{
    const user = getCookie("user");
    
    
    if(!user){
        document.body.classList.remove("theme-loading");
        return;
    }
    const userId = user.user_id;
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
            document.body.classList.remove("theme-loading");
            console.error("Error " + error);
        }
}); 


function updateThemeBanner(theme) {
    //debug
    try{
        console.log("Theme function", theme);

        const themes = {
            none: { img1: "/img/transparent.png", img2: "/img/transparent.png"},
            dog: { gradient: "linear-gradient(to bottom, #89b388, #cdebcc)", img1: '/img/dog_1.png', img2: "/img/dog_2.png"},
            cat: { img1: '/img/cat_1.png', img2: "/img/cat_2.png"},
            fish: { img1: '/img/fish_1.png', img2: "/img/fish_2.png"},
            bird: { img1: '/img/bird_1.png', img2: "/img/bird_2.png"},
            smallpet: { img1: '/img/smallpet_1.png', img2: "/img/smallpet_2.png"}
        };
        const banner = document.getElementById("themebanner");
        const tblogo = document.getElementById("tblogo");
        const divTheme = document.querySelectorAll(".divboxes");
        const hbHeader = document.getElementById("hb-header");
        const petName = document.querySelectorAll(".petName");
        const titleText = document.querySelectorAll(".titleText");
        const buttonTheme = document.querySelectorAll(".buttonformat");
        const pagination = document.querySelectorAll("pagination");
        // console.log("pagination elements: "+ pagination);
        // console.log(divTheme); // Should work if elements are added dynamically
        var gradient = "linear-gradient(to bottom, #133319,rgb(150, 181, 161))";
        var divBackgroundColour = "transparent";
        var themeColour = "#89b388";
        const dogGradient = "linear-gradient(to bottom, rgba(137, 179, 136,1), rgb(207, 231, 207))";
        const catGradient = "linear-gradient(to bottom, rgba(202, 194, 240,1), rgb(236, 234, 245))";
        const fishGradient = "linear-gradient(to bottom, rgba(168, 232, 247 ,1), rgba(228, 241, 245,1))";
        const birdGradient = "linear-gradient(to bottom, rgba(247, 239, 168,1), rgb(249, 246, 227))";
        const smallPetGradient = "linear-gradient(to bottom, rgba(252, 240, 241,1), rgba(255, 255, 255,1))";
        var paginationClass = "default";
    
    
    
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
            document.body.classList.remove("theme-loading");
            return;
        }
        console.log("Applying images:", pics.img1, pics.img2);
        
        if (pics.img1 == "/img/dog_1.png") {
            gradient = dogGradient;
            divBackgroundColour = dogGradient;
            themeColour = "#1c4a24";
        
        }
        else if (pics.img1 == "/img/cat_1.png") {
            gradient = catGradient;
            divBackgroundColour = catGradient;
            themeColour = "#362e5c";
            paginationClass = "pagination_cat";
    
        }
        else if (pics.img1 == "/img/fish_1.png") {
            gradient = fishGradient;
            divBackgroundColour = fishGradient;
            themeColour = "#1f4a54";
        }
    
        else if (pics.img1 == "/img/bird_1.png") {
            gradient = birdGradient;
            divBackgroundColour = birdGradient;
            themeColour = "#6e6729";
        }
    
        else if (pics.img1 == "/img/smallpet_1.png") {
            gradient = smallPetGradient;
            divBackgroundColour = smallPetGradient;
            themeColour = "#633e42";
        }
        else {
            // Apply linear gradient for header and banner
            gradient = "linear-gradient(to bottom, #133319, #6B7F82)";
            divBackgroundColour = "#ffffff";
            themeColour = "#1c4a24";
        }
    
        // Dynamically style background based on theme chosen
        divTheme.forEach(div => {
            div.style.background = divBackgroundColour;
        });
        petName.forEach(h4 => {
            h4.style.color = themeColour;
        });
        pagination.forEach(li => {
            li.classList.add(paginationClass);
        });
        titleText.forEach(h2=> {
            h2.style.color = themeColour;
        });
        titleText.forEach(h1=> {
            h1.style.color = themeColour;
        });
        buttonTheme.forEach(button => {
            button.style.backgroundColor = themeColour;
        });

        
        banner.style.background = `url('${pics.img1}'), url('${pics.img2}'), ${gradient}`;
        banner.style.backgroundRepeat = "repeat-x, repeat-x, no-repeat";
        banner.style.backgroundSize = "auto 100%, auto 100%, cover";
        banner.style.backgroundPosition = "0 0, 30% 0, center";
    
        hbHeader.style.background = `url('${pics.img1}'), url('${pics.img2}'), ${gradient}`;
        hbHeader.style.backgroundRepeat = "repeat-x, repeat-x, no-repeat";
        hbHeader.style.backgroundSize = "auto 100%, auto 100%, cover";
        hbHeader.style.backgroundPosition = "0 0, 30% 0, center";

        document.body.classList.remove("theme-loading");
    }
    catch(these_hands){
        console.log(these_hands);
        document.body.classList.remove("theme-loading");
    }
    finally{
        // ensure the page is rendered 
        document.body.classList.remove("theme-loading");
    }
    
}