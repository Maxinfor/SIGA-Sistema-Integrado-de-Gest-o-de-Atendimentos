/* ==========================================================
   SIGACTPAR
   BANCO DE DADOS LOCAL (LOCALSTORAGE)
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
   INICIALIZAÇÃO DO BANCO
========================================================== */

function iniciarBanco() {
    carregarBanco();
}

/* ==========================================================
   CARREGAR BANCO DO LOCALSTORAGE
========================================================== */

function carregarBanco() {
    try {
        const dadosArmazenados = localStorage.getItem("SIGACTPAR");

        if (!dadosArmazenados) {
            salvarBanco();
            return;
        }

        const bancoParsed = JSON.parse(dadosArmazenados);
        
        // Garante mesclagem segura caso novas tabelas/contadores sejam adicionados futuramente
        Banco.dados = { ...Banco.dados, ...(bancoParsed.dados || {}) };
        Banco.contadores = { ...Banco.contadores, ...(bancoParsed.contadores || {}) };

    } catch (e) {
        console.error("Erro ao carregar banco de dados do LocalStorage.", e);
    }
}

/* ==========================================================
   SALVAR BANCO NO LOCALSTORAGE
========================================================== */

function salvarBanco() {
    try {
        localStorage.setItem(
            "SIGACTPAR",
            JSON.stringify({
                dados: Banco.dados,
                contadores: Banco.contadores
            })
        );
    } catch (e) {
        console.error("Erro ao salvar dados no LocalStorage.", e);
    }
}

/* ==========================================================
   GERAR ID ÚNICO SEQUENCIAL
========================================================== */

function gerarId(tipo) {
    if (Banco.contadores[tipo] === undefined) {
        return Date.now(); // Fallback caso o tipo não exista no contador
    }

    const id = Banco.contadores[tipo];
    Banco.contadores[tipo]++;
    salvarBanco();
    
    return id;
}

/* ==========================================================
   INSERIR REGISTRO
========================================================== */

function inserirRegistro(lista, objeto) {
    if (!Banco.dados[lista]) {
        console.error(`A tabela "${lista}" não existe no banco de dados.`);
        return false;
    }

    // Se o objeto não possuir ID, gera automaticamente com base no tipo correspondente
    if (!objeto.id) {
        // Converte o nome da lista no plural para singular (ex: "criancas" vira "crianca")
        const chaveContador = lista.endsWith("s") ? lista.slice(0, -1) : lista;
        objeto.id = gerarId(chaveContador);
    }

    Banco.dados[lista].push(objeto);
    salvarBanco();
    return objeto.id;
}

/* ==========================================================
   ATUALIZAR REGISTRO
========================================================== */

function atualizarRegistro(lista, objeto) {
    if (!Banco.dados[lista]) return false;

    const indice = Banco.dados[lista].findIndex(
        item => item.id == objeto.id
    );

    if (indice < 0) return false;

    Banco.dados[lista][indice] = { ...Banco.dados[lista][indice], ...objeto };
    salvarBanco();
    return true;
}

/* ==========================================================
   REMOVER REGISTRO
========================================================== */

function removerRegistro(lista, id) {
    if (!Banco.dados[lista]) return false;

    const tamanhoInicial = Banco.dados[lista].length;
    
    Banco.dados[lista] = Banco.dados[lista].filter(
        item => item.id != id
    );

    if (Banco.dados[lista].length < tamanhoInicial) {
        salvarBanco();
        return true;
    }

    return false;
}

/* ==========================================================
   BUSCAR REGISTRO ÚNICO POR ID
========================================================== */

function buscarRegistroPorId(lista, id) {
    if (!Banco.dados[lista]) return null;
    return Banco.dados[lista].find(item => item.id == id) || null;
}

// Funções de atalho mantidas para compatibilidade
function buscarCrianca(id) { return buscarRegistroPorId("criancas", id); }
function buscarResponsavel(id) { return buscarRegistroPorId("responsaveis", id); }
function buscarAtendimento(id) { return buscarRegistroPorId("atendimentos", id); }
function buscarProcesso(id) { return buscarRegistroPorId("processos", id); }
function buscarAgenda(id) { return buscarRegistroPorId("agenda", id); }

/* ==========================================================
   ESTATÍSTICAS / TOTAIS
========================================================== */

function totalRegistros(lista) {
    return Banco.dados[lista] ? Banco.dados[lista].length : 0;
}

function totalAtendimentos() { return totalRegistros("atendimentos"); }
function totalCriancas() { return totalRegistros("criancas"); }
function totalResponsaveis() { return totalRegistros("responsaveis"); }
function totalProcessos() { return totalRegistros("processos"); }

/* ==========================================================
   LIMPAR BANCO DE DADOS
========================================================== */

function limparBanco() {
    if (!confirm("Atenção: Deseja realmente apagar permanentemente todos os dados do sistema?")) {
        return;
    }

    localStorage.removeItem("SIGACTPAR");
    location.reload();
}

/* ==========================================================
   EXPORTAR BACKUP (JSON)
========================================================== */

function exportarBanco() {
    const dadosString = JSON.stringify(Banco, null, 4);
    const blob = new Blob([dadosString], { type: "application/json" });
    
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `backup_SIGACTPAR_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    
    URL.revokeObjectURL(link.href);
}

/* ==========================================================
   IMPORTAR BACKUP (JSON)
========================================================== */

function importarBanco(arquivo) {
    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = function(e) {
        try {
            const bancoImportado = JSON.parse(e.target.result);

            if (!bancoImportado.dados || !bancoImportado.contadores) {
                alert("O arquivo de backup selecionado é inválido.");
                return;
            }

            Banco.dados = bancoImportado.dados;
            Banco.contadores = bancoImportado.contadores;
            
            salvarBanco();
            alert("Backup importado com sucesso!");
            location.reload();

        } catch (erro) {
            console.error("Erro ao processar o arquivo de importação.", erro);
            alert("Erro ao ler o arquivo JSON de backup.");
        }
    };

    leitor.readAsText(arquivo);
}

/* ==========================================================
   AUTO-INICIALIZAÇÃO AO CARREGAR O SCRIPT
========================================================== */

iniciarBanco();
