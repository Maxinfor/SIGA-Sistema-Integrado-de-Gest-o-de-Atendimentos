// =======================================
// SIGA - Dashboard Inteligente
// =======================================


let atendimentos = JSON.parse(

localStorage.getItem("siga_atendimentos")

) || [];




// =======================================
// GRÁFICO POR TIPO DE ATENDIMENTO
// =======================================


function graficoTipo(){


let tipos={};



atendimentos.forEach(item=>{


let tipo=item.tipo || "Não informado";


tipos[tipo]=(tipos[tipo]||0)+1;


});



new Chart(

document.getElementById("graficoTipo"),

{

type:"bar",


data:{


labels:Object.keys(tipos),


datasets:[{

label:"Atendimentos",

data:Object.values(tipos),

backgroundColor:"#2563EB"


}]


}


}

);



}






// =======================================
// GRÁFICO POR LOCALIDADE
// =======================================


function graficoLocalidade(){


let locais={};



atendimentos.forEach(item=>{


let local=item.localidade || "Não informado";


locais[local]=(locais[local]||0)+1;


});




new Chart(

document.getElementById("graficoLocalidade"),

{

type:"pie",

data:{


labels:Object.keys(locais),


datasets:[{

data:Object.values(locais),


backgroundColor:[

"#2563EB",

"#22C55E",

"#F59E0B",

"#EF4444",

"#8B5CF6"

]


}]


}


}

);


}






graficoTipo();

graficoLocalidade();
