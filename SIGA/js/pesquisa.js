/* =====================================================
   SIGA - Pesquisa de Atendimentos
   ===================================================== */


let listaAtendimentos = JSON.parse(
    localStorage.getItem("siga_atendimentos")
) || [];




// Carregar ao abrir página

document.addEventListener(
"DOMContentLoaded",

()=>{

    carregarPesquisa();

});





// =====================================================
// PESQUISA
// =====================================================


function pesquisarAtendimentos(){



let nome =
document.getElementById("filtroNome")
.value
.toLowerCase();



let responsavel =
document.getElementById("filtroResponsavel")
.value
.toLowerCase();




let localidade =
document.getElementById("filtroLocalidade")
.value
.toLowerCase();




let assunto =
document.getElementById("filtroAssunto")
.value;




let tipo =
document.getElementById("filtroTipo")
.value;







let resultado =
listaAtendimentos.filter(a=>{



return (


(a.nome || "")
.toLowerCase()
.includes(nome)



&&



(a.responsavel || "")
.toLowerCase()
.includes(responsavel)



&&



(a.localidade || "")
.toLowerCase()
.includes(localidade)



&&



(
assunto === ""
||
a.assunto === assunto
)



&&



(
tipo === ""
||
a.tipo === tipo
)



);



});





mostrarResultados(resultado);



}







// =====================================================
// MOSTRAR RESULTADOS
// =====================================================


function mostrarResultados(lista){



let tabela =
document.getElementById(
"resultadoPesquisa"
);



tabela.innerHTML="";




if(lista.length===0){



tabela.innerHTML=`

<tr>

<td colspan="7" style="text-align:center">

Nenhum atendimento encontrado

</td>

</tr>


`;

return;


}







lista.forEach((a)=>{



tabela.innerHTML += `


<tr>


<td>
${formatarData(a.data)}
</td>



<td>
${a.nome || ""}
</td>



<td>
${a.responsavel || ""}
</td>



<td>
${a.assunto || ""}
</td>



<td>
${a.tipo || ""}
</td>



<td>
${a.plantonista || ""}
</td>




<td>


<button 
class="btn btn-azul"
onclick="visualizarAtendimento(${a.id})">

<i class="fa-solid fa-eye"></i>

</button>





<button 
class="btn btn-vermelho"
onclick="excluirAtendimento(${a.id})">

<i class="fa-solid fa-trash"></i>

</button>



</td>



</tr>



`;



});



}








// =====================================================
// CARREGAMENTO INICIAL
// =====================================================


function carregarPesquisa(){


mostrarResultados(
listaAtendimentos
);



}








// =====================================================
// VISUALIZAR
// =====================================================


function visualizarAtendimento(id){



let atendimento =

listaAtendimentos.find(

a=>a.id === id

);




if(!atendimento)
return;





alert(`

Nome:
${atendimento.nome}


Nascimento:
${atendimento.dataNascimento}


Responsável:
${atendimento.responsavel}


Telefone:
${atendimento.telefone}


Endereço:
${atendimento.endereco}


Localidade:
${atendimento.localidade}


Tipo:
${atendimento.tipo}


Assunto:
${atendimento.assunto}


Observações:

${atendimento.observacoes}

`);




}








// =====================================================
// EXCLUIR
// =====================================================


function excluirAtendimento(id){



let confirmar =
confirm(
"Deseja excluir este atendimento?"
);




if(!confirmar)
return;





listaAtendimentos =

listaAtendimentos.filter(

a=>a.id !== id

);





localStorage.setItem(

"siga_atendimentos",

JSON.stringify(listaAtendimentos)

);





carregarPesquisa();



alert(
"Atendimento excluído."
);



}








// =====================================================
// DATA
// =====================================================


function formatarData(data){


if(!data)
return "";



return new Date(data)

.toLocaleDateString(
"pt-BR"
);


}
