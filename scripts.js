let idsUsuario = [];
let idUnico;
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

const API = "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes";
const DOIS_S = 2 * 1000;
let response;
let contadorPerguntas = 0;
let acertos = 0;

function iniciarPagina () {
    idsUsuario = JSON.parse(localStorage.getItem("ids"));
    console.log(idsUsuario);
    if (idsUsuario === null) {
        idsUsuario = [];
    }
    pegarQuizzes ();
}

iniciarPagina();

function pegarQuizzes () {
    const promise = axios.get(API);
    promise.then(exibirQuizzes);
}

function exibirQuizzes (resposta) {
    const todosOsQuizzes = document.querySelector(".primeira-tela .todos-os-quizzes .quizzes");
    const meusQuizzes = document.querySelector(".primeira-tela .meus-quizzes .quizzes");
    todosOsQuizzes.innerHTML = "";

    if (idsUsuario.length === 0) {
        for(let i = 0; i < resposta.data.length; i++) {
            todosOsQuizzes.innerHTML += `
                <div class="quizz">
                    <img src="${resposta.data[i].image}" />
                    <div class="nome-quizz" onclick="abrirQuizz (this)">
                        <h4>${resposta.data[i].title}</h4>
                        <div class="ids escondido">${resposta.data[i].id}</div>
                    </div>
                </div>
            `;
        }
    }

    if (idsUsuario.length > 0) {
        document.querySelector(".primeira-tela .borda-cinza").classList.add("escondido");
        document.querySelector(".primeira-tela .borda-cinza").classList.remove("centralizado");
        document.querySelector(".primeira-tela .meus-quizzes").classList.remove("escondido");
        meusQuizzes.innerHTML = "";

        const naoEhMeuQuizz = resposta.data.filter(quizz => {
            for (let i = 0; i < idsUsuario.length; i++) {
                if (quizz.id === idsUsuario[i]) {
                    return false;
                }
            }
            return true;
        });

        for (let i = 0; i< idsUsuario.length; i++) {
            promise = axios.get(`${API}/${idsUsuario[i]}`);
            promise.then (function (resposta) {
                meusQuizzes.innerHTML += `
                <div class="quizz">
                    <img src="${resposta.data.image}" />
                    <div class="nome-quizz" onclick="abrirQuizz (this)">
                        <h4>${resposta.data.title}</h4>
                        <div class="ids escondido">${resposta.data.id}</div>
                    </div>
                </div>
            `;
            });
        }

        for (let i = 0; i < naoEhMeuQuizz.length; i++) {
            todosOsQuizzes.innerHTML += `
            <div class="quizz">
                <img src="${naoEhMeuQuizz[i].image}" />
                <div class="nome-quizz" onclick="abrirQuizz (this)">
                    <h4>${naoEhMeuQuizz[i].title}</h4>
                    <div class="ids escondido">${naoEhMeuQuizz[i].id}</div>
                </div>
            </div>
        `;
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

    zerarVariaveis ();
}

function zerarVariaveis () {
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
            alert ("Preencha os dados corretamente");
            return;
        }
    }
    //validação url imagem
    for (let i = 0; i < perguntas; i++) {
        if (validarURL (imagemCorreta[i].value) === false) {
            alert ("Preencha os dados corretamente");
            return;
        }
        if (respostaIncorreta1[i].value !== "") {
            if (validarURL (imagemIncorreta1[i].value) === false) {
                alert ("Preencha os dados corretamente");
                return;
            }
        }
        if (respostaIncorreta2[i].value !== "") {
            if (validarURL (imagemIncorreta2[i].value) === false) {
                alert ("Preencha os dados corretamente");
                return;
            }
        }
        if (respostaIncorreta3[i].value !== "") {
            if (validarURL (imagemIncorreta3[i].value) === false) {
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
        zerarAnswer ();
        
        if (respostaIncorreta1[i].value !== "") {
            answer.text = respostaIncorreta1[i].value;
            answer.image = imagemIncorreta1[i].value;
            answer.isCorrectAnswer = false;

            question.answers.push(answer);
            zerarAnswer ();
        }
        if (respostaIncorreta2[i].value !== "") {
            answer.text = respostaIncorreta2[i].value;
            answer.image = imagemIncorreta2[i].value;
            answer.isCorrectAnswer = false;

            question.answers.push(answer);
            zerarAnswer ();
        }
        if (respostaIncorreta3[i].value !== "") {
            answer.text = respostaIncorreta3[i].value;
            answer.image = imagemIncorreta3[i].value;
            answer.isCorrectAnswer = false;

            question.answers.push(answer);
            zerarAnswer ();
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
        `;
    }
    elemento.innerHTML += `
            <div class="botao" onclick="finalizarQuizz ()">
                <p>Finalizar Quizz</p>
            </div>
    `;
}

function zerarAnswer () {
    answer = {
        text: "",
        image: "",
        isCorrectAnswer: true
    }
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
            return true;
        }
        if (imagemIncorreta1[i].value === "" && imagemIncorreta2[i].value === "" && imagemIncorreta3[i].value === "") {
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
    if (verificacaoNivel (tituloNivel, percentualNumero, descricao)) {
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
        if (validarURL (urlNivel[i].value) === false) {
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
    enviarQuizz ();
}

function verificacaoNivel(tituloNivel, porcentagemAcerto, descricao) {
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
    promise.then(pegarID);
}

function pegarID (resposta) {
    idsUsuario.push(resposta.data.id);
    idUnico = resposta.data.id;
    response = resposta.data;
    localStorage.setItem("ids",JSON.stringify(idsUsuario));
}

function exibirQuizzFeito () {
    document.querySelector(".sucesso").classList.remove("centralizado");
    document.querySelector(".sucesso").classList.add("escondido");
    document.querySelector(".criacao-quizz").classList.remove("centralizado");
    document.querySelector(".criacao-quizz").classList.add("escondido");
    document.querySelector(".pagina-de-um-quizz").classList.add("centralizado");
    document.querySelector(".pagina-de-um-quizz").classList.remove("escondido");
    exibirQuizzUnico ();
}

function voltarTelaInicial () {
    window.location.reload();
}

function abrirQuizz (elemento) {
    idUnico = elemento.querySelector(".ids").innerHTML;
    promise = axios.get(`${API}/${idUnico}`);
    promise.then(trocarPaginas);
}

function trocarPaginas (resposta) {
    document.querySelector(".primeira-tela").classList.remove("centralizado");
    document.querySelector(".primeira-tela").classList.add("escondido");
    document.querySelector(".pagina-de-um-quizz").classList.add("centralizado");
    document.querySelector(".pagina-de-um-quizz").classList.remove("escondido");
    response = resposta.data;
    exibirQuizzUnico ();
}

function exibirQuizzUnico () {
    contadorPerguntas = 0;
    acertos = 0;
    const elemento = document.querySelector(".pagina-de-um-quizz");
    elemento.innerHTML = `
        <div class="faixa-quizz">
            <img src="${response.image}" >
            <div class="titulo-do-quizz">
                <p>${response.title}</p>
            </div>
        </div>
    `;

    elemento.scrollIntoView();
    exibirPerguntas (response.questions[contadorPerguntas]);
}

function exibirPerguntas (question) {
    const elemento = document.querySelector(".pagina-de-um-quizz");
    elemento.innerHTML += `
        <div class="caixa-quizz centralizado">
            <div class="pergunta-quizz" style="background-color: ${question.color}">
                <p>${question.title}</p>
            </div>
            <div class="imagens-quizz vazia">
                <div class="travar-respostas escondido"></div>
            </div>
        </div>
    `;
    const caixaRespostas = elemento.querySelector(".caixa-quizz .imagens-quizz.vazia");

    question.answers.sort(function () { 
        return Math.random() - 0.5; 
    });
    
    for (let i = 0; i < question.answers.length; i++) {
        caixaRespostas.innerHTML += `
            <div class="card-resposta" onclick="cliqueResposta (this)">
                <img src="${question.answers[i].image}" >
                <p class="preto">${question.answers[i].text}</p>
                <div class="valor-resposta escondido">${question.answers[i].isCorrectAnswer}</div>
            </div>
        `;
    }

    caixaRespostas.classList.remove("vazia");
    caixaRespostas.classList.add(`pergunta-${contadorPerguntas}`);

    setTimeout(proxPergunta, DOIS_S);
}

function proxPergunta () {
    const scrollar = document.querySelector(`.pagina-de-um-quizz .caixa-quizz .imagens-quizz.pergunta-${contadorPerguntas}`);
    scrollar.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function cliqueResposta (elemento) {
    const pai = elemento.parentNode;
    const todasRespostas = pai.querySelectorAll(".card-resposta");

    for (let i = 0; i < todasRespostas.length; i++) {
        todasRespostas[i].classList.add("opacidade");
        const ehACerta = todasRespostas[i].querySelector(".valor-resposta");
        if (ehACerta.innerHTML === "true") {
            todasRespostas[i].querySelector(".preto").classList.add("verde");
            todasRespostas[i].querySelector(".preto").classList.remove("preto");
        } else {
            todasRespostas[i].querySelector(".preto").classList.add("vermelho");
            todasRespostas[i].querySelector(".preto").classList.remove("preto");
        }
    }
    elemento.classList.remove("opacidade");
    document.querySelector(".travar-respostas.escondido").classList.remove("escondido");

    const verifAcertos = elemento.querySelector(".valor-resposta");
    if (verifAcertos.innerHTML === "true") {
        acertos++;
    }

    contadorPerguntas++;
    if (contadorPerguntas < response.questions.length) {
        exibirPerguntas (response.questions[contadorPerguntas]);
    } else {
        setTimeout(exibirNivel, DOIS_S);
    }
}

function exibirNivel () {
    const percentualAcertos = Math.ceil((acertos/contadorPerguntas)*100);
    let contadorNiveis = 0;

    response.levels.sort(function (a , b) {
        return a.minValue - b.minValue;
    });

    for (let i = 0; i < response.levels.length; i++) {
        if (percentualAcertos >= response.levels[i].minValue) {
            contadorNiveis++;
        }
    }

    const elemento = document.querySelector(".pagina-de-um-quizz");
    elemento.innerHTML += `
        <div class="resposta-quizz centralizado">
            <div class="titulo-resposta">
                <p>${percentualAcertos}% de acerto: ${response.levels[contadorNiveis - 1].title}</p>
            </div>
            <div class="caixa-resultado">
                <img src="${response.levels[contadorNiveis - 1].image}">
                <p>${response.levels[contadorNiveis - 1].text}</p>
            </div>
        </div>
        <div class="botao" onclick="exibirQuizzUnico ()">
            <p>Reiniciar quizz</p>
        </div>
        <p onclick="voltarTelaInicial()">Voltar pra home</p>
    `;

    const scrollar = document.querySelector(".pagina-de-um-quizz .resposta-quizz");
    scrollar.scrollIntoView({ behavior: 'smooth', block: 'center' });
}