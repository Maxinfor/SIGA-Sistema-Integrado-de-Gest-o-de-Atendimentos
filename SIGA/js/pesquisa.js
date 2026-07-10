/* =====================================================
   SIGA - Módulo Pesquisa
===================================================== */


let listaAtendimentos = [];


document.addEventListener("DOMContentLoaded",()=>{

    carregarDados();

    mostrarResultados(listaAtendimentos);

});



/* ==========================================
   Carregar dados
========================================== */

function carregarDados(){

    listaAtendimentos = 
    JSON.parse(localStorage.getItem("siga_atendimentos")) || [];

}



/* ==========================================
   Pesquisa
========================================== */

function pesquisar(){


    const nome =
    document.getElementById("buscaNome").value
    .toLowerCase();


    const responsavel =
    document.getElementById("buscaResponsavel").value
    .toLowerCase();



    const localidade =
    document.getElementById("buscaLocalidade").value
    .toLowerCase();



    const tipo =
    document.getElementById("buscaTipo").value;



    const assunto =
    document.getElementById("buscaAssunto").value;



    const resultado =
    listaAtendimentos.filter(a=>{


        return (

            (!nome ||
            a.nome.toLowerCase()
            .includes(nome))


            &&


            (!responsavel ||
            a.responsavel.toLowerCase()
            .includes(responsavel))


            &&


            (!localidade ||
            a.localidade.toLowerCase()
            .includes(localidade))


            &&


            (!tipo ||
            a.tipo === tipo)


            &&


            (!assunto ||
            a.assunto === assunto)


        );


    });



    mostrarResultados(resultado);


}



/* ==========================================
   Mostrar tabela
========================================== */


function mostrarResultados(lista){


    const tabela =
    document.getElementById("resultadoPesquisa");


    tabela.innerHTML="";



    if(lista.length===0){


        tabela.innerHTML=`

        <tr>

        <td colspan="6">

        Nenhum atendimento encontrado.

        </td>

        </tr>

        `;


        return;

    }



    lista.forEach(a=>{


        tabela.innerHTML +=`

        <tr>


        <td>
        ${a.data || ""}
        </td>


        <td>
        ${a.nome || ""}
        </td>


        <td>
        ${a.responsavel || ""}
        </td>


        <td>
        ${a.localidade || ""}
        </td>


        <td>
        ${a.assunto || ""}
        </td>


        <td>


        <button 
        class="btn"
        onclick="visualizar(${a.id})">

        Ver

        </button>



        <button
        class="btn"
        onclick="excluirAtendimento(${a.id})">

        Excluir

        </button>



        </td>


        </tr>

        `;


    });


}



/* ==========================================
   Visualizar ficha
========================================== */


function visualizar(id){


    const atendimento =
    listaAtendimentos.find(
        a=>a.id==id
    );


    if(!atendimento)
        return;



    localStorage.setItem(
        "atendimento_visualizar",
        JSON.stringify(atendimento)
    );


    alert(
    "Ficha selecionada: "
    + atendimento.nome
    );


}



/* ==========================================
   Excluir
========================================== */


function excluirAtendimento(id){


    if(!confirm(
    "Deseja excluir este atendimento?"
    ))
    return;



    listaAtendimentos =
    listaAtendimentos.filter(
        a=>a.id != id
    );



    localStorage.setItem(
        "siga_atendimentos",
        JSON.stringify(listaAtendimentos)
    );



    mostrarResultados(listaAtendimentos);


}



/* ==========================================
   Limpar pesquisa
========================================== */


function limparPesquisa(){


    document
    .querySelectorAll("input,select")
    .forEach(campo=>{

        campo.value="";

    });



    mostrarResultados(listaAtendimentos);


}
