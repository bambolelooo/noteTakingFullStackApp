require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const { readFile, writeFile } = require("fs/promises");
const db = require("./db/db.json");
const uniqid = require("uniqid");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});
app.get("/notes", (req, res) => {
    res.sendFile(__dirname + "/public/notes.html");
});
app.get("/api/notes", (req, res) => {
    res.json(db);
});
app.post("/api/notes", (req, res) => {
    const newNote = req.body;
    newNote.id = uniqid();
    db.push(req.body);
    res.json(db);
});
app.delete("/api/notes/:id", (req, res) => {
    const id = req.params.id;
    const index = db.findIndex((note) => note.id === id);
    db.splice(index, 1);
    res.json(db);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// write to db.json every 5 minutes
setInterval(() => {
    writeFile("./db/db.json", JSON.stringify(db));
}, 300000);
