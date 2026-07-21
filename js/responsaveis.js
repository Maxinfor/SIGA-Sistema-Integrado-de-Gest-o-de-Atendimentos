/* ==========================================================
   SIGACTPAR - MÓDULO DE RESPONSÁVEIS
========================================================== */

let responsavelEditando = null;

function iniciarResponsaveis() {
    configurarEventosResponsaveis();
    atualizarTabelaResponsaveis();
    atualizarIndicadoresResponsaveis();
}

function configurarEventosResponsaveis() {
    const btnNovo = document.getElementById("btnNovoResponsavel");
    if (btnNovo) {
        btnNovo.onclick = () => {
            responsavelEditando = null;
            const form = document.getElementById("formResponsavel");
            if (form) form.reset();
            abrirModalResponsavel();
        };
    }

    const btnAtualizar = document.getElementById("btnAtualizarResponsaveis");
    if (btnAtualizar) {
        btnAtualizar.onclick = () => {
            atualizarTabelaResponsaveis();
            atualizarIndicadoresResponsaveis();
        };
    }

    const fechar = document.getElementById("fecharModalResponsavel");
    const cancelar = document.getElementById("cancelarResponsavel");
    if (fechar) fechar.onclick = fecharModalResponsavel;
    if (cancelar) cancelar.onclick = fecharModalResponsavel;

    const pesquisa = document.getElementById("pesquisaResponsavel");
    if (pesquisa) pesquisa.onkeyup = atualizarTabelaResponsaveis;

    const form = document.getElementById("formResponsavel");
    if (form) form.onsubmit = salvarResponsavel;
}

function abrirModalResponsavel() {
    const modal = document.getElementById("modalResponsavel");
    if (modal) modal.classList.add("ativo");
}

function fecharModalResponsavel() {
    const modal = document.getElementById("modalResponsavel");
    if (modal) modal.classList.remove("ativo");
    responsavelEditando = null;
}

function atualizarIndicadoresResponsaveis() {
    if (!Banco || !Banco.dados || !Banco.dados.responsaveis) return;
    const total = Banco.dados.responsaveis.length;
    const cardTotal = document.getElementById("cardTotalResponsaveis");
    if (cardTotal) cardTotal.textContent = total;
}

function salvarResponsavel(e) {
    e.preventDefault();

    const objeto = {
        id: responsavelEditando ?? gerarId("responsavel"),
        nome: document.getElementById("nomeResponsavel").value.trim(),
        cpf: document.getElementById("cpfResponsavel").value.trim(),
        telefone: document.getElementById("telefoneResponsavel").value.trim(),
        endereco: document.getElementById("enderecoResponsavel").value.trim(),
        observacoes: document.getElementById("observacoesResponsavel").value.trim()
    };

    if (responsavelEditando === null) {
        inserirRegistro("responsaveis", objeto);
    } else {
        atualizarRegistro("responsaveis", objeto);
    }

    atualizarTabelaResponsaveis();
    atualizarIndicadoresResponsaveis();
    fecharModalResponsavel();
}

function atualizarTabelaResponsaveis() {
    const tbody = document.getElementById("listaResponsaveis");
    if (!tbody || !Banco || !Banco.dados || !Banco.dados.responsaveis) return;

    tbody.innerHTML = "";
    const termo = document.getElementById("pesquisaResponsavel")?.value.toLowerCase() || "";

    let lista = Banco.dados.responsaveis.filter(item => 
        (item.nome && item.nome.toLowerCase().includes(termo)) ||
        (item.cpf && item.cpf.toLowerCase().includes(termo)) ||
        (item.telefone && item.telefone.toLowerCase().includes(termo))
    );

    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--texto-secundario);">Nenhum responsável cadastrado.</td></tr>`;
        return;
    }

    tbody.innerHTML = lista.map(item => `
        <tr>
            <td><strong>#${item.id}</strong></td>
            <td>${item.nome}</td>
            <td>${item.cpf}</td>
            <td>${item.telefone}</td>
            <td>${item.endereco}</td>
            <td>
                <div class="tabela-acoes">
                    <button class="btn-acao-tabela btn-excluir" onclick="removerRegistro('responsaveis', ${item.id}); atualizarTabelaResponsaveis(); atualizarIndicadoresResponsaveis();" title="Excluir">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}
