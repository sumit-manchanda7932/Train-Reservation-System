const mongoose = require("mongoose");

const TrainSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    trainNo:{
        type :String,
        required :true,
    },
    departureTime:{
        type :String,
        required :true
    },
    departurePlace:{
        type :String,
        required :true,
    },
    arrivalTime :{
        type :String,
        required :true
    },
    arrivalPlace:{
         type :String,
         required :true,
    },
    noOfSeatsAvailable:{
        type :Number,
        required :true,
    }   
});

module.exports = mongoose.model("Train Information",TrainSchema);