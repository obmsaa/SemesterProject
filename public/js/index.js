
//Headers defined as strings for change based on user or guest
const guestHeaderTemplate = `
<h1 id="title">SilverPalate</h1>
    <nav>
        <ul>
            <li><a class="link" href="/" onclick="route(event)">Home</a></li>
            <li><a class="link" href="/register" onclick="route(event)">Register</a></li>
            <li><a class="link" href="/login" onclick="route(event)">Login</a></li>
        </ul>
    </nav>
`;

const userHeaderTemplate = `
<h1 id="title">SilverPalate</h1>
    <nav>
        <ul>
            <li><a class="link" href="/myHome" onclick="route(event)">Home</a></li>
            <li><a class="link" href="/myRecipes" onclick="route(event)">My Recipes</a></li>
            <li><a class="link" href="/Profile" onclick="route(event)">Profile</a></li>
            <li><a class="link" href="/" onclick="logout(event)">Logout</a></li>
        </ul>
    </nav>
`;



function updateHeader() {
    const authToken = localStorage.getItem('authToken'); 
    let header = document.getElementById("dynamic-header");
    if(authToken){
        header.innerHTML = userHeaderTemplate;
    } else {
        header.innerHTML = guestHeaderTemplate;
    }
  
}


updateHeader();


function logout(event) {
    event.preventDefault();
    localStorage.removeItem('authToken'); // Removing the token from storage
    updateHeader(); // Updating the header to reflect logged-out state
    //Switch page with the use of route and handlelocation
    route(event);   
}