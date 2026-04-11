// routes/karyawanRoutes.js
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/karyawanController");

router.get("/:idk", ctrl.getByIdk);

module.exports = router;