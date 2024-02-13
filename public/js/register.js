
    console.log('Javascript jogging...');



//Variables
const regForm = document.getElementById("regForm");

//Eventlistener for registering a user
regForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const pswHash = document.getElementById("pswHash").value;

    const user = { name, email, pswHash };


    try {
        const response = await postTo("/user", user);
        const data = await response.json();

        if (response.ok) {
            console.log("Registration successful", data);
        } else {
            console.log("Registration failed:", data);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
});


  

async function postTo(url, data) {
    const header = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };


    const response = await fetch(url, header);
    return response;
}

