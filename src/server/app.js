const express = require('express');

const app = express();

// future use?
app.set("view engine", "ejs");

// static files
app.use(express.static('public'));

app.listen(3000);

// testing
app.get("/", (req, res) => {
    res.sendFile("/view/index.html", { root:__dirname});
});

app.get("/style.css", (req, res) => {
    res.sendFile("/view/style.css", { root:__dirname});
});

app.get("/script.js", (req, res) => {
    res.sendFile("/view/script.js", { root:__dirname});
});

app.use((req, res) => {
    res.status(404).send("<p> 404 error </p>");
})