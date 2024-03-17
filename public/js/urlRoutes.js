
const content = document.getElementById("content");

//Prevent the reloading of the page and instead updating the window history with the route path in question
const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();

};

const routes = {
    //Path : page content to load

    "/": "home.html",
    "/register": "/register.html",
    "/login": "/login.html",
    "/myHome": "/myHome.html",
    "/myRecipes": "/myRecipes.html",
    "/Profile": "/profile.html",


};


//An attempt at making the app single page
async function handleLocation() {
    const path = window.location.pathname;

    //Routepath refers to which route, if you navigate to /profile the routpath is /profile.html
    //Set to go to '/' if it finds no path  with content to load. Which means it goes to the home.html. 
    const routePath = routes[path] || routes['/'];
    
    try {
        const response = await fetch(routePath);

        if (!response.ok){
            throw new Error(`Error in fetching route path: `,  response.status)
        }
        //Extracting the content of the html file thats paired to the routepath. /profile extracts /profile.html
        let html = await response.text();

        //Removing script tags from HTML to execute them again separately
        //Making a div and adding the html to that div, selecting the scripts in the page and removing them from the div
        
        const div = document.createElement('div');
        div.innerHTML = html;

        const scripts = div.querySelectorAll('script');
        scripts.forEach((script) => {
            div.removeChild(script);
        });

        //Update the content div
        content.innerHTML = div.innerHTML

        //Reload scripts
        scripts.forEach((script) => {
            //Making a new script element
            const newScript = document.createElement('script');
            //Selecting the previous scripts source and giving it to the new script
            if (script.src) {
                newScript.src = script.src;
            }else {
                //Adding the old text content to the new script
                newScript.textContent = script.textContent;
            }
            //Appending the new script to the body of the document in question, the page we are on
            document.body.appendChild(newScript);
        });


    } catch (error) {
        console.error('Fetch error: ', error);
        throw new Error("Error in switching pages");
    }


}

//Makes it so a user can go back and forth by triggering handlelocation when the window history changes
window.onpopstate = handleLocation;

//Making the route function globally accessible by attaching it to the window 
window.route = route;

handleLocation();

