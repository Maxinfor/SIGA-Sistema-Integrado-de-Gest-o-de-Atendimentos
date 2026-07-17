// js/dashboard.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Atualiza os cards com os valores do banco.js
    const cards = document.querySelectorAll('.card .numero');
    if (cards.length >= 4) {
        cards[0].innerText = dadosDashboard.atendimentosHoje;
        cards[1].innerText = dadosDashboard.casosAbertos;
        cards[2].innerText = dadosDashboard.processos;
        cards[3].innerText = dadosDashboard.urgencias;
    }

    // 2. Preenche a tabela
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = atendimentosRecentes.map(atendimento => `
        <tr>
            <td>${atendimento.id}</td>
            <td>${atendimento.data}</td>
            <td>${atendimento.responsavel}</td>
            <td>${atendimento.status}</td>
        </tr>
    `).join('');
});
