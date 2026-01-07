const Listing = require("../models/listing");
const { cloudinary } = require("../cloudConfig"); // ✅ destructured properly

// INDEX
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

// SHOW LISTING (populate owner + review author)
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate("owner", "username") // listing owner
    .populate({
      path: "reviews",
      populate: { path: "author", select: "username" }, // review author
    });

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/show", { listing });
};

// CREATE LISTING
module.exports.createListing = async (req, res) => {
  try {
    const listing = new Listing(req.body.listing);

    // ✅ If image uploaded via multer-cloudinary
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    listing.owner = req.user._id;
    await listing.save();

    req.flash("success", "New listing created");
    res.redirect("/listings");
  } catch (e) {
    console.log("🔥 IMAGE UPLOAD ERROR:", e);
    req.flash("error", "Image upload failed. Try again!");
    res.redirect("/listings/new");
  }
};

// EDIT LISTING
module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
};

// UPDATE LISTING
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }

  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};

// DELETE LISTING
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};
