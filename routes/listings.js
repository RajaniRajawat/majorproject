

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const listingController = require("../controllers/listings");
const { storage } = require("../cloudConfig");
const multer = require("multer");
const upload = multer({ storage });
const { isLoggedIn, isOwner } = require("../middleware");

// INDEX + CREATE
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
  );

// NEW FORM
router.get("/new", isLoggedIn, listingController.renderNewForm);

// SHOW
router.get("/:id", wrapAsync(listingController.showListing));

// EDIT
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

// UPDATE
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  wrapAsync(listingController.updateListing)
);

// DELETE
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;
