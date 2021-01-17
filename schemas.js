const Joi = require("joi");

module.exports.projectSchema = Joi.object({
  project: Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    targetAmount: Joi.number().required().min(25000).max(50000),
    targetDate: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
  }).required(),
});
