const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 8080;

const { Pub, Group, Person, Question } = require("./models");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = require("http").createServer(app);
const io = require("socket.io")(server);
io.on("connection", client => {
  client.on("click", data => {
    console.log("User clicked");
  });
  //client.on('disconnect', () => { /* … */ });
});

// BEGIN pub
app.get("/api/pubs", (req, res) => {
  Pub.findAll().then(result => {
    res.json(result);
  });
});

app.get("/api/pub/:id", (req, res) =>
  Pub.findByPk(req.params.id).then(result => res.json(result))
);

app.post("/api/pub", (req, res) =>
  Pub.create({
    name: req.body.name,
    donationUrl: req.body.donationUrl
  }).then(result => res.json(result))
);

app.put("/api/pub/:id", (req, res) =>
  Pub.update(
    {
      name: req.body.name,
      donationUrl: req.body.donationUrl
    },
    {
      where: {
        id: req.params.id
      }
    }
  ).then(result => res.json(result))
);
// END pub

// BEGIN  person
app.get("/api/persons", (req, res) => {
  Person.findAll().then(result => {
    res.json(result);
  });
});

app.get("/api/person/:id", (req, res) =>
  Person.findByPk(req.params.id).then(result => res.json(result))
);

app.post("/api/person", (req, res) =>
  Person.create({
    nickname: req.body.nickname
  }).then(result => res.json(result))
);

app.put("/api/person/:id", (req, res) =>
  Person.update(
    {
      nickname: req.body.name
    },
    {
      where: {
        id: req.params.id
      }
    }
  ).then(result => res.json(result))
);
//END person

app.get("/api/questions", (req, res) => {
  Question.findAll().then(result => {
    res.json(result);
  });
});

app.get("/api/question/:id", (req, res) =>
  Question.findByPk(req.params.id).then(result => res.json(result))
);

// TODO: post question
// TODO: put question
// TODO: delete question?

app.get("/api/groups", (req, res) => {
  Group.findAll().then(result => {
    res.json(result);
  });
});

app.get("/api/group/:id", (req, res) =>
  Group.findByPk(req.params.id).then(result => res.json(result))
);

// TODO: post groups
// TODO: put groups
// TODO: delete groups?

server.listen(port, () => console.log(`Listening on port ${port}`));
