/* ==========================================================
   SIGACTPAR
   APP.JS
========================================================== */

document.addEventListener("DOMContentLoaded", iniciarSistema);

/* ==========================================================
   INICIAR
========================================================== */

function iniciarSistema(){

    atualizarData();

    carregarPagina("dashboard");

    configurarMenu();

}

/* ==========================================================
   MENU
========================================================== */

function configurarMenu(){

    const links = document.querySelectorAll(".menu a");

    links.forEach(link=>{

        link.addEventListener("click",function(e){

            e.preventDefault();

            links.forEach(item=>{

                item.parentElement.classList.remove("ativo");

            });

            this.parentElement.classList.add("ativo");

            carregarPagina(

                this.dataset.page

            );

        });

    });

}

/* ==========================================================
   CARREGAR PÁGINAS
========================================================== */

async function carregarPagina(nome){

    const conteudo=document.getElementById("conteudo");

    const titulo=document.getElementById("tituloPagina");

    try{

        const resposta=await fetch(

            "pages/"+nome+".html"

        );

        const html=await resposta.text();

        conteudo.innerHTML=html;

        titulo.textContent=

            primeiraMaiuscula(nome);

        iniciarModulo(nome);

    }

    catch{

        conteudo.innerHTML=`

            <div class="erro">

                <h2>Página não encontrada.</h2>

            </div>

        `;

    }

}

/* ==========================================================
   CHAMA O MÓDULO
========================================================== */

function iniciarModulo(nome){

    switch(nome){

        case "dashboard":

            if(typeof iniciarDashboard==="function"){

                iniciarDashboard();

            }

        break;

        case "atendimentos":

            if(typeof iniciarAtendimentos==="function"){

                iniciarAtendimentos();

            }

        break;

    }

}

/* ==========================================================
   DATA
========================================================== */

function atualizarData(){

    const data=document.getElementById("dataAtual");

    if(!data) return;

    const hoje=new Date();

    data.textContent=

    hoje.toLocaleDateString(

        "pt-BR",

        {

            weekday:"long",

            day:"2-digit",

            month:"long",

            year:"numeric"

        }

    );

}

/* ==========================================================
   PRIMEIRA MAIÚSCULA
========================================================== */

function primeiraMaiuscula(texto){

    return texto.charAt(0).toUpperCase()

    +texto.slice(1);

}
