//controllers/reportController.js
//const puppeteer = require("puppeteer");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const db = require("../db"); // sesuaikan dengan koneksi kamu

exports.generatePdf = async (req, res) => {
    try {
        const { periode, idk } = req.query;
        
        const zdate = periode;
        const [zyear, zmonth]= zdate.split("-");
        const zperiode = `${zyear}-${String(zmonth).padStart(2, '0')}-01`;
        
        const result = await db.query(
            "SELECT * FROM tabel_nilai WHERE period = $1 AND idk = $2",
            [zperiode, idk]
        );

        if (!result || result.length === 0) {
            return res.status(404).send("Data tidak ditemukan");
        }

        const data = result[0];

        //const browser = await puppeteer.launch({
        //    headless: true,
        //    args: ['--no-sandbox', '--disable-setuid-sandbox']
        //});

        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });        

        const page = await browser.newPage();

        const html = await new Promise((resolve, reject) => {
            res.render("report", { d: data }, (err, html) => {
                if (err) reject(err);
                else resolve(html);
            });
        });

        const fs = require("fs");
        //fs.writeFileSync("test.html", html);

        //await page.setContent(html, {
        //    waitUntil: "domcontentloaded"
        //});
        //await new Promise(r => setTimeout(r, 500));

        await page.setContent(html, {
            waitUntil: "networkidle0"
        });

        //const bootstrapCSS = fs.readFileSync(
        //    "./public/css/bootstrap.min.css",
        //    "utf8"
        //);
        //await page.addStyleTag({
        //    content: bootstrapCSS
        //});

        const pdf = await page.pdf({
            format: "A4",
            printBackground: true,
            preferCSSPageSize: true,
            margin: {
                top: "20px",
                right: "20px",
                bottom: "20px",
                left: "20px"
            }
        });


        //fs.writeFileSync("debug.pdf", pdf);

        await browser.close();
            res.set({
                "Content-Type": "application/pdf",
                "Content-Disposition": "inline; filename=report.pdf",
                "Content-Length": pdf.length
            });

            res.end(pdf);


    } catch (err) {
        console.error(err);
        res.status(500).send("Error toto");
    }
};


exports.generatePdf2 = async (req, res) => {
    try {
        const { periode } = req.query;
        
        const zdate = periode;
        const [zyear, zmonth]= zdate.split("-");
        const zperiode = `${zyear}-${String(zmonth).padStart(2, '0')}-01`;
        
        const result = await db.query(
            "SELECT * FROM tabel_nilai WHERE period = $1",
            [zperiode]
        );

        if (!result || result.length === 0) {
            return res.status(404).send("Data tidak ditemukan");
        }

        const data = result[0];

        //const browser = await puppeteer.launch({
        //    headless: true,
        //    args: ['--no-sandbox', '--disable-setuid-sandbox']
        //});

        const browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        });

        const page = await browser.newPage();

        let allHtml = "";

        for (let i = 0; i < result.length; i++) {
            const html = await new Promise((resolve, reject) => {
                res.render("report", { d: result[i] }, (err, html) => {
                    if (err) reject(err);
                    else resolve(html);
                });
            });

            allHtml += html;

            // kasih page break antar karyawan
            if (i < result.length - 1) {
                allHtml += '<div style="page-break-after: always;"></div>';
            }
        }


        const fs = require("fs");
        //fs.writeFileSync("test.html", allHtml);

        //await page.setContent(allHtml, {
        //   waitUntil: "domcontentloaded"
        //});
        //await new Promise(r => setTimeout(r, 500));

        await page.setContent(html, {
            waitUntil: "networkidle0"
        });

        //const bootstrapCSS = fs.readFileSync(
        //    "./public/css/bootstrap.min.css",
        //    "utf8"
        //);
        //await page.addStyleTag({
        //    content: bootstrapCSS
        //});

        const pdf = await page.pdf({
            format: "A4",
            printBackground: true,
            preferCSSPageSize: true,
            margin: {
                top: "20px",
                right: "20px",
                bottom: "20px",
                left: "20px"
            }
        });


        //fs.writeFileSync("debug.pdf", pdf);

        await browser.close();
            res.set({
                "Content-Type": "application/pdf",
                "Content-Disposition": "inline; filename=report.pdf",
                "Content-Length": pdf.length
            });

            res.end(pdf);


    } catch (err) {
        console.error(err);
        res.status(500).send("Error toto");
    }
};