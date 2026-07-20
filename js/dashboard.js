/* ==========================================================
   SIGACTPAR - MÓDULO DE DASHBOARD
========================================================== */

function iniciarDashboard() {
    atualizarDashboard();
    
    const btnAtualizar = document.getElementById("btnAtualizarDashboard");
    if (btnAtualizar) {
        btnAtualizar.onclick = atualizarDashboard;
    }
}

function calcularIdade(dataNascimentoStr) {
    if (!dataNascimentoStr) return 0;
    const hoje = new Date();
    const nascimento = new Date(dataNascimentoStr);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return isNaN(idade) ? 0 : idade;
}

function atualizarDashboard() {
    if (!Banco || !Banco.dados) return;

    const atendimentos = Banco.dados.atendimentos || [];
    const criancas = Banco.dados.criancas || [];
    const responsaveis = Banco.dados.responsaveis || [];
    const agenda = Banco.dados.agenda || [];

    // Atualizar Indicadores Principais (Cards)
    const cardAtend = document.getElementById("dashTotalAtendimentos");
    const cardCriancas = document.getElementById("dashTotalCriancas");
    const cardResp = document.getElementById("dashTotalResponsaveis");
    const cardAgenda = document.getElementById("dashTotalAgenda");

    if (cardAtend) cardAtend.textContent = atendimentos.length;
    if (cardCriancas) cardCriancas.textContent = criancas.length;
    if (cardResp) cardResp.textContent = responsaveis.length;
    if (cardAgenda) cardAgenda.textContent = agenda.length;

    // 1. Agrupar por Assunto
    let assuntosCount = {};
    atendimentos.forEach(a => {
        let ass = a.assunto || "Outros";
        assuntosCount[ass] = (assuntosCount[ass] || 0) + 1;
    });
    preencherTabelaDashboard("dashTabelaAssuntos", assuntosCount);

    // 2. Agrupar por Forma de Atendimento (Presencial, Telefônico, Online)
    let formasCount = {};
    atendimentos.forEach(a => {
        let forma = a.tipo || "Presencial";
        formasCount[forma] = (formasCount[forma] || 0) + 1;
    });
    preencherTabelaDashboard("dashTabelaFormas", formasCount);

    // 3. Agrupar por Região (Extraído do endereço dos responsáveis)
    let regioesCount = {};
    responsaveis.forEach(r => {
        let end = r.endereco ? r.endereco.trim() : "Paranoá - DF";
        regioesCount[end] = (regioesCount[end] || 0) + 1;
    });
    preencherTabelaDashboard("dashTabelaRegioes", regioesCount);

    // 4. Agrupar por Faixa Etária (Idade)
    let idadesCount = { 
        "0 a 3 anos (Primeira Infância)": 0, 
        "4 a 6 anos": 0, 
        "7 a 11 anos (Criança)": 0, 
        "12 a 18 anos (Adolescente)": 0 
    };
    criancas.forEach(c => {
        let idade = calcularIdade(c.nascimento);
        if (idade <= 3) idadesCount["0 a 3 anos (Primeira Infância)"]++;
        else if (idade <= 6) idadesCount["4 a 6 anos"]++;
        else if (idade <= 11) idadesCount["7 a 11 anos (Criança)"]++;
        else idadesCount["12 a 18 anos (Adolescente)"]++;
    });
    preencherTabelaDashboard("dashTabelaIdades", idadesCount);
}

function preencherTabelaDashboard(elementId, dadosObj) {
    const tbody = document.getElementById(elementId);
    if (!tbody) return;

    tbody.innerHTML = "";
    const chaves = Object.keys(dadosObj);

    if (chaves.length === 0 || chaves.every(k => dadosObj[k] === 0)) {
        tbody.innerHTML = `<tr><td colspan="2" style="text-align: center; color: var(--texto-secundario);">Nenhum dado registrado.</td></tr>`;
        return;
    }

    tbody.innerHTML = chaves.map(chave => `
        <tr>
            <td>${chave}</td>
            <td style="text-align: right;"><strong>${dadosObj[chave]}</strong></td>
        </tr>
    `).join("");
}
