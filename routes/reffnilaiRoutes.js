// routes/refnilaiRoutes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/reffnilaiController");

router.get("/", ctrl.get);
router.post("/update", ctrl.update);
router.get("/load", ctrl.loadDatak);

module.exports = router;