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
