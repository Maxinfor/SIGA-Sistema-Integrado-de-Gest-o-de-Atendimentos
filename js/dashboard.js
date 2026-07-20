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

    // Referências de datas para o dia, mês e ano atuais (2026)
    const hojeObj = new Date();
    const diaAtualStr = hojeObj.toLocaleDateString("pt-BR");
    const mesAtual = hojeObj.getMonth() + 1;
    const anoAtual = hojeObj.getFullYear();

    let atdDia = 0;
    let atdMes = 0;
    let atdAno = 0;

    atendimentos.forEach(a => {
        let dataStr = a.data || "";
        if (!dataStr) return;

        if (dataStr.includes(String(anoAtual)) || dataStr.includes(`${anoAtual}`)) {
            atdAno++;
        }
        if (dataStr === diaAtualStr) {
            atdDia++;
        }
        if (dataStr.split('/')[1] == mesAtual || (dataStr.includes('-') && parseInt(dataStr.split('-')[1]) === mesAtual)) {
            atdMes++;
        }
    });

    // Atualizar Cards Principais (Por Assunto, Idade, Localidade, Dia, Mês, Ano)
    document.getElementById("dashCardAssuntoCount").textContent = atendimentos.length;
    document.getElementById("dashCardIdadeCount").textContent = criancas.length;
    document.getElementById("dashCardLocalidadeCount").textContent = responsaveis.length;
    document.getElementById("dashCardDia").textContent = atdDia;
    document.getElementById("dashCardMes").textContent = atdMes;
    document.getElementById("dashCardAno").textContent = atdAno;

    // 1. Tabela: Atendimentos por Assunto
    let assuntosCount = {};
    atendimentos.forEach(a => {
        let ass = a.assunto || "Acompanhamento Geral";
        assuntosCount[ass] = (assuntosCount[ass] || 0) + 1;
    });
    preencherTabelaDashboard("dashTabelaAssuntos", assuntosCount);

    // 2. Tabela: Forma de Atendimento
    let formasCount = {};
    atendimentos.forEach(a => {
        let forma = a.tipo || "Presencial";
        formasCount[forma] = (formasCount[forma] || 0) + 1;
    });
    preencherTabelaDashboard("dashTabelaFormas", formasCount);

    // 3. Tabela: Monitoramento por Região / Endereço
    let regioesCount = {};
    responsaveis.forEach(r => {
        let end = r.endereco ? r.endereco.trim() : "Paranoá - DF";
        regioesCount[end] = (regioesCount[end] || 0) + 1;
    });
    preencherTabelaDashboard("dashTabelaRegioes", regioesCount);

    // 4. Tabela: Monitoramento por Idade
    let idadesCount = { 
        "0 a 3 anos": 0, 
        "4 a 6 anos": 0, 
        "7 a 11 anos": 0, 
        "12 a 18 anos": 0 
    };
    criancas.forEach(c => {
        let idade = calcularIdade(c.nascimento);
        if (idade <= 3) idadesCount["0 a 3 anos"]++;
        else if (idade <= 6) idadesCount["4 a 6 anos"]++;
        else if (idade <= 7 && idade <= 11) idadesCount["7 a 11 anos"]++; // tratativa segura
        else if (idade <= 11) idadesCount["7 a 11 anos"]++;
        else idadesCount["12 a 18 anos"]++;
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
