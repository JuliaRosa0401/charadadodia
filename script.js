const baseUrl = "https://charadas-ashen.vercel.app";
const aleatorio = "/charadas";

let acertosSeguidos = 0;
let totalAcertos = 0;
let totalErros = 0;

// Timer
let timerAtivo = false;
let tempoRestante = 10;
let intervaloTimer = null;

// Atualiza o placar na tela
function atualizarPlacar() {
    const placarEl = document.querySelector("#placar");
    placarEl.textContent = `✅ Acertos: ${totalAcertos} | ❌ Erros: ${totalErros}`;
}

// Inicia o timer
function iniciarTimer() {
    clearInterval(intervaloTimer);
    tempoRestante = 10;
    const cronometroEl = document.getElementById("cronometro");
    cronometroEl.style.display = "inline";
    cronometroEl.textContent = `⏱ ${tempoRestante}s`;

    intervaloTimer = setInterval(() => {
        tempoRestante--;
        cronometroEl.textContent = `⏱ ${tempoRestante}s`;

        if (tempoRestante <= 0) {
            clearInterval(intervaloTimer);
            cronometroEl.textContent = "⏳ Tempo esgotado!";
            alert(`⏱ Tempo acabou!\nA resposta correta era: ${window.respostaAtual}`);

            document.querySelector("#verificar").style.display = "none";
            document.querySelector("#verRespostaBtn").style.display = "none";
        }
    }, 1000);
}

async function getCharada() {
    try {
        const response = await fetch(baseUrl + aleatorio);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        const charadaJson = await response.json();

        const perguntaEl = document.querySelector(".text-dark");
        perguntaEl.textContent = charadaJson.pergunta;

        // Fade-in
        perguntaEl.classList.remove("fade-in");
        void perguntaEl.offsetWidth;
        perguntaEl.classList.add("fade-in");

        window.respostaAtual = charadaJson.resposta.toLowerCase().trim();

        document.querySelector("#respostaUsuario").value = "";
        document.querySelector("#resultado").textContent = "";

        document.querySelector("#verRespostaBtn").style.display = "inline-block";
        document.querySelector("#verificar").style.display = "inline-block";
        document.querySelector("#mensagemComemoracao").style.display = "none";

        // Reinicia o timer se estiver ativado
        if (timerAtivo) {
            iniciarTimer();
        } else {
            clearInterval(intervaloTimer);
            document.getElementById("cronometro").style.display = "none";
        }

    } catch (error) {
        console.error("Erro ao chamar a API: " + error);
        document.querySelector("#resultado").textContent = "Erro ao buscar a charada. Tente novamente.";
        document.querySelector("#resultado").style.color = "red";
    }
}

document.querySelector("#verificar").addEventListener("click", function () {
    const respostaUsuario = document.querySelector("#respostaUsuario").value.toLowerCase().trim();
    const resultado = document.querySelector("#resultado");
    const inputField = document.querySelector("#respostaUsuario");
    const msgComemoracao = document.querySelector("#mensagemComemoracao");

    clearInterval(intervaloTimer);
    document.getElementById("cronometro").style.display = "none";

    if (respostaUsuario === window.respostaAtual) {
        resultado.textContent = "✔ Resposta correta!";
        resultado.style.color = "green";
        inputField.classList.remove("shake");

        totalAcertos++;
        acertosSeguidos++;
        atualizarPlacar();

        if (acertosSeguidos >= 3) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });

            msgComemoracao.textContent = "🎉 Você mandou bem! 3 acertos seguidos!";
            msgComemoracao.style.display = "block";

            setTimeout(() => {
                msgComemoracao.style.display = "none";
            }, 3000);

            acertosSeguidos = 0;
        }

        document.querySelector("#verificar").style.display = "none";
        document.querySelector("#verRespostaBtn").style.display = "none";
    } else {
        resultado.textContent = "❌ Resposta incorreta!";
        resultado.style.color = "red";
        inputField.classList.add("shake");

        setTimeout(() => {
            inputField.classList.remove("shake");
        }, 300);

        totalErros++;
        acertosSeguidos = 0;
        atualizarPlacar();

        msgComemoracao.style.display = "none";
        document.querySelector("#verRespostaBtn").style.display = "inline-block";
    }
});

document.querySelector("#verRespostaBtn").addEventListener("click", function () {
    clearInterval(intervaloTimer);
    document.getElementById("cronometro").style.display = "none";

    alert(`A resposta correta é: ${window.respostaAtual}`);
    document.querySelector("#verificar").style.display = "none";
    document.querySelector("#verRespostaBtn").style.display = "none";
});

document.querySelector("#novaCharada").addEventListener("click", getCharada);

document.querySelector("#resetPlacar").addEventListener("click", function () {
    totalAcertos = 0;
    totalErros = 0;
    acertosSeguidos = 0;
    atualizarPlacar();

    document.querySelector("#mensagemComemoracao").style.display = "none";

    alert("Placar zerado!");
});

// Timer ativar/desativar
document.getElementById("ativarTimer").addEventListener("click", () => {
    timerAtivo = !timerAtivo;
    const botao = document.getElementById("ativarTimer");

    if (timerAtivo) {
        botao.textContent = "⏸ Desativar Timer";
        iniciarTimer();
    } else {
        botao.textContent = "⏳ Ativar Timer";
        clearInterval(intervaloTimer);
        document.getElementById("cronometro").style.display = "none";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    getCharada();
    atualizarPlacar();
});

const rankingLista = document.getElementById("rankingLista");
const rankingBox = document.getElementById("rankingBox");
const toggleRankingBtn = document.getElementById("toggleRanking");
const fecharRankingBtn = document.getElementById("fecharRanking");
const salvarRankingBtn = document.getElementById("salvarRanking");
const nomeJogadorInput = document.getElementById("nomeJogador");

let rankingLocal = JSON.parse(localStorage.getItem("rankingLocal")) || [];

function atualizarRanking() {
  rankingLista.innerHTML = "";
  rankingLocal.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${item.nome} - ✅ ${item.acertos} | ❌ ${item.erros}`;
    rankingLista.appendChild(li);
  });
}

toggleRankingBtn.addEventListener("click", () => {
  rankingBox.style.display = rankingBox.style.display === "none" ? "block" : "none";
  if (rankingBox.style.display === "block") atualizarRanking();
});

fecharRankingBtn.addEventListener("click", () => {
  rankingBox.style.display = "none";
});

salvarRankingBtn.addEventListener("click", () => {
  const nome = nomeJogadorInput.value.trim();
  if (!nome) return alert("Digite seu nome para salvar!");

  rankingLocal.push({ nome, acertos: totalAcertos, erros: totalErros });
  localStorage.setItem("rankingLocal", JSON.stringify(rankingLocal));
  atualizarRanking();
  alert("Placar salvo no ranking!");
});
