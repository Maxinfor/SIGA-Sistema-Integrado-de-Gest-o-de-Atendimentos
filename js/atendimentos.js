/* ==========================================================
   ATENDIMENTOS
========================================================== */

function iniciarAtendimentos(){

    atualizarTabela();

    const btn = document.getElementById("btnNovo");

    if(btn){

        btn.onclick = abrirModal;

    }

    const fechar = document.getElementById("fecharModal");

    if(fechar){

        fechar.onclick = fecharModal;

    }

    const cancelar = document.getElementById("cancelar");

    if(cancelar){

        cancelar.onclick = fecharModal;

    }

    const form = document.getElementById("formAtendimento");

    if(form){

        form.onsubmit = salvarAtendimento;

    }

}

/* ==========================================================
   MODAL
========================================================== */

function abrirModal(){

    document

    .getElementById("modalAtendimento")

    .classList

    .add("ativo");

}

function fecharModal(){

    document

    .getElementById("modalAtendimento")

    .classList

    .remove("ativo");

}

/* ==========================================================
   SALVAR
========================================================== */

function salvarAtendimento(e){

    e.preventDefault();

    const atendimento={

        id: Banco.dados.atendimentos.length + 1,

        data: document.getElementById("data").value,

        hora: document.getElementById("hora").value,

        crianca: document.getElementById("crianca").value,

        responsavel: document.getElementById("responsavel").value,

        telefone: document.getElementById("telefone").value,

        status: document.getElementById("status").value,

        relato: document.getElementById("relato").value

    };

    Banco.dados.atendimentos.push(atendimento);

    salvarBanco();

    atualizarTabela();

    fecharModal();

    e.target.reset();

}

/* ==========================================================
   TABELA
========================================================== */

function atualizarTabela(){

    const tbody = document.getElementById("listaAtendimentos");

    if(!tbody) return;

    tbody.innerHTML = "";

    if(Banco.dados.atendimentos.length === 0){

        tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    Nenhum atendimento cadastrado.
                </td>
            </tr>
        `;

        return;
    }

    Banco.dados.atendimentos.forEach(item=>{

        tbody.innerHTML += `
            <tr>

                <td>${item.id}</td>

                <td>${formatarData(item.data)}</td>

                <td>${item.crianca}</td>

                <td>${item.responsavel}</td>

                <td>
                    <span class="status ${corStatus(item.status)}">
                        ${item.status}
                    </span>
                </td>

                <td>

                    <button onclick="visualizar(${item.id})">
                        <i class="fa-solid fa-eye"></i>
                    </button>

                    <button onclick="editar(${item.id})">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button onclick="excluir(${item.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </td>

            </tr>
        `;

    });

}/* ==========================================================
   FORMATA DATA
========================================================== */

function formatarData(data){

    if(!data) return "";

    const partes = data.split("-");

    return partes[2] + "/" + partes[1] + "/" + partes[0];

}
/* ==========================================================
   COR DO STATUS
========================================================== */

function corStatus(status){

    switch(status){

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
/* ==========================================================
   EXCLUIR
========================================================== */

function excluir(id){

    const confirmar = confirm(
        "Deseja realmente excluir este atendimento?"
    );

    if(!confirmar) return;

    Banco.dados.atendimentos =
        Banco.dados.atendimentos.filter(
            atendimento => atendimento.id != id
        );

    salvarBanco();

    atualizarTabela();

}/* ==========================================================
   VISUALIZAR
========================================================== */

function visualizar(id){

    const atendimento =
        Banco.dados.atendimentos.find(
            atendimento => atendimento.id == id
        );

    if(!atendimento) return;

    alert(

`ATENDIMENTO

Data: ${formatarData(atendimento.data)}

Hora: ${atendimento.hora}

Criança:
${atendimento.crianca}

Responsável:
${atendimento.responsavel}

Telefone:
${atendimento.telefone}

Status:
${atendimento.status}

Relato:
${atendimento.relato}`

    );

}/* ==========================================================
   EDITAR
========================================================== */

function editar(id){

    alert(
        "A edição será implementada na próxima etapa."
    );

}
