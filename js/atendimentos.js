/* ==========================================================
   SIGACTPAR
   MÓDULO DE ATENDIMENTOS
   Parte 1 - Estrutura Inicial
========================================================== */

let atendimentoEditando = null;
let atendimentoExcluir = null;

/* ==========================================================
   INICIAR MÓDULO
========================================================== */

function iniciarAtendimentos() {

    configurarEventos();

    atualizarTabela();

    atualizarIndicadores();

}

/* ==========================================================
   CONFIGURA EVENTOS
========================================================== */

function configurarEventos() {

    // Novo Atendimento
    const btnNovo = document.getElementById("btnNovo");

    if (btnNovo) {
        btnNovo.onclick = novoAtendimento;
    }

    // Atualizar
    const btnAtualizar = document.getElementById("btnAtualizar");

    if (btnAtualizar) {

        btnAtualizar.onclick = () => {

            atualizarTabela();

            atualizarIndicadores();

        };

    }

    // Fechar Modal Cadastro
    const fecharModalCadastro = document.getElementById("fecharModal");

    if (fecharModalCadastro) {

        fecharModalCadastro.onclick = fecharModal;

    }

    // Cancelar Cadastro
    const cancelar = document.getElementById("cancelar");

    if (cancelar) {

        cancelar.onclick = fecharModal;

    }

    // Fechar Modal Visualização
    const fecharVisualizar = document.getElementById("fecharVisualizar");

    if (fecharVisualizar) {

        fecharVisualizar.onclick = fecharVisualizacao;

    }

    // Botão Fechar Rodapé
    const fecharRodape = document.getElementById("fecharVisualizarRodape");

    if (fecharRodape) {

        fecharRodape.onclick = fecharVisualizacao;

    }

    // Pesquisa
    const pesquisa = document.getElementById("pesquisa");

    if (pesquisa) {

        pesquisa.onkeyup = atualizarTabela;

    }

    // Filtro Status
    const filtroStatus = document.getElementById("filtroStatus");

    if (filtroStatus) {

        filtroStatus.onchange = atualizarTabela;

    }

    // Filtro Tipo
    const filtroTipo = document.getElementById("filtroTipo");

    if (filtroTipo) {

        filtroTipo.onchange = atualizarTabela;

    }

    // Filtro Plantonista
    const filtroPlantonista = document.getElementById("filtroPlantonista");

    if (filtroPlantonista) {

        filtroPlantonista.onchange = atualizarTabela;

    }

    // Formulário
    const formulario = document.getElementById("formAtendimento");

    if (formulario) {

        formulario.onsubmit = salvarAtendimento;

    }

}

/* ==========================================================
   NOVO ATENDIMENTO
========================================================== */

function novoAtendimento() {

    atendimentoEditando = null;

    const form = document.getElementById("formAtendimento");

    if (form) {

        form.reset();

    }

    const numero = document.getElementById("numero");

    if (numero) {

        numero.value = gerarNumero();

    }

    const data = document.getElementById("data");

    if (data) {

        data.value = new Date().toISOString().substring(0, 10);

    }

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
   MODAIS
========================================================== */

function abrirModal() {

    document
        .getElementById("modalAtendimento")
        .classList
        .add("ativo");

}

function fecharModal() {

    document
        .getElementById("modalAtendimento")
        .classList
        .remove("ativo");

}

function abrirVisualizacao() {

    document
        .getElementById("modalVisualizar")
        .classList
        .add("ativo");

}

function fecharVisualizacao() {

    document
        .getElementById("modalVisualizar")
        .classList
        .remove("ativo");

}

/* ==========================================================
   GERAR NÚMERO DO ATENDIMENTO
========================================================== */

function gerarNumero() {

    const numero = Banco.dados.atendimentos.length + 1;

    return "AT-" + String(numero).padStart(6, "0");

}

/* ==========================================================
   ATUALIZAR INDICADORES
========================================================== */

/* ==========================================================
   ATUALIZAR INDICADORES
========================================================== */

function atualizarIndicadores() {

    const total = Banco.dados.atendimentos.length;

    const hoje = new Date().toISOString().substring(0,10);

    const atendimentosHoje =
        Banco.dados.atendimentos.filter(a => a.data === hoje).length;

    const pendentes =
        Banco.dados.atendimentos.filter(a => a.status === "Pendente").length;

    const concluidos =
        Banco.dados.atendimentos.filter(a => a.status === "Concluído").length;

    const cardTotal = document.getElementById("cardTotal");
    const cardHoje = document.getElementById("cardHoje");
    const cardPendente = document.getElementById("cardPendente");
    const cardConcluido = document.getElementById("cardConcluido");

    if(cardTotal) cardTotal.textContent = total;
    if(cardHoje) cardHoje.textContent = atendimentosHoje;
    if(cardPendente) cardPendente.textContent = pendentes;
    if(cardConcluido) cardConcluido.textContent = concluidos;

}

/* ==========================================================
   SALVAR ATENDIMENTO
========================================================== */

function salvarAtendimento(e){

    e.preventDefault();

    const atendimento = {

        id: atendimentoEditando ??
            (Banco.dados.atendimentos.length + 1),

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

        observacoes:
            document.getElementById("observacoes").value.trim()

    };

    if(

        atendimento.crianca === "" ||

        atendimento.responsavel === "" ||

        atendimento.assunto === "" ||

        atendimento.relato === ""

    ){

        alert("Preencha todos os campos obrigatórios.");

        return;

    }

    if(atendimentoEditando === null){

        Banco.dados.atendimentos.push(atendimento);

    }else{

        const indice =
            Banco.dados.atendimentos.findIndex(

                a => a.id === atendimentoEditando

            );

        if(indice >= 0){

            Banco.dados.atendimentos[indice] = atendimento;

        }

    }

    salvarBanco();

    atualizarTabela();

    atualizarIndicadores();

    fecharModal();

    document.getElementById("formAtendimento").reset();

    atendimentoEditando = null;

}
/* ==========================================================
   ATUALIZAR TABELA
========================================================== */
/* ==========================================================
   ATUALIZAR TABELA
========================================================== */

function atualizarTabela() {

    const tbody = document.getElementById("listaAtendimentos");

    if (!tbody) return;

    tbody.innerHTML = "";

    const pesquisa =
        document.getElementById("pesquisa")?.value.toLowerCase() || "";

    const filtroStatus =
        document.getElementById("filtroStatus")?.value || "";

    const filtroTipo =
        document.getElementById("filtroTipo")?.value || "";

    const filtroPlantonista =
        document.getElementById("filtroPlantonista")?.value || "";

    let lista = Banco.dados.atendimentos.filter(item => {

        const texto =

            item.numero?.toLowerCase().includes(pesquisa) ||

            item.crianca?.toLowerCase().includes(pesquisa) ||

            item.responsavel?.toLowerCase().includes(pesquisa) ||

            item.assunto?.toLowerCase().includes(pesquisa);

        const status =
            filtroStatus === "" ||
            item.status === filtroStatus;

        const tipo =
            filtroTipo === "" ||
            item.tipo === filtroTipo;

        const plantonista =
            filtroPlantonista === "" ||
            item.plantonista === filtroPlantonista;

        return texto && status && tipo && plantonista;

    });

    lista.sort((a, b) => b.id - a.id);

    if (lista.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td colspan="8">

                    Nenhum atendimento encontrado.

                </td>

            </tr>

        `;

        return;

    }

    lista.forEach(item => {

        tbody.innerHTML += `

        <tr>

            <td>${item.numero}</td>

            <td>${formatarData(item.data)}</td>

            <td>${item.hora}</td>

            <td>${item.crianca}</td>

            <td>${item.responsavel}</td>

            <td>${item.assunto}</td>

            <td>

                <span class="status ${corStatus(item.status)}">

                    ${item.status}

                </span>

            </td>

            <td>

                <button
                    class="btn-tabela visualizar"
                    onclick="visualizar(${item.id})"
                    title="Visualizar">

                    <i class="fa-solid fa-eye"></i>

                </button>

                <button
                    class="btn-tabela editar"
                    onclick="editar(${item.id})"
                    title="Editar">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="btn-tabela excluir"
                    onclick="excluir(${item.id})"
                    title="Excluir">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}

/* ==========================================================
   VISUALIZAR
========================================================== */

function visualizar(id) {

    // Será implementado na Parte 4

}

/* ==========================================================
   EDITAR
========================================================== */

function editar(id) {

    // Será implementado na Parte 5

}

/* ==========================================================
   EXCLUIR
========================================================== */

function excluir(id) {

    // Será implementado na Parte 6

}

/* ==========================================================
   FUNÇÕES AUXILIARES
========================================================== */

function formatarData(data) {

    if (!data) return "";

    const partes = data.split("-");

    return partes[2] + "/" + partes[1] + "/" + partes[0];

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
