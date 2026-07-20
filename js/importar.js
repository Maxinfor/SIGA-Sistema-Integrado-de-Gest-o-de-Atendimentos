/* ==========================================================
   SIGACTPAR - MÓDULO DE IMPORTAÇÃO E EXTRAÇÃO INTELIGENTE DE PDFS
========================================================== */

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

    tbody.innerHTML = "";
    let resultadosHtml = "";
    let totalImportados = 0;

    for (let arquivo of arquivos) {
        try {
            // Tenta extrair o texto por texto ou via OCR se for digitalizado
            const textoPdf = await extrairTextoInteligenteDoPdf(arquivo);
            const dadosExtraidos = interpretarTextoDocumento(textoPdf);

            // Salva de forma automática nas tabelas do sistema
            salvarDadosImportadosNoSistema(dadosExtraidos);
            totalImportados++;

            resultadosHtml += `
                <tr>
                    <td><strong>${arquivo.name}</strong></td>
                    <td>${dadosExtraidos.crianca}</td>
                    <td><span class="badge azul">${dadosExtraidos.tipoAtendimento}</span> / ${dadosExtraidos.assunto}</td>
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

    tbody.innerHTML = resultadosHtml;

    const cardImportados = document.getElementById("cardTotalImportados");
    if (cardImportados) cardImportados.textContent = totalImportados;
    
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

        // Se o PDF não tiver texto selecionável (for escaneado/imagem), usa OCR (Tesseract)
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
    // Normaliza quebras de linha e múltiplos espaços para facilitar a leitura por regex
    const textoLimpo = texto.replace(/\r?\n|\r/g, " ").replace(/\s+/g, " ");

    const extrairCampo = (regex) => {
        const match = textoLimpo.match(regex);
        return match && match[1] ? match[1].trim() : "";
    };

    // Buscas flexíveis cobrindo variações comuns em formulários do Conselho Tutelar
    let crianca = extrairCampo(/(?:Criança\s*\/?\s*Adolescente|Nome\s*da\s*Criança|Criança|Nome)\s*[:=]\s*([^,\n]+?)(?=\s+(?:D\.?N\.?|Nasc|Responsável|Endereço|Telefone|Assunto)|$)/i);
    let nascimento = extrairCampo(/(?:D\.?N\.?|Nascimento|Data\s*de\s*Nasc\.?)\s*[:=]\s*(\d{2}\/\d{2}\/\d{4})/i);
    let responsavel = extrairCampo(/(?:Responsável\s*Legal|Responsável|Pai\s*\/?\s*Mãe)\s*[:=]\s*([^,\n]+?)(?=\s+(?:Telefone|Endereço|CPF|Assunto)|$)/i);
    let telefone = extrairCampo(/(?:Telefone\s*\/?\s*WhatsApp|Telefone|Tel|Contato)\s*[:=]\s*([\(\)\d\s\-\.]+)/i);
    let endereco = extrairCampo(/(?:Endereço\s*Residencial|Endereço|End\.?|Residência)\s*[:=]\s*([^,\n]+?)(?=\s+(?:Telefone|Responsável|Bairro|CEP)|$)/i);
    let dataAtendimento = extrairCampo(/(?:Data\s*do\s*Atendimento|Data)\s*[:=]\s*(\d{2}\/\d{2}\/\d{4})/i);

    // Tipo de Atendimento (Procura marcação [x] ou campo Outro)
    let tipoAtendimento = "Demanda Espontânea";
    if (/\[\s*x\s*\]\s*Denúncia/i.test(textoLimpo) || /Denúncia/i.test(textoLimpo)) tipoAtendimento = "Denúncia";
    if (/\[\s*x\s*\]\s*Plantão/i.test(textoLimpo) || /Plantão/i.test(textoLimpo)) tipoAtendimento = "Plantão";
    let outroTipo = extrairCampo(/Tipo\s*de\s*Atendimento.*?[Oo]utro\s*[:=]\s*([^,\n]+)/i);
    if (outroTipo) tipoAtendimento = outroTipo;

    // Assunto (Procura marcação [x] ou campo Outro)
    let assunto = "Acompanhamento Geral";
    if (/\[\s*x\s*\]\s*Escolar/i.test(textoLimpo) || /Frequência\s*Escolar/i.test(textoLimpo)) assunto = "Frequência Escolar";
    if (/\[\s*x\s*\]\s*Saúde/i.test(textoLimpo) || /Saúde/i.test(textoLimpo)) assunto = "Saúde";
    if (/\[\s*x\s*\]\s*Abrigo/i.test(textoLimpo) || /Medida\s*Protetiva/i.test(textoLimpo)) assunto = "Medida Protetiva";
    let outroAssunto = extrairCampo(/[Aa]ssunto.*?[Oo]utro\s*[:=]\s*([^,\n]+)/i);
    if (outroAssunto) assunto = outroAssunto;

    return {
        crianca: crianca || "Não informado no PDF",
        nascimento: nascimento || "01/01/2015",
        responsavel: responsavel || "Não informado no PDF",
        telefone: telefone || "(61) 90000-0000",
        endereco: endereco || "Paranoá - DF",
        tipoAtendimento: tipoAtendimento,
        assunto: assunto,
        dataAtendimento: dataAtendimento || new Date().toLocaleDateString("pt-BR")
    };
}

function salvarDadosImportadosNoSistema(dados) {
    if (!Banco || !Banco.dados) return;

    // Salva o Responsável
    inserirRegistro("responsaveis", {
        id: gerarId("responsavel"),
        nome: dados.responsavel,
        cpf: "000.000.000-00",
        telefone: dados.telefone,
        endereco: dados.endereco,
        observacoes: "Importado via PDF"
    });

    // Converte a data de nascimento de DD/MM/AAAA para o formato de input (AAAA-MM-DD)
    let partesData = dados.nascimento.split("/");
    let nascIso = partesData.length === 3 ? `${partesData[2]}-${partesData[1]}-${partesData[0]}` : "2015-01-01";

    // Salva a Criança/Adolescente
    inserirRegistro("criancas", {
        id: gerarId("crianca"),
        nome: dados.crianca,
        nascimento: nascIso,
        cpf: "",
        escola: "Escola do Paranoá",
        responsavel: dados.responsavel,
        observacoes: "Importado via PDF"
    });

    // Salva o Atendimento
    inserirRegistro("atendimentos", {
        id: gerarId("atendimentos"),
        tipo: dados.tipoAtendimento,
        crianca: dados.crianca,
        responsavel: dados.responsavel,
        assunto: dados.assunto,
        data: dados.dataAtendimento,
        status: "Em Andamento"
    });
}

function atualizarIndicadoresRelatorios() {
    if (!Banco || !Banco.dados) return;
    const totalGeral = (Banco.dados.atendimentos?.length || 0) + 
                       (Banco.dados.criancas?.length || 0) + 
                       (Banco.dados.responsaveis?.length || 0);

    const cardTotal = document.getElementById("cardTotalRelatorio");
    if (cardTotal) cardTotal.textContent = totalGeral;
}
