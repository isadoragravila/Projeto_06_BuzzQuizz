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

function enviarInfos () {
    const titulo = document.querySelector(".infos-basicas input.titulo").value;
    const url = document.querySelector(".infos-basicas input.url").value;
    perguntas = document.querySelector(".infos-basicas input.qtd-perguntas").value;
    niveis = document.querySelector(".infos-basicas input.qtd-niveis").value;
    perguntas = parseInt(perguntas);
    niveis = parseInt(niveis);
    
    // if (verificacaoInfos (titulo, url, perguntas, niveis)) {
    //     alert ("Preencha os dados corretamente");
    //     return;
    // }

    quizz.title = titulo;
    quizz.image = url;


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
}

function verificacaoInfos (titulo, url, perguntas, niveis) {
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

function abrirPerguntaX (elemento) {
    const pai = elemento.parentNode;
    const avo = pai.parentNode;
    pai.classList.add("escondido");
    pai.classList.remove("alinhamento");
    avo.querySelector(".caixa-pergunta").classList.add("alinhamento");
    avo.querySelector(".caixa-pergunta").classList.add("escondido");
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

    // if (verificacaoPerguntas (textoPergunta, corPergunta, respostaCorreta, imagemCorreta, respostaIncorreta1, imagemIncorreta1, respostaIncorreta2, imagemIncorreta2, respostaIncorreta3, imagemIncorreta3)) {
    //     alert ("Preencha os dados corretamente");
    //     return;
    // }
    
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

    document.querySelector(".perguntas").classList.add("escondido");
    document.querySelector(".perguntas").classList.remove("centralizado");
    document.querySelector(".niveis").classList.remove("escondido");
    document.querySelector(".niveis").classList.add("centralizado");


    //colocar os niveis no innerHTML niveis

}

function verificacaoPerguntas (textoPergunta, corPergunta, respostaCorreta, imagemCorreta, respostaIncorreta1, imagemIncorreta1, respostaIncorreta2, imagemIncorreta2, respostaIncorreta3, imagemIncorreta3) {
    for (let i = 0; i < perguntas; i++) {
        if (textoPergunta[i].value.length < 20) {
            return true;
        }
        if (respostaCorreta[i].value === "" || respostaIncorreta1[i].value === "") {
            return true;
        }
        if (imagemIncorreta2[i].value !== "" && respostaIncorreta2[i].value === "") {
            return true;
        }
        if (imagemIncorreta3[i].value !== "" && respostaIncorreta3[i].value === "") {
            return true;
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
}