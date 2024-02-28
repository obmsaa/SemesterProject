import express, { json } from "express";
import Recipe from "../modules/recipe.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import DBManager from "../modules/storageManager.mjs";




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
RECIPE_API.get('/user/:userId', async (req, res, next) => {
  
  try {
    const recipes = await DBManager.findRecipes();
    res.status(HTTPCodes.SuccesfullRespons.Ok).json(recipes);
  } catch (error) {
    res.status(HTTPCodes.ServerErrorRespons.InternalError).send('Could not fetch recipes.');
  }
});



RECIPE_API.post('/', async (req, res, next) => { 

  

});


RECIPE_API.put('/:id', (req, res) => {
  /// TODO: Edit recipe
  const recipe = new Recipe(); //TODO: The recipe info comes as part of the request 
  recipe.save();
})

RECIPE_API.delete('/:id', (req, res) => {
  /// TODO: Delete recipe.
  const recipe = new Recipe(); //TODO: Actual recipe
  recipe.delete();
})

export default RECIPE_API


