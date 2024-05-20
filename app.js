/*
    IMPORTS
*/
const express = require('express');
const { engine } = require("express-handlebars");
const exphbs = require("express-handlebars");
const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');
const corsOptions = {
    origin: [
        'https://lit-everglades-39146-fd2b4b5a3c5f.herokuapp.com',
        'https://young-temple-29103-db4fe9f80609.herokuapp.com',
        'http://localhost:3000',
      ],
    optionsSuccessStatus: 200,
  };

/*
    SETUP
*/
const app = express();
const port = process.env.PORT || 3003;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("views/public"));
app.use(cors(corsOptions));

const hbs = exphbs.create({
  partialsDir: "views/partials",
  extname: ".hbs",
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

app.post('/', async (req, res) => {
    const { species, age, condition } = req.body;
    console.log('Received data:', species, age);
    
    try {
        // Forward the data to another microservice
        const response = await axios.post('https://young-temple-29103-db4fe9f80609.herokuapp.com', { species });
        const receivedData = response.data;
        console.log('Forwarded data response:', receivedData);

        // Check the condition and respond accordingly
        if (receivedData.food) {

            let foodValue;
            if (age === "baby") {
                foodValue = "0.3 ml milk";
            } else if (age === "teenager") {
                foodValue = `0.2 ml milk and ${response.data.food * 0.5} mw ${response.data.foodshape}`;
            } else if (condition === "optimal") {
                foodValue = `${response.data.food} mw ${response.data.foodshape}`;
            } else if (condition === "underweight") {
                foodValue = `${response.data.food * 1.2} mw ${response.data.foodshape}`;
            } else if (condition === "overweight") {
                foodValue = `${response.data.food * 0.8} mw ${response.data.foodshape}`;
            }
            
            // Respond to the initial request with the calculated foodValue
            res.status(200).send({ foodValue,sizecat });
        } else {
            res.status(200).send('Data received and processed, but food is not found');
        }
    } catch (error) {
        console.error('Error forwarding data:', error);
        res.status(500).send('Error forwarding data');
    }
});


app.get('/', (req, res) => {
    res.send('hi microserviceB');
});

app.listen(port, () => {
    console.log(`Microservice listening at http://localhost:${port}`);
});