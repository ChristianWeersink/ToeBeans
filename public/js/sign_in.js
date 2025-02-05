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
    }

    else {
        try {
            const res = await fetch("/sign_in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, userpass})
            });
            const formrslt = await res.json();
            if (formrslt.success) {
                errormsg.innerHTML = "Sign up successful!"
            }
            else {
                errormsg.innerHTML= formrslt.message;
                
            }
        }
        catch (error) {
            console.log(error);
        }
    }

});

