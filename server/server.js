const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 8080;

const { Pub, Group, Person, Quiz, Question, Session } = require("./models");

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

app.get("/api/quizzes/:pubId", (req, res) => {
  Quiz.findAll({where: {pubId: req.params.pubId}}).then(result => {
    res.json(result);
  });
});

app.get("/api/quizzes", (req, res) => {
  Quiz.findAll().then(result => {
    res.json(result);
  });
});

app.get("/api/quiz/:id", (req, res) => {
  Quiz.findByPk(req.params.id).then(result => res.json(result));
});
// END quiz

app.get("/api/questions", (req, res) => {
  Question.findAll().then(result => {
    res.json(result);
  });
});

app.get("/api/questions", (req, res) => {
  Question.findAll().then(result => {
    res.json(result);
  });
});

app.get("/api/questions/:quizId", (req, res) => {
  Question.findAll({ where: { quizId: req.params.quizId } }).then(result => {
    res.json(result);
  });
});

app.get("/api/question/:id", (req, res) => Question.findByPk(req.params.id).then(result => res.json(result)));

app.post("/api/questions", async (req, res) => {
  let { pubId, quizId, date, questions } = req.body;

  let success = true;

  let quiz = null;
  if (quizId) {
    quiz = await Quiz.findByPk(quizId);
  }

  if (quiz) {
    quiz.update(date);
  } else {
    quiz = await Quiz.create({ date, pubId });
    quizId = quiz.id;
  }

  await questions.forEach((i_question, i) => {
    let { round, positionInround, question, questionExternalLink, correctAnswer } = i_question;

    Question.findOne({ where: { quizId, round, positionInround } })
      .then(result => {
        if (result) {
          return result.update({ question, questionExternalLink, correctAnswer });
        } else {
          return Question.create({ quizId, round, positionInround, question, questionExternalLink, correctAnswer });
        }
      })
      .then(opResult => {
        success = success && true;
      });
  });

  res.json({ success, quizId });
});

// TODO: post question
// TODO: put question
// TODO: delete question?

app.get("/api/groups", (req, res) => {
  Group.findAll().then(result => {
    res.json(result);
  });
});

app.get("/api/groups/:pubId", (req, res) => {
  Group.findAll({where: {pubId: req.params.pubId}}).then(result => {
    res.json(result);
  });
});

app.get("/api/group/:id", (req, res) => Group.findByPk(req.params.id).then(result => res.json(result)));

app.post("/api/group", async (req, res) => {
  const groupName = req.body.groupName;
  const isPublic = req.body.public;
  const pubId = req.body.pubId;

  const [group, created] = await Group.findOrCreate({
    where: { name: groupName },
    defaults: {
      public: isPublic,
      pubId: pubId,
    }
  });
  console.log(`${isPublic ? "Public" : "Private"} group "${groupName}" created! (Pub ${pubId})`);
  res.json({
    group: group
  });
});

// Expected body: { userId: <id>, groupId: <id>}
app.post("/api/group/join", async (req, res, next) => {
  const userId = req.body.userId;
  const groupId = req.body.groupId;

  Group.findByPk(groupId).then(group => {
    if (!group) {
      next("Group does not exist");
    } else if (group.public) {
      group.addPerson(userId);
      res.send();
    } else {
      next("Group was not public");
    }
  });
});

app.post("/api/login", async (req, res) => {
  const requested_nickname = req.body.nickname;
  const {pubId} = req.body;
  const [person, personCreated] = await Person.findOrCreate({
    where: { nickname: requested_nickname }
  });

  const [session, sessionCreated] = await Session.findOrCreate({
    where: { personId: person.id}
  });
  res.json({
    person: person
  });
});

// TODO: post groups
// TODO: put groups
// TODO: delete groups?

server.listen(port, () => console.log(`Listening on port ${port}`));
