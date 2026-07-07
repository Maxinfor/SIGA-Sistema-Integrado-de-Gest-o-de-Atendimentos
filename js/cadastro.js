// ==========================================
// SIGA - Cadastro de Atendimento
// ==========================================


// Recupera os dados já existentes

let atendimentos = JSON.parse(
    localStorage.getItem("siga_atendimentos")
) || [];




// ==========================================
// SALVAR ATENDIMENTO
// ==========================================

function salvarAtendimento(){


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


        assunto:
        document.getElementById("assunto").value,


        plantonista:
        document.getElementById("plantonista").value,


        tipo:
        document.getElementById("tipo").value,


        observacoes:
        document.getElementById("observacoes").value,


        datahora:
        document.getElementById("datahora").value,


        usuario:
        "Administrador",


        criadoEm:
        new Date().toISOString()


    };





    // Validação básica

    if(!atendimento.nome){

        alert("Informe o nome do atendido.");

        return;

    }



    if(!atendimento.data){

        alert("Informe a data do atendimento.");

        return;

    }





    // Adiciona no banco

    atendimentos.push(atendimento);





    // Salva no navegador

    localStorage.setItem(

        "siga_atendimentos",

        JSON.stringify(atendimentos)

    );





    alert("Atendimento cadastrado com sucesso!");





    limpar();

}







// ==========================================
// LIMPAR FORMULÁRIO
// ==========================================

function limpar(){


    document.querySelectorAll(
        "input, textarea, select"
    )
    .forEach(campo=>{


        campo.value="";


    });


}
