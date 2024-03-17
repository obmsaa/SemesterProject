

//Variables
const regForm = document.getElementById("regForm");

  
//Eventlistener for registering a user
regForm.addEventListener("submit", async function (event) {

    event.preventDefault();

   
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = "user";

    const user = { name, email, password, role };

  
    try {
        const response = await postTo("/user", user);
        if (response.ok) {
            const data = await response.json();
            console.log("Registration successful", data);
            regForm.textContent = "SUCCESFULL REGISTRATION, GO LOG IN!";
      
        } else {
            console.error("Registration failed:", response.statusText);

        }
    } catch (error) {
        console.error(error);
        throw new Error ("Error in creating user");
        
    }
});


  

async function postTo(url, data) {

    let cfg = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },  body: JSON.stringify(data),
        
    };
    console.log('Making request to:', url, 'with config:', cfg);
    console.log('Data being sent:', JSON.stringify(data));
    const response = await fetch(url, cfg);
    return response;

}

