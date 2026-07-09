/* =====================================================
   SIGA - Leitor Inteligente de PDF
   ===================================================== */



// Configuração PDF.JS

pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";





// =====================================================
// LER PDF
// =====================================================


async function lerPDF(){



let arquivo = 
document.getElementById("arquivoPDF").files[0];



if(!arquivo){


alert(
"Selecione um arquivo PDF."
);


return;


}





let leitor = new FileReader();




leitor.onload = async function(){



let pdf = await pdfjsLib.getDocument(

new Uint8Array(this.result)

).promise;




let textoCompleto = "";





for(let i=1; i<=pdf.numPages; i++){



let pagina = await pdf.getPage(i);



let conteudo =
await pagina.getTextContent();




let textoPagina =
conteudo.items

.map(item=>item.str)

.join(" ");




textoCompleto += textoPagina + "\n";



}






// Mostrar texto bruto


document.getElementById(
"textoPDF"
).value = textoCompleto;





// Processar informações


interpretarDocumento(
textoCompleto
);



};




leitor.readAsArrayBuffer(arquivo);



}









// =====================================================
// INTERPRETAR DOCUMENTO
// =====================================================


function interpretarDocumento(texto){



let conteudo =
texto.toLowerCase();






// Nome


let nome =
buscarCampo(
texto,
[
"nome:",
"nome da criança:",
"criança:"
]
);




document.getElementById(
"pdfNome"
).value =
nome;






// Data nascimento


let nascimento =
buscarCampo(
texto,
[
"dn:",
"data de nascimento:",
"nascimento:"
]
);




document.getElementById(
"pdfNascimento"
).value =
nascimento;






// Responsável


let responsavel =
buscarCampo(
texto,
[
"responsável:",
"genitor:",
"mãe:",
"pai:"
]
);



document.getElementById(
"pdfResponsavel"
).value =
responsavel;






// Telefone


let telefone =
buscarCampo(
texto,
[
"telefone:",
"contato:",
"celular:"
]
);



document.getElementById(
"pdfTelefone"
).value =
telefone;







// Endereço


let endereco =
buscarCampo(
texto,
[
"endereço:",
"rua:",
"logradouro:"
]
);



document.getElementById(
"pdfEndereco"
).value =
endereco;







// Localidade


let localidade =
buscarCampo(
texto,
[
"localidade:",
"bairro:",
"região:"
]
);



document.getElementById(
"pdfLocalidade"
).value =
localidade;








// Tipo atendimento


let tipo = "";



if(conteudo.includes(
"atendimento presencial"
)){

tipo =
"Atendimento Presencial";


}

else if(conteudo.includes(
"atendimento telefonico"
)
||
conteudo.includes(
"atendimento telefônico"
)){


tipo =
"Atendimento Telefônico";


}

else if(conteudo.includes(
"atendimento on-line"
)
||
conteudo.includes(
"online"
)){


tipo =
"Atendimento On-line";


}

else{


tipo =
"Outro";


}



document.getElementById(
"pdfTipo"
).value =
tipo;








// Assunto


let assunto="";



if(conteudo.includes(
"vaga escolar"
)){

assunto =
"Vaga Escolar";

}


else if(conteudo.includes(
"abandono de incapaz"
)){

assunto =
"Abandono de Incapaz";


}


else if(conteudo.includes(
"conflito familiar"
)){


assunto =
"Conflito Familiar";


}


else{


assunto =
"Outro";


}




document.getElementById(
"pdfAssunto"
).value =
assunto;






}









// =====================================================
// BUSCA DE CAMPOS
// =====================================================


function buscarCampo(texto,palavras){



for(let palavra of palavras){



let posicao =
texto.toLowerCase()
.indexOf(
palavra
.toLowerCase()
);




if(posicao !== -1){



let inicio =
posicao + palavra.length;





let trecho =

texto.substring(
inicio,
inicio + 80
);





return trecho
.replace(
/[:\n]/g,
""
)
.trim();



}



}




return "";



}









// =====================================================
// ENVIAR PARA CADASTRO
// =====================================================


function enviarCadastro(){



localStorage.setItem(

"pdf_dados",

JSON.stringify({

nome:
document.getElementById("pdfNome").value,


dataNascimento:
document.getElementById("pdfNascimento").value,


responsavel:
document.getElementById("pdfResponsavel").value,


telefone:
document.getElementById("pdfTelefone").value,


endereco:
document.getElementById("pdfEndereco").value,


localidade:
document.getElementById("pdfLocalidade").value,


tipo:
document.getElementById("pdfTipo").value,


assunto:
document.getElementById("pdfAssunto").value



})

);




window.location.href =
"cadastro.html";



}
