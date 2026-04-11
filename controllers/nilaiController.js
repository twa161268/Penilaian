// controllers/nilaiController.js

const db = require("../db");

// ambil data untu lISTING



exports.loadDataByPeriode = async (req, res) => {

    const periode = req.params.periode;
    const [tahun, bulan] = periode.split("-");
    

    //const startDate = `#${tahun}-${bulan}-01#`;
    //const endDate   = `#${tahun}-${String(Number(bulan)+1).padStart(2,'0')}-01#`;
    //    const sql = `
    //    SELECT PERIOD, IDK, NAMA, TOTALPERSEN, BNSACTUAL
    //    FROM TABEL_NILAI
    //    WHERE PERIOD >= ${startDate} AND PERIOD < ${endDate}
    //`;

    const sql = `
    SELECT period, idk, nama, totalpersen, bnsactual
    FROM tabel_nilai
    WHERE period >= $1 AND period < $2
    `;

    //const startDate = `${tahun}-${bulan}-01`;
    const start = new Date(`${tahun}-${bulan}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const startDate = start.toISOString().slice(0, 10);
    const endDate = end.toISOString().slice(0, 10);

    
    try {
        //const rows = await db.query(sql);
        const rows = await db.query(sql, [startDate, endDate]);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.json({ success: false });
    }
};

exports.loadDataByPeriodeidk = async (req, res) => {
    const periode = req.params.periode;
    const [tahun, bulan] = periode.split("-");
    const idk = req.params.idk;

    const sql = `
    SELECT *
    FROM tabel_nilai
    WHERE period >= $1 AND period < $2 AND idk = $3
`;

    const start = new Date(`${tahun}-${bulan}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const startDate = start.toISOString().slice(0, 10);
    const endDate = end.toISOString().slice(0, 10);
    
    try {
        const rows = await db.query(sql, [startDate, endDate, idk]);

        res.json({
            success: true,
            data: rows[0] || null
        });

    } catch (err) {
        console.error(err);
        res.json({ success: false });
    }

};




// Ambil daftar nilai berdasarkan periode
//exports.getByPeriode = async (req, res) => {
//    try {
//        const { periode } = req.params;
//
//        const sql = `
//            SELECT *
//            FROM TABEL_NILAI
//            WHERE PERIOD = '${periode}'
//            ORDER BY IDK
//        `;

//        const rows = await db.query(sql);
//        res.json(rows);

//    } catch (err) {
//        res.status(500).json({ error: err.message });
//    }
//};


exports.simpanNilai = async (req, res) => {
    try {
        const d = req.body;

        //tanggal yang diambil itu formatnya YYYY-MM, jadi harus diubah dulu jadi penanggalan system
        const chdate = d.PERIOD;
        const [xyear, xmonth]= chdate.split("-");
        //const xperiode = `#${xyear}-${xmonth}-01#`;
        const xperiode = `${xyear}-${xmonth}-01`;

        if (!d.PERIOD || !d.IDK) {
            return res.json({ success: false, msg: "PERIOD & IDK wajib ada!" });
        }

        // Escape khusus Access
        const esc = (v) => v === undefined || v === null ? '' : String(v).replace(/'/g, "''");

        let sql = `
            UPDATE tabel_nilai SET
                period=${esc(xperiode)},
                idk='${esc(d.IDK)}',

                nama='${esc(d.nama)}',
                jabatan='${esc(d.jabatan)}',
                nilaibonus=${d.nilaibonus},

                cutisakit=${d.cutisakit},
                telatu30=${d.telatu30},
                telatd30=${d.telatd30},
                telatu60=${d.telatu60},
                lupa=${d.lupa},
                hadirfull=${d.hadirfull},
                ontime=${d.ontime},
                ovrmnt=${d.ovrmnt},
                kerjalibur=${d.kerjalibur},
                reward=${d.reward},
                lalai=${d.lalai},
                tunda=${d.tunda},
                alpha=${d.alpha},

                cutisakita=${d.cutisakita},
                telatu30a=${d.telatu30a},
                telatd30a=${d.telatd30a},
                telatu60a=${d.telatu60a},
                lupaa=${d.lupaa},
                hadirfulla=${d.hadirfulla},
                ontimea=${d.ontimea},
                ovrmnta=${d.ovrmnta},
                kerjalibura=${d.kerjalibura},
                reward=${d.rewarda},
                lalaia=${d.lalaia},
                tundaa=${d.tundaa},
                alphaa=${d.alphaa},

                cutisakitb=${d.cutisakitb},
                telatu30b=${d.telatu30b},
                telatd30b=${d.telatd30b},
                telatu60b=${d.telatu60b},
                lupab=${d.lupab},
                hadirfullb=${d.hadirfullb},
                ontimeb=${d.ontimeb},
                ovrmntb=${d.ovrmntb},
                kerjaliburb=${d.kerjaliburb},
                rewardb=${d.rewardb},
                lalaib=${d.lalaib},
                tundab=${d.tundab},
                alphab=${d.alphab},

                totals=${d.TOTALS},
                totalr=${d.TOTALR},
                totalp=${d.TOTALP},

                totalnilai=${d.totalnilai},
                totalpersen=${d.totalpersen},
                surplusmin=${d.surplusmin},
                jmlbonus=${d.jmlbonus},
                bnsactual=${d.bnsactual}

                WHERE period=$1
                AND idk=$2
        `;

        const rows = await db.query(sql, [xperiode, d.IDK]);

        //db.query(sql, (err, result) => {
        //    if (err) {
        //        console.log("SQL ERROR:", sql);
        //        console.error(err);
        //        return res.json({ success: false, msg: "Gagal update database!" });
        //    }

            res.json({ success: true, msg: "Update berhasil!" });
        //});

    } catch (e) {
        console.error(e);
        res.json({ success: false, msg: "Server error!" });
    }
};

exports.deleteNilai = async (req, res) => {
    try {
        const items = req.body.items;
        //console.log("REQ BODY:", req.body);
        //tanggal yang diambil itu formatnya YYYY-MM, jadi harus diubah dulu jadi penanggalan system
 
        if (!items || items.length === 0) {
            return res.json({ success: false, msg: "Tidak ada data!" });
        }

        let successCount = 0;
        let failCount = 0;

        for (let row of items) {

          const zdate = row.PERIOD;
          const [zyear, zmonth]= zdate.split("-");
          const zperiode = `${zyear}-${String(zmonth).padStart(2, '0')}-01`;

            // di zperiode tidak dikasih tanda kutip
            const sql = `
                DELETE FROM tabel_nilai
                WHERE idk=$1 AND period=$2
            `;
            //console.log("EKSEKUSI QUERY:", sql);


            try {
                await db.query(sql, [row.IDK, zperiode]);
                //await db.query(sql);  // <— TANPA CALLBACK
                successCount++;
            } catch (err) {
                console.log("Delete error:", err);
                failCount++;
            }

        }

        return res.json({
            success: true,
            deleted: successCount,
            failed: failCount
        });

    } catch (err) {
        console.error(err);
        res.json({ success: false, msg: "Server error!" });
    }
};