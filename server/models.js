const { Sequelize, Model } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

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

class Question extends Model {}
Question.init(
  {
    type: Sequelize.STRING,
    date: Sequelize.DATE,
    round: Sequelize.INTEGER,
    positionInround: Sequelize.INTEGER,
    question: Sequelize.STRING,
    questionExternalLink: Sequelize.STRING
  },
  {
    sequelize,
    modelName: "question"
  }
);

Pub.hasMany(Group);
Group.belongsTo(Pub);
Group.hasMany(Person);
Person.belongsTo(Group);

sequelize.sync().then(() => {
  console.log("Database initialized");
});

module.exports = {
  Pub,
  Group,
  Question,
  Person
};
