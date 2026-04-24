const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const { isAuth } = require("./middleware/auth");

const nilaiRoutes = require("./routes/nilaiRoutes");
const nilaiidkRoutes = require("./routes/nilaiidkRoutes");
const karyawanRoutes = require("./routes/karyawanRoutes");
const simpanRoutes = require("./routes/simpanRoutes");
const reportRoutes = require("./routes/reportRoutes");
const authRoutes = require("./routes/authRoutes");
const mloginRoutes = require("./routes/mloginRoutes");
const reffnilaiRoutes = require("./routes/reffnilaiRoutes");
const session = require("express-session");
const app = express();

// ✅ PASANG SESSION DI SINI (SEBELUM ROUTE)
app.use(session({
    secret: "secret123",
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


//----------------Ini saat Menu terbuka-----------
app.get("/", (req, res) => {
    res.render("index", {
        isLogin: !!req.session.user,
        user: req.session.user || null
    });
});

//app.get("/", (req, res) => {
//    res.render("index");
//});
//-----------------------------------------------

// ROUTE HALAMAN DASHBOARD (penilaian.ejs)
app.get("/penilaian", (req, res) => {
    res.render("penilaian");
});

//app.get("/penilaian", isAuth, (req, res) => {
//    res.render("penilaian");
//});

//app.get("/mlogin", (req, res) => {
//    res.render("mlogin");
//});


// API ROUTES
app.use("/nilai", nilaiRoutes);
app.use("/karyawan", karyawanRoutes);
app.use("/nilaiidk", nilaiidkRoutes);
app.use("/simpan", simpanRoutes);
app.use("/report", reportRoutes);
app.use("/mlogin", mloginRoutes);
app.use("/reffnilai", reffnilaiRoutes);
app.use("/", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
    console.log(`Server berjalan di http://localhost:${PORT}`)
);





