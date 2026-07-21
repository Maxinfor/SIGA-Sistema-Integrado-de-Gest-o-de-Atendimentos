/* ==========================================================
   SIGACTPAR - MÓDULO DE PROCESSOS
========================================================== */

let processoEditando = null;

function iniciarProcessos() {
    configurarEventosProcessos();
    atualizarTabelaProcessos();
    atualizarIndicadoresProcessos();
}

function configurarEventosProcessos() {
    const btnNovo = document.getElementById("btnNovoProcesso");
    if (btnNovo) btnNovo.onclick = () => { processoEditando = null; document.getElementById("formProcesso").reset(); abrirModalProcesso(); };

    const btnAtualizar = document.getElementById("btnAtualizarProcessos");
    if (btnAtualizar) btnAtualizar.onclick = () => { atualizarTabelaProcessos(); atualizarIndicadoresProcessos(); };

    const fechar = document.getElementById("fecharModalProcesso");
    const cancelar = document.getElementById("cancelarProcesso");
    if (fechar) fechar.onclick = fecharModalProcesso;
    if (cancelar) cancelar.onclick = fecharModalProcesso;

    const pesquisa = document.getElementById("pesquisaProcesso");
    if (pesquisa) pesquisa.onkeyup = atualizarTabelaProcessos;

    const form = document.getElementById("formProcesso");
    if (form) form.onsubmit = salvarProcesso;
}

function abrirModalProcesso() {
    const modal = document.getElementById("modalProcesso");
    if (modal) modal.classList.add("ativo");
}

function fecharModalProcesso() {
    const modal = document.getElementById("modalProcesso");
    if (modal) modal.classList.remove("ativo");
}

function atualizarIndicadoresProcessos() {
    if (!Banco || !Banco.dados || !Banco.dados.processos) return;
    const total = Banco.dados.processos.length;
    const andamento = Banco.dados.processos.filter(p => p.status === "Em Andamento").length;

    document.getElementById("cardTotalProcessos").textContent = total;
    document.getElementById("cardProcessosAndamento").textContent = andamento;
}

function salvarProcesso(e) {
    e.preventDefault();
    const objeto = {
        id: processoEditando ?? gerarId("processo"),
        numero: document.getElementById("numeroProcesso").value.trim(),
        status: document.getElementById("statusProcesso").value,
        assunto: document.getElementById("assuntoProcesso").value.trim(),
        interessado: document.getElementById("interessadoProcesso").value.trim(),
        descricao: document.getElementById("descricaoProcesso").value.trim(),
        data: new Date().toLocaleDateString("pt-BR")
    };

    if (processoEditando === null) {
        inserirRegistro("processos", objeto);
    } else {
        atualizarRegistro("processos", objeto);
    }

    atualizarTabelaProcessos();
    atualizarIndicadoresProcessos();
    fecharModalProcesso();
}

function atualizarTabelaProcessos() {
    const tbody = document.getElementById("listaProcessos");
    if (!tbody || !Banco || !Banco.dados || !Banco.dados.processos) return;

    tbody.innerHTML = "";
    const termo = document.getElementById("pesquisaProcesso")?.value.toLowerCase() || "";

    let lista = Banco.dados.processos.filter(p => 
        (p.numero && p.numero.toLowerCase().includes(termo)) ||
        (p.assunto && p.assunto.toLowerCase().includes(termo)) ||
        (p.interessado && p.interessado.toLowerCase().includes(termo))
    );

    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--texto-secundario);">Nenhum processo encontrado.</td></tr>`;
        return;
    }

    tbody.innerHTML = lista.map(item => `
        <tr>
            <td><strong>${item.numero}</strong></td>
            <td>${item.assunto}</td>
            <td>${item.interessado}</td>
            <td>${item.data}</td>
            <td><span class="badge ${item.status === 'Em Andamento' ? 'amarelo' : 'verde'}">${item.status}</span></td>
            <td>
                <div class="tabela-acoes">
                    <button class="btn-acao-tabela btn-excluir" onclick="removerRegistro('processos', ${item.id}); atualizarTabelaProcessos(); atualizarIndicadoresProcessos();" title="Excluir">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}
