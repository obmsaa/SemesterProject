// Function to fetch recipes and display them
async function displayRecipes() {
    try {
      const response = await getFrom('/recipes'); // Adjust the endpoint as necessary
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
        for (let ingredient of recipe.ingredients) {
          ingredientsList += `<li>${ingredient}</li>`;
        }
        ingredientsList += '</ul>';
        recipeEl.innerHTML = `
          <h3>${recipe.title}</h3>
          <p>${recipe.description}</p>
          ${ingredientsList}
          <p>${recipe.instructions}</p>
        `;
        container.appendChild(recipeEl);
      });
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
}

// Call the function to load and display recipes
displayRecipes();


async function getFrom(url){
    let cfg = {
        method: "GET"
    };
    console.log('Making GET request to:', url);
    const response = await fetch(url, cfg);
    return response;
}
