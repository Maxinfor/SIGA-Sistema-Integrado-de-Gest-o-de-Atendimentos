/* ==========================================================
   SIGACTPAR
   MENU
========================================================== */

document.addEventListener("DOMContentLoaded", iniciarMenu);

function iniciarMenu(){

    const btn = document.getElementById("btnMenu");

    const sidebar = document.getElementById("sidebar");

    if(!btn || !sidebar) return;

    btn.onclick = function(){

        sidebar.classList.toggle("recolhido");

    };

    window.addEventListener("resize",function(){

        if(window.innerWidth > 900){

            sidebar.classList.remove("mobile");

        }

    });

}

/* ==========================================================
   FECHAR MENU AO CLICAR (CELULAR)
========================================================== */

document.addEventListener("click",function(e){

    const sidebar = document.getElementById("sidebar");

    const btn = document.getElementById("btnMenu");

    if(!sidebar || !btn) return;

    if(window.innerWidth <= 900){

        if(

            !sidebar.contains(e.target) &&

            !btn.contains(e.target)

        ){

            sidebar.classList.remove("mobile");

        }

    }

});

/* ==========================================================
   MENU MOBILE
========================================================== */

function abrirMenuMobile(){

    const sidebar = document.getElementById("sidebar");

    if(sidebar){

        sidebar.classList.add("mobile");

    }

}

function fecharMenuMobile(){

    const sidebar = document.getElementById("sidebar");

    if(sidebar){

        sidebar.classList.remove("mobile");

    }

}
