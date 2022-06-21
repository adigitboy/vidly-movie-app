const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');

const mongoose = require('mongoose');



const genresSchema = new mongoose.Schema({
    id : Number,                                                     
    name : String,                                                 
    category : String,                                                
});

const Genres = mongoose.model('Genres',genresSchema);

async function createGenre(obj){
    const genre = new Genres({
        id : parseInt(obj.id),
        name : obj.name,
        category : obj.category,
    })
    const result  = await genre.save();
    return result;
} 

router.use(express.json());

async function getAllCourse(){
    const genres = await Genres.find();
    return genres;
}

router.get('/',(req,res)=>{

    async function getReq(){
        const result = await getAllCourse();
        res.send(result);
    }
    getReq();
    
})
  
router.get('/:id',(req,res)=>{
    async function getParticularGenre(_id){
        const id = _id;
        const genre = await Genres.find({id : {$eq : id}}); 
        if(genre[0]==null) res.status(404).send( " Genre Doesn't Exists :( .." );
        else res.send(genre);
    }
    getParticularGenre(parseInt(req.params.id));
    
});

router.put('/:id',(req,res)=>{
    async function putGenre(obj){
        const result = validateCourse(req.body);
        if(result.error){
            res.status(404).send(result.error.details[0].message);
            return;
        } 
        const id_ = parseInt(obj.id);
        const oid = await Genres.find(); 
       
        const genre = await Genres.findByIdAndUpdate(oid[id_-1]._id,{$set :{
            id : id_,
            name : obj.name,
            category : obj.category,
        } },{new : true}); 
        
        res.send(genre);
    }
    putGenre(req.body);
});

router.post('/',(req,res)=>{
    const result = validateCourse(req.body);
    if(result.error){
        res.status(404).send(result.error.details[0].message);
        return;
    }
    async function postReq(){
        const result  = await createGenre(req.body);
        res.send(result);
    }
    postReq();
});

router.delete('/:id',async(req,res)=>{
    const oid = await Genres.find();
    if(oid[parseInt(req.params.id)-1]==null) res.status(404).send('Genre not found :(..');
    const genre = await Genres.findByIdAndRemove(oid[parseInt(req.params.id)-1]._id);
    res.send(genre);

});

function validateCourse(genre){
    const schema = {
        id : Joi.number(),
        name : Joi.string().min(3).required(),
        category : Joi.string(),
    };
    return Joi.validate(genre,schema);
}

module.exports = router;