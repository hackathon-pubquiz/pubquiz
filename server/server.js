const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 8080;

const { Pub, Group, Person, Question, Session } = require("./models");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = require("http").createServer(app);
const io = require("socket.io")(server);

const WebsocketHandler = require("./websocketHandler");
const websocketHandler = new WebsocketHandler(io);

const session = require("express-session");
app.use(session({ secret: "such pub much wow", resave: false }));

// BEGIN pub
app.get("/api/pubs", (req, res) => {
  Pub.findAll().then(result => {
    res.json(result);
  });
});

app.get("/api/pub/:id", (req, res) => Pub.findByPk(req.params.id).then(result => res.json(result)));

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

app.get("/api/person/:id", (req, res) => Person.findByPk(req.params.id).then(result => res.json(result)));

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

app.get("/api/question/:id", (req, res) => Question.findByPk(req.params.id).then(result => res.json(result)));

app.post("/api/questions", (req, res) => {
  console.log(JSON.stringify(req.body));
});

// TODO: post question
// TODO: put question
// TODO: delete question?

app.get("/api/groups", (req, res) => {
  Group.findAll().then(result => {
    res.json(result);
  });
});

app.get("/api/group/:id", (req, res) => Group.findByPk(req.params.id).then(result => res.json(result)));

app.post("/api/group", async (req, res) => {
  const groupName = req.body.groupName;
  const isPublic = req.body.public;

  const [group, created] = await Group.findOrCreate({
    where: { name: groupName },
    defaults: {
      public: isPublic
    }
  });
  console.log(`${isPublic ? "Public" : "Private"} group ${groupName} created!`);
  res.json({
    group: group
  });
});

app.post("/api/login", async (req, res) => {
  const requested_nickname = req.body.nickname;
  const [person, personCreated] = await Person.findOrCreate({
    where: { nickname: requested_nickname }
  });

  const [session, sessionCreated] = await Session.findOrCreate({
    where: { personId: person.id }
  });
  res.json({
    person: person
  });
});

// TODO: post groups
// TODO: put groups
// TODO: delete groups?

server.listen(port, () => console.log(`Listening on port ${port}`));
