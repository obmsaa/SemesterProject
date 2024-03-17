import express, { json } from "express";
import Recipe from "../modules/recipe.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import DBManager from "../modules/storageManager.mjs";
import { verifyToken } from "../modules/authenticator.mjs";




const RECIPE_API = express.Router();
RECIPE_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.


// Get all recipes
RECIPE_API.get('/', async (req, res, next) => {

  try {
    const recipes = await DBManager.findRecipes();
    res.status(HTTPCodes.SuccesfullRespons.Ok).json(recipes);
  } catch (error) {
    res.status(HTTPCodes.ServerErrorRespons.InternalError).send('Could not fetch recipes.');
  }
});

//Get recipes for a specific user
RECIPE_API.get('/user/recipes', async (req, res, next) => {

  const token = req.headers.authorization;
  console.log(token)
  const userID = verifyToken(token);
  console.log(userID)



  try {
    const recipes = await DBManager.findRecipes(userID);
    res.status(HTTPCodes.SuccesfullRespons.Ok).json(recipes);
  } catch (error) {
    res.status(HTTPCodes.ServerErrorRespons.InternalError).send('Could not fetch recipes.');
  }
});



RECIPE_API.post('/', async (req, res, next) => { 

  
  const token = req.headers.authorization;
  console.log(token)
  const userID = verifyToken(token);
  console.log(userID);

  if (!userID) {
    return res.status(HTTPCodes.ClientSideErrorRespons.Unauthorized).send("Invalid or expired token");
}

const { title, description, ingredients, instructions } = req.body;
const recipe = new Recipe({ title, 
  description, 
  ingredients: ingredients, 
  instructions:instructions,
   createdBy: userID });
  try {
     await recipe.save();
    res.status(HTTPCodes.SuccesfullRespons.Ok).json(recipe).end();
  } catch (error) {
    res.status(HTTPCodes.ServerErrorRespons.InternalError).send('Could not create recipe.');
  }
  

});




export default RECIPE_API


