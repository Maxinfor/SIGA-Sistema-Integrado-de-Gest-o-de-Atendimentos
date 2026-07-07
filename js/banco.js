// =====================================
// BANCO DE DADOS
// =====================================

const DB_NAME = "SistemaAtendimentoDB";
const DB_VERSION = 1;

let db;

// Abre ou cria o banco
function abrirBanco() {

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
        console.error("Erro ao abrir banco:", event.target.error);
    };

    request.onsuccess = (event) => {

        db = event.target.result;

        console.log("Banco conectado com sucesso!");

    };

    request.onupgradeneeded = (event) => {

        db = event.target.result;

        // Atendimento
        if (!db.objectStoreNames.contains("atendimentos")) {

            const store = db.createObjectStore("atendimentos", {
                keyPath: "id",
                autoIncrement: true
            });

            store.createIndex("nome", "nome");
            store.createIndex("assunto", "assunto");
            store.createIndex("data", "data");
            store.createIndex("status", "status");

        }

        // Usuários
        if (!db.objectStoreNames.contains("usuarios")) {

            db.createObjectStore("usuarios", {
                keyPath: "id",
                autoIncrement: true
            });

        }

        // Configurações
        if (!db.objectStoreNames.contains("configuracoes")) {

            db.createObjectStore("configuracoes", {
                keyPath: "id",
                autoIncrement: true
            });

        }

        console.log("Banco criado.");

    };

}
