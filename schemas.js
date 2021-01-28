const { number, date } = require("joi");
const Joi = require("joi");

module.exports.projectSchema = Joi.object({
  project: Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    targetAmount: Joi.number().required().min(25000).max(50000),
    targetDate: Joi.string().required(),
    description: Joi.string().required(),
    // image: Joi.string().required(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.commentSchema = Joi.object({
  comment: Joi.object({
    body: Joi.string().required(),
  }).required(),
});

module.exports.donationSchema = Joi.object({
  donation: Joi.object({
    amount: Joi.number().min(1).required(),
  }).required(),
});
