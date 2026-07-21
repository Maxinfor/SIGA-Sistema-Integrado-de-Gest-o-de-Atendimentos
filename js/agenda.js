/* ==========================================================
   SIGACTPAR
   MÓDULO DE AGENDA
========================================================== */

let agendaEditando = null;
let agendaExcluir = null;

function iniciarAgenda() {
    configurarEventosAgenda();
    atualizarTabelaAgenda();
    atualizarIndicadoresAgenda();
}

function configurarEventosAgenda() {
    const btnNovo = document.getElementById("btnNovoCompromisso");
    if (btnNovo) btnNovo.onclick = novoCompromisso;

    const btnAtualizar = document.getElementById("btnAtualizarAgenda");
    if (btnAtualizar) {
        btnAtualizar.onclick = () => {
            atualizarTabelaAgenda();
            atualizarIndicadoresAgenda();
        };
    }

    const btnLimparFiltro = document.getElementById("btnLimparFiltroAgenda");
    if (btnLimparFiltro) {
        btnLimparFiltro.onclick = () => {
            const filtroData = document.getElementById("filtroDataAgenda");
            if (filtroData) filtroData.value = "";
            atualizarTabelaAgenda();
        };
    }

    // Fechar modais
    const fecharModalCadastro = document.getElementById("fecharModalAgenda");
    const cancelar = document.getElementById("cancelarAgenda");
    if (fecharModalCadastro) fecharModalCadastro.onclick = fecharModalAgenda;
    if (cancelar) cancelar.onclick = fecharModalAgenda;

    const fecharVis = document.getElementById("fecharVisualizarAgenda");
    const fecharVisRodape = document.getElementById("fecharVisualizarAgendaRodape");
    if (fecharVis) fecharVis.onclick = fecharModalVisualizacaoAgenda;
    if (fecharVisRodape) fecharVisRodape.onclick = fecharModalVisualizacaoAgenda;

    const fecharExc = document.getElementById("fecharExcluirAgenda");
    const cancelarExc = document.getElementById("cancelarExcluirAgenda");
    const confirmarExc = document.getElementById("confirmarExcluirAgenda");
    if (fecharExc) fecharExc.onclick = fecharModalExcluirAgenda;
    if (cancelarExc) cancelarExc.onclick = fecharModalExcluirAgenda;
    if (confirmarExc) confirmarExc.onclick = confirmarExclusaoAgenda;

    // Filtros e Pesquisa
    const pesquisa = document.getElementById("pesquisaAgenda");
    if (pesquisa) pesquisa.onkeyup = atualizarTabelaAgenda;

    const filtroData = document.getElementById("filtroDataAgenda");
    if (filtroData) filtroData.onchange = atualizarTabelaAgenda;

    // Submit formulário
    const form = document.getElementById("formAgenda");
    if (form) form.onsubmit = salvarCompromisso;
}

function novoCompromisso() {
    agendaEditando = null;
    const form = document.getElementById("formAgenda");
    if (form) form.reset();

    const data = document.getElementById("dataCompromisso");
    if (data) data.value = new Date().toISOString().substring(0, 10);

    const horario = document.getElementById("horarioCompromisso");
    if (horario) horario.value = "09:00";

    abrirModalAgenda();
}

function abrirModalAgenda() {
    const modal = document.getElementById("modalAgenda");
    if (modal) modal.classList.add("ativo");
}

function fecharModalAgenda() {
    const modal = document.getElementById("modalAgenda");
    if (modal) modal.classList.remove("ativo");
    agendaEditando = null;
}

function abrirModalVisualizacaoAgenda() {
    const modal = document.getElementById("modalVisualizarAgenda");
    if (modal) modal.classList.add("ativo");
}

function fecharModalVisualizacaoAgenda() {
    const modal = document.getElementById("modalVisualizarAgenda");
    if (modal) modal.classList.remove("ativo");
}

function fecharModalExcluirAgenda() {
    agendaExcluir = null;
    const modal = document.getElementById("modalExcluirAgenda");
    if (modal) modal.classList.remove("ativo");
}

function atualizarIndicadoresAgenda() {
    const total = Banco.dados.agenda.length;
    const hojeStr = new Date().toISOString().substring(0, 10);
    const compromissosHoje = Banco.dados.agenda.filter(a => a.data === hojeStr).length;

    const cardTotal = document.getElementById("cardTotalAgenda");
    const cardHoje = document.getElementById("cardAgendaHoje");

    if (cardTotal) cardTotal.textContent = total;
    if (cardHoje) cardHoje.textContent = compromissosHoje;
}

function salvarCompromisso(e) {
    e.preventDefault();

    const objeto = {
        id: agendaEditando ?? gerarId("agenda"),
        titulo: document.getElementById("tituloAgenda").value.trim(),
        data: document.getElementById("dataCompromisso").value,
        horario: document.getElementById("horarioCompromisso").value,
        local: document.getElementById("localCompromisso").value.trim(),
        responsavel: document.getElementById("responsavelCompromisso").value.trim(),
        descricao: document.getElementById("descricaoCompromisso").value.trim()
    };

    if (!objeto.titulo || !objeto.data || !objeto.horario || !objeto.local || !objeto.responsavel) {
        alert("Preencha todos os campos obrigatórios (*).");
        return;
    }

    if (agendaEditando === null) {
        inserirRegistro("agenda", objeto);
    } else {
        atualizarRegistro("agenda", objeto);
    }

    atualizarTabelaAgenda();
    atualizarIndicadoresAgenda();
    fecharModalAgenda();
}

function atualizarTabelaAgenda() {
    const tbody = document.getElementById("listaAgenda");
    if (!tbody) return;

    tbody.innerHTML = "";
    const termo = document.getElementById("pesquisaAgenda")?.value.toLowerCase() || "";
    const filtroData = document.getElementById("filtroDataAgenda")?.value || "";

    let lista = Banco.dados.agenda.filter(item => {
        const textoMatch = 
            (item.titulo && item.titulo.toLowerCase().includes(termo)) ||
            (item.local && item.local.toLowerCase().includes(termo)) ||
            (item.responsavel && item.responsavel.toLowerCase().includes(termo));

        const dataMatch = filtroData === "" || item.data === filtroData;

        return textoMatch && dataMatch;
    });

    lista.sort((a, b) => {
        if (a.data === b.data) return a.horario.localeCompare(b.horario);
        return a.data.localeCompare(b.data);
    });

    if (lista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="vazio">Nenhum compromisso encontrado.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = lista.map(item => `
        <tr>
            <td><strong>${formatarDataAgenda(item.data)}</strong></td>
            <td>${item.horario}</td>
            <td>${item.titulo}</td>
            <td>${item.local}</td>
            <td>${item.responsavel}</td>
            <td>
                <div class="tabela-acoes">
                    <button class="btn-acao-tabela btn-visualizar" onclick="visualizarAgenda(${item.id})" title="Visualizar">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="btn-acao-tabela btn-editar" onclick="editarAgenda(${item.id})" title="Editar">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-acao-tabela btn-excluir" onclick="excluirAgendaModal(${item.id})" title="Excluir">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}

function visualizarAgenda(id) {
    const item = buscarAgenda(id);
    if (!item) return;

    document.getElementById("verTituloAgenda").value = item.titulo;
    document.getElementById("verDataAgenda").value = formatarDataAgenda(item.data);
    document.getElementById("verHorarioAgenda").value = item.horario;
    document.getElementById("verLocalAgenda").value = item.local;
    document.getElementById("verResponsavelAgenda").value = item.responsavel;
    document.getElementById("verDescricaoAgenda").value = item.descricao || "Nenhuma observação registrada.";

    abrirModalVisualizacaoAgenda();
}

function editarAgenda(id) {
    const item = buscarAgenda(id);
    if (!item) return;

    agendaEditando = item.id;
    document.getElementById("tituloAgenda").value = item.titulo;
    document.getElementById("dataCompromisso").value = item.data;
    document.getElementById("horarioCompromisso").value = item.horario;
    document.getElementById("localCompromisso").value = item.local;
    document.getElementById("responsavelCompromisso").value = item.responsavel;
    document.getElementById("descricaoCompromisso").value = item.descricao;

    abrirModalAgenda();
}

function excluirAgendaModal(id) {
    agendaExcluir = id;
    const modal = document.getElementById("modalExcluirAgenda");
    if (modal) modal.classList.add("ativo");
}

function confirmarExclusaoAgenda() {
    if (agendaExcluir === null) return;

    removerRegistro("agenda", agendaExcluir);
    atualizarTabelaAgenda();
    atualizarIndicadoresAgenda();
    fecharModalExcluirAgenda();
}

function formatarDataAgenda(data) {
    if (!data) return "";
    const partes = data.split("-");
    if (partes.length !== 3) return data;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}
