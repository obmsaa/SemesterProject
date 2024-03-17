// Function to fetch recipes and display them
async function displayAllRecipes() {
    try {
      const response = await getFrom('/recipes'); 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const recipes = await response.json();
  
      const container = document.getElementById('recipe-container');
      container.innerHTML = ''; // Clear existing content
  
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
      alert("Error fetching recipes", error)
      throw new Error('Error fetching recipes:', error);
    }
}

// Calling the function to load and display recipes
displayAllRecipes();


async function getFrom(url){
    let cfg = {
        method: "GET"
    };
    console.log('Making GET request to:', url);
    const response = await fetch(url, cfg);
    return response;
}
