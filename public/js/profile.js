async function displayUserProfile() {
    console.log("Display user profile is running");

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
