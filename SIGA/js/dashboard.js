/* =====================================================
   SIGA - Dashboard
   ===================================================== */


// Banco temporário (será substituído pelo MySQL depois)

let atendimentos = JSON.parse(
    localStorage.getItem("siga_atendimentos")
) || [];




// =====================================================
// INICIALIZAÇÃO
// =====================================================


document.addEventListener("DOMContentLoaded",()=>{


    atualizarCards();

    carregarTabela();

    criarGraficos();


});






// =====================================================
// CARDS DO DASHBOARD
// =====================================================


function atualizarCards(){


    let total = atendimentos.length;



    document.getElementById("totalAtendimentos")
    .innerText = total;



    let hoje = new Date()
    .toISOString()
    .split("T")[0];



    let atendHoje =
    atendimentos.filter(a=>a.data === hoje);



    document.getElementById("atendimentosHoje")
    .innerText = atendHoje.length;





    let dataAtual = new Date();



    let atendMes =
    atendimentos.filter(a=>{


        if(!a.data)
            return false;


        let data = new Date(a.data);



        return (

            data.getMonth()
            === dataAtual.getMonth()

            &&

            data.getFullYear()
            === dataAtual.getFullYear()

        );


    });



    document.getElementById("atendimentosMes")
    .innerText = atendMes.length;







    let criancas = [

        ...new Set(
            atendimentos.map(
                a=>a.nome
            )
        )

    ];



    document.getElementById("totalCriancas")
    .innerText =
    criancas.length;





    let responsaveis = [

        ...new Set(
            atendimentos.map(
                a=>a.responsavel
            )
        )

    ];



    document.getElementById("totalResponsaveis")
    .innerText =
    responsaveis.length;






    let localidades = [

        ...new Set(
            atendimentos.map(
                a=>a.localidade
            )
        )

    ];



    document.getElementById("totalLocalidades")
    .innerText =
    localidades.length;






    document.getElementById("tipoMaisUsado")
    .innerText =
    calcularTipo();



}








// =====================================================
// TIPO MAIS UTILIZADO
// =====================================================


function calcularTipo(){



let tipos={};



atendimentos.forEach(a=>{


    let tipo=a.tipo || "Não informado";


    tipos[tipo]=
    (tipos[tipo]||0)+1;


});



let maior="-";

let quantidade=0;



for(let t in tipos){


    if(tipos[t]>quantidade){


        quantidade=tipos[t];

        maior=t;


    }


}



return maior;


}








// =====================================================
// TABELA
// =====================================================


function carregarTabela(){



let tabela =
document.getElementById(
"tabelaAtendimentos"
);



if(!tabela)
return;




if(atendimentos.length===0)
return;




tabela.innerHTML="";



let lista =
atendimentos
.slice(-10)
.reverse();




lista.forEach((a,index)=>{



tabela.innerHTML += `

<tr>


<td>${formatarData(a.data)}</td>


<td>${a.nome || ""}</td>


<td>${a.responsavel || ""}</td>


<td>${a.assunto || ""}</td>


<td>${a.tipo || ""}</td>


<td>${a.plantonista || ""}</td>


<td>

<button class="btn btn-azul">

<i class="fa-solid fa-eye"></i>

</button>


</td>


</tr>


`;



});



}








// =====================================================
// GRÁFICOS
// =====================================================


function criarGraficos(){



graficoMensal();

graficoTipo();

graficoLocalidade();

graficoAssunto();



}








function graficoMensal(){


let ctx =
document.getElementById(
"graficoMensal"
);



if(!ctx)return;



new Chart(ctx,{

type:"line",


data:{


labels:[

"Jan",
"Fev",
"Mar",
"Abr",
"Mai",
"Jun"

],


datasets:[{


label:"Atendimentos",


data:[0,0,0,0,0,0],


borderColor:"#2563EB",


backgroundColor:
"rgba(37,99,235,.2)",


fill:true


}]


},



options:{


responsive:true,


maintainAspectRatio:false


}


});



}









function graficoTipo(){



let ctx =
document.getElementById(
"graficoTipo"
);



if(!ctx)return;



new Chart(ctx,{

type:"doughnut",


data:{


labels:[

"Presencial",

"Telefone",

"Online",

"Outro"

],


datasets:[{

data:[0,0,0,0],


backgroundColor:[

"#2563EB",

"#16A34A",

"#F59E0B",

"#DC2626"

]


}]


}



});



}









function graficoLocalidade(){



let ctx =
document.getElementById(
"graficoLocalidade"
);



if(!ctx)return;



new Chart(ctx,{

type:"bar",


data:{


labels:[],


datasets:[{

label:
"Localidades",

data:[],


backgroundColor:"#3B82F6"


}]


},



options:{


responsive:true,


maintainAspectRatio:false


}


});



}









function graficoAssunto(){



let ctx =
document.getElementById(
"graficoAssunto"
);



if(!ctx)return;



new Chart(ctx,{

type:"pie",


data:{


labels:[],


datasets:[{


data:[],


backgroundColor:[

"#2563EB",
"#16A34A",
"#F59E0B",
"#DC2626"

]


}]


}



});


}









// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================


function formatarData(data){


if(!data)
return "";


let d =
new Date(data);



return d.toLocaleDateString(
"pt-BR"
);


}
