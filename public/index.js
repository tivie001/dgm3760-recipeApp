const url = 'http://localhost:3000'
const imageURL = "https://api.unsplash.com/";
const API_KEY = 'eRc8A7PplvKHhAGhzHyRcYKg4sgGLvgWN7MmZ_TtP5I';
let searchedImages;
let recipes = [];
let lists = [];
let images = [];
let selectedRecipeDetails = [];
let selectedListDetails = [];
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
    selectedRecipeDetails = recipeDetails[0];
    document.getElementById("cardContainer").innerHTML = '';
    let ingredientStr = '';
    let directionStr = '';

    recipeDetails[0].ingredients.forEach((ingredient) => {
        if (ingredient)
            ingredientStr += `<li style="padding-top: 7px">${ingredient}</li>`
    })
    recipeDetails[0].directions.forEach((direction, index) => {
        if (direction)
            directionStr += `<h6>${index + 1}. ${direction}</h6>`
    })

    document.getElementById("cardContainer").innerHTML +=
            `<div class="demo-card-wide mdl-card mdl-shadow--2dp">
                <img class="card-image" src="${recipeDetails[0].img}"/>
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
                  <button id="showIngredsDialog" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" 
                  onclick="showIngredientsDialog(selectedRecipeDetails)">
                    Add Ingredients To List
                  </button>
                </div>
                <div class="mdl-card__menu">
                  <div class="card-icons">
                    <button id="showEditDialog" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" onclick="toggleEditRecipe()">
                        <i class="material-icons">create</i>
                    </button>
                  </div>
                </div>
              </div>`

    var ingredsDialog = document.getElementById('ingredsDialog');
    var showIngredListDialogBtn = document.querySelector('#showIngredsDialog');
    if (! ingredsDialog.showModal) {
        dialogPolyfill.registerDialog(ingredsDialog);
    }
    showIngredListDialogBtn.addEventListener('click', function() {
        ingredsDialog.showModal();
    });
    ingredsDialog.querySelector('.close').addEventListener('click', function() {
        ingredsDialog.close();
    });

    let editDialog = document.getElementById('editDialog');
    let showEditDialogBtn = document.querySelector('#showEditDialog');
    console.log(editDialog);
    console.log(showEditDialogBtn);
    if (! editDialog.showModal) {
        dialogPolyfill.registerDialog(editDialog);
    }
    showEditDialogBtn.addEventListener('click', function() {
        editDialog.showModal();
    });
    editDialog.querySelector('.close').addEventListener('click', function() {
        editDialog.close();
    });
}
function closeModal() {
    const ingredsDialog = document.getElementById('ingredsDialog');
    const editDialog = document.getElementById('editDialog');
    ingredsDialog.close();
    editDialog.close();
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
        const imagePath = document.querySelector(".img-selected").src;
        console.log(imagePath);

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
            directions,
            imagePath
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
    todoItem = document.getElementById( 'items');
    todoItem.insertAdjacentHTML( 'beforeend', str );
    todoItem.classList.remove("is-upgraded");
    todoItem.removeAttribute("data-upgraded");
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
                            <div class='${list.category === "Shopping" ? "mdl-card__title shopping-list-card" : "mdl-card__title general-list-card"}'>
                                <h2 class="mdl-card__title-text">
                                    <i class="material-icons" style="padding-right: 1rem">${list.category === 'Shopping' ? 'shopping_cart' : 'list'}</i>
                                    ${list.listTitle}
                                </h2>
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
    const listDetails = lists.filter((list) => list._id === id);
    selectedListDetails = listDetails[0];
    console.log(selectedListDetails);
    document.getElementById("listDetailsContainer").innerHTML = '';
    let listItems = '';
    listDetails[0].items.forEach((item, index) => {
        if (item)
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
                    <td>
                        <button type="button" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect trash-icon" id="${index}" onclick="deleteTodoItem(this.id)">                       
                            <i class="material-icons">delete</i>
                        </button>
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
    checkboxLabel = document.querySelectorAll( '.mdl-checkbox');
    checkboxLabel.forEach(checkbox => {
        checkbox.removeAttribute("data-upgraded");
        // componentHandler.upgradeDom();
    })
}
if (listForm) {
    listForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const items = [];
        const listTitle = document.querySelector("#listTitle").value;
        const category = document.querySelector("#category").value;
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
            category,
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
}

function updateListItem(id, index) {
    const listItem = lists.filter((list) => list._id === id);
    const indexedItem = listItem[0].items[index];
    indexedItem.completed = !indexedItem.completed;

    axios.put(`/api/updateList/${id}`, listItem)
        .then(function () {
            getLists();
            document.getElementById("listDetailsContainer").innerHTML = ''
            getListDetails(id);
        })
        .catch(function (error) {
            console.log(error);
        })
}

function deleteTodoItem(index) {
    console.log(selectedListDetails);
    const id = selectedListDetails._id;
    selectedListDetails.items.splice(index, 1);
    axios.put(`/api/updateList/${id}`, selectedListDetails)
        .then(function () {
            getLists();
            document.getElementById("listDetailsContainer").innerHTML = ''
            getListDetails(id);
        })
        .catch(function (error) {
            console.log(error);
        })
}

function showIngredientsDialog(details) {
    let listItems = '';
    lists.forEach((list, index) => {
        // listItems += `<li class="mdl-menu__item" data-val="${index}">${list.listTitle}</li>`
        listItems += `<option value="${list._id}">${list.listTitle}</option>`
    })
    console.log(listItems);
    document.getElementById("ingredsTable").innerHTML =
            `<table class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp" id="listTable">
             <thead>
               <tr>
                <th class="mdl-data-table__cell--non-numeric"></th>
               </tr>
             </thead>
             <tbody id="selectIngreds">
                ${formatIngredsTable(details)}
             </tbody>
        </table>`
    listedItems = document.getElementById( 'selectList');
    listedItems.insertAdjacentHTML( 'beforeend', listItems);
    componentHandler.upgradeDom();
}

function formatIngredsTable(details) {
    let tableRows = '';
    if (details) {
        details.ingredients.forEach((item, index) => {
            if (item)
                tableRows += ` 
                    <tr>
                        <td>
                            ${item}
                        </td>
                    </tr>`
        })
        checkboxLabel = document.querySelectorAll( '.mdl-checkbox');
        checkboxLabel.forEach(checkbox => {
            checkbox.removeAttribute("data-upgraded");
            componentHandler.upgradeDom();
        })
        return tableRows;
    }
}
function addIngredientToList() {
    let addedIngreds = [];
    let todoObj = {};
    const id = document.getElementById("selectList").value;
    const ingredDiv = document.getElementById("selectIngreds");
    const selectedIngreds = ingredDiv.querySelectorAll("tr.is-selected");
    selectedIngreds.forEach((ingred) => {
        todoObj = {
            name: ingred.innerText,
            completed: false
        }
        addedIngreds.push(todoObj);
    })
    console.log(addedIngreds);
    console.log(id);

    axios.put(`/api/addIngreds/${id}`, addedIngreds)
        .then(function () {
            getLists();
            document.getElementById("listDetailsContainer").innerHTML = ''
            getListDetails(id);
            closeModal();
        })
        .catch(function (error) {
            console.log(error);
        })

}

function toggleEditRecipe() {
    const recipeDetails = selectedRecipeDetails;
    console.log(recipeDetails);
    document.querySelector('#editTitle').value = recipeDetails.title;
    document.querySelector('#editSubTitle').value = recipeDetails.subTitle;
    document.querySelector('#editTotalHours').value = recipeDetails.totalHours;
    document.querySelector('#editTotalMin').value = recipeDetails.totalMins;
    document.querySelector('#editRating').value = recipeDetails.rating;
    document.querySelector('#editDifficulty').value = recipeDetails.difficulty;
    document.querySelector('#editPrepHours').value = recipeDetails.prepHours;
    document.querySelector('#editPrepMins').value = recipeDetails.prepMins;
    document.querySelector('#editPrepDetails').value = recipeDetails.prepDetails;

    ingredientsContainer = document.getElementById( 'editIngredients');
    recipeDetails.ingredients.forEach((ingred, index) => {
        var str = `<section id="${index}"><div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label editable-inputs">
                             <input class="mdl-textfield__input edit-ingredient" value="${ingred}" id="${index}" type="text" id="editIngredient">
                             <label class="mdl-textfield__label" for="editIngredient">New Ingredient</label>
                         </div> 
                         <button type="button" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect trash-icon" id="${index}" onclick="removeIndex(this.id)">
                            <i class="material-icons">delete</i>
                         </button></section>`
        ingredientsContainer.insertAdjacentHTML( 'beforeend', str );
    })
    directionsContainer = document.getElementById( 'editDirections');
    recipeDetails.directions.forEach((direct, index) => {
        var str = `<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label editable-inputs">
                             <input class="mdl-textfield__input edit-direction" value="${direct}" id="${index}" type="text" id="editDirection">
                             <label class="mdl-textfield__label" for="editDirection">New Step</label>
                         </div>
                         <button type="button" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect trash-icon" onclick="removeIndex()">
                            <i class="material-icons">delete</i>
                         </button>
                        `
        directionsContainer.insertAdjacentHTML( 'beforeend', str );
    })

    ingredientsContainer = document.querySelectorAll( '.editable-inputs');
    ingredientsContainer.forEach(input => {
        input.removeAttribute("data-upgraded");
        componentHandler.upgradeDom();
    })
}
function removeIndex(index) {
    ingredientsContainer = document.getElementById( 'editIngredients');
    const ingredientDiv = ingredientsContainer.getElementsByTagName("section")[index];
    const input = ingredientDiv.getElementsByClassName('edit-ingredient');
    selectedRecipeDetails.ingredients.splice(index, 1);
    ingredientDiv.classList.add('hide-element');
    input[0].classList.remove('edit-ingredient');
}
function editAddIngredients() {
    const index = (selectedRecipeDetails.ingredients.length);
    var str = `<section id="${index}"><div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input class="mdl-textfield__input edit-ingredient" type="text" id="editIngredient">
                    <label class="mdl-textfield__label" for="editIngredient">New Ingredient</label>
               </div>
              <button type="button" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect trash-icon" id="${index}" onclick="removeIndex(this.id)">                       
                <i class="material-icons">delete</i>
              </button></section>`
    ingredientsContainer = document.getElementById( 'editIngredients');
    ingredientsContainer.insertAdjacentHTML( 'beforeend', str );
    ingredientsContainer.classList.remove("is-upgraded");
    ingredientsContainer.removeAttribute("data-upgraded");
    componentHandler.upgradeDom();
}
function editAddDirections() {
    var str = '<section><div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">\n' +
        '                  <input class="mdl-textfield__input edit-direction" type="text" id="editDirection">\n' +
        '                  <label class="mdl-textfield__label" for="editDirection">New Step</label>\n' +
        '                </div> ' +
        '                       <button type="button" class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect trash-icon" onclick="removeIndex()">\n                                ' +
        '                           <i class="material-icons">delete</i>\n                             ' +
        '                       </button></section>'
    directionsContainer = document.getElementById( 'editDirections');
    directionsContainer.insertAdjacentHTML( 'beforeend', str );
    directionsContainer.classList.remove("is-upgraded");
    directionsContainer.removeAttribute("data-upgraded");
    componentHandler.upgradeDom();
}
function updateRecipe(){
    const ingredients = [];
    const directions = [];
    const id = selectedRecipeDetails._id;
    const ingredientsContainer = document.querySelectorAll('.edit-ingredient');
    const directionsContainer = document.querySelectorAll('.edit-direction');
    ingredientsContainer.forEach((ingredient) => {
        if(ingredient)
            ingredients.push(ingredient.value);
    })
    directionsContainer.forEach((direction, index) => {
        if(direction)
            directions.push(direction.value);
    })

    const bodyData = {
        title: document.querySelector( '#editTitle').value,
        subTitle: document.querySelector( '#editSubTitle').value,
        totalHours: document.querySelector( '#editTotalHours').value,
        totalMins: document.querySelector( '#editTotalMin').value,
        rating: document.querySelector( '#editRating').value,
        difficulty: document.querySelector( '#editDifficulty').value,
        prepHours: document.querySelector( '#editPrepHours').value,
        prepMins: document.querySelector( '#editPrepMins').value,
        prepDetails: document.querySelector( '#editPrepDetails').value,
        ingredients: ingredients,
        directions: directions
    };

    axios.put(`/api/${id}`, bodyData)
        .then(function () {
            getRecipeDetails(id)
            closeModal();
        })
        .catch(function (error) {
            console.log(error);
        })
}
function searchImages(){
    const searchTerm = document.querySelector('#imgSearch').value;
    let newImg;
    fetch(imageURL + `search/photos?client_id=${API_KEY}&query=${searchTerm}&orientation=landscape`, {
        headers: {
            "Accept-Version": "v1"
        }
    })
        .then((res => res.json()))
        .then(function(res) {
            console.log(res);
            res.results.forEach((img, index) => {
                images.push(img);
                newImg += `<img src=${img.urls.regular} alt="${img.alt_description}" id="${img.id}" width="200" height="200" class="search-images" onclick="imageSelect(this.id)"/>`
            })
            document.getElementById("imageContainer").innerHTML = newImg;
        }).catch(function(err) {
        console.log(err);
    })
}
function imageSelect(id){
    const searchedImages = document.querySelectorAll('.search-images')
    searchedImages.forEach(el => {
        el.classList.remove("img-selected");
    })
    const selectedImg = document.getElementById(id);
    selectedImg.classList.add("img-selected");
}
