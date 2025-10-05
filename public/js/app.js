let usuarioLogado = JSON.parse(localStorage.getItem("usuario")) || null;

function login() {
    const username = document.getElementById("loginUsername")?.value;
    const password = document.getElementById("loginPassword")?.value;

    fetch('/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(res => res.json())
        .then(data => {
            if (data.error || !data.success) {
                document.getElementById("loginMsg").innerText = data.error || "Erro ao logar";
            } else {
                usuarioLogado = data.user;
                localStorage.setItem("usuario", JSON.stringify(usuarioLogado));
                window.location.href = "meus-produtos.html";
            }
        })
        .catch(err => console.error(err));
}

function register() {
    const username = document.getElementById("regUsername")?.value;
    const password = document.getElementById("regPassword")?.value;
    const fullName = document.getElementById("regFullName")?.value;

    fetch('/api/usuarios/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, fullName })
    })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                document.getElementById("registerMsg").innerText = data.error || "Erro ao registrar";
            } else {
                alert("Usuário criado com sucesso!");
                window.location.href = "login.html";
            }
        })
        .catch(err => console.error(err));
}

function logout() {
    localStorage.removeItem("usuario");
    usuarioLogado = null;
    window.location.href = "login.html";
}

const modal = document.getElementById("modalProduto");
const modalName = document.getElementById("modalName");
const modalPrice = document.getElementById("modalPrice");
const modalCreator = document.getElementById("modalCreator");
const closeBtn = document.querySelector(".close-btn");

if (closeBtn) closeBtn.onclick = () => modal.style.display = "none";

window.onclick = (event) => {
    if (event.target === modal) modal.style.display = "none";
};

function abrirModal(prod) {
    modalName.textContent = prod.name;
    modalPrice.textContent = `Preço: R$ ${prod.price}`;
    modalCreator.textContent = `Criado por: ${prod.full_name || prod.user_id}`;
    modal.style.display = "flex";
}

function cadastrarProduto() {
    if (!usuarioLogado) return logout();

    const name = document.getElementById("prodName")?.value;
    const price = parseFloat(document.getElementById("prodPrice")?.value);

    if (!name || isNaN(price)) {
        alert("Preencha nome e preço corretamente!");
        return;
    }

    fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name,
            price,
            userId: usuarioLogado.username // 🔹 Envia username
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                document.getElementById("prodName").value = "";
                document.getElementById("prodPrice").value = "";
                listarMeusProdutos();
            } else {
                alert(data.error || "Erro ao cadastrar produto");
            }
        })
        .catch(err => console.error("Erro ao cadastrar produto:", err));
}

function listarMeusProdutos() {
    if (!usuarioLogado) return logout();

    const list = document.getElementById("produtosList");
    if (!list) return;

    fetch(`/api/produtos/${usuarioLogado.username}`)
        .then(res => res.json())
        .then(produtos => {
            list.innerHTML = produtos.length === 0 ? "<p>Nenhum produto encontrado.</p>" : "";
            produtos.forEach(prod => {
                const div = document.createElement("div");
                div.classList.add("produto-card");

                div.innerHTML = `
                    <strong>${prod.name}</strong>
                    <p>R$ ${prod.price}</p>
                    <button class="detalhes-btn">Detalhes</button>
                    <button class="delete-btn">🗑 Deletar</button>
                `;

                list.appendChild(div);

                div.querySelector(".detalhes-btn").onclick = () => abrirModal(prod);
                div.querySelector(".delete-btn").onclick = () => {
                    if (confirm(`Deseja realmente deletar "${prod.name}"?`)) {
                        deletarProduto(prod.id);
                    }
                };
            });
        })
        .catch(err => console.error("Erro ao listar meus produtos:", err));
}

function listarTodosProdutos() {
    const list = document.getElementById("produtosList");
    if (!list) return;

    fetch('/api/produtos')
        .then(res => res.json())
        .then(produtos => {
            list.innerHTML = produtos.length === 0 ? "<p>Nenhum produto encontrado.</p>" : "";
            produtos.forEach(prod => {
                const div = document.createElement("div");
                div.classList.add("produto-card");

                div.innerHTML = `
                    <strong>${prod.name}</strong>
                    <p>R$ ${prod.price}</p>
                    <p>Criado por: ${prod.full_name || prod.user_id}</p>
                    <button class="detalhes-btn">Detalhes</button>
                `;

                list.appendChild(div);
                div.querySelector(".detalhes-btn").onclick = () => abrirModal(prod);
            });
        })
        .catch(err => console.error("Erro ao listar produtos:", err));
}

function deletarProduto(id) {
    fetch(`/api/produtos/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => listarMeusProdutos())
        .catch(err => console.error("Erro ao deletar produto:", err));
}

document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    // Protege páginas que exigem login
    if (!usuarioLogado && (path.endsWith("meus-produtos.html") || path.endsWith("profile.html"))) {
        window.location.href = "login.html";
        return;
    }

    const form = document.getElementById("addProductForm");
    if (form) form.addEventListener("submit", e => {
        e.preventDefault();
        cadastrarProduto();
    });

    if (path.endsWith("meus-produtos.html")) {
        listarMeusProdutos();
    } else if (path.endsWith("produtos.html")) {
        listarTodosProdutos();
    } else if (path.endsWith("profile.html") && usuarioLogado) {
        const fullNameEl = document.getElementById("fullName");
        const usernameEl = document.getElementById("username");
        if (fullNameEl) fullNameEl.textContent = usuarioLogado.full_name || usuarioLogado.fullName;
        if (usernameEl) usernameEl.textContent = usuarioLogado.username;
    }
});
