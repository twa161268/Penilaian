//routes/nilaiRoutes.js

const express = require("express");
const router = express.Router();
const nilaiController = require("../controllers/nilaiController");
//router.get("/:periode", ctrl.getByPeriode);
//router.post("/", ctrl.saveData);
router.get("/load/:periode", nilaiController.loadDataByPeriode);
router.post("/delete", nilaiController.deleteNilai);

module.exports = router;