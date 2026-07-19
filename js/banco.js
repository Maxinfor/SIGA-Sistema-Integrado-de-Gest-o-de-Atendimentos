/* ==========================================================
   SIGACTPAR
   BANCO DE DADOS LOCAL
   Conselho Tutelar do Paranoá
========================================================== */

/* ==========================================================
   OBJETO PRINCIPAL
========================================================== */

const Banco = {

    dados: {

        atendimentos: [],

        criancas: [],

        responsaveis: [],

        processos: [],

        agenda: [],

        relatorios: [],

        veiculos: [],

        patrimonio: [],

        usuarios: [],

        configuracoes: {

            nomeSistema: "SIGACTPAR",

            orgao: "Conselho Tutelar do Paranoá"

        }

    }

};

/* ==========================================================
   CARREGAR BANCO
========================================================== */

function carregarBanco(){

    const dados = localStorage.getItem("SIGACTPAR");

    if(dados){

        Banco.dados = JSON.parse(dados);

    }

}

/* ==========================================================
   SALVAR BANCO
========================================================== */

function salvarBanco(){

    localStorage.setItem(

        "SIGACTPAR",

        JSON.stringify(Banco.dados)

    );

}

/* ==========================================================
   LIMPAR BANCO
========================================================== */

function limparBanco(){

    if(confirm("Deseja apagar todos os dados do sistema?")){

        localStorage.removeItem("SIGACTPAR");

        location.reload();

    }

}

/* ==========================================================
   GERAR ID
========================================================== */

function gerarId(lista){

    if(lista.length===0){

        return 1;

    }

    return Math.max(

        ...lista.map(item=>item.id)

    )+1;

}

/* ==========================================================
   BUSCAR POR ID
========================================================== */

function buscarPorId(lista,id){

    return lista.find(item=>item.id==id);

}

/* ==========================================================
   REMOVER REGISTRO
========================================================== */

function removerRegistro(lista,id){

    return lista.filter(item=>item.id!=id);

}

/* ==========================================================
   QUANTIDADE
========================================================== */

function totalAtendimentos(){

    return Banco.dados.atendimentos.length;

}

function totalCriancas(){

    return Banco.dados.criancas.length;

}

function totalResponsaveis(){

    return Banco.dados.responsaveis.length;

}

function totalProcessos(){

    return Banco.dados.processos.length;

}

/* ==========================================================
   ATENDIMENTOS DO DIA
========================================================== */

function atendimentosHoje(){

    const hoje = new Date().toISOString().slice(0,10);

    return Banco.dados.atendimentos.filter(

        item=>item.data===hoje

    ).length;

}

/* ==========================================================
   ATENDIMENTOS DO MÊS
========================================================== */

function atendimentosMes(){

    const hoje = new Date();

    const ano = hoje.getFullYear();

    const mes = String(

        hoje.getMonth()+1

    ).padStart(2,"0");

    return Banco.dados.atendimentos.filter(item=>{

        return item.data.startsWith(

            ano+"-"+mes

        );

    }).length;

}

/* ==========================================================
   PENDÊNCIAS
========================================================== */

function totalPendencias(){

    return Banco.dados.atendimentos.filter(item=>

        item.status==="Pendente"

    ).length;

}

/* ==========================================================
   DASHBOARD
========================================================== */

function atualizarIndicadores(){

    const total = document.getElementById("totalAtendimentos");

    if(total){

        total.textContent = totalAtendimentos();

    }

    const hoje = document.getElementById("atendimentosHoje");

    if(hoje){

        hoje.textContent = atendimentosHoje();

    }

    const mes = document.getElementById("atendimentosMes");

    if(mes){

        mes.textContent = atendimentosMes();

    }

    const criancas = document.getElementById("totalCriancas");

    if(criancas){

        criancas.textContent = totalCriancas();

    }

    const responsaveis = document.getElementById("totalResponsaveis");

    if(responsaveis){

        responsaveis.textContent = totalResponsaveis();

    }

    const processos = document.getElementById("totalProcessos");

    if(processos){

        processos.textContent = totalProcessos();

    }

    const pendencias = document.getElementById("totalPendencias");

    if(pendencias){

        pendencias.textContent = totalPendencias();

    }

}

/* ==========================================================
   EXPORTAR BANCO
========================================================== */

function exportarBanco(){

    const dados = JSON.stringify(

        Banco.dados,

        null,

        4

    );

    const blob = new Blob(

        [dados],

        {

            type:"application/json"

        }

    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "SIGACTPAR_Backup.json";

    link.click();

}

/* ==========================================================
   IMPORTAR BANCO
========================================================== */

function importarBanco(arquivo){

    const leitor = new FileReader();

    leitor.onload=function(e){

        Banco.dados = JSON.parse(

            e.target.result

        );

        salvarBanco();

        location.reload();

    };

    leitor.readAsText(arquivo);

}

/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

carregarBanco();

atualizarIndicadores();
