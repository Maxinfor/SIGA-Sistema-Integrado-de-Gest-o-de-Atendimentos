// =======================================
// SIGA - Dashboard Inteligente
// =======================================


let atendimentos = JSON.parse(
    localStorage.getItem("siga_atendimentos")
) || [];



// =======================================
// GRÁFICO POR TIPO DE ATENDIMENTO
// =======================================

function criarGraficoTipo(){


    let tipos = {};


    atendimentos.forEach(item => {

        let tipo = item.tipo || "Não informado";

        tipos[tipo] = (tipos[tipo] || 0) + 1;

    });



    const grafico = document.getElementById("graficoTipo");


    if(!grafico){
        return;
    }



    new Chart(grafico, {

        type:"bar",


        data:{


            labels:Object.keys(tipos),


            datasets:[{


                label:"Quantidade",


                data:Object.values(tipos),


                backgroundColor:"#2563EB",


                borderRadius:8


            }]

        },


        options:{


            responsive:true,


            plugins:{


                legend:{


                    display:false


                }

            }

        }


    });



}







// =======================================
// GRÁFICO POR LOCALIDADE
// =======================================

function criarGraficoLocalidade(){


    let localidades = {};



    atendimentos.forEach(item=>{


        let local =
        item.localidade || "Não informado";


        localidades[local] =
        (localidades[local] || 0) + 1;


    });




    const grafico =
    document.getElementById("graficoLocalidade");



    if(!grafico){
        return;
    }





    new Chart(grafico,{


        type:"doughnut",


        data:{


            labels:Object.keys(localidades),


            datasets:[{


                data:Object.values(localidades),


                backgroundColor:[

                    "#2563EB",
                    "#22C55E",
                    "#F59E0B",
                    "#EF4444",
                    "#8B5CF6"

                ]



            }]


        },


        options:{


            responsive:true,


            plugins:{


                legend:{


                    position:"bottom"


                }


            }


        }


    });



}







// =======================================
// EXECUTAR
// =======================================


criarGraficoTipo();

criarGraficoLocalidade();
