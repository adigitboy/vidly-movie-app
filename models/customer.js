const mongoose = require('mongoose');
const Joi = require('@hapi/joi');


const Customers = mongoose.model('Customers',new mongoose.Schema({
    id : Number,
    name : String,
    isGold :{ 
        default : false,
        type : Boolean,
    },
    phone : String

}));

function validateCustomer(customer){
    const schema = {
        id : Joi.number(),
        name : Joi.string().min(3).required(),
        phone : Joi.string().min(3).required(),
        isGold : Joi.string(),
    };
    return Joi.validate(customer,schema);
}

exports.Customers = Customers;
exports.validateCustomer = validateCustomer; 