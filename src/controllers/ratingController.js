const Rating = require("../models/Rating");

exports.createRating = async (req, res) => {
  const { rating, comment } = req.body;
  const newRating = new Rating({
    user: req.user.id,
    service: req.params.serviceId,
    rating,
    comment,
  });
  await newRating.save();
  res.redirect(`/services/${req.params.serviceId}`);
};
