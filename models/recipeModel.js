const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    title: String,
    subTitle: String,
    rating: String,
    prepDetails: String,
    prepTime: String,
    totalTime: String,
    difficulty: String,
    ingredients: Array,
    directions: Array
})

module.exports = mongoose.model('Recipe', RecipeSchema);

