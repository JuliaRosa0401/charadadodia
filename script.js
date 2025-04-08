const baseUrl = "https://charadas-ashen.vercel.app";
const aleatorio = "/charadas";

async function getCharada() {
    try {
        const response = await fetch(baseUrl + aleatorio);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        const charadaJson = await response.json();

        document.querySelector(".text-dark").textContent = charadaJson.pergunta;
        window.respostaAtual = charadaJson.resposta.toLowerCase().trim();

        document.querySelector("#respostaUsuario").value = "";
        document.querySelector("#resultado").textContent = "";
        
        // Ao carregar nova charada, os botões ficam visíveis
        document.querySelector("#verRespostaBtn").style.display = "inline-block"; // Deixa o botão de ver resposta visível
        document.querySelector("#verificar").style.display = "inline-block"; // Deixa o botão verificar visível
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

    if (respostaUsuario === window.respostaAtual) {
        resultado.textContent = "✔ Resposta correta!";
        resultado.style.color = "green";
        inputField.classList.remove("shake");
        
        // Esconde os botões "Ver Resposta" e "Verificar Resposta" quando a resposta for correta
        document.querySelector("#verificar").style.display = "none"; 
        document.querySelector("#verRespostaBtn").style.display = "none"; 
    } else {
        resultado.textContent = "❌ Resposta incorreta!";
        resultado.style.color = "red";
        inputField.classList.add("shake");

        setTimeout(() => {
            inputField.classList.remove("shake");
        }, 300);

        // Exibe o botão "Ver Resposta" apenas se a resposta estiver errada
        document.querySelector("#verRespostaBtn").style.display = "inline-block";
    }
});

// Evento para mostrar a resposta correta
document.querySelector("#verRespostaBtn").addEventListener("click", function () {
    // Exibe a resposta correta diretamente ao clicar no botão
    alert(`A resposta correta é: ${window.respostaAtual}`);
    
    // Após o alerta ser confirmado, esconde os botões
    document.querySelector("#verificar").style.display = "none";
    document.querySelector("#verRespostaBtn").style.display = "none";
});

document.querySelector("#novaCharada").addEventListener("click", getCharada);

document.addEventListener("DOMContentLoaded", getCharada);
