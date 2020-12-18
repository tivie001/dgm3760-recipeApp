const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./models/recipeModel');
const List = require('./models/listModel');
// require('dotenv/config');
const app = express();
const PORT = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
// const mongoURI = 'mongodb+srv://dbAdminUser:r11r2jFZkQ9VhIdQ@nodestorecluster.ob64v.mongodb.net/recipe?retryWrites=true&w=majority';

mongoose.connect(process.env.MONGODB_URI,
    {useNewUrlParser: true, useUnifiedTopology: true});

app.listen(process.env.PORT || 3000, () =>{
    console.log(`Recipe App server running on port ${PORT}`);
})


// ============== RECIPE CRUD METHODS =============
// ============== (GET) GET DATA =============
app.get('/api', (req, res) => {
    Recipe.find((err, recipes) => {
        if (err)
            console.log(handleError(err));
        res.json(recipes);
    })
})
app.get('/api/lists', (req, res) => {
    List.find((err, lists) => {
        if (err)
            console.log(handleError(err));
        res.json(lists);
    })
})


// ============== (POST) NEW RECIPE =============
app.post('/api/addRecipe',(req, res) => {
    console.log(req.body);
    console.log(req.file);

    Recipe.create({
        title: req.body.title,
        subTitle: req.body.subTitle,
        rating: req.body.rating,
        prepDetails: req.body.prepDetails,
        prepHours: req.body.prepHours,
        prepMins: req.body.prepMins,
        totalHours: req.body.totalHours,
        totalMins: req.body.totalMins,
        difficulty: req.body.difficulty,
        ingredients: req.body.ingredients,
        directions: req.body.directions,
        img: req.body.imagePath
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
// ============== (PUT) UPDATE RECIPE =============
app.put('/api/:id', (req, res) => {
    Recipe.findById(req.params.id, (err, recipe) => {
        if (err)
            console.log(handleError(err));
        recipe.update(req.body, (err) => {
            if (err)
                console.log(err);
            Recipe.find((err, recipe) => {
                if (err)
                    console.log(handleError(err));
                res.json(recipe);
            })
        })
    })
})

// ============== (DELETE) RECIPE =============
app.delete('/api/:id', (req, res) => {
    Recipe.remove({
        _id: req.params.id
    }, (err) => {
        if (err)
            console.log(handleError(err));
        Recipe.find((err, recipes) => {
            if (err)
                console.log(handleError(err));
            res.json(recipes);
        })
    })
})
// ============== LIST CRUD METHODS =============

app.post('/api/addList' ,(req, res) => {
    console.log(req.body);

    List.create({
        listTitle: req.body.listTitle,
        items: req.body.items,
        category: req.body.category

    }, (err) => {
        if (err)
            console.log(err);
        List.find((err, lists) => {
            if (err)
                console.log(handleError(err));
            res.json(lists);
        })
    })
})
// ============== (PUTS) UPDATE LIST =============
app.put('/api/updateList/:id', (req, res) => {
    console.log(req.body);
    List.findById(req.params.id, (err, list) => {
        if (err)
            console.log(handleError(err));
        // console.log(list);
        list.update({items: req.body.items}, (err) => {
            if (err)
                console.log(err);
            List.find((err, list) => {
                if (err)
                    console.log(handleError(err));
                res.json(list);
            })
        })
    })
})
// ============== (PUTS) ADD INGREDIENTS TO LIST =============
app.put('/api/addIngreds/:id', (req, res) => {
    let newItems;
    List.findById(req.params.id, (err, list) => {
        if (err)
            console.log(handleError(err));
        if (list.items){
            newItems = [...list.items, ...req.body]
        } else {
            newItems = req.body;
        }
        console.log(newItems);
        list.update({items: newItems}, (err) => {
            if (err)
                console.log(err);
            List.find((err, list) => {
                if (err)
                    console.log(handleError(err));
                res.json(list);
            })
        })
    })
})

// ============== (DELETE) LIST =============
app.delete('/api/updateList/:id', (req, res) => {
    List.remove({
        _id: req.params.id
    }, (err) => {
        if (err)
            console.log(handleError(err));
        List.find((err, lists) => {
            if (err)
                console.log(handleError(err));
            res.json(lists);
        })
    })
})