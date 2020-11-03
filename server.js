const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./models/recipeModel');

const app = express();
const PORT = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.connect('mongodb+srv://dbAdminUser:r11r2jFZkQ9VhIdQ@nodestorecluster.ob64v.mongodb.net/recipe?retryWrites=true&w=majority',
    {useNewUrlParser: true, useUnifiedTopology: true});
app.listen(process.env.PORT || 3000, () =>{
    console.log(`Recipe App server running on port ${PORT}`);
})

// ============== RECIPE APP CRUD METHODS =============
// ============== (GET) ALL RECIPES =============
app.get('/api', (req, res) => {

})


// ============== (POST) NEW RECIPE =============
app.post('/api/addRecipe', (req, res) => {
    Recipe.create({
        title: req.body.title,
        subTitle: req.body.subTitle,
        rating: req.body.rating,
        prepDetails: req.body.prepDetails,
        prepTime: req.body.prepTime,
        totalTime: req.body.totalTime,
        difficulty: req.body.difficulty,
        ingredients: req.body.ingredients,
        directions: req.body.directions
    }, (err) => {
        if (err)
            console.log(err);
        Recipe.find((err, recipes) => {
            if (err)
                console.log(handleError(err));
            res.json(recipes);
        })
    })
})
