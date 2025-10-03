const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db"); // db.js já com .promise()

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// -----------------------
// ROTAS DE USUÁRIOS
// -----------------------

// Criar conta
app.post("/api/usuarios/register", async (req, res) => {
    const {
        username,
        password,
        fullName
    } = req.body;

    try {
        await db.query(
            "INSERT INTO usuarios (username, password, full_name) VALUES (?, ?, ?)",
            [username, password, fullName]
        );
        res.json({
            message: "Usuário criado com sucesso!"
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            error: "Usuário já existe ou erro no cadastro"
        });
    }
});

// Login
app.post("/api/usuarios/login", async (req, res) => {
    const {
        username,
        password
    } = req.body;

    try {
        const [results] = await db.query(
            "SELECT * FROM usuarios WHERE username = ? AND password = ?",
            [username, password]
        );

        if (results.length > 0) {
            res.json({
                message: "Login bem-sucedido",
                user: results[0]
            });
        } else {
            res.status(401).json({
                error: "Usuário ou senha inválidos"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro no servidor"
        });
    }
});

// -----------------------
// ROTAS DE PRODUTOS
// -----------------------

// Listar produtos por usuário
app.get("/api/produtos/:userId", async (req, res) => {
    const {
        userId
    } = req.params;

    try {
        const [produtos] = await db.query(
            "SELECT * FROM produtos WHERE user_id = ?",
            [userId]
        );
        res.json(produtos);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao buscar produtos"
        });
    }
});

// Cadastrar produto
app.post("/api/produtos", async (req, res) => {
    const {
        name,
        price,
        userId
    } = req.body;

    try {
        await db.query(
            "INSERT INTO produtos (name, price, user_id) VALUES (?, ?, ?)",
            [name, price, userId]
        );
        res.json({
            message: "Produto cadastrado com sucesso!"
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            error: "Erro ao cadastrar produto"
        });
    }
});

// Deletar produto
app.delete("/api/produtos/:id", async (req, res) => {
    const {
        id
    } = req.params;

    try {
        await db.query("DELETE FROM produtos WHERE id = ?", [id]);
        res.json({
            message: "Produto deletado com sucesso!"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Erro ao deletar produto"
        });
    }
});

// -----------------------
// Iniciar servidor
// -----------------------
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));