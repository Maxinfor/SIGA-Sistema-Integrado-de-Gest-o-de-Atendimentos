/* ==========================================================
   SIGACTPAR - MÓDULO DE ATENDIMENTOS (COMPLETO)
========================================================== */

let atendimentoEditando = null;

function iniciarAtendimentos() {
    configurarEventosAtendimentos();
    atualizarTabelaAtendimentos();
    calcularIndicadoresAtendimentos();
}

function configurarEventosAtendimentos() {
    const btnNovo = document.getElementById("btnNovoAtendimento");
    if (btnNovo) {
        btnNovo.onclick = () => {
            atendimentoEditando = null;
            const form = document.getElementById("formAtendimento");
            if (form) form.reset();
            
            // Sugere a data de hoje automaticamente ao abrir
            const hoje = new Date().toISOString().split('T')[0];
            const campoData = document.getElementById("dataAtendimento");
            if (campoData) campoData.value = hoje;

            abrirModalAtendimento("modalAtendimento");
        };
    }

    const btnAtualizar = document.getElementById("btnAtualizarAtendimento");
    if (btnAtualizar) {
        btnAtualizar.onclick = () => {
            const pesquisa = document.getElementById("pesquisaAtendimento");
            if (pesquisa) pesquisa.value = "";
            
            if (typeof Banco !== "undefined" && Banco.inicializar) {
                Banco.inicializar();
            }
            atualizarTabelaAtendimentos();
            calcularIndicadoresAtendimentos();
        };
    }

    // Fechar modais
    const fechar1 = document.getElementById("fecharModalAtendimento");
    const cancelar1 = document.getElementById("cancelarAtendimento");
    if (fechar1) fechar1.onclick = () => fecharModalAtendimento("modalAtendimento");
    if (cancelar1) cancelar1.onclick = () => fecharModalAtendimento("modalAtendimento");

    const fechar2 = document.getElementById("fecharVisualizarAtendimento");
    const fechar2Rodape = document.getElementById("fecharVisualizarAtendimentoRodape");
    if (fechar2) fechar2.onclick = () => fecharModalAtendimento("modalVisualizarAtendimento");
    if (fechar2Rodape) fechar2Rodape.onclick = () => fecharModalAtendimento("modalVisualizarAtendimento");

    const pesquisa = document.getElementById("pesquisaAtendimento");
    if (pesquisa) pesquisa.onkeyup = atualizarTabelaAtendimentos;

    const form = document.getElementById("formAtendimento");
    if (form) form.onsubmit = salvarAtendimento;
}

function abrirModalAtendimento(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add("ativo");
}

function fecharModalAtendimento(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove("ativo");
    if (id === "modalAtendimento") atendimentoEditando = null;
}

function salvarAtendimento(e) {
    e.preventDefault();

    if (!Banco.dados.atendimentos) Banco.dados.atendimentos = [];

    const objeto = {
        id: atendimentoEditando ?? gerarId("atendimentos"),
        data: document.getElementById("dataAtendimento").value,
        tipo: document.getElementById("tipoAtendimento").value,
        assunto: document.getElementById("assuntoAtendimento").value.trim(),
        plantonista: document.getElementById("plantonistaAtendimento").value.trim()
    };

    if (atendimentoEditando === null) {
        inserirRegistro("atendimentos", objeto);
    } else {
        atualizarRegistro("atendimentos", objeto);
    }

    fecharModalAtendimento("modalAtendimento");
    atualizarTabelaAtendimentos();
    calcularIndicadoresAtendimentos();
}

function visualizarAtendimento(id) {
    const item = Banco.dados.atendimentos.find(a => Number(a.id) === Number(id));
    if (!item) return;

    // Formata a data de AAAA-MM-DD para DD/MM/AAAA para exibição amigável
    let dataFormatada = item.data;
    if (item.data && item.data.includes("-")) {
        const partes = item.data.split("-");
        dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    document.getElementById("verDataAtendimento").value = dataFormatada || "";
    document.getElementById("verTipoAtendimento").value = item.tipo || "";
    document.getElementById("verAssuntoAtendimento").value = item.assunto || "";
    document.getElementById("verPlantonistaAtendimento").value = item.plantonista || "";

    abrirModalAtendimento("modalVisualizarAtendimento");
}

function editarAtendimento(id) {
    const item = Banco.dados.atendimentos.find(a => Number(a.id) === Number(id));
    if (!item) return;

    atendimentoEditando = item.id;

    document.getElementById("dataAtendimento").value = item.data || "";
    document.getElementById("tipoAtendimento").value = item.tipo || "";
    document.getElementById("assuntoAtendimento").value = item.assunto || "";
    document.getElementById("plantonistaAtendimento").value = item.plantonista || "";

    abrirModalAtendimento("modalAtendimento");
}

function excluirAtendimento(id) {
    if (!confirm("Deseja realmente excluir este atendimento?")) return;
    removerRegistro("atendimentos", id);
    atualizarTabelaAtendimentos();
    calcularIndicadoresAtendimentos();
}

function calcularIndicadoresAtendimentos() {
    if (!Banco || !Banco.dados || !Banco.dados.atendimentos) return;

    const lista = Banco.dados.atendimentos;
    
    // Data atual do navegador baseada em 2026
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = String(hoje.getMonth() + 1).padStart(2, '0');
    const diaAtual = String(hoje.getDate()).padStart(2, '0');
    
    const dataHojeStr = `${anoAtual}-${mesAtual}-${diaAtual}`;
    const anoMesAtualStr = `${anoAtual}-${mesAtual}`;

    // Total Diário (Conselheiros + Atos de Balcão somados)
    const totalDiario = lista.filter(item => item.data === dataHojeStr).length;

    // Total Mensal (Todo o mês atual somado)
    const totalMensal = lista.filter(item => item.data && item.data.startsWith(anoMesAtualStr)).length;

    const cardDiario = document.getElementById("cardAtendimentosDiarios");
    const cardMensal = document.getElementById("cardAtendimentosMensais");

    if (cardDiario) cardDiario.textContent = totalDiario;
    if (cardMensal) cardMensal.textContent = totalMensal;
}

function atualizarTabelaAtendimentos() {
    const tbody = document.getElementById("listaAtendimentos");
    if (!tbody || !Banco || !Banco.dados || !Banco.dados.atendimentos) return;

    tbody.innerHTML = "";
    const termo = document.getElementById("pesquisaAtendimento")?.value.toLowerCase() || "";

    let lista = Banco.dados.atendimentos.filter(item => 
        (item.assunto && item.assunto.toLowerCase().includes(termo)) ||
        (item.plantonista && item.plantonista.toLowerCase().includes(termo)) ||
        (item.tipo && item.tipo.toLowerCase().includes(termo)) ||
        (item.data && item.data.includes(termo))
    );

    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: var(--texto-secundario);">Nenhum atendimento encontrado.</td></tr>`;
        return;
    }

    // Ordena do mais recente para o mais antigo por data
    lista.sort((a, b) => new Date(b.data) - new Date(a.data));

    tbody.innerHTML = lista.map(item => {
        let dataFormatada = item.data;
        if (item.data && item.data.includes("-")) {
            const partes = item.data.split("-");
            dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
        }

        // Estilo diferente para destacar o Ato de Atendimento (Balcão)
        const ehAtoBalcao = item.tipo && item.tipo.includes("Ato de Atendimento");
        const badgeTipo = ehAtoBalcao 
            ? `<span class="badge badge-laranja" style="font-size:11px;">Ato de Balcão</span>` 
            : `<span class="badge badge-azul" style="font-size:11px;">Conselheiro</span>`;

        return `
            <tr>
                <td><strong>${dataFormatada}</strong></td>
                <td>
                    ${item.tipo || "Não informado"}<br>
                    ${badgeTipo}
                </td>
                <td>${item.assunto}</td>
                <td>${item.plantonista}</td>
                <td>
                    <div class="tabela-acoes">
                        <button class="btn-acao-tabela btn-visualizar" onclick="visualizarAtendimento(${item.id})" title="Visualizar / Imprimir">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn-acao-tabela btn-editar" onclick="editarAtendimento(${item.id})" title="Editar">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn-acao-tabela btn-excluir" onclick="excluirAtendimento(${item.id})" title="Excluir">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}
