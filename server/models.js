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
    nickname: Sequelize.STRING,
    uuid: Sequelize.STRING
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

class Round extends Model {}
Round.init(
  {
    numberInQuiz: Sequelize.INTEGER,
    startTime: Sequelize.DATE,
    endTime: Sequelize.DATE
  },
  {
    sequelize,
    modelName: "round"
  }
);

class Question extends Model {}
Question.init(
  {
    type: Sequelize.STRING,
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

Question.belongsTo(Round);
Round.hasMany(Question);

class QuestionSubmission extends Model {}
QuestionSubmission.init(
  {
    answer: Sequelize.STRING,
    points: Sequelize.INTEGER
  },
  {
    sequelize
  }
);

QuestionSubmission.belongsTo(Question);
QuestionSubmission.belongsTo(Group);
QuestionSubmission.belongsTo(Person);
Question.hasMany(QuestionSubmission);

Quiz.hasMany(Round);
Quiz.belongsTo(Pub);

// const SumPointsOfQuizPerGroup = id =>
//   QuestionSubmission.findAll({
//     include: [
//       {
//         model: Question,
//         where: { quizId: id },
//         attributes: []
//       }
//     ],
//     attributes: ["groupId", [sequelize.fn("SUM", sequelize.col("points")), "total_points"]],
//     group: ["groupId"]
//   });

const SumPointsOfQuizPerGroup = id =>
  QuestionSubmission.findAll({
    include: [
      {
        model: Question,
        include: [
          {
            model: Group,
            where: { quizId: id },
            attributes: []
          }
        ],
        attributes: []
      }
    ],
    attributes: ["groupId", [sequelize.fn("SUM", sequelize.col("points")), "total_points"]],
    group: ["groupId"]
  });

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
        groupId: 1,
        uuid: require("uuid").v4()
      });
    });

    Quiz.create(
      {
        date: new Date(),
        state: "future",
        rounds: [
          {
            numberInQuiz: 1,
            questions: [
              {
                type: "text",
                positionInround: 1,
                question: "Muss das so?",
                correctAnswer: "Ja",
                QuestionSubmissions: [
                  {
                    answer: "Erste Antwort",
                    groupId: 1,
                    points: 1
                  },
                  {
                    answer: "Andere Antwort",
                    groupId: 2,
                    points: 1
                  }
                ]
              },
              {
                type: "text",
                positionInround: 2,
                question: "Könnt ihr noch?",
                correctAnswer: "Ja",
                QuestionSubmissions: [
                  {
                    answer: "Dritte",
                    groupId: 1,
                    points: 1
                  },
                  {
                    answer: "Vierte",
                    groupId: 2,
                    points: 2
                  }
                ]
              }
            ]
          },
          {
            numberInQuiz: 2,
            questions: [
              {
                type: "text",
                positionInround: 1,
                question: "Habt ihr genug getrunken?",
                correctAnswer: "Ja"
              }
            ]
          },
          {
            numberInQuiz: 3,
            questions: [
              {
                type: "text",
                positionInround: 1,
                question: "Würdet ihr an einem virtuellen Pubquiz teilnehmen?",
                correctAnswer: "Ja"
              }
            ]
          },
          {
            numberInQuiz: 4,
            questions: [
              {
                type: "song",
                positionInround: 1,
                questionExternalLink: "https://www.youtube.com/watch?v=z9Uz1icjwrM",
                correctAnswer: "Ja"
              },
              {
                type: "picture",
                positionInround: 2,
                questionExternalLink: "http://thecatapi.com/api/images/get?format=src&type=jpg&size=med",
                correctAnswer: "Ja"
              }
            ]
          }
        ]
      },
      { include: [{ model: Round, include: [{ model: Question, include: [QuestionSubmission] }] }, Pub] }
    );
  });
}

module.exports = {
  Pub,
  Group,
  Quiz,
  Round,
  Question,
  QuestionSubmission,
  Person,
  Session,
  SumPointsOfQuizPerGroup
};
