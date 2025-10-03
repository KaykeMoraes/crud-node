const db = require('../db');

exports.cadastrar = async (req, res) => {
    const {
        name,
        price,
        userId
    } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO produtos (name, price, user_id) VALUES (?, ?, ?)",
            [name, price, userId]
        );
        res.json({
            id: result.insertId,
            name,
            price,
            userId
        });
    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
};

exports.listarPorUsuario = async (req, res) => {
    const userId = req.params.userId;
    try {
        const [rows] = await db.query(
            "SELECT * FROM produtos WHERE user_id = ?",
            [userId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
};

exports.atualizar = async (req, res) => {
    const {
        id,
        name,
        price
    } = req.body;
    try {
        await db.query(
            "UPDATE produtos SET name = ?, price = ? WHERE id = ?",
            [name, price, id]
        );
        res.json({
            id,
            name,
            price
        });
    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
};

exports.deletar = async (req, res) => {
    const id = req.params.id;
    try {
        await db.query("DELETE FROM produtos WHERE id = ?", [id]);
        res.json({
            message: "Produto deletado"
        });
    } catch (err) {
        res.status(500).json({
            erro: err.message
        });
    }
};