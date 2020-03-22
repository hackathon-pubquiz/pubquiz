const { Sequelize, Model } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite"
});

class Pub extends Model {}
Pub.init(
  {
    name: Sequelize.STRING,
    donationUrl: Sequelize.STRING
  },
  { sequelize, modelName: "pub" }
);

class Group extends Model {}
Group.init(
  {
    name: Sequelize.STRING,
    public: Sequelize.BOOLEAN
  },
  {
    sequelize,
    modelName: "group"
  }
);

class Person extends Model {}
Person.init(
  {
    nickname: Sequelize.STRING
  },
  {
    sequelize,
    modelName: "person"
  }
);

class Quiz extends Model {}
Quiz.init(
  {
    date: Sequelize.DATE,
    state: Sequelize.ENUM("running", "past", "future")
  },
  {
    sequelize,
    modelName: "quiz"
  }
);

class Question extends Model {}
Question.init(
  {
    type: Sequelize.STRING,
    round: Sequelize.INTEGER,
    positionInround: Sequelize.INTEGER,
    question: Sequelize.STRING,
    questionExternalLink: Sequelize.STRING,
    correctAnswer: Sequelize.STRING
  },
  {
    sequelize,
    modelName: "question"
  }
);

class QuestionSubmission extends Model {}
QuestionSubmission.init(
  {
    answer: Sequelize.STRING
  },
  {
    sequelize
  }
);

QuestionSubmission.belongsTo(Question);
QuestionSubmission.belongsTo(Group);
Question.hasMany(QuestionSubmission);

Quiz.hasMany(Question);
Question.belongsTo(Quiz);
Quiz.belongsTo(Pub);

Group.belongsToMany(Quiz, { through: "QuizGroups" });
Quiz.belongsToMany(Group, { through: "QuizGroups" });

Pub.hasMany(Group);
// Group.belongsTo(Pub);
Group.hasMany(Person);
Person.belongsTo(Group);

class Session extends Model {}
Session.init({}, { sequelize, modelName: "session" });
Session.belongsTo(Person);

sequelize.sync().then(() => {
  console.log("Database initialized");

  Pub.findAll().then(result => {
    if (result.length === 0) seedDatabase();
  });
});

function seedDatabase() {
  Pub.create(
    {
      name: "The Snug",
      groups: [
        { name: "Quizzer", public: true },
        { name: "Krasse Hacker", public: false }
      ]
    },
    { include: [Group] }
  ).then(() => {
    ["User1", "User2", "User3"].forEach(user => {
      Person.create({
        nickname: user,
        groupId: 1
      });
    });

    Quiz.create(
      {
        date: new Date(),
        state: "future",
        questions: [
          {
            type: "text",
            round: 1,
            positionInround: 1,
            question: "Muss das so?",
            correctAnswer: "Ja",
            pubId: 1,
            QuestionSubmissions: [
              {
                answer: "Erste Antwort",
                groupId: 1
              },
              {
                answer: "Andere Antwort",
                groupId: 2
              }
            ]
          },
          {
            type: "text",
            round: 1,
            positionInround: 2,
            question: "Könnt ihr noch?",
            correctAnswer: "Ja",
            pubId: 1,
            QuestionSubmissions: [
              {
                answer: "Dritte",
                groupId: 1
              },
              {
                answer: "Vierte",
                groupId: 2
              }
            ]
          },
          {
            type: "text",
            round: 2,
            positionInround: 1,
            question: "Habt ihr genug getrunken?",
            correctAnswer: "Ja",
            pubId: 1
          },
          {
            type: "text",
            round: 3,
            positionInround: 1,
            question: "Würdet ihr an einem virtuellen Pubquiz teilnehmen?",
            correctAnswer: "Ja",
            pubId: 1
          },
          {
            type: "song",
            round: 4,
            positionInround: 1,
            questionExternalLink: "https://www.youtube.com/watch?v=z9Uz1icjwrM",
            correctAnswer: "Ja",
            pubId: 1
          },
          {
            type: "picture",
            round: 4,
            positionInround: 2,
            questionExternalLink: "http://thecatapi.com/api/images/get?format=src&type=jpg&size=med",
            correctAnswer: "Ja",
            pubId: 1
          }
        ]
      },
      { include: [{ model: Question, include: [QuestionSubmission] }, Pub] }
    );
  });
}

module.exports = {
  Pub,
  Group,
  Quiz,
  Question,
  QuestionSubmission,
  Person,
  Session
};
