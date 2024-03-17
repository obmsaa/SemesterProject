


async function displayUserProfile() {

    try {
        let token = localStorage.getItem("authToken");
        if (!token) {
            throw new Error("No token found or available");
        }

        const response = await getFrom(`/user/profile`, token); 

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const userProfile = await response.json();

        const container = document.getElementById('profile-container');
        container.innerHTML = ''; 

       
        container.innerHTML = `
        <div class="profile-details">
        <p class="profile-info"><span class="profile-info-title">Email:</span> ${userProfile.email}</p>
        <p class="profile-info"><span class="profile-info-title">Username:</span> ${userProfile.name}</p>
    </div>
        `;

    } catch (error) {
        throw new Error("Error in profile.js: ", error); 
    }
}

displayUserProfile();


async function getFrom(url, token) {
    let cfg = {
        method: "GET",
        headers: {
            "Authorization": `${token}` 
        }
    };
    console.log('Making GET request to:', url);
    const response = await fetch(url, cfg);
    return response;
}




// Function to make PUT request
async function putTo(url, data, token) {
    let cfg = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token  
        },
        body: JSON.stringify(data),
    };
    console.log('Making PUT request to:', url, 'with config:', cfg);
    const response = await fetch(url, cfg);
    return response;
}

const editButton = document.getElementById("editProfile");

// Event listener for the edit button
editButton.addEventListener("click", async function (event) {


//Variables for editing user
const editName = document.getElementById("editName");
const editPassword = document.getElementById("editPassword");
const editEmail = document.getElementById("editEmail");


    const token = localStorage.getItem('authToken');  

    const user = {
        name: editName.value,
        password: editPassword.value, 
        email: editEmail.value
    };

    try {
        const response = await putTo(`/user/edit`, user, token);
        if (response.ok) {
            const data = await response.json();
            console.log("Profile updated successfully", data);
            displayUserProfile();
            editName.value ="";
            editPassword.value ="";
            editEmail.value = "";
        } else {
            console.log("Profile update failed:", response.statusText);
        }
    } catch (error) {
       throw new Error("Error during profile update:", error);
    }
});


