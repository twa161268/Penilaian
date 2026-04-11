// controllers/karyawanController.js
const db = require("../db");

exports.getByIdk = async (req, res) => {
  try {
    const { idk } = req.params;

    const sql = `
      SELECT *
      FROM TABEL_KARYAWAN
      WHERE IDK = '${idk}';
    `;

    const rows = await db.query(sql);
    res.json(rows.length ? rows[0] : {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};