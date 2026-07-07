// ==========================================
// SIGA - Pesquisa de Atendimentos
// ==========================================



let atendimentos = JSON.parse(

localStorage.getItem("siga_atendimentos")

) || [];







// ==========================================
// CARREGAR TABELA
// ==========================================


function carregarResultados(lista = atendimentos){



let tabela =

document.getElementById("resultado");



if(!tabela){

    return;

}



tabela.innerHTML="";






lista.forEach((item,index)=>{



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

${item.tipo || ""}

</td>





<td>


<button onclick="visualizar(${index})">

<i class="fa-solid fa-eye"></i>

</button>





<button onclick="excluir(${index})">

<i class="fa-solid fa-trash"></i>

</button>



</td>



</tr>


`;



});



}









// ==========================================
// PESQUISA E FILTROS
// ==========================================


function pesquisar(){



let nome =

document.getElementById("fNome")
.value
.toLowerCase();




let responsavel =

document.getElementById("fResponsavel")
.value
.toLowerCase();




let localidade =

document.getElementById("fLocalidade")
.value
.toLowerCase();




let tipo =

document.getElementById("fTipo")
.value;





let assunto =

document.getElementById("fAssunto")
.value;








let resultado = atendimentos.filter(item=>{



return (



(item.nome || "")
.toLowerCase()
.includes(nome)



&&



(item.responsavel || "")
.toLowerCase()
.includes(responsavel)



&&



(item.localidade || "")
.toLowerCase()
.includes(localidade)



&&



(tipo === "" || item.tipo === tipo)



&&



(assunto === "" || item.assunto === assunto)



);



});






carregarResultados(resultado);



}









// ==========================================
// VISUALIZAR
// ==========================================


function visualizar(index){



let item = atendimentos[index];



alert(`

DATA:
${item.data}


NOME:
${item.nome}


DATA NASCIMENTO:
${item.nascimento}


RESPONSÁVEL:
${item.responsavel}


ENDEREÇO:
${item.endereco}


LOCALIDADE:
${item.localidade}


CONTATO:
${item.contato}


CONTATO 2:
${item.contato2}


TIPO:
${item.tipo}


ASSUNTO:
${item.assunto}


PLANTONISTA:
${item.plantonista}


OBSERVAÇÕES:

${item.observacoes}


USUÁRIO:

${item.usuario}

`);



}









// ==========================================
// EXCLUIR
// ==========================================


function excluir(index){



let confirmar = confirm(

"Deseja excluir este atendimento?"

);



if(confirmar){



atendimentos.splice(index,1);



localStorage.setItem(

"siga_atendimentos",

JSON.stringify(atendimentos)

);



carregarResultados();



}



}







// ==========================================
// INICIAR
// ==========================================


carregarResultados();
