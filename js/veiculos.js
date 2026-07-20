/* ==========================================================
   SIGACTPAR - MÓDULO DE VEÍCULOS
========================================================== */

let veiculoEditando = null;

function iniciarVeiculos() {
    configurarEventosVeiculos();
    atualizarTabelaVeiculos();
    atualizarIndicadoresVeiculos();
}

function configurarEventosVeiculos() {
    const btnNovo = document.getElementById("btnNovoVeiculo");
    if (btnNovo) {
        btnNovo.onclick = () => {
            veiculoEditando = null;
            document.getElementById("formVeiculo").reset();
            document.getElementById("modalVeiculo").classList.add("ativo");
        };
    }

    const btnAtualizar = document.getElementById("btnAtualizarVeiculos");
    if (btnAtualizar) {
        btnAtualizar.onclick = () => {
            atualizarTabelaVeiculos();
            atualizarIndicadoresVeiculos();
        };
    }

    const fechar = document.getElementById("fecharModalVeiculo");
    const cancelar = document.getElementById("cancelarVeiculo");
    if (fechar) fechar.onclick = () => document.getElementById("modalVeiculo").classList.remove("ativo");
    if (cancelar) cancelar.onclick = () => document.getElementById("modalVeiculo").classList.remove("ativo");

    const pesquisa = document.getElementById("pesquisaVeiculo");
    if (pesquisa) pesquisa.onkeyup = atualizarTabelaVeiculos;

    const form = document.getElementById("formVeiculo");
    if (form) form.onsubmit = salvarVeiculo;
}

function atualizarIndicadoresVeiculos() {
    if (!Banco || !Banco.dados || !Banco.dados.veiculos) return;
    const total = Banco.dados.veiculos.length;
    const disponiveis = Banco.dados.veiculos.filter(v => v.status === "Disponível").length;

    document.getElementById("cardTotalVeiculos").textContent = total;
    document.getElementById("cardVeiculosDisponiveis").textContent = disponiveis;
}

function salvarVeiculo(e) {
    e.preventDefault();
    const objeto = {
        id: veiculoEditando ?? gerarId("veiculo"),
        placa: document.getElementById("placaVeiculo").value.trim(),
        modelo: document.getElementById("modeloVeiculo").value.trim(),
        ano: document.getElementById("anoVeiculo").value.trim(),
        status: document.getElementById("statusVeiculo").value,
        motorista: document.getElementById("motoristaVeiculo").value.trim()
    };

    if (veiculoEditando === null) {
        inserirRegistro("veiculos", objeto);
    } else {
        atualizarRegistro("veiculos", objeto);
    }

    atualizarTabelaVeiculos();
    atualizarIndicadoresVeiculos();
    document.getElementById("modalVeiculo").classList.remove("ativo");
}

function atualizarTabelaVeiculos() {
    const tbody = document.getElementById("listaVeiculos");
    if (!tbody || !Banco || !Banco.dados || !Banco.dados.veiculos) return;

    tbody.innerHTML = "";
    const termo = document.getElementById("pesquisaVeiculo")?.value.toLowerCase() || "";

    let lista = Banco.dados.veiculos.filter(v => 
        (v.placa && v.placa.toLowerCase().includes(termo)) ||
        (v.modelo && v.modelo.toLowerCase().includes(termo)) ||
        (v.motorista && v.motorista.toLowerCase().includes(termo))
    );

    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--texto-secundario);">Nenhum veículo cadastrado.</td></tr>`;
        return;
    }

    tbody.innerHTML = lista.map(item => `
        <tr>
            <td><strong>${item.placa}</strong></td>
            <td>${item.modelo}</td>
            <td>${item.ano || '-'}</td>
            <td><span class="badge ${item.status === 'Disponível' ? 'verde' : item.status === 'Em Diligência' ? 'amarelo' : 'vermelho'}">${item.status}</span></td>
            <td>${item.motorista || 'Não alocado'}</td>
            <td>
                <div class="tabela-acoes">
                    <button class="btn-acao-tabela btn-excluir" onclick="removerRegistro('veiculos', ${item.id}); atualizarTabelaVeiculos(); atualizarIndicadoresVeiculos();" title="Excluir">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}
