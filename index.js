const express = require('express');
const app = express();
const router = require('./routes/genres');


const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vidly').then(()=>console.log('Connected'));


app.use('/api/genres',router);

app.get('/',(req,res)=>{
    res.send('Hello there!,..');
});

app.listen(3000,()=>{
    console.log('Listening to port 3000..');
});

