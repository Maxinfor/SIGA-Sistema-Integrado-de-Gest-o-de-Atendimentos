// ==========================================
// SIGA - Sistema Integrado de Gestão
// APP PRINCIPAL
// ==========================================


// Recupera os dados salvos

let atendimentos = JSON.parse(

    localStorage.getItem("siga_atendimentos")

) || [];





// ==========================================
// SALVAR DADOS
// ==========================================

function salvarDados(){

    localStorage.setItem(

        "siga_atendimentos",

        JSON.stringify(atendimentos)

    );

}







// ==========================================
// ATUALIZAR DASHBOARD
// ==========================================

function atualizarDashboard(){



    // TOTAL DE ATENDIMENTOS

    let total = atendimentos.length;


    let campoTotal =
    document.getElementById("total");


    if(campoTotal){

        campoTotal.innerHTML = total;

    }





    // DATA ATUAL

    let hoje = new Date();


    let dataHoje =
    hoje.toISOString().split("T")[0];






    // ATENDIMENTOS DE HOJE


    let hojeTotal =
    atendimentos.filter(item => {


        return item.data === dataHoje;


    }).length;



    let campoHoje =
    document.getElementById("hoje");



    if(campoHoje){

        campoHoje.innerHTML = hojeTotal;

    }







    // ATENDIMENTOS DO MÊS


    let mesAtual =
    hoje.getMonth();


    let anoAtual =
    hoje.getFullYear();




    let totalMes =
    atendimentos.filter(item=>{


        let data =
        new Date(item.data);



        return (

            data.getMonth() === mesAtual

            &&

            data.getFullYear() === anoAtual

        );


    }).length;




    let campoMes =
    document.getElementById("mes");



    if(campoMes){

        campoMes.innerHTML = totalMes;

    }







    // =================================
    // CRIANÇAS E ADOLESCENTES
    // =================================


    let criancas =
    atendimentos.length;



    let campoCriancas =
    document.getElementById("criancas");



    if(campoCriancas){

        campoCriancas.innerHTML = criancas;

    }








    // =================================
    // RESPONSÁVEIS ÚNICOS
    // =================================


    let listaResponsaveis =
    atendimentos.map(item=>item.responsavel)
    .filter(Boolean);



    let responsaveis =
    new Set(listaResponsaveis).size;



    let campoResponsaveis =
    document.getElementById("responsaveis");



    if(campoResponsaveis){

        campoResponsaveis.innerHTML =
        responsaveis;

    }







    // =================================
    // LOCALIDADES
    // =================================


    let listaLocalidades =
    atendimentos.map(item=>item.localidade)
    .filter(Boolean);



    let localidades =
    new Set(listaLocalidades).size;



    let campoLocalidades =
    document.getElementById("localidades");



    if(campoLocalidades){

        campoLocalidades.innerHTML =
        localidades;

    }








    // =================================
    // TIPO DE ATENDIMENTO MAIS USADO
    // =================================


    let tipos = {};



    atendimentos.forEach(item=>{


        let tipo =
        item.tipo || "Não informado";


        tipos[tipo] =
        (tipos[tipo] || 0) + 1;


    });




    let tipoMaisUsado = "-";


    let maior = 0;



    for(let tipo in tipos){


        if(tipos[tipo] > maior){


            maior = tipos[tipo];


            tipoMaisUsado = tipo;


        }


    }






    let campoTipo =
    document.getElementById("tipoMaisUsado");



    if(campoTipo){

        campoTipo.innerHTML =
        tipoMaisUsado;

    }





}









// ==========================================
// ÚLTIMOS ATENDIMENTOS
// ==========================================

function carregarTabela(){



    let tabela =
    document.getElementById("tabela");



    if(!tabela){

        return;

    }



    tabela.innerHTML="";




    atendimentos

    .slice(-5)

    .reverse()

    .forEach(item=>{



        tabela.innerHTML += `


        <tr>


            <td>
            ${item.data || ""}
            </td>


            <td>
            ${item.nome || ""}
            </td>


            <td>
            ${item.responsavel || ""}
            </td>


            <td>
            ${item.assunto || ""}
            </td>


            <td>
            ${item.plantonista || ""}
            </td>



        </tr>


        `;



    });



}








// ==========================================
// INICIALIZAÇÃO DO SISTEMA
// ==========================================


function iniciarSIGA(){


    atualizarDashboard();


    carregarTabela();


}





iniciarSIGA();
