document.addEventListener("DOMContentLoaded",() =>{
    document.getElementById("signupform").addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const userphone = document.getElementById('userphone').value;
        const useremail = document.getElementById('useremail').value;
        const username = document.getElementById('username').value;
        const userpass = document.getElementById('userpass').value;
        const errormsg = document.getElementById("errormsg");
        errormsg.classList.add("d-none");
        let isValid = true;
        let message = "";
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(name.trim() == ""){
            isValid = false;
            message += "Your name can't be blank!<br>"
        }

        if(useremail.trim() != "") {
            if(!emailRegex.test(useremail)){
                isValid = false;
                message += "Incorrect email format<br>"
            }
        }

        if(username.trim() == ""){
            isValid = false;
            message += "Please input a username<br>"
        }

        if(userpass.trim() == ""){
            isValid = false;
            message += "Please input a password<br>"
        }

        if(userpass.length <8){
            isValid = false;
            message += "Password must be at least 8 characters<br>"
        }

        if(!isValid){
            console.log(message);
            errormsg.innerHTML = message;
            errormsg.classList.remove("d-none");
        }

        else {
            try {
                const res = await fetch("/sign_up", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, userphone, useremail, username, userpass})
                });
                const formrslt = await res.json();
                //Sign up is successful
                if (formrslt.success) {
                    
                    errormsg.classList.remove("d-none");
                    errormsg.classList.remove("alert-danger");
                    errormsg.classList.add("alert-success");
                    errormsg.innerHTML = formrslt.message;
                    document.getElementById("signupform").reset();
                    setTimeout(() => {
                        window.location.href = "/sign_in";
                    }, 2000);
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
});

