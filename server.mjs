import 'dotenv/config'
import express from 'express' // Express is installed using npm
import USER_API from "./routes/usersRoute.mjs";
import SuperLogger from './modules/SuperLogger.mjs';  //Logging middleware
import RECIPE_API from './routes/recipeRoute.mjs';
import LOGIN_API from './modules/login.mjs';

// Creating an instance of the server
const server = express();

// Selecting a port for the server to use.
const port = (process.env.PORT || 8080);
server.set('port', port);



// Enable logging for server
const logger = new SuperLogger();
server.use(logger.createAutoHTTPRequestLogger()); // Will logg all http method requests


// Defining a folder that will contain static files.
server.use(express.static('public'));



// Telling the server to use the USER_API (all urls that uses this code will have to have the /user after the base address)
server.use("/user", USER_API);


// Telling the server to use the RECIPE_API (all urls that uses this code will have to have the /recipe after the base address)
server.use("/recipes", RECIPE_API);

// Telling the server to use the LOGIN_API (all urls that uses this code will have to have the /login after the base address)
server.use("/login", LOGIN_API);




// Start the server 
server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});
