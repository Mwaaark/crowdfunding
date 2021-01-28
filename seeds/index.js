const mongoose = require("mongoose");
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
  for (let i = 0; i < 9; i++) {
    const targetAmount = Math.floor(Math.random() * 25000) + 25000;
    const project = new Project({
      author: "600be275a305631e2ccc2cb9",
      title: `Lorem Ipsum Project ${i}`,
      location: "Pasig City, Metro Manila",
      targetAmount,
      targetDate: new Date("Jan 5, 2022 15:37:25"),
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. At cumque omnis nesciunt, ullam consectetur autem enim ducimus sint reiciendis? Sint dolores sed iste quisquam ad necessitatibus ab iusto aliquid mollitia?",
      images: [
        {
          url:
            "https://res.cloudinary.com/dzfkuznwb/image/upload/v1611753802/Crowdfunding/z4kjufnjb1x3kdc4ogyn.jpg",
          filename: "Crowdfunding/z4kjufnjb1x3kdc4ogyn",
        },
        {
          url:
            "https://res.cloudinary.com/dzfkuznwb/image/upload/v1611753802/Crowdfunding/tjnub6tk2d28y02ibym2.jpg",
          filename: "Crowdfunding/tjnub6tk2d28y02ibym2",
        },
      ],
    });
    await project.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
