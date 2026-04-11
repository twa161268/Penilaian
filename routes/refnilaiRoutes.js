// routes/refnilaiRoutes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/refnilaiController");

router.get("/", ctrl.getRef);

module.exports = router;