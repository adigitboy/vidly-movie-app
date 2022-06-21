const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vidly').then(()=>console.log('Connected'));


app.use('/api/genres',genres);

app.use('/api/customers',customers);

app.get('/',(req,res)=>{
    res.send('Hello there!,..');
});

app.listen(3000,()=>{
    console.log('Listening to port 3000..');
});

