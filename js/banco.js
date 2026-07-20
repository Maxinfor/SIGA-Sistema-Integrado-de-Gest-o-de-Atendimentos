/* ==========================================================
   SIGACTPAR
   BANCO DE DADOS
========================================================== */

const Banco = {

    versao: "1.0.0",

    nomeSistema: "SIGACTPAR",

    dados: {

        usuarios: [],

        atendimentos: [],

        criancas: [],

        responsaveis: [],

        processos: [],

        agenda: [],

        veiculos: [],

        patrimonio: [],

        notificacoes: [],

        configuracoes: {

            tema: "claro",

            registrosPagina: 10,

            idioma: "pt-BR"

        }

    },

    contadores: {

        usuario: 1,

        atendimento: 1,

        crianca: 1,

        responsavel: 1,

        processo: 1,

        agenda: 1,

        veiculo: 1,

        patrimonio: 1,

        notificacao: 1

    }

};
/* ==========================================================
   CARREGAR BANCO
========================================================== */

function carregarBanco(){

    const dados = localStorage.getItem("SIGACTPAR");

    if(!dados){

        salvarBanco();

        return;

    }

    try{

        const banco = JSON.parse(dados);

        Banco.dados = banco.dados || Banco.dados;

        Banco.contadores = banco.contadores || Banco.contadores;

    }catch(e){

        console.error("Erro ao carregar banco.", e);

    }

}
/* ==========================================================
   SALVAR BANCO
========================================================== */

function salvarBanco(){

    localStorage.setItem(

        "SIGACTPAR",

        JSON.stringify({

            dados: Banco.dados,

            contadores: Banco.contadores

        })

    );

}
/* ==========================================================
   GERAR ID
========================================================== */

function gerarId(tipo){

    if(!Banco.contadores[tipo]){

        return Date.now();

    }

    const id = Banco.contadores[tipo];

    Banco.contadores[tipo]++;

    salvarBanco();

    return id;
id: gerarId("atendimento")
}
/* ==========================================================
   LIMPAR BANCO
========================================================== */

function limparBanco(){

    if(!confirm("Deseja apagar todos os dados?")){

        return;

    }

    localStorage.removeItem("SIGACTPAR");

    location.reload();

}
/* ==========================================================
   EXPORTAR BACKUP
========================================================== */

function exportarBanco(){

    const dados = JSON.stringify(Banco,null,4);

    const blob = new Blob(

        [dados],

        {

            type:"application/json"

        }

    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "backup_SIGACTPAR.json";

    link.click();

}
/* ==========================================================
   IMPORTAR BACKUP
========================================================== */

function importarBanco(arquivo){

    const leitor = new FileReader();

    leitor.onload = function(e){

        const banco = JSON.parse(e.target.result);

        Banco.dados = banco.dados;

        Banco.contadores = banco.contadores;

        salvarBanco();

        location.reload();

    };

    leitor.readAsText(arquivo);

}
/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

carregarBanco();
