document.getElementById("sign_in").addEventListener
("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById('user_name').value;
    const userpass = document.getElementById('password').value;
    const errormsg = document.getElementById("message");
    let isValid = true;
    let message = "";

    if(username.trim() == ""){
        isValid = false;
        message += "Please input a username<br>"
    }

    if(userpass.trim() == ""){
        isValid = false;
        message += "Please input a password<br>"
    }

    if(!isValid){
        console.log("error");
        errormsg.innerHTML = message;
        errormsg.classList.remove("d-none");
    }

    else {
        try {
            const res = await fetch("/sign_in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({username, userpass})
            });
            const formrslt = await res.json();
            if (formrslt.success) {
                errormsg.innerHTML = "Sign in successful!";
                console.log(formrslt.user);
                setCookie("user", JSON.stringify(formrslt.user), 1); // user will be signed in for 1 day
                window.location.href = "/profile"; //redirect to profile page
            }
            else {
                errormsg.innerHTML= formrslt.message;
                errormsg.classList.remove("d-none");
                
            }
        }
        catch (error) {
            console.log(error);
        }
    }

});

document.addEventListener("DOMContentLoaded", () =>{
    if(getCookie("user")){
        window.location.href = "/profile";
    }
})
