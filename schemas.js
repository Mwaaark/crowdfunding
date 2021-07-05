const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.projectSchema = Joi.object({
  project: Joi.object({
    title: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    targetAmount: Joi.number().required().min(25000).max(50000),
    targetDate: Joi.date().min("now").required(),
    description: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.commentSchema = Joi.object({
  comment: Joi.object({
    body: Joi.string().required().escapeHTML(),
  }).required(),
});

module.exports.donationSchema = Joi.object({
  donation: Joi.object({
    amount: Joi.number().required().min(50).max(999999),
  }).required(),
});
