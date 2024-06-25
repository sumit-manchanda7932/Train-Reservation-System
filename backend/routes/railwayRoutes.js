const express = require('express');
const model = require('../schema/TrainSchema');
const router = express.Router();
const db =require('../app.js')
const mongoose=require('mongoose')


const {Mutex} = require('async-mutex')

const bookingMutex = new Mutex()
const cancelMultex = new Mutex()


//get trains with destination and arrival
router.get('/getTrains/:departurePlace/:arrivalPlace', async (req, res) => {
    try {
        const departurePlace = req.params.departurePlace;
        const arrivalPlace = req.params.arrivalPlace;
        const Train = mongoose.model("Train Information");
        const trains = await Train.find({departurePlace:departurePlace,arrivalPlace:arrivalPlace});
        res.status(200).json(trains);
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
})

//get trains by id
router.get('/getTrains/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const Train = mongoose.model("Train Information");
        const trains = await Train.find({_id:id});
        res.status(200).json(trains);
    }
    catch (error) {
        res.status(404).json({ message: error.message })
    }
})

//Get all Trains Method
router.get('/getAllTrains', async (req, res) => {
    try {
        const Train = mongoose.model("Train Information");
        const trains = await Train.find().exec();
        res.json(trains);
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/addTrain', async(req, res) => {
    const data = new model ({
     name : req.body.name,
     trainNo :  req.body.trainNo,
     departureTime :  req.body.departureTime,
     departurePlace :  req.body.departurePlace,    
     arrivalTime:  req.body.arrivalTime,
     arrivalPlace :  req.body.arrivalPlace,
     noOfSeatsAvailable: req.body.noOfSeatsAvailable
        })
     
    try { 
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Book ticket by train id and no of tickets
router.patch('/book/:id/:noOfTickets', async (req, res) => {
    const release = await bookingMutex.acquire();

    try {
        const trainNo = req.params.id;
        const noOfTickets = req.params.noOfTickets;
        const availableSeats = await model.findById(trainNo);

        if (availableSeats.noOfSeatsAvailable >= noOfTickets) {
            //allow booking
            const updatedData = { noOfSeatsAvailable: (availableSeats.noOfSeatsAvailable - noOfTickets) };
            const options = { new: true };
            // const result = await model.findByIdAndUpdate(trainNo, updatedData, options).session(session);
            const result = await model.findByIdAndUpdate(trainNo, updatedData, options)
            // await session.commitTransaction();
            res.status(200).send(result);
        } else {
            //do not allow booking
            // await session.abortTransaction();
            return res.status(409).json({ message: "Seats Unavailable!!" });
        }

    } catch (error) {
        // await session.abortTransaction();
        res.status(400).json({ message: error.message })
    }finally{
        release();
    }
})

//cancel ticket by train id
router.patch('/cancel/:id/:noOfTickets', async (req, res) => {
    const release = await cancelMultex.acquire()

    try {
        const trainNo = req.params.id;
        const noOfTickets = req.params.noOfTickets;
        const availableSeats = await model.findById(trainNo);
        const newSeatCount = parseInt(availableSeats.noOfSeatsAvailable) + parseInt(noOfTickets);

        const updatedData = { noOfSeatsAvailable: newSeatCount };
        const options = { new: true };
        // const result = await model.findByIdAndUpdate(trainNo, updatedData, options).session(session);
        const result = await model.findByIdAndUpdate(trainNo, updatedData, options)
        // await session.commitTransaction();
        res.status(200).send(result);
    } catch (error) {
        // await session.abortTransaction();
        res.status(400).json({ message: error.message })
    } 
    finally{
        release()
    }
})

module.exports = router;