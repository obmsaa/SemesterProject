
import DBManager from "./storageManager.mjs";

class Recipe {
  constructor({ title, description, ingredients, instructions, createdBy }) {
    this.title = title;
    this.description = description;
    this.ingredients = ingredients;
    this.instructions = instructions;
    this.createdBy = createdBy;
  }

  async save() {
    if (!this.createdBy) {
        throw new Error("Error, you log in to create a recipe.");
    }
    try {
        const recipe = await DBManager.createRecipe(this);
        console.log("Recipe created successfully:", recipe);
        return recipe;
    } catch (error) {
        console.error("Failed to save recipe:", error);
        throw new Error(`Error saving recipe the recipe `, error.message);
    }
  }

  delete() {

    /// TODO: What happens if the DBManager fails to complete its task?
    DBManager.deleteRecipe(this);
  }


}

export default Recipe;



