document.addEventListener('DOMContentLoaded', () => {
    const dataAtual = document.getElementById('dataAtual');
    const data = new Date().toLocaleDateString('pt-BR');
    if(dataAtual) dataAtual.innerText = data;
});
const btnMenu = document.getElementById('btnMenuMobile');
const sidebar = document.getElementById('sidebar');

// Alterna a classe 'ativo' para abrir/fechar a sidebar
btnMenu.addEventListener('click', () => {
    sidebar.classList.toggle('ativo');
});

// Fecha a sidebar se clicar fora dela (opcional)
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !btnMenu.contains(e.target)) {
        sidebar.classList.remove('ativo');
    }
});
