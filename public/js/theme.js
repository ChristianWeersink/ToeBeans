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
        document.body.classList.remove("theme-loading");
        return;
    }
    console.log("Applying images:", pics.img1, pics.img2);

    // Dynamically style background based on theme chosen
    banner.style.background = `url('${pics.img1}'), url('${pics.img2}')`;
    banner.style.backgroundSize = "auto 100%";
    banner.style.backgroundPosition = "0 0, 30% 0";
    banner.style.backgroundRepeat = "repeat-x";
    hbHeader.style.background = `url('${pics.img1}'), url('${pics.img2}')`
    hbHeader.style.backgroundSize = "auto 100%";
    hbHeader.style.backgroundPosition = "0 0, 30% 0";
    hbHeader.style.backgroundRepeat = "repeat-x";

    if (pics.img1 == "/img/dog_1.png") {
        banner.style.backgroundColor = "#89b388";
        banner.style.backgroundColor = "#89b388";
        hbHeader.style.backgroundColor = "#89b388"
        divTheme.forEach(div => {
            div.style.backgroundColor = "#89b388"
        })
        petName.forEach(h4 => {
            h4.style.color = "#1c4a24"
        })
        titleText.forEach(h2=> {
            h2.style.color = "#1c4a24"
        })
        titleText.forEach(h1=> {
            h1.style.color = "#1c4a24"
        })
        buttonTheme.forEach(button => {
            button.style.backgroundColor = "#1c4a24"
        })
        
    }
    else if (pics.img1 == "/img/cat_1.png") {
        banner.style.backgroundColor = "#cac2f0";
        hbHeader.style.backgroundColor = "#cac2f0";
        divTheme.forEach(div => {
            div.style.backgroundColor = "#cac2f0";
        });
        petName.forEach(h4 => {
            h4.style.color = "#362e5c";
        });
        titleText.forEach(h2 => {
            h2.style.color = "#362e5c";
        });
        titleText.forEach(h1=> {
            h1.style.color = "#362e5c";
        });
        buttonTheme.forEach(button => {
            button.style.backgroundColor = "#362e5c";
        });
    }
    else if (pics.img1 == "/img/fish_1.png") {
        banner.style.backgroundColor = "#a8e8f7"
        hbHeader.style.backgroundColor = "#a8e8f7"
        divTheme.forEach(div => {
            div.style.backgroundColor = "#a8e8f7"
        })
        petName.forEach(h4 => {
            h4.style.color = "#1f4a54"
        })
        titleText.forEach(h2 => {
            h2.style.color = "#1f4a54"
        })
        titleText.forEach(h1=> {
            h1.style.color = "#1f4a54"
        })
        buttonTheme.forEach(button => {
            button.style.backgroundColor = "#1f4a54"
        })
    }

    else if (pics.img1 == "/img/bird_1.png") {
        banner.style.backgroundColor = "#f7efa8"
        hbHeader.style.backgroundColor = "#f7efa8"
        divTheme.forEach(div => {
            div.style.backgroundColor = "#f7efa8"
        })
        petName.forEach(h4 => {
            h4.style.color = "#6e6729"
        })
        titleText.forEach(h2 => {
            h2.style.color = "#6e6729"
        })
        titleText.forEach(h1=> {
            h1.style.color = "#6e6729"
        })
        buttonTheme.forEach(button => {
            button.style.backgroundColor = "#6e6729"
        })
    }

    else if (pics.img1 == "/img/smallpet_1.png") {
        banner.style.backgroundColor = "#fcf0f1"
        hbHeader.style.backgroundColor = "#fcf0f1"
        divTheme.forEach(div => {
            div.style.backgroundColor = "#fcf0f1"
        })
        petName.forEach(h4 => {
            h4.style.color = "#633e42"
        })
        titleText.forEach(h2 => {
            h2.style.color = "#633e42"
        })
        titleText.forEach(h1=> {
            h1.style.color = "#633e42"
        })
        buttonTheme.forEach(button => {
            button.style.backgroundColor = "#633e42"
        })
    }
    else {
        // Apply linear gradient for header and banner
        const gradient = "linear-gradient(to bottom, #133319, #6B7F82)";
        banner.style.background = gradient;
        hbHeader.style.background = gradient;
    
        // Remove background color from the themed boxes
        divTheme.forEach(div => {
            div.style.backgroundColor = "transparent";
        });
    
        // Optional: Set pet name color to something that contrasts well
        petName.forEach(h4 => {
            h4.style.color = "#ffffff";
        });
    }
    
    
    document.body.classList.remove("theme-loading");

    
}