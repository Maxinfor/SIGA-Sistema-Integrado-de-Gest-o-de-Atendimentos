/* ==========================================================
   SIGACTPAR
   APP.JS - GERENCIADOR PRINCIPAL DO SISTEMA
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    iniciarSistema();
});

/* ==========================================================
   INICIAR SISTEMA
========================================================== */

function iniciarSistema() {
    atualizarData();
    configurarMenu();
    configurarSidebarMobile();
    
    // Carrega a página inicial padrão (Dashboard)
    carregarPagina("dashboard");
}

/* ==========================================================
   MENU E NAVEGAÇÃO SPA (SINGLE PAGE APPLICATION)
========================================================== */

function configurarMenu() {
    const links = document.querySelectorAll(".menu a[data-page]");

    links.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();

            // Remove a classe ativa de todos os itens do menu
            links.forEach(item => {
                item.closest("li").classList.remove("ativo");
            });

            // Adiciona a classe ativa apenas no item clicado
            this.closest("li").classList.add("ativo");

            const pagina = this.dataset.page;
            carregarPagina(pagina);

            // No mobile, fecha a sidebar automaticamente ao clicar em um link
            fecharSidebarMobile();
        });
    });
}

/* ==========================================================
   CARREGAR PÁGINAS DINAMICAMENTE
========================================================== */

async function carregarPagina(nome) {
    const conteudo = document.getElementById("conteudo");
    const titulo = document.getElementById("tituloPagina");
    const loading = document.getElementById("loading");

    // Exibe o indicador de carregamento (spinner) se existir
    if (loading) loading.classList.remove("oculto");

    try {
        const resposta = await fetch(`pages/${nome}.html`);
        
        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const html = await resposta.text();
        conteudo.innerHTML = html;

        // Atualiza o título da página com tratamento para casos especiais
        if (titulo) {
            titulo.textContent = formatarTituloPagina(nome);
        }

        // Executa o script/módulo específico da página carregada
        iniciarModulo(nome);

    } catch (erro) {
        console.error("Erro ao carregar a página:", erro);
        conteudo.innerHTML = `
            <div class="painel vazio">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 40px; color: var(--vermelho); margin-bottom: 15px;"></i>
                <h2>Página não encontrada ou erro de conexão.</h2>
                <p>Não foi possível carregar o conteúdo solicitado.</p>
            </div>
        `;
        if (titulo) titulo.textContent = "Erro";
    } finally {
        // Oculta o indicador de carregamento
        if (loading) loading.classList.add("oculto");
    }
}

/* ==========================================================
   CHAMA O MÓDULO CORRESPONDENTE DA PÁGINA
========================================================== */

function iniciarModulo(nome) {
    const nomeFuncao = `iniciar${primeiraMaiuscula(nome)}`;

    // Verifica se a função existe globalmente antes de chamá-la
    if (typeof window[nomeFuncao] === "function") {
        window[nomeFuncao]();
    }
}

/* ==========================================================
   CONTROLE DA SIDEBAR NO MOBILE
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
   DATA ATUAL NO PERFIL
========================================================== */

function atualizarData() {
    const elementoData = document.getElementById("dataAtual");
    if (!elementoData) return;

    const hoje = new Date();
    elementoData.textContent = hoje.toLocaleDateString(
        "pt-BR",
        {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );
}

/* ==========================================================
   UTILITÁRIOS
========================================================== */

function primeiraMaiuscula(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatarTituloPagina(nome) {
    const mapaTitulos = {
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

    return mapaTitulos[nome] || primeiraMaiuscula(nome);
}
