const express = require("express");
const router = express.Router();

const wrapasync = require("../utils/wrapasync.js");

const Listing = require("../models/listing.js");
const {isLogged,isOwner,validateListing} = require("../middleware.js");
const ListingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
    .route("/")
    .get( wrapasync(ListingController.index))
    .post(isLogged, upload.single("listing[image]"), wrapasync(ListingController.new_listing));
    
router.get("/new",isLogged,(req,res)=>{
    res.render("listings/new.ejs");
});




router
    .route("/:id")
    .get(wrapasync(ListingController.show))
    .put(isLogged,upload.single("listing[image]"),isOwner,wrapasync (ListingController.edit_listing))
    .delete(isLogged,isOwner,wrapasync (ListingController.delete));

router.get("/:id/edit",isLogged,isOwner,wrapasync (ListingController.edit));

module.exports = router;