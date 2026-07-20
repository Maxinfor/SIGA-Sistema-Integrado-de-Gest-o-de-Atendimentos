/* ==========================================================
   SIGACTPAR - MÓDULO DE IMPORTAÇÃO DE PDFS
========================================================== */

function iniciarImportar() {
    configurarEventosImportacao();
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

    for (let arquivo of arquivos) {
        try {
            const textoPdf = await extrairTextoDoPdf(arquivo);
            const dadosExtraidos = interpretarTextoDocumento(textoPdf);

            // Inserir automaticamente nos registros de Atendimentos / Crianças / Responsáveis
            salvarDadosImportadosNoSistema(dadosExtraidos);

            resultadosHtml += `
                <tr>
                    <td><strong>${arquivo.name}</strong></td>
                    <td>${dadosExtraidos.crianca || 'Não identificado'}</td>
                    <td><span class="badge azul">${dadosExtraidos.tipoAtendimento || 'Geral'}</span> / ${dadosExtraidos.assunto || 'Não esp.'}</td>
                    <td>${dadosExtraidos.dataAtendimento || '-'}</td>
                    <td><span class="badge verde"><i class="fa-solid fa-check"></i> Importado com Sucesso</span></td>
                </tr>
            `;
        } catch (erro) {
            console.error("Erro ao ler PDF:", erro);
            resultadosHtml += `
                <tr>
                    <td><strong>${arquivo.name}</strong></td>
                    <td colspan="3" style="color: var(--vermelho);">Erro ao processar documento.</td>
                    <td><span class="badge vermelho">Falha</span></td>
                </tr>
            `;
        }
    }

    tbody.innerHTML = resultadosHtml;
}

async function extrairTextoDoPdf(arquivo) {
    const arrayBuffer = await arquivo.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let textoCompleto = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const pagina = await pdf.getPage(i);
        const conteudo = await pagina.getTextContent();
        const textoPagina = conteudo.items.map(item => item.str).join(" ");
        textoCompleto += textoPagina + "\n";
    }

    return textoCompleto;
}

function interpretarTextoDocumento(texto) {
    // Função auxiliar para procurar padrões próximos a rótulos
    const limpar = (str) => str ? str.trim() : "";

    // Regex aproximadas para buscar os campos solicitados
    // Exemplo: busca campos como "Criança:", "Nome:", "D.N:", etc.
    const extrairCampo = (regex) => {
        const match = texto.match(regex);
        return match ? limpar(match[1]) : "";
    };

    // Buscas flexíveis no texto extraído do PDF
    let crianca = extrairCampo(/(?:Criança|Criança\/Adolescente|Nome)\s*[:=]\s*([^,\n]+)/i);
    let nascimento = extrairCampo(/(?:D\.?N\.?|Nascimento|Data de Nasc\.?)\s*[:=]\s*(\d{2}\/\d{2}\/\d{4})/i);
    let responsavel = extrairCampo(/(?:Responsável|Responsável Legal|Pai\/Mãe)\s*[:=]\s*([^,\n]+)/i);
    let telefone = extrairCampo(/(?:Telefone|Tel|Contato|WhatsApp)\s*[:=]\s*([\(\)\d\s\-\.]+)/i);
    let endereco = extrairCampo(/(?:Endereço|End\.|Residência)\s*[:=]\s*([^,\n]+)/i);
    let dataAtendimento = extrairCampo(/(?:Data|Data do Atendimento)\s*[:=]\s*(\d{2}\/\d{2}\/\d{4})/i);

    // Tratamento para Tipo de Atendimento e Assunto (marcado com X ou digitado em Outro)
    let tipoAtendimento = "Demanda Espontânea";
    if (/\[\s*x\s*\]\s*Denúncia/i.test(texto) || /Denúncia/i.test(texto)) tipoAtendimento = "Denúncia";
    if (/\[\s*x\s*\]\s*Plantão/i.test(texto) || /Plantão/i.test(texto)) tipoAtendimento = "Plantão";

    let assunto = "Acompanhamento Geral";
    if (/\[\s*x\s*\]\s*Escolar/i.test(texto) || /Frequência Escolar/i.test(texto)) assunto = "Frequência Escolar";
    if (/\[\s*x\s*\]\s*Saúde/i.test(texto) || /Saúde/i.test(texto)) assunto = "Saúde / Atendimento Médico";
    if (/\[\s*x\s*\]\s*Abrigo/i.test(texto) || /Medida protetiva/i.test(texto)) assunto = "Medida Protetiva / Abrigo";

    return {
        crianca: crianca || "Não informado",
        nascimento: nascimento || "01/01/2015",
        responsavel: responsavel || "Não informado",
        telefone: telefone || "(61) 90000-0000",
        endereco: endereco || "Paranoá - DF",
        tipoAtendimento: tipoAtendimento,
        assunto: assunto,
        dataAtendimento: dataAtendimento || new Date().toLocaleDateString("pt-BR")
    };
}

function salvarDadosImportadosNoSistema(dados) {
    if (!Banco || !Banco.dados) return;

    // 1. Salvar Responsável caso não exista
    let respId = gerarId("responsavel");
    inserirRegistro("responsaveis", {
        id: respId,
        nome: dados.responsavel,
        cpf: "000.000.000-00",
        telefone: dados.telefone,
        endereco: dados.endereco,
        observacoes: "Importado via PDF"
    });

    // 2. Salvar Criança/Adolescente
    let criancaId = gerarId("crianca");
    let partesData = dados.nascimento.split("/");
    let nascIso = partesData.length === 3 ? `${partesData[2]}-${partesData[1]}-${partesData[0]}` : "2015-01-01";
    
    inserirRegistro("criancas", {
        id: criancaId,
        nome: dados.crianca,
        nascimento: nascIso,
        cpf: "",
        escola: "Escola Pública do Paranoá",
        responsavel: dados.responsavel,
        observacoes: "Cadastrado via importação de PDF"
    });

    // 3. Salvar Atendimento
    let atendimentoId = gerarId("atendimentos");
    inserirRegistro("atendimentos", {
        id: atendimentoId,
        tipo: dados.tipoAtendimento,
        crianca: dados.crianca,
        responsavel: dados.responsavel,
        assunto: dados.assunto,
        data: dados.dataAtendimento,
        status: "Em Andamento"
    });
}
