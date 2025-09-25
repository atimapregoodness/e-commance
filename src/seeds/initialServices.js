const mongoose = require("mongoose");
const slugify = require("slugify");
const Service = require("../models/Service");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

const services = [
  { title: "Frontal wig installation & styling (studio)", price: 40000 },
  {
    title: "Glueless frontal wig installation & styling (studio)",
    price: 35000,
  },
  { title: "Closure wig installation & styling (studio)", price: 35000 },
  { title: "Ponytail frontal installation (studio)", price: 40000 },
  { title: "Natural hair ponytail", price: 30000 },
  {
    title:
      "Home service Frontal wig installation/styling (price varies with location)",
    price: 60000,
  },
  { title: "Bridal styling and touchup", price: 200000 },
  { title: "2 frontal / 360 frontal installation (studio)", price: 50000 },
  { title: "Waving hair", price: 20000 },
  { title: "Straight hair", price: 15000 },
  { title: "Wigging & styling of wig", price: 30000 },
];

// add missing required fields (slug + description)
const seededServices = services.map((s) => ({
  ...s,
  slug: slugify(s.title, { lower: true, strict: true }),
  description: `${s.title} by GloriousStylist. Book now for a professional and hygienic service.`,
}));

Service.insertMany(seededServices)
  .then(() => {
    console.log("✅ Services seeded successfully");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("❌ Error seeding services:", err.message);
    mongoose.connection.close();
  });
