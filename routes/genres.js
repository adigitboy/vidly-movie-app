const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vidly').then(()=>console.log('Connected'));

const genresSchema = new mongoose.Schema({
    id : Number,                                                     
    name : String,                                                 
    category : String,                                                
});

const Genres = new mongoose.model('Genres',genresSchema);

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

// router.put('/:id',(req,res)=>{
//     const genre = genres.find( c =>  c.id === parseInt(req.params.id) ); 
//     if(!genre) res.status(404).send( " Genre Doesn't Exisit :( .." );

//     const result = validateCourse(req.body);
//     if(result.error){
//         res.status(404).send(result.error.details[0].message);
//         return;
//     }
    
//     genre.name = req.body.name;
//     res.send(genre);

// });

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

// router.delete('/:id',(req,res)=>{
//     const genre = genres.find(c => c.id===parseInt(req.params.id));
//     if(!genre) res.status(404).send('Genre not found :(..');

//     genres.splice(genres.indexOf(genre),1);

//     res.send(genres);

// });

function validateCourse(genre){
    const schema = {
        id : Joi.number(),
        name : Joi.string().min(3).required(),
        category : Joi.string(),
    };
    return Joi.validate(genre,schema);
}

module.exports = router;