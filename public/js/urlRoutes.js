
const content = document.getElementById("content");

const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();

};

const routes = {
    "/": "home.html",
    "/register": "/register.html"
};



const handleLocation = async() => {
    const path = window.location.pathname;

    const routePath = routes[path] || routes['/'];
    try {
        const response = await fetch(routePath);
        if (!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const html = await response.text();
       content.innerHTML = html;
    } catch (error) {
        console.error('Fetch error: ', error);
    }


}

window.onpopstate = handleLocation;
window.route = route;

handleLocation();