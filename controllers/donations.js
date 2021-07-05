const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Project = require("../models/project");
const Donation = require("../models/donation");
const User = require("../models/user");

module.exports.createCheckoutSession = async (req, res) => {
  const { donationAmount } = req.body;

  const project = await Project.findById(req.params.id);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    client_reference_id: req.params.id,
    customer_email: req.user.email,
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

  res.redirect(303, session.url);
};

const createDonationCheckout = async (session) => {
  // const donation = new Donation(req.body.donation);
  // donation.backer = req.user._id;
  // project.donations.push(donation);
  // await donation.save();
  // await project.save();
  // req.flash("success", "Successfully donated! Thanks for the donations!");
  // res.redirect(`/projects/${project._id}`);

  const { client_reference_id: id, amount_total, customer_email } = session;

  const project = await Project.findById(id);

  const user = (await User.findOne({ email: customer_email })).id;

  const donation = new Donation({
    amount: amount_total / 100,
  });

  donation.backer = user;

  project.donations.push(donation);

  await donation.save();
  await project.save();
};

module.exports.webhookCheckout = (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    createDonationCheckout(event.data.object);

    res.status(200).json({ received: true });
  }
};
