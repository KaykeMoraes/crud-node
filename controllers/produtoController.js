const db = require('../db');

exports.cadastrar = async (req, res) => {
    const { name, price, userId } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO produtos (name, price, user_id) VALUES (?, ?, ?)",
            [name, price, userId]
        );
        res.json({
            id: result.insertId,
            name,
            price,
            username: userId
        });
    } catch (err) {
        res.status(500).json({ erro: err.message });
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
        res.status(500).json({ erro: err.message });
    }
};

exports.deletar = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ erro: "ID do produto inválido" });
    }

    try {
        await db.query("DELETE FROM produtos WHERE id = ?", [id]);
        res.json({ message: "Produto deletado" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
};
