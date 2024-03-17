



// Function to fetch recipes and display them
async function displayMyRecipes() {

    try {
      let token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found or available");
      }
     
      const response = await getFrom(`recipes/user/recipes` , token);


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const recipes = await response.json();

      const container = document.getElementById('recipe-container');
      container.innerHTML = ''; 
  
      recipes.forEach(recipe => {
        const recipeEl = document.createElement('div');
        recipeEl.className = 'recipe';
      
       
        let ingredientsList = '<ul>';
        recipe.ingredients.forEach(ingredient => {
          ingredientsList += `<li>${ingredient.name}</li>`; 
        });
        ingredientsList += '</ul>';
      
        let instructionsList = '<ol>';
        recipe.instructions.forEach(instruction => {
          instructionsList += `<li>${instruction.instruction}</li>`; 
        });
        instructionsList += '</ol>';
      
        recipeEl.innerHTML = `
          <h2>${recipe.title}</h2>
          <p class="recipeDesc">${recipe.description}</p>
          <h3>Ingredients</h3>
          ${ingredientsList}
          <h3>Instructions</h3>
          ${instructionsList}
        `;
      
        container.appendChild(recipeEl);
      });
      

    } catch (error) {
      console.error(error)
    throw new Error("Error in myRecipes.js: ", error)
    }
}

displayMyRecipes();


async function getFrom(url, token){

    let cfg = {
        method: "GET",
        headers: {
            "Authorization": token
        }
    };
    console.log('Making GET request to:', url);
    const response = await fetch(url, cfg);
    return response;
}



//Creating Recipes
const addRecipeTitle = document.getElementById("addRecipeTitle");
const addDesc = document.getElementById("addDesc");
const addIngredientsBtn = document.getElementById("addIngredientBtn");
const addStepBtn = document.getElementById("addStepBtn");
const saveRecipe = document.getElementById("submitBtn")



//Creating new input fields for instructions and ingredients
addIngredientsBtn.addEventListener("click", () => {
  const ingredientsDiv = document.getElementById("addIngredientsDiv");
  const newInput = document.createElement('input');
  newInput.type = 'text'; 
  newInput.className = 'addIngredient'; 
  ingredientsDiv.appendChild(newInput);
})

addStepBtn.addEventListener("click", () => {
  const stepsDiv = document.getElementById("stepsDiv"); 
  const newInput = document.createElement('input');
  newInput.type = 'text';
  newInput.className = 'addStep'; 
  stepsDiv.appendChild(newInput); 


})


saveRecipe.addEventListener("click", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('authToken');

  if (!token) {
    alert("You must be logged in to create a recipe.");
    return;
}

  const title = addRecipeTitle.value;
  const description = addDesc.value;

  
  const ingredients = [];
  //Going through all ingredients and sorting them in an array
  const ingredientInputs = document.querySelectorAll('.addIngredient');
  ingredientInputs.forEach(input => {
      ingredients.push({ name: input.value }); 
  });

  const instructions = [];
  //Going through all steps and sorting them in an array + adding a nr for structure later when displayed
  const instructionInputs = document.querySelectorAll('.addStep');
  instructionInputs.forEach((input, number) => {
      instructions.push({ step: number + 1, instruction: input.value }); 
  });

  // Constructing a recipe object to send as data in body
  const recipe = {
      title: title,
      description: description,
      ingredients: JSON.stringify(ingredients),
      instructions: JSON.stringify(instructions),
  };

  try {
      const response = await postTo(`/recipes`, recipe, token);
      if (response.ok) {
          console.log("Recipe created successfully");
          displayMyRecipes();
      } else {
          console.log("Failed to create recipe:", response.statusText);
      }
  } catch (error) {
      throw new Error("Error during recipe creation:", error);
  }
});




async function postTo(url, recipe, token){
  let cfg = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": token  
    },
    body: JSON.stringify(recipe),
};
console.log('Making POST request to:', url, 'with config:', cfg);
const response = await fetch(url, cfg);
return response;
  

}