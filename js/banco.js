/* ==========================================================
   SIGACTPAR
   BANCO DE DADOS LOCAL
========================================================== */

const Banco = {

    dados: {

        atendimentos: [],

        criancas: [],

        responsaveis: [],

        processos: [],

        agenda: [],

        veiculos: [],

        patrimonio: [],

        usuarios: []

    }

};

/* ==========================================================
   CARREGAR DADOS
========================================================== */

function carregarBanco(){

    const dados = localStorage.getItem("SIGACTPAR");

    if(dados){

        Banco.dados = JSON.parse(dados);

    }

}

/* ==========================================================
   SALVAR DADOS
========================================================== */

function salvarBanco(){

    localStorage.setItem(

        "SIGACTPAR",

        JSON.stringify(Banco.dados)

    );

}

/* ==========================================================
   INICIAR
========================================================== */

carregarBanco();
