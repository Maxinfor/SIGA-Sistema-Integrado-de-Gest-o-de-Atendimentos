// js/banco.js

// Verifica se já existem dados no navegador, caso contrário, usa os dados iniciais
const dadosIniciais = {
    atendimentosHoje: 12,
    casosAbertos: 45,
    processos: 108,
    urgencias: 3
};

// Dados de atendimentos (simulando uma base de dados)
let atendimentosRecentes = JSON.parse(localStorage.getItem('atendimentos')) || [
    { id: '#001', data: '17/07/2026', responsavel: 'João da Silva', status: 'Em análise' },
    { id: '#002', data: '17/07/2026', responsavel: 'Maria Oliveira', status: 'Concluído' }
];

// Função para salvar no LocalStorage (sempre que adicionarmos algo)
function salvarDados() {
    localStorage.setItem('atendimentos', JSON.stringify(atendimentosRecentes));
}

// Exporta as variáveis para serem usadas pelos outros arquivos JS
window.dadosDashboard = dadosIniciais;
window.atendimentosRecentes = atendimentosRecentes;
window.salvarDados = salvarDados;
