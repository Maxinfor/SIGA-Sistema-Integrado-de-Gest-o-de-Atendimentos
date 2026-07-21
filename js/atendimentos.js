/* ==========================================================
   SIGACTPAR
   MÓDULO DE ATENDIMENTOS - LÓGICA COMPLETA
========================================================== */

let atendimentoEditando = null;
let atendimentoExcluir = null;

/* ==========================================================
   INICIALIZAÇÃO DO MÓDULO
========================================================== */

function iniciarAtendimentos() {
    configurarEventosAtendimentos();
    atualizarTabela();
    atualizarIndicadores();
}

/* ==========================================================
   CONFIGURAÇÃO DE EVENTOS
========================================================== */

function configurarEventosAtendimentos() {
    // Novo Atendimento
    const btnNovo = document.getElementById("btnNovo");
    if (btnNovo) btnNovo.onclick = novoAtendimento;

    // Atualizar Tabela / Indicadores
    const btnAtualizar = document.getElementById("btnAtualizar");
    if (btnAtualizar) {
        btnAtualizar.onclick = () => {
            atualizarTabela();
            atualizarIndicadores();
        };
    }

    // Fechar / Cancelar Modal Cadastro
    const fecharModalCadastro = document.getElementById("fecharModal");
    const cancelar = document.getElementById("cancelar");
    if (fecharModalCadastro) fecharModalCadastro.onclick = fecharModal;
    if (cancelar) cancelar.onclick = fecharModal;

    // Fechar Modal Visualização
    const fecharVisualizar = document.getElementById("fecharVisualizar");
    const fecharRodape = document.getElementById("fecharVisualizarRodape");
    if (fecharVisualizar) fecharVisualizar.onclick = fecharVisualizacao;
    if (fecharRodape) fecharRodape.onclick = fecharVisualizacao;

    // Fechar / Cancelar Modal Exclusão
    const fecharExcluir = document.getElementById("fecharModalExcluir");
    const cancelarExcluir = document.getElementById("cancelarExcluir");
    const btnConfirmarExcluir = document.getElementById("confirmarExcluir");
    if (fecharExcluir) fecharExcluir.onclick = fecharModalExcluir;
    if (cancelarExcluir) cancelarExcluir.onclick = fecharModalExcluir;
    if (btnConfirmarExcluir) btnConfirmarExcluir.onclick = confirmarExcluir;

    // Filtros e Pesquisa Dinâmica
    const pesquisa = document.getElementById("pesquisa");
    if (pesquisa) pesquisa.onkeyup = atualizarTabela;

    const filtroStatus = document.getElementById("filtroStatus");
    if (filtroStatus) filtroStatus.onchange = atualizarTabela;

    const filtroTipo = document.getElementById("filtroTipo");
    if (filtroTipo) filtroTipo.onchange = atualizarTabela;

    const filtroPlantonista = document.getElementById("filtroPlantonista");
    if (filtroPlantonista) filtroPlantonista.onchange = atualizarTabela;

    // Submissão do Formulário
    const formulario = document.getElementById("formAtendimento");
    if (formulario) formulario.onsubmit = salvarAtendimento;
}

/* ==========================================================
   NOVO ATENDIMENTO
========================================================== */

function novoAtendimento() {
    atendimentoEditando = null;

    const form = document.getElementById("formAtendimento");
    if (form) form.reset();

    const numero = document.getElementById("numero");
    if (numero) numero.value = gerarNumeroAtendimento();

    const data = document.getElementById("data");
    if (data) data.value = new Date().toISOString().substring(0, 10);

    const hora = document.getElementById("hora");
    if (hora) {
        hora.value = new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    abrirModal();
}

/* ==========================================================
   GERENCIAMENTO DE MODAIS
========================================================== */

function abrirModal() {
    const modal = document.getElementById("modalAtendimento");
    if (modal) modal.classList.add("ativo");
}

function fecharModal() {
    const modal = document.getElementById("modalAtendimento");
    if (modal) modal.classList.remove("ativo");
    atendimentoEditando = null;
}

function abrirVisualizacao() {
    const modal = document.getElementById("modalVisualizar");
    if (modal) modal.classList.add("ativo");
}

function fecharVisualizacao() {
    const modal = document.getElementById("modalVisualizar");
    if (modal) modal.classList.remove("ativo");
}

/* ==========================================================
   GERAR NÚMERO DO ATENDIMENTO
========================================================== */

function gerarNumeroAtendimento() {
    const anoAtual = new Date().getFullYear();
    const total = Banco.dados.atendimentos.length + 1;
    return `${anoAtual}/${String(total).padStart(4, "0")}`;
}

/* ==========================================================
   ATUALIZAR INDICADORES (CARDS SUPERIORES)
========================================================== */

function atualizarIndicadores() {
    const total = Banco.dados.atendimentos.length;
    const hoje = new Date().toISOString().substring(0, 10);

    const atendimentosHoje = Banco.dados.atendimentos.filter(a => a.data === hoje).length;
    const pendentes = Banco.dados.atendimentos.filter(a => a.status === "Pendente").length;
    const concluidos = Banco.dados.atendimentos.filter(a => a.status === "Concluído").length;

    const cardTotal = document.getElementById("cardTotal");
    const cardHoje = document.getElementById("cardHoje");
    const cardPendente = document.getElementById("cardPendente");
    const cardConcluido = document.getElementById("cardConcluido");

    if (cardTotal) cardTotal.textContent = total;
    if (cardHoje) cardHoje.textContent = atendimentosHoje;
    if (cardPendente) cardPendente.textContent = pendentes;
    if (cardConcluido) cardConcluido.textContent = concluidos;
}

/* ==========================================================
   SALVAR ATENDIMENTO (INSERIR OU EDITAR)
========================================================== */

function salvarAtendimento(e) {
    e.preventDefault();

    const atendimento = {
        id: atendimentoEditando ?? gerarId("atendimento"),
        numero: document.getElementById("numero").value,
        data: document.getElementById("data").value,
        hora: document.getElementById("hora").value,
        tipo: document.getElementById("tipo").value,
        plantonista: document.getElementById("plantonista").value,
        crianca: document.getElementById("crianca").value.trim(),
        responsavel: document.getElementById("responsavel").value.trim(),
        telefone: document.getElementById("telefone").value.trim(),
        assunto: document.getElementById("assunto").value.trim(),
        status: document.getElementById("status").value,
        relato: document.getElementById("relato").value.trim(),
        observacoes: document.getElementById("observacoes").value.trim()
    };

    if (!atendimento.crianca || !atendimento.responsavel || !atendimento.assunto || !atendimento.relato) {
        alert("Preencha todos os campos obrigatórios (*).");
        return;
    }

    if (atendimentoEditando === null) {
        inserirRegistro("atendimentos", atendimento);
    } else {
        atualizarRegistro("atendimentos", atendimento);
    }

    atualizarTabela();
    atualizarIndicadores();
    fecharModal();
    
    const form = document.getElementById("formAtendimento");
    if (form) form.reset();
}

/* ==========================================================
   ATUALIZAR TABELA COM FILTROS E PESQUISA
========================================================== */

function atualizarTabela() {
    const tbody = document.getElementById("listaAtendimentos");
    if (!tbody) return;

    tbody.innerHTML = "";

    const pesquisa = document.getElementById("pesquisa")?.value.toLowerCase() || "";
    const filtroStatus = document.getElementById("filtroStatus")?.value || "";
    const filtroTipo = document.getElementById("filtroTipo")?.value || "";
    const filtroPlantonista = document.getElementById("filtroPlantonista")?.value || "";

    let lista = Banco.dados.atendimentos.filter(item => {
        const textoMatch = 
            (item.numero && item.numero.toLowerCase().includes(pesquisa)) ||
            (item.crianca && item.crianca.toLowerCase().includes(pesquisa)) ||
            (item.responsavel && item.responsavel.toLowerCase().includes(pesquisa)) ||
            (item.assunto && item.assunto.toLowerCase().includes(pesquisa));

        const statusMatch = filtroStatus === "" || item.status === filtroStatus;
        const tipoMatch = filtroTipo === "" || item.tipo === filtroTipo;
        const plantonistaMatch = filtroPlantonista === "" || item.plantonista === filtroPlantonista;

        return textoMatch && statusMatch && tipoMatch && plantonistaMatch;
    });

    // Ordena do mais recente para o mais antigo
    lista.sort((a, b) => b.id - a.id);

    if (lista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="vazio">Nenhum atendimento encontrado.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = lista.map(item => `
        <tr>
            <td><strong>${item.numero || `#${item.id}`}</strong></td>
            <td>${formatarData(item.data)}</td>
            <td>${item.hora || "--:--"}</td>
            <td>${item.crianca}</td>
            <td>${item.responsavel}</td>
            <td>${item.assunto}</td>
            <td>
                <span class="status ${corStatus(item.status)}">
                    ${item.status}
                </span>
            </td>
            <td>
                <div class="tabela-acoes">
                    <button class="btn-acao-tabela btn-visualizar" onclick="visualizar(${item.id})" title="Visualizar">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="btn-acao-tabela btn-editar" onclick="editar(${item.id})" title="Editar">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-acao-tabela btn-excluir" onclick="excluir(${item.id})" title="Excluir">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}

/* ==========================================================
   VISUALIZAR ATENDIMENTO
========================================================== */

function visualizar(id) {
    const atendimento = buscarAtendimento(id);
    if (!atendimento) return;

    preencherCamposModal("ver", atendimento);
    abrirVisualizacao();
}

/* ==========================================================
   EDITAR ATENDIMENTO
========================================================== */

function editar(id) {
    const atendimento = buscarAtendimento(id);
    if (!atendimento) return;

    atendimentoEditando = atendimento.id;
    preencherCamposModal("", atendimento);
    abrirModal();
}

/* ==========================================================
   EXCLUIR ATENDIMENTO
========================================================== */

function excluir(id) {
    atendimentoExcluir = id;
    const modal = document.getElementById("modalExcluir");
    if (modal) modal.classList.add("ativo");
}

function fecharModalExcluir() {
    atendimentoExcluir = null;
    const modal = document.getElementById("modalExcluir");
    if (modal) modal.classList.remove("ativo");
}

function confirmarExcluir() {
    if (atendimentoExcluir === null) return;

    removerRegistro("atendimentos", atendimentoExcluir);
    atualizarTabela();
    atualizarIndicadores();
    fecharModalExcluir();
}

/* ==========================================================
   FUNÇÕES AUXILIARES
========================================================== */

function formatarData(data) {
    if (!data) return "";
    const partes = data.split("-");
    if (partes.length !== 3) return data;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function corStatus(status) {
    switch (status) {
        case "Concluído":
            return "status-verde";
        case "Encaminhado":
            return "status-laranja";
        case "Pendente":
            return "status-vermelho";
        default:
            return "status-azul";
    }
}

function preencherCamposModal(pref, obj) {
    const campos = [
        "Numero", "Data", "Hora", "Tipo", "Plantonista", 
        "Crianca", "Responsavel", "Telefone", "Assunto", 
        "Status", "Relato", "Observacoes"
    ];

    campos.forEach(campo => {
        const el = document.getElementById(`${pref}${campo.charAt(0).toLowerCase() + campo.slice(1)}`);
        if (el) {
            const chave = campo.toLowerCase();
            let valor = obj[chave] || "";
            if (chave === "data" && pref === "ver") {
                valor = formatarData(valor);
            }
            el.value = valor;
        }
    });
}
