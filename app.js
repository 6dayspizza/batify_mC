/*
    IMPORTS
*/
const express = require('express');
const { engine } = require("express-handlebars");
const exphbs = require("express-handlebars");
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');
const corsOptions = {
    origin: 'https://lit-everglades-39146-fd2b4b5a3c5f.herokuapp.com',
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


app.listen(port, () => {
    console.log(`Microservice listening at http://localhost:${port}`);
});