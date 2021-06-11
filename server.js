const matrixHadler = require('./matrixHandler.js');
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3001;  

app.use(bodyParser.json());

//This allow requests from the frontend
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500"); // update to match the domain you will make the request from
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.post("/matrix", (req, res) => {
    const matrix = req.body;
    const result = matrixHadler.handle(matrix.data);

    res.status(201);
    res.json(result);
});

app.use(express.static('front-end'));

app.get('/', (req, res) => {
    res.sendFile('front-end/index.html', {root: __dirname});
});

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
