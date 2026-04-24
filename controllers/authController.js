const svgCaptcha = require('svg-captcha');
const bcrypt = require("bcrypt");
const db = require("../db");


// simulasi user (bisa dari database nanti)
const users = [
    {
        username: "admin",
        password: bcrypt.hashSync("12345", 10)
    }
];

// tampilkan halaman login
exports.showLogin = (req, res) => {
    const captcha = svgCaptcha.create();
    req.session.captcha = captcha.text;
    //console.log("SHOW CAPTCHA:", captcha.text);
    //console.log("SHOW CAPTCHA IN SESSION:", req.session.captcha);
    res.render("login", {
        captcha: captcha.data,
        error: null
    });

};

// proses login
exports.login = async (req, res) => {
    const { username, password, captcha } = req.body;
    //console.log("Captcha yang dimasukkan:", captcha)
    //console.log("Captcha yang disimpan di session:", req.session.captcha)

    // cek captcha
    if (captcha.trim().toLowerCase() !== req.session.captcha.toLowerCase()) {

        const newCaptcha = svgCaptcha.create();
        req.session.captcha = newCaptcha.text;

        return req.session.save(() => {
            res.render("login", {
                captcha: newCaptcha.data,
                error: "Captcha salah"
            });
        });

    }

    //const user = users.find(u => u.username === username);

    const result = await db.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
    );

    const user = result[0]; // atau result.rows[0] tergantung db kamu

    if (!user) {
        const newCaptcha = svgCaptcha.create();
        req.session.captcha = newCaptcha.text;

        return res.render("login", {
            captcha: newCaptcha.data,
            error: "User tidak ditemukan"
        });
    }


    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        const newCaptcha = svgCaptcha.create();
        req.session.captcha = newCaptcha.text;

        return res.render("login", {
            captcha: newCaptcha.data,
            error: "Password salah"
        });
    }

    if (!user.is_active) {
        return res.render("login", {
            captcha: newCaptcha.data,
            error: "User tidak aktif"
        });
    }
    
    req.session.user = username;
    req.session.captcha = null;

    return res.redirect("/");

};

// logout
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
};