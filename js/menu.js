/* ==========================================================
   SIGACTPAR
   MENU / NAVEGAÇÃO SPA
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    iniciarSistema();
});

/* ==========================================================
   INICIALIZAÇÃO DO SISTEMA
========================================================== */

function iniciarSistema() {
    // Inicializa o banco de dados local ou storage (se a função existir)
    if (typeof iniciarBanco === "function") {
        iniciarBanco();
    }

    configurarMenu();
    configurarSidebarMobile();
    atualizarData();

    // Carrega a página inicial padrão
    carregarPagina("dashboard");
}

/* ==========================================================
   CONFIGURAÇÃO DOS LINKS DO MENU
========================================================== */

function configurarMenu() {
    const links = document.querySelectorAll(".menu a[data-page]");

    links.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();

            const pagina = this.dataset.page;
            if (!pagina) return;

            carregarPagina(pagina);
            ativarMenu(this);

            // Fecha a sidebar automaticamente no mobile ao selecionar uma opção
            fecharSidebarMobile();
        });
    });
}

/* ==========================================================
   GERENCIAMENTO DE ESTADO ATIVO DO MENU
========================================================== */

function ativarMenu(link) {
    document.querySelectorAll(".menu li")
        .forEach(li => li.classList.remove("ativo"));

    const itemPai = link.closest("li");
    if (itemPai) {
        itemPai.classList.add("ativo");
    }
}

/* ==========================================================
   CARREGAMENTO ASSÍNCRONO DE PÁGINAS (SPA)
========================================================== */

async function carregarPagina(nome) {
    const conteudo = document.getElementById("conteudo");
    const tituloPagina = document.getElementById("tituloPagina");
    const loading = document.getElementById("loading");

    // Mostra o spinner de loading se ele existir no layout
    if (loading) loading.classList.remove("oculto");

    try {
        const resposta = await fetch(`pages/${nome}.html`);
        
        if (!resposta.ok) {
            throw new Error(`Erro ao carregar a página: ${resposta.status}`);
        }

        const html = await resposta.text();
        conteudo.innerHTML = html;

        // Atualiza o título dinamicamente com formatação limpa
        if (tituloPagina) {
            tituloPagina.innerText = formatarTitulo(nome);
        }

        // Executa o script modular correspondente
        executarModulo(nome);

    } catch (erro) {
        console.error(erro);
        conteudo.innerHTML = `
            <div class="painel vazio" style="text-align: center; padding: 40px;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 36px; color: var(--vermelho); margin-bottom: 12px;"></i>
                <h2>Página não encontrada</h2>
                <p style="color: var(--texto-secundario); margin-top: 5px;">O conteúdo solicitado não pôde ser carregado no momento.</p>
            </div>
        `;
        if (tituloPagina) tituloPagina.innerText = "Erro";
    } finally {
        // Oculta o spinner de loading
        if (loading) loading.classList.add("oculto");
    }
}

/* ==========================================================
   EXECUÇÃO DINÂMICA DE MÓDULOS JS
========================================================== */

function executarModulo(modulo) {
    // Transforma o nome do módulo no padrão de função (ex: "atendimentos" vira "iniciarAtendimentos")
    const nomeFuncao = `iniciar${modulo.charAt(0).toUpperCase()}${modulo.slice(1)}`;

    if (typeof window[nomeFuncao] === "function") {
        window[nomeFuncao]();
    }
}

/* ==========================================================
   CONTROLE DA SIDEBAR RESPONSIVA (MOBILE)
========================================================== */

function configurarSidebarMobile() {
    const btnMenu = document.getElementById("btnMenu");
    const sidebar = document.getElementById("sidebar");

    if (btnMenu && sidebar) {
        btnMenu.addEventListener("click", () => {
            sidebar.classList.toggle("ativo");
        });
    }
}

function fecharSidebarMobile() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar && window.innerWidth <= 992) {
        sidebar.classList.remove("ativo");
    }
}

/* ==========================================================
   ATUALIZAÇÃO DE DATA
========================================================== */

function atualizarData() {
    const hoje = new Date();
    const opcoes = {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    };

    const dataFormatada = hoje.toLocaleDateString("pt-BR", opcoes);

    document.querySelectorAll("#dataAtual")
        .forEach(el => el.innerHTML = dataFormatada);
}

/* ==========================================================
   AUXILIARES
========================================================== */

function formatarTitulo(nome) {
    const dicionario = {
        "dashboard": "Dashboard",
        "atendimentos": "Gerenciamento de Atendimentos",
        "criancas": "Crianças e Adolescentes",
        "responsaveis": "Responsáveis",
        "processos": "Processos",
        "agenda": "Agenda",
        "relatorios": "Relatórios",
        "veiculos": "Veículos",
        "patrimonio": "Patrimônio"
    };

    return dicionario[nome] || (nome.charAt(0).toUpperCase() + nome.slice(1));
}
