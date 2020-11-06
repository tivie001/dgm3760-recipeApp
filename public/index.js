// const url = 'https://todo-app-dgm3760.herokuapp.com'
let recipes = [];

function getRecipes() {
    axios.get('/api')
        .then(function (response) {
            let tableRows = [];
            const recipeNames = response.data;
            console.log(recipeNames);
            recipeNames.forEach((recipe) => {
                recipes.push(recipe);
                tableRows += `<tr id="${recipe._id}" onclick="getRecipeDetails(this.id)">
                                <td class="mdl-data-table__cell--non-numeric">${recipe.title}
                                    <br><small class="subtitle-name">${recipe.subTitle}</small>
                                </td>
                              </tr>`
            })
            document.getElementById("recipe-name-table").innerHTML = tableRows;
        })
        .catch(function (error) {
            console.log(error);
        })
}


function getRecipeDetails(id) {
    console.log(recipes);
    const recipeDetails = recipes.filter((recipe) => recipe._id === id);
    console.log(recipeDetails);
    document.getElementById("cardContainer").innerHTML +=
            `<div class="demo-card-wide mdl-card mdl-shadow--2dp">
                <img class="card-image" src="images/header-image.jpg"/>
                <div class="card-title">
                  <h2>${recipeDetails[0].title}</h2>
                  <h4 style="color: #868686">${recipeDetails[0].subTitle}</h4>
                </div>
                <div class="details-row">
                    <div>
                        <p class="featured-details">${recipeDetails[0].prepTime}</p>
                        <p>Prep Time</p>
                    </div>
                    <div>
                        <p class="featured-details">${recipeDetails[0].totalTime}</p>
                        <p>Total Time</p>
                    </div>
                    <div>
                        <p class="featured-details">${recipeDetails[0].rating}</p>
                        <p>Rating</p>
                    </div>
                    <div>
                        <p class="featured-details">${recipeDetails[0].difficulty}</p>
                        <p>Difficulty</p>
                    </div>
                </div>
                <div class="mdl-card__supporting-text">
                  ${recipeDetails[0].prepDetails}<br>
                  <ul>
                    <li>${recipeDetails[0].ingredients}</li>  
                  </ul>
                  <ol>
                    <li>${recipeDetails[0].directions}</li>  
                  </ol>
                </div>
                <div class="mdl-card__actions mdl-card--border">
                  <a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"></a>
                </div>
                <div class="mdl-card__menu">
                  <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                    <i class="material-icons">share</i>
                  </button>
                </div>
              </div>`

}