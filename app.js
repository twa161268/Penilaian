const express = require("express");


const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const nilaiRoutes = require("./routes/nilaiRoutes");
const nilaiidkRoutes = require("./routes/nilaiidkRoutes");
const karyawanRoutes = require("./routes/karyawanRoutes");
const refnilaiRoutes = require("./routes/refnilaiRoutes");
const simpanRoutes = require("./routes/simpanRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ROUTE HALAMAN DASHBOARD (penilaian.ejs)
app.get("/", (req, res) => {
    res.render("penilaian");
});

// API ROUTES
app.use("/nilai", nilaiRoutes);
app.use("/karyawan", karyawanRoutes);
app.use("/refnilai", refnilaiRoutes);
app.use("/nilaiidk", nilaiidkRoutes);
app.use("/simpan", simpanRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
    console.log(`Server berjalan di http://localhost:${PORT}`)
);


//const PORT = 3000;
//app.listen(PORT, () =>
//    console.log(`Server berjalan di http://localhost:${PORT}`)
//);


