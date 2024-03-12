

// Function to fetch recipes and display them
async function displayMyRecipes() {
  console.log("Display recipes is running")

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
throw new Error("Error in myRecipes.js: ", error)
    }
}

// Call the function to load and display recipes
displayMyRecipes();


async function getFrom(url, token){

    let cfg = {
        method: "GET",
        headers: {
            "Authorization": `${token}`
        }
    };
    console.log('Making GET request to:', url);
    const response = await fetch(url, cfg);
    return response;
}

