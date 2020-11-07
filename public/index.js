const url = 'http://localhost:3000'
let recipes = [];
const form = document.querySelector('#addRecipeForm');

function getRecipes() {
    axios.get('/api')
        .then(function (response) {
            let tableRows = [];
            const recipeNames = response.data;
            console.log(recipeNames);
            recipeNames.sort(function (a, b) {
                return a.value - b.value;
            });
            recipeNames.sort(function(a, b) {
                let nameA = a.title.toUpperCase();
                let nameB = b.title.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
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
    const recipeDetails = recipes.filter((recipe) => recipe._id === id);
    document.getElementById("cardContainer").innerHTML = '';
    console.log(recipeDetails);
    let ingredientStr ='';
    let directionStr ='';

    recipeDetails[0].ingredients.forEach((ingredient) => {
        console.log(ingredient);
        if (ingredient !== null || ingredient !== undefined)
            ingredientStr += `<li>${ingredient}</li>`
    })
    recipeDetails[0].directions.forEach((direction, index) => {
        if (direction !== null || direction !== undefined)
            directionStr += `<h6>${index + 1}. ${direction}</h6>`
    })

    document.getElementById("cardContainer").innerHTML +=
            `<div class="demo-card-wide mdl-card mdl-shadow--2dp">

                <img class="card-image" src="images/header-image.jpg"/>
                <div class="card-title">
                  <h2>${recipeDetails[0].title}</h2>
                  <h4 style="color: #868686">${recipeDetails[0].subTitle}</h4>
                </div>
                <div class="details-row">
                    <div>
                        <p class="featured-details">${recipeDetails[0].prepHours}hr(s). ${recipeDetails[0].prepMins}min.</p>
                        <p>Prep Time</p>
                    </div>
                    <div>
                        <p class="featured-details">${recipeDetails[0].totalHours}hr(s). ${recipeDetails[0].totalMins}min.</p>
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
                    ${recipeDetails[0].prepDetails}
                    <div style="margin-top: 2rem">
                        ${ingredientStr}
                        ${directionStr}
                    </div>
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
// document.getElementById("file").addEventListener("change", readFile);

// function readFile() {
//     let b64URL;
//
//     if (this.files && this.files[0]) {
//
//         let FR = new FileReader();
//
//         FR.addEventListener("load", function(e) {
//             document.getElementById("img").src       = e.target.result;
//             b64URL = document.getElementById("b64").innerHTML = e.target.result;
//         });
//         FR.readAsDataURL( this.files[0] );
//     }
//     return b64URL;
// }

// ******* ADD RECIPE (POST) *******
// if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const ingredients = [];
        const directions = [];
        const title = document.querySelector("#title").value;
        const subTitle = document.querySelector("#subTitle").value;
        const totalHours = document.querySelector("#totalHours").value;
        const totalMins = document.querySelector("#totalMins").value;
        const rating = document.querySelector("#rating").value;
        const difficulty = document.querySelector("#difficulty").value;
        const prepHours = document.querySelector("#prepHours").value;
        const prepMins = document.querySelector("#prepMins").value;
        const prepDetails = document.querySelector("#prepDetails").value;
        // const imagePath = document.getElementById("b64").innerHTML;

        let ingreds, i, steps, x;
        ingreds = document.querySelectorAll(".ingredient");
        steps = document.querySelectorAll(".direction");
        for (i = 0; i < ingreds.length; i++) {
            ingredients.push(ingreds[i].value);
        }
        for (x = 0; x < steps.length; x++) {
            directions.push(steps[x].value);
        }
        const bodyData = {
            title,
            subTitle,
            totalHours,
            totalMins,
            rating,
            difficulty,
            prepHours,
            prepMins,
            prepDetails,
            ingredients,
            directions
        };
        if (title && subTitle) {
            async function addRecipe() {
                const response = await fetch(`${url}/api/addRecipe`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bodyData)
                });
                const recipes = await response.json();
                return recipes;
            }
            addRecipe().then((recipes) => {
                document.getElementById("recipe-name-table").innerHTML = getRecipes(recipes);
            })
        }

    });
// }


function addIngredient() {
    var str = '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">\n' +
        '                  <input class="mdl-textfield__input ingredient" type="text" id="ingredient">\n' +
        '                  <label class="mdl-textfield__label" for="ingredient">New Ingredient</label>\n' +
        '                </div>'
    ingredientsContainer = document.getElementById( 'ingredients' );
    ingredientsContainer.insertAdjacentHTML( 'beforeend', str );
    ingredientsContainer.classList.remove("is-upgraded");
    ingredientsContainer.removeAttribute("data-upgraded");
    componentHandler.upgradeDom();
}
function addDirections() {
    var str = '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">\n' +
        '                  <input class="mdl-textfield__input direction" type="text" id="ingredient">\n' +
        '                  <label class="mdl-textfield__label" for="ingredient">New Step</label>\n' +
        '                </div>'
    directionsContainer = document.getElementById( 'directions');
    directionsContainer.insertAdjacentHTML( 'beforeend', str );
    directionsContainer.classList.remove("is-upgraded");
    directionsContainer.removeAttribute("data-upgraded");
    componentHandler.upgradeDom();
}