const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./models/recipeModel');
const List = require('./models/listModel');
require('dotenv/config');
const multer = require('multer');
const upload = multer({dest: 'uploads/'})

const app = express();
const PORT = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
const mongoURI = 'mongodb+srv://dbAdminUser:r11r2jFZkQ9VhIdQ@nodestorecluster.ob64v.mongodb.net/recipe?retryWrites=true&w=majority';

mongoose.connect(mongoURI,
    {useNewUrlParser: true, useUnifiedTopology: true});

app.listen(process.env.PORT || 3000, () =>{
    console.log(`Recipe App server running on port ${PORT}`);
})


// ============== RECIPE APP CRUD METHODS =============
// ============== (GET) ALL RECIPES =============
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
        // img: req.file
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
app.post('/api/addList' ,(req, res) => {
    console.log(req.body);

    List.create({
        listTitle: req.body.listTitle,
        items: req.body.items

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

app.put('/api/:id', (req, res) => {
    List.findById(req.params.id, (err, list) => {
        if (err)
            console.log(handleError(err));
        list.update({items: req.body[0].items}, (err) => {
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

app.put('/api/addIngreds/:id', (req, res) => {
    // let newItems;
    List.findById(req.params.id, (err, list) => {
        if (err)
            console.log(handleError(err));
        const newItems = [...list.items, ...req.body]
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