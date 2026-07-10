/* =====================================================
   SIGA
   Login
   ===================================================== */

document.addEventListener("DOMContentLoaded", iniciarLogin);

function iniciarLogin() {

    carregarUsuarioSalvo();

    const form = document.getElementById("formLogin");

    form.addEventListener("submit", fazerLogin);

}


//=====================================================
// LOGIN
//=====================================================

function fazerLogin(event){

    event.preventDefault();

    const usuario =
    document.getElementById("usuario").value.trim();

    const senha =
    document.getElementById("senha").value.trim();

    const lembrar =
    document.getElementById("lembrar").checked;



    if(usuario === ""){

        alert("Informe o usuário.");

        return;

    }

    if(senha === ""){

        alert("Informe a senha.");

        return;

    }


    //=========================================
    // LOGIN PADRÃO (DESENVOLVIMENTO)
    //=========================================

    if(usuario==="admin" && senha==="123456"){

        if(lembrar){

            localStorage.setItem(
                "siga_usuario",
                usuario
            );

        }else{

            localStorage.removeItem(
                "siga_usuario"
            );

        }

        localStorage.setItem(
            "siga_logado",
            "true"
        );

        localStorage.setItem(
            "siga_nome",
            "Administrador"
        );

        window.location.href="index.html";

        return;

    }


    alert("Usuário ou senha inválidos.");

}



//=====================================================
// CARREGAR USUÁRIO
//=====================================================

function carregarUsuarioSalvo(){

    const usuario =
    localStorage.getItem("siga_usuario");

    if(!usuario)
        return;

    document.getElementById("usuario").value =
    usuario;

    document.getElementById("lembrar").checked =
    true;

}



//=====================================================
// LOGOUT
//=====================================================

function sairSistema(){

    localStorage.removeItem(
        "siga_logado"
    );

    localStorage.removeItem(
        "siga_nome"
    );

    window.location.href="login.html";

}



//=====================================================
// VERIFICAR LOGIN
//=====================================================

function verificarLogin(){

    const logado =
    localStorage.getItem(
        "siga_logado"
    );

    if(logado!=="true"){

        window.location.href=
        "login.html";

    }

}
