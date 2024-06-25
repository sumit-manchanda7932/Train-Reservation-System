// require('dotenv').config();
// const mongoose = require('mongoose');
// const express  = require

// let db
// const uri="mongodb+srv://20threads:cp6QiByIfEnEet3z@cluster0.jcqyey4.mongodb.net/"

// connectToDb:()=>{
//     const mongoose = require('mongoose');

//     mongoose.connect(uri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     })
//     .then(() => {
//         console.log('Connected to MongoDB');
//         db = mongoose.connection.name;
//         console.log('Connected to database:', dbName);
//     })
//     .catch((error) => {
//         console.error('Error connecting to MongoDB:', error);
//     });

// }

// module.exports(connectToDb,db);