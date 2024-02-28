import { verifyToken } from "../../modules/authenticator";


// Function to fetch recipes and display them
async function displayMyRecipes() {
    try {
      let token = localStorage.getItem("authtoken");

      const {userAuthenticated, userId} = verifyToken(token);

      if(!userAuthenticated) {
        throw new Error(`Token is invalid`);

      };

      const response = await getFrom(`/recipes/user/${userId}`);


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
          ingredientsList += `<li>${ingredient}</li>`;
        });
        ingredientsList += '</ul>';
        recipeEl.innerHTML = `
          <h3>${recipe.title}</h3>
          <p class="recipeDesc">${recipe.description}</p>
          ${ingredientsList}
          <p class="recipeInstruct">${recipe.instructions}</p>
        `;
        container.appendChild(recipeEl);
      });
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
}

// Call the function to load and display recipes
displayMyRecipes();


async function getFrom(url){
    let cfg = {
        method: "GET"
    };
    console.log('Making GET request to:', url);
    const response = await fetch(url, cfg);
    return response;
}
