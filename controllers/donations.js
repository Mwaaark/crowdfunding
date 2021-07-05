const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Project = require("../models/project");
const Donation = require("../models/donation");

module.exports.createCheckoutSession = async (req, res) => {
  const { donationAmount } = req.body;

  const project = await Project.findById(req.params.id);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    client_reference_id: req.params.id,
    line_items: [
      {
        price_data: {
          currency: "php",
          product_data: {
            name: project.title,
            images: [project.images[0].url],
          },
          unit_amount: donationAmount * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.DOMAIN_NAME}/projects/${req.params.id}?success=true`,
    cancel_url: `${process.env.DOMAIN_NAME}/projects/${req.params.id}?cancel=true`,
  });

  // const donation = new Donation(req.body.donation);
  // donation.backer = req.user._id;
  // project.donations.push(donation);
  // await donation.save();
  // await project.save();
  // req.flash("success", "Successfully donated! Thanks for the donations!");
  // res.redirect(`/projects/${project._id}`);

  res.redirect(303, session.url);
};
