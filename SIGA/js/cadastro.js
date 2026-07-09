/* =====================================================
   SIGA - Cadastro de Atendimento
   ===================================================== */


// =====================================================
// SALVAR ATENDIMENTO
// =====================================================


function salvarAtendimento(){



let atendimento = {


    id: Date.now(),


    data:
    document.getElementById("data").value
    ||
    new Date().toISOString().split("T")[0],



    hora:
    document.getElementById("hora").value,



    nome:
    document.getElementById("nome").value,



    dataNascimento:
    document.getElementById("dataNascimento").value,



    sexo:
    document.getElementById("sexo").value,



    cpf:
    document.getElementById("cpf").value,



    rg:
    document.getElementById("rg").value,



    responsavel:
    document.getElementById("responsavel").value,



    parentesco:
    document.getElementById("parentesco").value,



    telefone:
    document.getElementById("telefone").value,



    telefone2:
    document.getElementById("telefone2").value,



    endereco:
    document.getElementById("endereco").value,



    numero:
    document.getElementById("numero").value,



    bairro:
    document.getElementById("bairro").value,



    localidade:
    document.getElementById("localidade").value,



    tipo:
    document.getElementById("tipo").value,



    assunto:
    document.getElementById("assunto").value,



    plantonista:
    document.getElementById("plantonista").value,



    observacoes:
    document.getElementById("observacoes").value,



    criadoEm:
    new Date().toISOString()


};





// validação simples


if(!atendimento.nome){


alert(
"Informe o nome da criança/adolescente."
);


return;


}



if(!atendimento.responsavel){


alert(
"Informe o responsável."
);


return;


}






// buscar registros existentes


let atendimentos = JSON.parse(

localStorage.getItem(
"siga_atendimentos"
)

) || [];






// adicionar novo registro


atendimentos.push(atendimento);






// salvar


localStorage.setItem(

"siga_atendimentos",

JSON.stringify(atendimentos)

);







alert(
"Atendimento cadastrado com sucesso!"
);







limparFormulario();



}









// =====================================================
// LIMPAR FORMULÁRIO
// =====================================================


function limparFormulario(){



document
.getElementById("formAtendimento")
.reset();



}




// =====================================================
// DATA AUTOMÁTICA
// =====================================================


window.addEventListener(
"DOMContentLoaded",

()=>{


let campoData =
document.getElementById("data");



if(campoData){


campoData.value =
new Date()
.toISOString()
.split("T")[0];


}



let campoHora =
document.getElementById("hora");



if(campoHora){


let agora =
new Date();



campoHora.value =
agora
.toTimeString()
.substring(0,5);



}



});
