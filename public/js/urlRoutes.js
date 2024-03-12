
const content = document.getElementById("content");

const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();

};

const routes = {
    "/": "home.html",
    "/register": "/register.html",
    "/login": "/login.html",
    "/myHome": "/myHome.html",
    "/myRecipes": "/myRecipes.html",
    "/myShopping": "/myShopping.html",
    "/Profile": "/profile.html",


};



async function handleLocation() {
    const path = window.location.pathname;

    const routePath = routes[path] || routes['/'];
    try {
        const response = await fetch(routePath);
        if (!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        let html = await response.text();

        //Removing script tags from HTML to execute them again separately
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
            const newScript = document.createElement('script');
            if (script.src) {
                newScript.src = script.src;
            }else {
                newScript.textContent = script.textContent;
            }
            document.body.appendChild(newScript);
        });


    } catch (error) {
        console.error('Fetch error: ', error);
    }


}

window.onpopstate = handleLocation;
window.route = route;

handleLocation();

