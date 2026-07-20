/* ==========================================================
   SIGACTPAR - MÓDULO DE RELATÓRIOS E EXTRAÇÃO DE PDFS
========================================================== */

let totalImportadosSessao = 0;

function iniciarRelatorios() {
    configurarEventosImportacao();
    atualizarIndicadoresRelatorios();
}

function configurarEventosImportacao() {
    const inputFiles = document.getElementById("inputPdfFiles");
    if (inputFiles) {
        inputFiles.onchange = async (e) => {
            const arquivos = e.target.files;
            if (arquivos.length > 0) {
                await processarArquivosPdf(arquivos);
            }
        };
    }
}

async function processarArquivosPdf(arquivos) {
    const tbody = document.getElementById("listaImportacaoPdf");
    if (!tbody) return;

    if (totalImportadosSessao === 0) {
        tbody.innerHTML = "";
    }

    let resultadosHtml = "";

    for (let arquivo of arquivos) {
        try {
            const textoPdf = await extrairTextoInteligenteDoPdf(arquivo);
            const dadosExtraidos = interpretarTextoDocumento(textoPdf);

            salvarDadosImportadosNoSistema(dadosExtraidos);
            totalImportadosSessao++;

            resultadosHtml += `
                <tr>
                    <td><strong>${arquivo.name}</strong></td>
                    <td>${dadosExtraidos.crianca}</td>
                    <td><span class="badge azul">${dadosExtraidos.assunto}</span> (${dadosExtraidos.formaAtendimento})</td>
                    <td>${dadosExtraidos.dataAtendimento}</td>
                    <td><span class="badge verde"><i class="fa-solid fa-check"></i> Importado</span></td>
                </tr>
            `;
        } catch (erro) {
            console.error("Erro ao processar PDF:", erro);
            resultadosHtml += `
                <tr>
                    <td><strong>${arquivo.name}</strong></td>
                    <td colspan="3" style="color: var(--vermelho);">Erro ao extrair dados do documento.</td>
                    <td><span class="badge vermelho">Falha</span></td>
                </tr>
            `;
        }
    }

    tbody.innerHTML += resultadosHtml;

    const cardImportados = document.getElementById("cardTotalImportados");
    if (cardImportados) cardImportados.textContent = totalImportadosSessao;
    
    atualizarIndicadoresRelatorios();
}

async function extrairTextoInteligenteDoPdf(arquivo) {
    const arrayBuffer = await arquivo.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let textoCompleto = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const pagina = await pdf.getPage(i);
        const conteudo = await pagina.getTextContent();
        let textoPagina = conteudo.items.map(item => item.str).join(" ");

        if (!textoPagina || textoPagina.trim().length < 15) {
            const viewport = pagina.getViewport({ scale: 2.0 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await pagina.render({ canvasContext: context, viewport: viewport }).promise;
            const imagemDataUrl = canvas.toDataURL("image/png");

            const worker = await Tesseract.createWorker("por");
            const resultadoOcr = await worker.recognize(imagemDataUrl);
            await worker.terminate();

            textoPagina = resultadoOcr.data.text;
        }

        textoCompleto += textoPagina + "\n";
    }

    return textoCompleto;
}

function interpretarTextoDocumento(texto) {
    const textoLimpo = texto.replace(/\r?\n|\r/g, " ").replace(/\s+/g, " ");

    const extrairCampo = (regex) => {
        const match = textoLimpo.match(regex);
        return match && match[1] ? match[1].trim() : "";
    };

    let crianca = extrairCampo(/(?:Criança\s*\/?\s*Adolescente|Nome\s*da\s*Criança|Criança|Nome)\s*[:=]\s*([^,\n]+?)(?=\s+(?:D\.?N\.?|Nasc|Responsável|Endereço|Telefone|Assunto)|$)/i);
    let nascimento = extrairCampo(/(?:D\.?N\.?|Nascimento|Data\s*de\s*Nasc\.?)\s*[:=]\s*(\d{2}\/\d{2}\/\d{4})/i);
    let responsavel = extrairCampo(/(?:Responsável\s*Legal|Responsável|Pai\s*\/?\s*Mãe)\s*[:=]\s*([^,\n]+?)(?=\s+(?:Telefone|Endereço|CPF|Assunto)|$)/i);
    let telefone = extrairCampo(/(?:Telefone\s*\/?\s*WhatsApp|Telefone|Tel|Contato)\s*[:=]\s*([\(\)\d\s\-\.]+)/i);
    let endereco = extrairCampo(/(?:Endereço\s*Residencial|Endereço|End\.?|Residência)\s*[:=]\s*([^,\n]+?)(?=\s+(?:Telefone|Responsável|Bairro|CEP)|$)/i);
    let dataAtendimento = extrairCampo(/(?:Data\s*do\s*Atendimento|Data)\s*[:=]\s*(\d{2}\/\d{2}\/\d{4})/i);

    // Tipo de Atendimento / Forma (Presencial, Telefônico, Online)
    let formaAtendimento = "Presencial";
    if (/\[\s*x\s*\]\s*Telefônico|Telefônico|Ligação/i.test(textoLimpo)) formaAtendimento = "Telefônico";
    if (/\[\s*x\s*\]\s*On-line|Online|WhatsApp/i.test(textoLimpo)) formaAtendimento = "On-line";

    // Assunto
    let assunto = "Acompanhamento Geral";
    if (/\[\s*x\s*\]\s*Escolar|Frequência\s*Escolar/i.test(textoLimpo)) assunto = "Frequência Escolar";
    if (/\[\s*x\s*\]\s*Saúde|Saúde/i.test(textoLimpo)) assunto = "Saúde";
    if (/\[\s*x\s*\]\s*Abrigo|Medida\s*Protetiva/i.test(textoLimpo)) assunto = "Medida Protetiva";
    let outroAssunto = extrairCampo(/[Aa]ssunto.*?[Oo]utro\s*[:=]\s*([^,\n]+)/i);
    if (outroAssunto) assunto = outroAssunto;

    return {
        crianca: crianca || "Não informado no PDF",
        nascimento: nascimento || "01/01/2015",
        responsavel: responsavel || "Não informado no PDF",
        telefone: telefone || "(61) 90000-0000",
        endereco: endereco || "Paranoá - DF",
        formaAtendimento: formaAtendimento,
        assunto: assunto,
        dataAtendimento: dataAtendimento || new Date().toLocaleDateString("pt-BR")
    };
}

function salvarDadosImportadosNoSistema(dados) {
    if (!Banco || !Banco.dados) return;

    inserirRegistro("responsaveis", {
        id: gerarId("responsavel"),
        nome: dados.responsavel,
        cpf: "000.000.000-00",
        telefone: dados.telefone,
        endereco: dados.endereco,
        observacoes: "Importado via PDF"
    });

    let partesData = dados.nascimento.split("/");
    let nascIso = partesData.length === 3 ? `${partesData[2]}-${partesData[1]}-${partesData[0]}` : "2015-01-01";

    inserirRegistro("criancas", {
        id: gerarId("crianca"),
        nome: dados.crianca,
        nascimento: nascIso,
        cpf: "",
        escola: "Escola do Paranoá",
        responsavel: dados.responsavel,
        observacoes: "Importado via PDF"
    });

    inserirRegistro("atendimentos", {
        id: gerarId("atendimentos"),
        tipo: dados.formaAtendimento, // Presencial, Telefônico, Online
        crianca: dados.crianca,
        responsavel: dados.responsavel,
        assunto: dados.assunto,
        data: dados.dataAtendimento,
        status: "Em Andamento"
    });
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

function atualizarIndicadoresRelatorios() {
    if (!Banco || !Banco.dados) return;

    const atendimentos = Banco.dados.atendimentos || [];
    const criancas = Banco.dados.criancas || [];
    const responsaveis = Banco.dados.responsaveis || [];

    // Total de Atendimentos
    const cardTotal = document.getElementById("cardTotalAtendimentosRel");
    if (cardTotal) cardTotal.textContent = atendimentos.length;

    // 1. Agrupar por Assunto
    let assuntosCount = {};
    atendimentos.forEach(a => {
        let ass = a.assunto || "Outros";
        assuntosCount[ass] = (assuntosCount[ass] || 0) + 1;
    });
    preencherTabelaAgrupada("tabelaAssuntos", assuntosCount);

    // 2. Agrupar por Forma de Atendimento (Presencial, Telefônico, Online)
    let formasCount = {};
    atendimentos.forEach(a => {
        let forma = a.tipo || "Presencial";
        formasCount[forma] = (formasCount[forma] || 0) + 1;
    });
    preencherTabelaAgrupada("tabelaFormas", formasCount);

    // 3. Agrupar por Região (Extraído do endereço dos responsáveis)
    let regioesCount = {};
    responsaveis.forEach(r => {
        let end = r.endereco ? r.endereco.trim() : "Paranoá - DF";
        regioesCount[end] = (regioesCount[end] || 0) + 1;
    });
    preencherTabelaAgrupada("tabelaRegioes", regioesCount);

    // 4. Agrupar por Faixa Etária (Idade)
    let idadesCount = { "0 a 3 anos (Primeira Infância)": 0, "4 a 6 anos": 0, "7 a 11 anos (Criança)": 0, "12 a 18 anos (Adolescente)": 0 };
    criancas.forEach(c => {
        let idade = calcularIdade(c.nascimento);
        if (idade <= 3) idadesCount["0 a 3 anos (Primeira Infância)"]++;
        else if (idade <= 6) idadesCount["4 a 6 anos"]++;
        else if (idade <= 11) idadesCount["7 a 11 anos (Criança)"]++;
        else idadesCount["12 a 18 anos (Adolescente)"]++;
    });
    preencherTabelaAgrupada("tabelaIdades", idadesCount);
}

function preencherTabelaAgrupada(elementId, dadosObj) {
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
