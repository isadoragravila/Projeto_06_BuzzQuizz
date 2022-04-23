let idsUsuario = [];
let tituloQuizz;
let url;
let perguntas;
let niveis;
let quizz = {
	title: "",
	image: "",
	questions: [],
	levels: []
}

let question = {
    title: "",
    color: "",
    answers: []
}

let answer = {
    text: "",
    image: "",
    isCorrectAnswer: true
}

let level = {
    title: "",
    image: "",
    text: "",
    minValue: 0
}

let API = "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes";

function iniciarPagina () {
    console.log("iniciar pagina")
    idsUsuario = JSON.parse(localStorage.getItem("ids"));
    console.log(idsUsuario);
    if (idsUsuario === null) {
        idsUsuario = [];
    }

    pegarQuizzes ();
}

iniciarPagina();

function pegarQuizzes () {
    console.log("pegar quizzes");
    const promise = axios.get(API);
    promise.then(exibirQuizzes);
}

function exibirQuizzes (resposta) {
    console.log("exibir quizzes");

    const todosOsQuizzes = document.querySelector(".primeira-tela .todos-os-quizzes .quizzes");
    const meusQuizzes = document.querySelector(".primeira-tela .meus-quizzes .quizzes");

    if (idsUsuario.length === 0) {
        console.log("ids.length é 0");
        todosOsQuizzes.innerHTML = "";
        for(let i = 0; i < resposta.data.length; i++) {
            todosOsQuizzes.innerHTML += `
                <div class="quizz">
                    <img src="${resposta.data[i].image}" />
                    <div class="nome-quizz">
                        <h4>${resposta.data[i].title}</h4>
                    </div>
                </div>
            `
        }
    }

    if (idsUsuario.length > 0) {
        console.log("ids.length maior que 0");
        document.querySelector(".primeira-tela .borda-cinza").classList.add("escondido");
        document.querySelector(".primeira-tela .borda-cinza").classList.remove("centralizado");
        document.querySelector(".primeira-tela .meus-quizzes").classList.remove("escondido");

        meusQuizzes.innerHTML = "";
        todosOsQuizzes.innerHTML = "";

            const ehMeuQuizz = resposta.data.filter(quizz => {
                for (let i = 0; i < idsUsuario.length; i++) {
                    if (quizz.id === idsUsuario[i]) {
                        return true;
                    }
                }
            });

            const naoEhMeuQuizz = resposta.data.filter(quizz => {
                for (let i = 0; i < idsUsuario.length; i++) {
                    if (quizz.id === idsUsuario[i]) {
                        return false;
                    }
                }
                return true;
            });

            for (let i = 0; i < ehMeuQuizz.length; i++) {
                meusQuizzes.innerHTML += `
                <div class="quizz">
                    <img src="${ehMeuQuizz[i].image}" />
                    <div class="nome-quizz">
                        <h4>${ehMeuQuizz[i].title}</h4>
                    </div>
                </div>
            `
            }
            for (let i = 0; i < naoEhMeuQuizz.length; i++) {
                todosOsQuizzes.innerHTML += `
                <div class="quizz">
                    <img src="${naoEhMeuQuizz[i].image}" />
                    <div class="nome-quizz">
                        <h4>${naoEhMeuQuizz[i].title}</h4>
                    </div>
                </div>
            `
            }

    } 
}

function criarQuizz () {
    document.querySelector(".primeira-tela").classList.remove("centralizado");
    document.querySelector(".primeira-tela").classList.add("escondido");
    document.querySelector(".criacao-quizz").classList.add("centralizado");
    document.querySelector(".criacao-quizz").classList.remove("escondido");
    document.querySelector(".infos-basicas").classList.add("centralizado");
    document.querySelector(".infos-basicas").classList.remove("escondido");

    tituloQuizz = "";
    url = "";
    perguntas = 0;
    niveis = 0;
    quizz = {
        title: "",
        image: "",
        questions: [],
        levels: []
    }

    question = {
        title: "",
        color: "",
        answers: []
    }

    answer = {
        text: "",
        image: "",
        isCorrectAnswer: true
    }

    level = {
        title: "",
        image: "",
        text: "",
        minValue: 0
    }
}

function enviarInfos () {
    tituloQuizz = document.querySelector(".infos-basicas input.titulo").value;
    url = document.querySelector(".infos-basicas input.url").value;
    perguntas = document.querySelector(".infos-basicas input.qtd-perguntas").value;
    niveis = document.querySelector(".infos-basicas input.qtd-niveis").value;
    perguntas = parseInt(perguntas);
    niveis = parseInt(niveis);

    //validações
    if (verificacaoInfos (tituloQuizz, perguntas, niveis)) {
        console.log("pelos outros dados");
        alert ("Preencha os dados corretamente");
        return;
    }

    if (validarURL (url) === false) {
        console.log("pela url");
        alert ("Preencha os dados corretamente");
        return;
    }

    //manda informações para o objeto
    quizz.title = tituloQuizz;
    quizz.image = url;

    //monta a pagina de perguntas
    document.querySelector(".infos-basicas").classList.add("escondido");
    document.querySelector(".infos-basicas").classList.remove("centralizado");
    document.querySelector(".perguntas").classList.remove("escondido");
    document.querySelector(".perguntas").classList.add("centralizado");

    const elemento = document.querySelector(".perguntas");
    elemento.innerHTML = `
        <h2>Crie suas perguntas</h2>
    `;
    
    for (let i = 0; i < perguntas; i++) {
        elemento.innerHTML += `
        <div class="pergunta-X centralizado">
            <div class="caixa-pergunta escondido">
                <div class="caixa-secundaria">
                    <h3>Pergunta ${i+1}</h3>
                    <input class="texto-pergunta" placeholder="Texto da pergunta" />
                    <input class="cor-pergunta" placeholder="Cor de fundo da pergunta" />
                </div>
                <div class="caixa-secundaria">
                    <h3>Resposta correta</h3>
                    <input class="resposta-correta" placeholder="Resposta correta" />
                    <input class="imagem-correta" placeholder="URL da imagem" />
                </div>
                <div class="caixa-secundaria">
                    <h3>Respostas incorretas</h3>
                    <input class="resposta-1" placeholder="Resposta incorreta 1" />
                    <input class="imagem-1" placeholder="URL da imagem 1" />
                    <div class="space"></div>
                    <input class="resposta-2" placeholder="Resposta incorreta 2" />
                    <input class="imagem-2" placeholder="URL da imagem 2" />
                    <div class="space"></div>
                    <input class="resposta-3" placeholder="Resposta incorreta 3" />
                    <input class="imagem-3" placeholder="URL da imagem 3" />
                </div> 
            </div>
            <div class="caixa-editar alinhamento">
                <h3>Pergunta ${i+1}</h3>
                <ion-icon name="create-outline" onclick="abrirPerguntaX (this)"></ion-icon>
            </div>
        </div>
        `;
    }
    elemento.innerHTML += `
        <div class="botao" onclick="coletarPerguntas ()"><p>Prosseguir pra criar níveis</p></div>
    `;

    //limpa os campos de input
    document.querySelector(".infos-basicas input.titulo").value = "";
    document.querySelector(".infos-basicas input.url").value = "";
    document.querySelector(".infos-basicas input.qtd-perguntas").value = "";
    document.querySelector(".infos-basicas input.qtd-niveis").value = "";
}

function verificacaoInfos (titulo, perguntas, niveis) {
    if (titulo.length < 20 || titulo.length > 65) {
        return true;
    }
    if (isNaN(perguntas) || perguntas < 3) {
        return true;
    }
    if (isNaN(niveis) || niveis < 2) {
        return true;
    }
}

function validarURL (url) {
    const pattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;
    const resultado = pattern.test(url);
    return resultado;
}

function abrirPerguntaX (elemento) {
    const pai = elemento.parentNode;
    const avo = pai.parentNode;
    pai.classList.add("escondido");
    pai.classList.remove("alinhamento");
    avo.querySelector(".caixa-pergunta").classList.add("alinhamento");
    avo.querySelector(".caixa-pergunta").classList.remove("escondido");
}

function coletarPerguntas () {
    const textoPergunta = document.querySelectorAll(".perguntas .texto-pergunta");
    const corPergunta = document.querySelectorAll(".perguntas .cor-pergunta");
    const respostaCorreta = document.querySelectorAll(".perguntas .resposta-correta");
    const imagemCorreta = document.querySelectorAll(".perguntas .imagem-correta");
    const respostaIncorreta1 = document.querySelectorAll(".perguntas .resposta-1");
    const imagemIncorreta1 = document.querySelectorAll(".perguntas .imagem-1");
    const respostaIncorreta2 = document.querySelectorAll(".perguntas .resposta-2");
    const imagemIncorreta2 = document.querySelectorAll(".perguntas .imagem-2");
    const respostaIncorreta3 = document.querySelectorAll(".perguntas .resposta-3");
    const imagemIncorreta3 = document.querySelectorAll(".perguntas .imagem-3");

    //validações
    if (verificacaoPerguntas (textoPergunta, respostaCorreta, respostaIncorreta1, imagemIncorreta1, respostaIncorreta2, imagemIncorreta2, respostaIncorreta3, imagemIncorreta3)) {
        alert ("Preencha os dados corretamente");
        return;
    }
    //validação cores
    for (let i = 0; i < perguntas; i++) {
        if (validarCor (corPergunta[i].value) === false) {
            console.log("pela cor");
            alert ("Preencha os dados corretamente");
            return;
        }
    }
    //validação url imagem
    for (let i = 0; i < perguntas; i++) {
        if (validarURL (imagemCorreta[i].value) === false) {
            console.log("pelo url imagem correta" + i);
            alert ("Preencha os dados corretamente");
            return;
        }
        if (respostaIncorreta1[i].value !== "") {
            if (validarURL (imagemIncorreta1[i].value) === false) {
                console.log("pelo url imagem incorreta 1" + i);
                alert ("Preencha os dados corretamente");
                return;
            }
        }
        if (respostaIncorreta2[i].value !== "") {
            if (validarURL (imagemIncorreta2[i].value) === false) {
                console.log("pelo url imagem incorreta 2" + i);
                alert ("Preencha os dados corretamente");
                return;
            }
        }
        if (respostaIncorreta3[i].value !== "") {
            if (validarURL (imagemIncorreta3[i].value) === false) {
                console.log("pelo url imagem incorreta 2" + i);
                alert ("Preencha os dados corretamente");
                return;
            }
        }
    }


    
    //manda as informações para o objeto
    for (let i = 0; i < perguntas; i++) {
        question.title = textoPergunta[i].value;
        question.color = corPergunta[i].value;
        answer.text = respostaCorreta[i].value;
        answer.image = imagemCorreta[i].value;
        answer.isCorrectAnswer = true;
        question.answers.push(answer);
        answer = {
            text: "",
            image: "",
            isCorrectAnswer: true
        }
        if (respostaIncorreta1[i].value !== "") {
            answer.text = respostaIncorreta1[i].value;
            answer.image = imagemIncorreta1[i].value;
            answer.isCorrectAnswer = false;
            question.answers.push(answer);
            answer = {
                text: "",
                image: "",
                isCorrectAnswer: true
            }
        }
        if (respostaIncorreta2[i].value !== "") {
            answer.text = respostaIncorreta2[i].value;
            answer.image = imagemIncorreta2[i].value;
            answer.isCorrectAnswer = false;
            question.answers.push(answer);
            answer = {
                text: "",
                image: "",
                isCorrectAnswer: true
            }
        }
        if (respostaIncorreta3[i].value !== "") {
            answer.text = respostaIncorreta3[i].value;
            answer.image = imagemIncorreta3[i].value;
            answer.isCorrectAnswer = false;
            question.answers.push(answer);
            answer = {
                text: "",
                image: "",
                isCorrectAnswer: true
            }
        }
        quizz.questions.push(question);
        question = {
            title: "",
            color: "",
            answers: []
        }
    }

    //monta a pagina de niveis
    document.querySelector(".perguntas").classList.add("escondido");
    document.querySelector(".perguntas").classList.remove("centralizado");
    document.querySelector(".niveis").classList.remove("escondido");
    document.querySelector(".niveis").classList.add("centralizado");

    const elemento = document.querySelector(".niveis");
    elemento.innerHTML = `
        <h2>Agora, decida os níveis</h2>
    `;

    for(let i = 0; i < niveis; i++) {
        elemento.innerHTML += `
            <div class="pergunta-X centralizado">
                <div class="caixa-pergunta escondido">
                    <span>Nível ${i+1}</span>
                    <input class="titulo-nivel" placeholder="Título do nível">
                    <input class="porcentagem-acerto" placeholder="% de acerto mínima">
                    <input class="url-imagem" placeholder="URL da imagem do nível">
                    <input class="descricao-nivel" placeholder="Descrição do nível">
                </div>
                <div class="caixa-editar alinhamento">
                    <span>Nível ${i+1}</span>
                    <ion-icon name="create-outline" onclick="abrirPerguntaX (this)"></ion-icon>
                </div>
            </div>
        `
    }
    elemento.innerHTML += `
            <div class="botao" onclick="finalizarQuizz ()">
                <p>Finalizar Quizz</p>
            </div>
    `
}

function verificacaoPerguntas (textoPergunta, respostaCorreta, respostaIncorreta1, imagemIncorreta1, respostaIncorreta2, imagemIncorreta2, respostaIncorreta3, imagemIncorreta3) {
    for (let i = 0; i < perguntas; i++) {
        if (textoPergunta[i].value.length < 20) {
            return true;
        }
        if (respostaCorreta[i].value === "") {
            return true;
        }
        if (respostaIncorreta1[i].value === "" && respostaIncorreta2[i].value === "" && respostaIncorreta3[i].value === "") {
            console.log("pelas respostas incorretas vazias" + i);
            return true;
        }
        if (imagemIncorreta1[i].value === "" && imagemIncorreta2[i].value === "" && imagemIncorreta3[i].value === "") {
            console.log("pelas imagens incorretas vazias" + i);
            return true;
        }
    }
}

function validarCor (cor) {
    const pattern = /^#(?:[0-9a-fA-F]{6})$/g;
    const resultado = pattern.test(cor);
    return resultado;
}

function finalizarQuizz () {
    const tituloNivel = document.querySelectorAll(".niveis .titulo-nivel");
    const porcentagemAcerto = document.querySelectorAll(".niveis .porcentagem-acerto");
    const urlNivel = document.querySelectorAll(".niveis .url-imagem");
    const descricao = document.querySelectorAll(".niveis .descricao-nivel");

    const percentualNumero = [];
    for (let i = 0; i < niveis; i++) {
        percentualNumero.push(Number(porcentagemAcerto[i].value));
    }

    //validações
    if (validarNivel (tituloNivel, percentualNumero, descricao)) {
        alert ("Preencha os dados corretamente");
        return;
    }

    for (let i = 0; i < niveis; i++) {
        if (porcentagemAcerto[i].value === "") {
            alert ("Preencha os dados aqui corretamente");
            return;
        }
    }

    for (let i = 0; i < niveis; i++) {
        //valida URL
        if (validarURL (urlNivel[i].value) === false) {
            console.log("pelo nivel");
            alert ("Preencha os dados corretamente");
            return;
        }
    }

     //manda as informações para o objeto
    for (let i = 0; i < niveis; i++) {
        level.title = tituloNivel[i].value;
        level.image = urlNivel[i].value;
        level.text = descricao[i].value;
        level.minValue = percentualNumero[i];
        quizz.levels.push(level);
        level = {
            title: "",
            image: "",
            text: "",
            minValue: 0
        }
    }

    //monta a pagina de sucessos
    document.querySelector(".niveis").classList.add("escondido");
    document.querySelector(".niveis").classList.remove("centralizado");
    document.querySelector(".sucesso").classList.remove("escondido");
    document.querySelector(".sucesso").classList.add("centralizado");

    const elemento = document.querySelector(".sucesso .imagem-quizz");

    elemento.innerHTML = `
        <img src="${quizz.image}" />
        <div class="nome-quizz">
            <h4>${quizz.title}</h4>
        </div>
    `;
    //enviarQuizz ();
}

function validarNivel(tituloNivel, porcentagemAcerto, descricao) {
    let contador = 0;
    for (let i = 0; i < niveis; i++) {
        if (porcentagemAcerto[i] === 0) {
            contador++;
        }
    }
    if (contador === 0) {
        return true;
    }

    for (let i = 0; i < niveis; i++) {
        if (tituloNivel[i].value.length < 10) {
            return true;
        }
        if (porcentagemAcerto[i] < 0 || porcentagemAcerto[i] > 100 || isNaN(porcentagemAcerto[i])) {
            return true;
        }
        if (descricao[i].value.length < 30) {
            return true;
        }
    }
}

function enviarQuizz () {
    const promise = axios.post(API, quizz);
    console.log("enviou!!");
    promise.then(pegarID);
}

function pegarID (resposta) {
    console.log(resposta.data.id);
    idsUsuario.push(resposta.data.id);
    console.log(idsUsuario);
    localStorage.setItem("ids",JSON.stringify(idsUsuario));
}

function listarQuizz () {
    document.querySelector(".sucesso").classList.remove("centralizado");
    document.querySelector(".sucesso").classList.add("escondido");
    document.querySelector(".primeira-tela").classList.add("centralizado");
    document.querySelector(".primeira-tela").classList.remove("escondido");
    pegarQuizzes ();
}

function voltarTelaInicial () {
    document.querySelector(".pagina-de-um-quizz").classList.remove("centralizado");
    document.querySelector(".pagina-de-um-quizz").classList.add("escondido");
    document.querySelector(".primeira-tela").classList.add("centralizado");
    document.querySelector(".primeira-tela").classList.remove("escondido");
    pegarQuizzes ();
}


