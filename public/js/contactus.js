
document.getElementById("contactform").addEventListener("submit", async function (event) {
    event.preventDefault();
    const theform = event.target;
console.log("hello world")
  
// Get information from the form
    const emailinfo = {
        name: theform.name.value.trim(),
        email: theform.email.value.trim(),
        subject: theform.subject.value.trim(),
        message: theform.message.value.trim(),
    }
    
    const semessage = document.getElementById("semessage");
    semessage.classList.add("d-none");

    // Validation
    let isValid = true;
    let responsemsg = "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    semessage.innerHTML = "";


    if(emailinfo.name === ""){
        isValid = false;
        responsemsg += "Please add your name in the form.<br>"
    }

    if(emailinfo.email === ""){
        isValid = false;
        responsemsg += "Please add your email to the form so we can contact you.<br>"
    } else if(!emailRegex.test(emailinfo.email)){
            isValid = false;
            responsemsg += "Incorrect email format. Please enter your email address in the \"email@email.com\" format. <br>"
        }
    

    if(emailinfo.subject === ""){
        isValid = false;
        responsemsg += "Please add a subject for your message.<br>"
    }

    if(emailinfo.message === ""){
        isValid = false;
        responsemsg += "Please add your message.<br>"
    }

    if(!isValid){
        semessage.innerHTML = responsemsg;
        semessage.classList.remove("d-none");
        return;
    }

    

    // Try to send to backend .js
    try {
        const res = await fetch("/contactus", {
            method: "POST",
            headers: {"Content-Type": "application/json"  
            },
            body: JSON.stringify(emailinfo),
        });

        const result = await res.json();

        if (result.success) {
            theform.style.display = "none";
            semessage.innerHTML = "Your message has been sent! We will get back to you as soon as possible!";
            semessage.classList.remove("d-none");
        }
        else {
            semessage.innerHTML = "There was an error sending your message, please try again.";
            semessage.classList.remove("d-none");
        }
    } catch (e) {
        console.error("Error", e);
        semessage.innerHTML = "An error occurred with our mail system. Please try again later.";
        semessage.classList.remove("d-none");

    }
    
});