/* ==========================================================
   SIGACTPAR - MÓDULO DE PATRIMÔNIO (CORRIGIDO E COMPLETO)
========================================================== */

let patrimonioEditando = null;

function iniciarPatrimonio() {
    configurarEventosPatrimonio();
    atualizarTabelaPatrimonio();
}

function configurarEventosPatrimonio() {
    const btnNovo = document.getElementById("btnNovoPatrimonio");
    if (btnNovo) {
        btnNovo.onclick = () => {
            patrimonioEditando = null;
            const form = document.getElementById("formPatrimonio");
            if (form) form.reset();
            abrirModal("modalPatrimonio");
        };
    }

    const btnAtualizar = document.getElementById("btnAtualizarPatrimonio");
    if (btnAtualizar) btnAtualizar.onclick = atualizarTabelaPatrimonio;

    // Fechar modais
    const fechar1 = document.getElementById("fecharModalPatrimonio");
    const cancelar1 = document.getElementById("cancelarPatrimonio");
    if (fechar1) fechar1.onclick = () => fecharModal("modalPatrimonio");
    if (cancelar1) cancelar1.onclick = () => fecharModal("modalPatrimonio");

    const fechar2 = document.getElementById("fecharVisualizarPatrimonio");
    const fechar2Rodape = document.getElementById("fecharVisualizarPatrimonioRodape");
    if (fechar2) fechar2.onclick = () => fecharModal("modalVisualizarPatrimonio");
    if (fechar2Rodape) fechar2Rodape.onclick = () => fecharModal("modalVisualizarPatrimonio");

    const pesquisa = document.getElementById("pesquisaPatrimonio");
    if (pesquisa) pesquisa.onkeyup = atualizarTabelaPatrimonio;

    const form = document.getElementById("formPatrimonio");
    if (form) form.onsubmit = salvarPatrimonio;
}

function abrirModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add("ativo");
}

function fecharModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove("ativo");
    if (id === "modalPatrimonio") patrimonioEditando = null;
}

function salvarPatrimonio(e) {
    e.preventDefault();

    if (!Banco.dados.patrimonio) Banco.dados.patrimonio = [];

    const objeto = {
        id: patrimonioEditando ?? gerarId("patrimonio"),
        tombamento: document.getElementById("tombamentoPatrimonio").value.trim(),
        descricao: document.getElementById("descricaoPatrimonio").value.trim(),
        local: document.getElementById("localPatrimonio").value.trim(),
        estado: document.getElementById("estadoPatrimonio").value,
        obs: document.getElementById("obsPatrimonio").value.trim()
    };

    if (patrimonioEditando === null) {
        inserirRegistro("patrimonio", objeto);
    } else {
        atualizarRegistro("patrimonio", objeto);
    }

    fecharModal("modalPatrimonio");
    atualizarTabelaPatrimonio();
}

function visualizarPatrimonio(id) {
    const item = Banco.dados.patrimonio.find(p => Number(p.id) === Number(id));
    if (!item) return;

    document.getElementById("verTombamento").value = item.tombamento || "";
    document.getElementById("verEstado").value = item.estado || "";
    document.getElementById("verDescricao").value = item.descricao || "";
    document.getElementById("verLocal").value = item.local || "";
    document.getElementById("verObs").value = item.obs || "";

    abrirModal("modalVisualizarPatrimonio");
}

function editarPatrimonio(id) {
    const item = Banco.dados.patrimonio.find(p => Number(p.id) === Number(id));
    if (!item) return;

    patrimonioEditando = item.id;

    document.getElementById("tombamentoPatrimonio").value = item.tombamento || "";
    document.getElementById("estadoPatrimonio").value = item.estado || "Bom";
    document.getElementById("descricaoPatrimonio").value = item.descricao || "";
    document.getElementById("localPatrimonio").value = item.local || "";
    document.getElementById("obsPatrimonio").value = item.obs || "";

    abrirModal("modalPatrimonio");
}

function excluirPatrimonio(id) {
    if (!confirm("Deseja realmente excluir este item do patrimônio?")) return;
    removerRegistro("patrimonio", id);
    atualizarTabelaPatrimonio();
}

function atualizarTabelaPatrimonio() {
    const tbody = document.getElementById("listaPatrimonio");
    if (!tbody || !Banco || !Banco.dados || !Banco.dados.patrimonio) return;

    tbody.innerHTML = "";
    const termo = document.getElementById("pesquisaPatrimonio")?.value.toLowerCase() || "";

    let lista = Banco.dados.patrimonio.filter(item => 
        (item.descricao && item.descricao.toLowerCase().includes(termo)) ||
        (item.tombamento && item.tombamento.toLowerCase().includes(termo)) ||
        (item.local && item.local.toLowerCase().includes(termo))
    );

    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--texto-secundario);">Nenhum patrimônio encontrado.</td></tr>`;
        return;
    }

    tbody.innerHTML = lista.map(item => `
        <tr>
            <td><strong>${item.tombamento}</strong></td>
            <td>${item.descricao}</td>
            <td>${item.local}</td>
            <td>${item.estado}</td>
            <td>
                <div class="tabela-acoes">
                    <button class="btn-acao-tabela btn-visualizar" onclick="visualizarPatrimonio(${item.id})" title="Visualizar / Imprimir">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="btn-acao-tabela btn-editar" onclick="editarPatrimonio(${item.id})" title="Editar">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-acao-tabela btn-excluir" onclick="excluirPatrimonio(${item.id})" title="Excluir">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}
