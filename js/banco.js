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
