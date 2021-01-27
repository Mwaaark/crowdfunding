const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Project = require("../models/project");

mongoose.connect("mongodb://localhost:27017/crowdfunding", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Project.deleteMany({});
  for (let i = 0; i < 15; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const targetAmount = Math.floor(Math.random() * 25000) + 25000;
    const project = new Project({
      author: "600be275a305631e2ccc2cb9",
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      targetAmount,
      targetDate: new Date("Jan 5, 2022 15:37:25"),
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. At cumque omnis nesciunt, ullam consectetur autem enim ducimus sint reiciendis? Sint dolores sed iste quisquam ad necessitatibus ab iusto aliquid mollitia?",
      image: "https://source.unsplash.com/collection/9724366/1600x900",
    });
    await project.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
