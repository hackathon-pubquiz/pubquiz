const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 8080;

const { Pub, Group, Person, Question } = require("./models");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', (client) => {
  client.on('click', data => {
    console.log('User clicked');
  });
  //client.on('disconnect', () => { /* … */ });
});

app.get("/api/hello", (req, res) => {
  res.send({ express: "Hello From Express" });
});

app.post("/api/world", (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`
  );
});

server.listen(port, () => console.log(`Listening on port ${port}`));
