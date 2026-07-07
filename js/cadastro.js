// ==========================================
// SIGA - Cadastro de Atendimento
// ==========================================



function salvarAtendimento(){



// Capturar informações


let atendimento = {


data:
document.getElementById("data").value,


nome:
document.getElementById("nome").value,


nascimento:
document.getElementById("nascimento").value,


responsavel:
document.getElementById("responsavel").value,


endereco:
document.getElementById("endereco").value,


localidade:
document.getElementById("localidade").value,


contato:
document.getElementById("contato").value,


contato2:
document.getElementById("contato2").value,


tipo:
document.getElementById("tipo").value,


assunto:
document.getElementById("assunto").value,


plantonista:
document.getElementById("plantonista").value,


observacoes:
document.getElementById("observacoes").value,


usuario:
document.getElementById("usuario").value,



dataHoraCadastro:
new Date().toLocaleString()



};







// Validação básica


if(!atendimento.nome){


alert("Informe o nome da criança/adolescente");


return;


}



if(!atendimento.tipo){


alert("Informe o tipo de atendimento");


return;


}






// Recupera banco existente


let atendimentos = JSON.parse(

localStorage.getItem("siga_atendimentos")

) || [];






// adiciona novo registro


atendimentos.push(atendimento);






// salva


localStorage.setItem(

"siga_atendimentos",

JSON.stringify(atendimentos)

);







alert("Atendimento cadastrado com sucesso!");







limparFormulario();



}









// ==========================================
// LIMPAR FORMULÁRIO
// ==========================================


function limparFormulario(){



document.querySelectorAll("input, textarea, select")

.forEach(campo=>{


if(campo.id !== "usuario"){


campo.value="";


}


});



}
