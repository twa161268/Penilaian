// controllers/reffnilaiController.js

const db = require("../db");


exports.get = async (req, res) => {
    const result = await db.query("SELECT * FROM tabelref_nilai limit 1");
    res.render("reffnilai");
};

exports.getreff = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM tabelref_nilai LIMIT 1");

        res.json({
            success: true,
            data: result.rows[0] || {}
        });

    } catch (err) {
        console.error(err);

        res.json({
            success: false,
            data: {}
        });
    }
};


exports.loadDatak = async (req, res) => {

    const sql = `
    SELECT * FROM tabelref_nilai limit 1
    `;
    try {
        //const rows = await db.query(sql);
        const rows = await db.query(sql);
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.json({ success: false });
    }
};


// update
exports.update = async (req, res) => {
    try {
        const d = req.body;

        const sql = `
            UPDATE tabelref_nilai SET
            nilaibonus=$1,
            cutisakita=$2,
            telatu30a=$3,
            telatd30a=$4,
            telatu60a=$5,
            lupaa=$6,
            hadirfulla=$7,
            ontimea=$8,
            ovrmnta=$9,
            kerjalibura=$10,
            lalaia=$11,
            tundaa=$12,
            alphaa=$13
        `;

        await db.query(sql, [
            d.nilaibonus,
            d.cutisakita,
            d.telatu30a,
            d.telatd30a,
            d.telatu60a,
            d.lupaa,
            d.hadirfulla,
            d.ontimea,
            d.ovrmnta,
            d.kerjalibura,
            d.lalaia,
            d.tundaa,
            d.alphaa
        ]);

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.json({ success: false });
    }
};