const mongoose = require('mongoose');
const Joi = require('@hapi/joi');


const Genres = mongoose.model('Genres',new mongoose.Schema({
    id : {
        type : Number,
        required : true,
    },                                                     
    name : String,                                                 
    category : String,                                                
}));


function validateGenre(genre){
    const schema = {
        id : Joi.number(),
        name : Joi.string().min(3).required(),
        category : Joi.string(),
    };
    return Joi.validate(genre,schema);
}

exports.Genres = Genres;
exports.validateGenre = validateGenre; 