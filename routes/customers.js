const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');

const mongoose = require('mongoose');

router.use(express.json());


const Customers = mongoose.model('Customers',new mongoose.Schema({
    id : Number,
    name : String,
    isGold :{ 
        default : false,
        type : Boolean,
    },
    phone : String

}));



async function createcustomer(obj){
    const customer = new Customers({
        id : parseInt(obj.id),
        name : obj.name,
        isGold : obj.isGold,
        phone : obj.phone
    })
    const result  = await customer.save();
    return result;
} 


async function getAllCustomer(){
    const customers = await Customers.find();
    return customers;
}

router.get('/',(req,res)=>{

    async function getReq(){
        const result = await getAllCustomer();
        res.send(result);
    }
    getReq();
    
})
  
router.get('/:id',(req,res)=>{
    async function getParticularcustomer(_id){
        const id = _id;
        const customer = await Customers.find({id : {$eq : id}}); 
        if(customer[0]==null) res.status(404).send( " customer Doesn't Exists :( .." );
        else res.send(customer);
    }
    getParticularcustomer(parseInt(req.params.id));
    
});

router.put('/:id',(req,res)=>{
    async function putcustomer(obj){
        const result = validateCustomer(req.body);
        if(result.error){
            res.status(404).send(result.error.details[0].message);
            return;
        } 
        const id_ = parseInt(obj.id);
        const oid = await Customers.find(); 
       
        const customer = await Customers.findByIdAndUpdate(oid[id_-1]._id,{$set :{
            id : id_,
            name : obj.name,
            isGold : obj.isGold,
            phone : obj.phone
        } },{new : true}); 
        
        res.send(customer);
    }
    putcustomer(req.body);
});

router.post('/',(req,res)=>{
    const result = validateCustomer(req.body);
    if(result.error){
        res.status(404).send(result.error.details[0].message);
        return;
    }
    async function postReq(){
        const result  = await createcustomer(req.body);
        res.send(result);
    }
    postReq();
});

router.delete('/:id',async(req,res)=>{
    const oid = await Customers.find();
    if(oid[parseInt(req.params.id)-1]==null) res.status(404).send('customer not found :(..');
    const customer = await Customers.findByIdAndRemove(oid[parseInt(req.params.id)-1]._id);
    res.send(customer);

});

function validateCustomer(customer){
    const schema = {
        id : Joi.number(),
        name : Joi.string().min(3).required(),
        phone : Joi.string().min(3).required(),
        isGold : Joi.string(),
    };
    return Joi.validate(customer,schema);
}

module.exports = router;