// controllers/refnilaiController.js

const db = require("../db");

exports.getRef = async (req, res) => {
  try {
    const rows = await db.query("SELECT * FROM tabelref_nilai LIMIT 1;");
    res.json(rows.length ? rows[0] : {});
  } catch (err) {
    console.error("ERROR REF:", err);
    res.status(500).json({ error: err.message });
  }
};