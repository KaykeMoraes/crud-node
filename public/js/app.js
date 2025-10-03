// Guardar usuário logado
let usuarioLogado = JSON.parse(localStorage.getItem("usuario")) || null;

// --- LOGIN ---
function login() {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    fetch('/api/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                document.getElementById("loginMsg").innerText = "Usuário ou senha inválidos!";
            } else {
                localStorage.setItem("usuario", JSON.stringify(data.user));
                usuarioLogado = data.user;
                window.location.href = "meus-produtos.html";
            }
        });
}

// --- CADASTRO ---
function register() {
    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;
    const fullName = document.getElementById("regFullName").value;

    fetch('/api/usuarios/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
                fullName
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                document.getElementById("registerMsg").innerText = data.error;
            } else {
                alert("Conta criada com sucesso!");
                window.location.href = "login.html";
            }
        });
}

// --- LOGOUT ---
function logout() {
    localStorage.removeItem("usuario");
    usuarioLogado = null;
    window.location.href = "login.html";
}

// --- PRODUTOS ---
function cadastrarProduto() {
    if (!usuarioLogado) return logout();

    const produto = {
        name: document.getElementById("prodName").value,
        price: parseFloat(document.getElementById("prodPrice").value),
        userId: usuarioLogado.id
    };

    fetch('/api/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produto)
        })
        .then(res => res.json())
        .then(() => {
            document.getElementById("prodName").value = "";
            document.getElementById("prodPrice").value = "";
            listarProdutos();
        });
}

function listarProdutos() {
    if (!usuarioLogado) return logout();

    fetch('/api/produtos/' + usuarioLogado.id)
        .then(res => res.json())
        .then(produtos => {
            const list = document.getElementById("produtosList");
            list.innerHTML = "";

            produtos.forEach(prod => {
                const div = document.createElement("div");
                div.classList.add("produto-card");
                div.innerHTML = `
                <strong>${prod.name}</strong>
                <p>R$ ${prod.price}</p>
                <button onclick="deletarProduto(${prod.id})">🗑 Deletar</button>
            `;
                list.appendChild(div);
            });
        });
}

function deletarProduto(id) {
    fetch('/api/produtos/' + id, {
            method: 'DELETE'
        })
        .then(() => listarProdutos());
}

// Carregar produtos automaticamente em meus-produtos.html
if (window.location.pathname.endsWith("meus-produtos.html")) {
    if (!usuarioLogado) logout();
    listarProdutos();
}