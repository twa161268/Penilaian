const svgCaptcha = require('svg-captcha');
const bcrypt = require("bcrypt");

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

    res.render("login", {
        captcha: captcha.data,
        error: null
    });
};

// proses login
exports.login = async (req, res) => {
    const { username, password, captcha } = req.body;

    // cek captcha
    if (captcha !== req.session.captcha) {
        return res.render("login", {
            captcha: svgCaptcha.create().data,
            error: "Captcha salah"
        });
    }

    const user = users.find(u => u.username === username);

    if (!user) {
        return res.render("login", {
            captcha: svgCaptcha.create().data,
            error: "User tidak ditemukan"
        });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        return res.render("login", {
            captcha: svgCaptcha.create().data,
            error: "Password salah"
        });
    }

    req.session.user = username;

    res.redirect("/penilaian");
};

// logout
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
};