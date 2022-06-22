const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Genres,validateGenre} = require('../models/genre');

router.use(express.json());

async function createGenre(obj){
    const genre = new Genres({
        id : parseInt(obj.id),
        name : obj.name,
        category : obj.category,
    })
    const result  = await genre.save();
    return result;
} 

async function getAllGenre(){
    const genres = await Genres.find();
    return genres;
}

router.get('/',(req,res)=>{

    async function getReq(){
        const result = await getAllGenre();
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
        const result = validateGenre(req.body);
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
    const result = validateGenre(req.body);
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


module.exports = router;