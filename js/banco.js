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
