const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/api/usuarios/register", async (req, res) => {
    const { username, password, fullName } = req.body;
    try {
        await db.query(
            "INSERT INTO usuarios (username, password, full_name) VALUES (?, ?, ?)",
            [username, password, fullName]
        );
        res.json({ success: true, message: "Usuário criado com sucesso!" });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, error: "Usuário já existe ou erro no cadastro" });
    }
});

app.post("/api/usuarios/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const [results] = await db.query(
            "SELECT * FROM usuarios WHERE username = ? AND password = ?",
            [username, password]
        );

        if (results.length > 0) {
            res.json({ success: true, user: results[0] });
        } else {
            res.status(401).json({ success: false, error: "Usuário ou senha inválidos" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Erro no servidor" });
    }
});

app.get("/api/produtos", async (req, res) => {
    try {
        const [produtos] = await db.query(`
            SELECT p.id, p.name, p.price, p.user_id AS username, u.full_name
            FROM produtos p
            JOIN usuarios u ON p.user_id = u.username
        `);
        res.json(produtos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar produtos" });
    }
});

app.get("/api/produtos/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const [produtos] = await db.query(
            "SELECT * FROM produtos WHERE user_id = ?",
            [userId]
        );
        res.json(produtos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar produtos do usuário" });
    }
});

app.post("/api/produtos", async (req, res) => {
    const { name, price, userId } = req.body;
    try {
        await db.query(
            "INSERT INTO produtos (name, price, user_id) VALUES (?, ?, ?)",
            [name, price, userId]
        );
        res.json({ success: true, message: "Produto cadastrado com sucesso!" });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, error: "Erro ao cadastrar produto" });
    }
});

app.delete("/api/produtos/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM produtos WHERE id = ?", [id]);
        res.json({ success: true, message: "Produto deletado com sucesso!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Erro ao deletar produto" });
    }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
