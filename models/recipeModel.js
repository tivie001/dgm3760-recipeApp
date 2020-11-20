const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    title: String,
    subTitle: String,
    rating: String,
    prepDetails: String,
    prepHours: String,
    prepMins: String,
    totalHours: String,
    totalMins: String,
    difficulty: String,
    ingredients: Array,
    directions: Array,
    img: String
})

module.exports = mongoose.model('Recipe', RecipeSchema);

