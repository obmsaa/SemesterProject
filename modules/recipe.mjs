
import SuperLogger from "./SuperLogger.mjs";
import DBManager from "./storageManager.mjs";
import RECIPE_API from "../routes/recipeRoute.mjs";

class Recipe {
  constructor({ title, description, ingredients, instructions, createdBy }) {
    this.title = title;
    this.description = description;
    this.ingredients = ingredients;
    this.instructions = instructions;
    this.createdBy = createdBy;
  }

  async save() {

    /// TODO: What happens if the DBManager fails to complete its task?

    // We know that if a recipe object does not have the ID, then it cant be in the DB.
    if (this.id == null) {

      return await DBManager.createRecipe(this) ;

    } else {
      return await DBManager.updateRecipe(this);
    }
  }

  delete() {

    /// TODO: What happens if the DBManager fails to complete its task?
    DBManager.deleteRecipe(this);
  }


}

export default Recipe;



