const express = require('express');
const app = express();
const router = require('./routes/genres');

app.use('/api/genres',router);

app.get('/',(req,res)=>{
    res.send('Hello there!,..');
});

app.listen(3000,()=>{
    console.log('Listening to port 3000..');
});

