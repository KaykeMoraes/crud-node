const db = require('../db');

exports.cadastrar = async (req, res) => {
    const {
        username,
        password,
        fullName
    } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO usuarios (username, password, full_name) VALUES (?, ?, ?)",
            [username, password, fullName]
        );
        res.json({
            id: result.insertId,
            username,
            fullName
        });
    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
};

exports.login = async (req, res) => {
    const {
        username,
        password
    } = req.body;
    try {
        const [rows] = await db.query(
            "SELECT * FROM usuarios WHERE username = ? AND password = ?",
            [username, password]
        );
        if (rows.length > 0) res.json(rows[0]);
        else res.status(401).json({
            erro: "Usuário ou senha inválidos"
        });
    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
};