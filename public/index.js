const url = 'http://localhost:3000'
let recipes = [];
let lists = [];
const recipeForm = document.querySelector('#addRecipeForm');
const listForm = document.querySelector('#addListForm');

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
            document.getElementById("recipeNameTable").innerHTML = tableRows;
        })
        .catch(function (error) {
            console.log(error);
        })
}


function getRecipeDetails(id) {
    const recipeDetails = recipes.filter((recipe) => recipe._id === id);
    document.getElementById("cardContainer").innerHTML = '';
    console.log(recipeDetails);
    let ingredientStr = '';
    let directionStr = '';

    recipeDetails[0].ingredients.forEach((ingredient) => {
        if (ingredient !== null || ingredient !== undefined)
            ingredientStr += `<li style="padding-top: 7px">${ingredient}</li>`
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
if (recipeForm){
    recipeForm.addEventListener('submit', (e) => {
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
                document.getElementById("recipeNameTable").innerHTML = getRecipes(recipes);
            })
        }

    });
}



function addIngredient() {
    var str = '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">\n' +
        '                  <input class="mdl-textfield__input ingredient" type="text" id="ingredient">\n' +
        '                  <label class="mdl-textfield__label" for="ingredient">New Ingredient</label>\n' +
        '                </div>'
    ingredientsContainer = document.getElementById( 'ingredients');
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
function addTodoItem() {
    var str = '<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">\n' +
        '                  <input class="mdl-textfield__input item" type="text" id="item" name="item">\n' +
        '                  <label class="mdl-textfield__label" for="item">New Item</label>\n' +
        '                </div>'
    directionsContainer = document.getElementById( 'items');
    directionsContainer.insertAdjacentHTML( 'beforeend', str );
    directionsContainer.classList.remove("is-upgraded");
    directionsContainer.removeAttribute("data-upgraded");
    componentHandler.upgradeDom();
}

var dialog = document.querySelector('dialog');
var showDialogButton = document.querySelector('#show-dialog');
if (! dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
}
showDialogButton.addEventListener('click', function() {
    dialog.showModal();
});
dialog.querySelector('.close').addEventListener('click', function() {
    dialog.close();
});





function getLists() {
    axios.get('/api/lists')
        .then(function (response) {
            let tableRows = [];
            const myLists = response.data;
            console.log(myLists);
            myLists.forEach((list) => {
                lists.push(list);
                tableRows += `<div class="demo-card-wide mdl-card mdl-shadow--2dp" id="${list._id}" style="margin-top: 2rem">
                            <div class="mdl-card__title list-card">
                                <h2 class="mdl-card__title-text"><i class="material-icons" style="padding-right: 1rem">shopping_cart</i>${list.listTitle}</h2>
                            </div>
                            <div class="mdl-card__actions mdl-card--border">
                                <button class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" id="${list._id}" onclick="getListDetails(this.id)">
                                    View List
                                </button>
                            </div>
                        </div>`
            })
            document.getElementById("listCards").innerHTML = tableRows;
        })
        .catch(function (error) {
            console.log(error);
        })
}

function getListDetails(id) {
    console.log(id);
    const listDetails = lists.filter((list) => list._id === id);
    console.log(listDetails);
    document.getElementById("listDetailsContainer").innerHTML = ''
    let listItems = '';
    listDetails[0].items.forEach((item, index) => {
        console.log(item);
        console.log(typeof item);
        if (item !== null || item !== undefined)
            console.log(index);
            listItems += ` 
                <tr class='${item.completed ? "is-selected" : "" }'>
                    <td>
                        <label 
                        class='${item.completed ? "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select mdl-js-ripple-effect--ignore-events is-upgraded is-checked" 
                        : "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select mdl-js-ripple-effect--ignore-events is-upgraded"}'
                        data-upgraded=",MaterialCheckbox,MaterialRipple">
                            <input type="checkbox" class="mdl-checkbox__input" id="${listDetails[0]._id}" onclick="updateListItem(this.id, ${index})">
                            <span class="mdl-checkbox__focus-helper"></span>
                            <span class="mdl-checkbox__box-outline">
                                <span class="mdl-checkbox__tick-outline"></span>
                            </span>
                            <span class="mdl-checkbox__ripple-container mdl-js-ripple-effect mdl-ripple--center" data-upgraded=",MaterialRipple">
                                <span class="mdl-ripple is-animating" style="width: 103.823px; height: 103.823px; transform: translate(-50%, -50%) translate(18px, 18px);"></span>
                            </span>
                        </label>
                   </td>
                    <td class='${item.completed ? "mdl-data-table__cell--non-numeric checked-off" : "mdl-data-table__cell--non-numeric"}'>
                        ${item.name}
                    </td>
                </tr>`
    })


    document.getElementById("listDetailsContainer").innerHTML +=
        `<table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" id="listTable">
            <thead>
               <tr>
               <th></th>
                <th class="mdl-data-table__cell--non-numeric">
                    ${listDetails[0].listTitle}
                </th>
               </tr>
            </thead>
            <tbody>
                ${listItems}
            </tbody>
        </table>`
    // listTable = document.getElementById( 'listTable');
    checkboxLabel = document.querySelectorAll( '.mdl-checkbox');
    checkboxLabel.forEach(checkbox => {
        checkbox.removeAttribute("data-upgraded");
        // componentHandler.upgradeDom();
    })
    // listTable.removeAttribute("data-upgraded");
}

listForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const items = [];
    const listTitle = document.querySelector("#listTitle").value;
    let todoItems, i;
    todoItems = document.querySelectorAll(".item");
    let todoObj = {};
    for (i = 0; i < todoItems.length; i++) {
        todoObj = {
            name: todoItems[i].value,
            completed: false
        }
        items.push(todoObj);
    }
    const bodyData = {
        listTitle,
        items
    };
    if (listTitle) {
        async function addRecipe() {
            const response = await fetch(`${url}/api/addList`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData)
            });
            const lists = await response.json();
            return lists;
        }
        addRecipe().then((lists) => {
            document.getElementById("listCards").innerHTML = getLists(lists);
        })
    }
});

function updateListItem(id, index) {
    const listItem = lists.filter((list) => list._id === id);
    console.log(listItem);
    const indexedItem = listItem[0].items[index];
    indexedItem.completed = !indexedItem.completed;
    console.log(listItem);

    axios.put(`/api/${id}`, listItem)
        .then(function () {
            getLists();
            document.getElementById("listDetailsContainer").innerHTML = ''
            getListDetails(id);
        })
        .catch(function (error) {
            console.log(error);
        })
}
