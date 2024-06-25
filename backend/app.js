const express = require('express');
const app = express();
const cors = require('cors');
const { connectDb } = require('./db'); // Import connectDb function
const trainRoutes = require('./routes/railwayRoutes');

app.use(cors()); //THIS IS IMPORTANT SAURIK ; OTHERWISE FRONTEND KE TIME PE FETCH KARNE ME PROBLEM HOTA HAI
app.use(express.json());
app.use("/railway",trainRoutes);

connectDb().then((db) => {
    app.listen(5000, () => {
        console.log('App listening on port 5000');
    });
}).catch((err) => {
    console.log(err);
});
