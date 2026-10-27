
let produtos = [];

const produtosIniciais = [
  {
    id: 1,
    title: "Kit 6 Sousplat Rosa",
    category: "Decoração",
    price: 270.00,
    image: "https://res.cloudinary.com/iqxfjivr/image/upload/v1793033502/Encomenda_mais_linda_essa_Me_diga_se_n%C3%A3o_vai_ficar_linda_na_mesa_posta_wgtkjo.jpg",
    description: "Sousplat de pratos branco (informar cor de detalher no chat).´<br>´"
  },
  {
    id: 2,
    title: "Bolsa de Crochê",
    category: "Acessórios",
    price: 135.00,
    image: "https://res.cloudinary.com/iqxfjivr/image/upload/v1793035038/download_1_dylyhs.jpg",
    description: "Bolsa branca (informar cor de detalhes no chat).´<br>´"
  },
  {
    id: 3,
    title: "Chaveiros de frutas",
    category: "Acessórios",
    price: 15.00,
    image: "https://res.cloudinary.com/iqxfjivr/image/upload/v1793034984/Crocheted_bag_charms_ffflz0.jpg",
    description: "Chaveiros de morango/cereja (informar outras opções desejadas no chat).´´"
  },
  {
    id: 4,
    title: "Bolsa de Crochê",
    category: "Acessórios",
    price: 95.00,
    image: "https://res.cloudinary.com/iqxfjivr/image/upload/v1793035385/download_2_e7euj1.jpg",
    description: "Bolsa pequena branca (informar cores alternativas no chat).´<br>´"
  }
];

// NAVEGAÇÃO
function navegarPara(id) {
  document.querySelectorAll(".secao").forEach(secao => {
    secao.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");

  document.querySelectorAll(".nav-btn").forEach(botao => {
    botao.classList.toggle(
      "active",
      botao.getAttribute("onclick").includes(id)
    );
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// CARREGAR API
async function carregarDadosAPI() {
  const loader = document.getElementById("loader");
  const grid = document.getElementById("gridProdutos");

  loader.style.display = "block";
  grid.innerHTML = "";

  try {
    const resposta = await fetch(
      "https://jsonplaceholder.typicode.com/posts?_limit=4"
    );

    if (!resposta.ok) {
      throw new Error("Erro ao carregar API");
    }

    const dados = await resposta.json();

    produtos = dados.map((item, index) => ({
      ...produtosIniciais[index],
      id: item.id
    }));

  } catch (erro) {
    console.log("Usando produtos iniciais.");

    produtos = [...produtosIniciais];

  } finally {
    loader.style.display = "none";
    filtrarProdutos();
  }
}

// MOSTRAR PRODUTOS
function renderizarProdutos(lista) {
  const grid = document.getElementById("gridProdutos");

  grid.innerHTML = "";

  if (lista.length === 0) {
    grid.innerHTML = "<p>Nenhum produto encontrado 🧶</p>";
    return;
  }

  lista.forEach(produto => {
    const card = document.createElement("article");

    card.className = "produto";

    card.innerHTML = `
      <img
        src="${produto.image}"
        alt="${produto.title}"
        onerror="this.src='https://placehold.co/300x200?text=Croche'"
      >

      <div class="produto-info">
        <span class="categoria">${produto.category}</span>

        <h3>${produto.title}</h3>

        <p>${produto.description}</p>

        <div class="produto-rodape">
          <strong>
            ${Number(produto.price).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL"
            })}
          </strong>

          <button
            class="btn btn-claro"
            onclick="alert('Produto de demonstração!')"
          >
            Ver peça
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// BUSCA E FILTRO
function filtrarProdutos() {
  const busca = document
    .getElementById("searchInput")
    .value
    .toLowerCase();

  const categoria = document.getElementById("categoryFilter").value;

  const resultado = produtos.filter(produto => {
    const texto = (
      produto.title + " " + produto.description
    ).toLowerCase();

    const encontrouTexto = texto.includes(busca);

    const encontrouCategoria =
      categoria === "todos" || produto.category === categoria;

    return encontrouTexto && encontrouCategoria;
  });

  renderizarProdutos(resultado);
}

// CADASTRAR PRODUTO
function cadastrarProduto(event) {
  event.preventDefault();

  const nome = document.getElementById("nomePeca").value.trim();
  const categoria = document.getElementById("categoriaPeca").value;
  const preco = Number(document.getElementById("precoPeca").value);
  const imagem = document.getElementById("imagemPeca").value.trim();
  const descricao = document.getElementById("descricaoPeca").value.trim();

  if (!nome || !categoria || preco <= 0 || !imagem || !descricao) {
    mostrarAlerta("Preencha todos os campos corretamente.", "erro");
    return;
  }

  const novoProduto = {
    id: Date.now(),
    title: nome,
    category: categoria,
    price: preco,
    image: imagem,
    description: descricao
  };

  produtos.unshift(novoProduto);

  document.getElementById("formCroche").reset();

  mostrarAlerta("Peça cadastrada com sucesso! 💗", "sucesso");

  filtrarProdutos();

  setTimeout(() => {
    navegarPara("catalogo");
    filtrarProdutos();
  }, 1000);
}

// MENSAGEM
function mostrarAlerta(mensagem, tipo) {
  const alerta = document.getElementById("alertBox");

  alerta.textContent = mensagem;
  alerta.className = "alerta " + tipo;
}

// INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", carregarDadosAPI);
