// --- ELEMENTOS DO DOM ---


// --- ESTADO GLOBAL ---
let energyLevel = 4; 
let stars = 0;
let currentScenarioIndex = 0;
let perigoRed = false;
let itemAtual = "A";



const energyMeterText = document.getElementById('energy-level-text');
const currentScenarioDisplay = document.getElementById('current-scenario');
const scenarioDescription = document.getElementById('scenario-description');
const cardOptionsDiv = document.querySelector('.card-options');
const nextScenarioBtn = document.getElementById('next-scenario-btn');
const messageArea = document.getElementById('message-area');
const starCountDisplay = document.getElementById('star-count');
const trophyDisplay = document.getElementById('trophy-display');
const celebrationOverlay = document.getElementById('celebration-overlay');

const greenZone = document.getElementById('zone-green');
const yellowZone = document.getElementById('zone-yellow');
const redZone = document.getElementById('zone-red');



// CERTIFIQUE-SE QUE ESTES ARQUIVOS EXISTEM NA PASTA /img EXATAMENTE COM ESSES NOMES
const scenarios = [
    {
        name: "Cantinho do Sossego",
        description: "Aqui o silêncio é como um abraço. Tudo está calmo e seu coração está batendo devagar. O que você quer fazer?",
        sensoryImpact: 0, 
        cards: [
            { text: "Ler um livrinho", impact: 1, img: "img/book.png" },
            { text: "Abraçar o ursinho", impact: 1, img: "img/soft-toy.png" },
        ]
    },
    {
        name: "Esta ficando barulhento",
        description: "Alguns sons estão ficando altos... Seus ouvidinhos precisam de um pouco de descanso. O que você quer fazer?",
        sensoryImpact: 1, 
        cards: [
            { text: "Usar meus fones", impact: 1, img: "img/headphones.png" },
            { text: "Achar um lugar calmo", impact: 1, img: "img/quiet-corner.png" },
        ]
    },
    {
        name: "Tem muitas Luzes e Cores",
        description: "Tem muita coisa acontecendo e seus olhinhos estão cansados. O que você quer fazer?",
        sensoryImpact: 2, 
        cards: [
            { text: "Pedir um abraço", impact: 2, img: "img/hug.png" },
            { text: "Focar em um objeto", impact: 1, img: "img/magnifying-glass.png" },
        ]
    }
];

const coresData = [
    { nome: "Vermelho", hex: "#FF8A80" }, // Vermelho Suave
    { nome: "Azul", hex: "#81D4FA" },     // Azul Céu
    { nome: "Verde", hex: "#A5D6A7" },    // Verde Menta
    { nome: "Amarelo", hex: "#FFF59D" },   // Amarelo Creme
    { nome: "Laranja", hex: "#FFCC80" },   // Laranja Pêssego
    { nome: "Roxo", hex: "#CE93D8" },      // Lavanda
    { nome: "Rosa", hex: "#F48FB1" },      // Rosa Chiclete Suave
    { nome: "Marrom", hex: "#BCAAA4" }     // Marrom Argila
];

let corAlvoAtual = null;
let timerAuxilioCores = null;

// CONFIGURAÇÃO DO ENCAIXE
const puzzles = [
    { id: 'p1', emoji: '🐶', casa: '🏠' }, { id: 'p2', emoji: '🐱', casa: '🧶' }, { id: 'p3', emoji: '🐦', casa: '🌲' },
    { id: 'p4', emoji: '🐰', casa: '🕳️' }, { id: 'p5', emoji: '🐢', casa: '🏖️' }, { id: 'p6', emoji: '🐟', casa: '🫧' },
    { id: 'p7', emoji: '🐝', casa: '🍯' }, { id: 'p8', emoji: '🐒', casa: '🌴' }, { id: 'p9', emoji: '🐸', casa: '🪷' }
];

let indiceGrupo = 0;
let acertosNoGrupo = 0;
const ITENS_POR_VEZ = 3;


// FORMAS GEOMETRICAS
const formasData = [
    { nome: "Quadrado", classe: "quadrado" },
    { nome: "Círculo", classe: "circulo" },
    { nome: "Triângulo", classe: "triangulo" },
    { nome: "Retângulo", classe: "retangulo" },
    { nome: "Estrela", classe: "estrela" },
    { nome: "Coração", classe: "coracao" }
];

let corAlvo = "";
let modoDesafio = false;


let formaCorreta = null;
let hintTimeout = null;

function carregarJogoFormas() {
    const targetContainer = document.getElementById('target-shape');
    const optionsGrid = document.getElementById('formas-options');
    clearTimeout(hintTimeout); // Limpa timer anterior

    // Sorteia a forma alvo
    formaCorreta = formasData[Math.floor(Math.random() * formasData.length)];
    
    // Renderiza a forma alvo
    targetContainer.className = `shape ${formaCorreta.classe}`;
    setTimeout(() => {
        falar(`Onde está o ${formaCorreta.nome}?`);
    }, 1000);

    // Renderiza opções
    optionsGrid.innerHTML = '';
    formasData.forEach(forma => {
        const btn = document.createElement('div');
        btn.className = `shape ${forma.classe}`;
        btn.id = `opt-${forma.classe}`;
        btn.onclick = () => validarForma(forma.nome);
        optionsGrid.appendChild(btn);
    });

    // Inicia cronômetro de 8 segundos para a dica (pulsar)
    hintTimeout = setTimeout(() => {
        const corretaBtn = document.getElementById(`opt-${formaCorreta.classe}`);
        if (corretaBtn) {
            corretaBtn.classList.add('pulsar');
            falar(`Olha aqui o ${formaCorreta.nome}`);
        }
    }, 8000);
}

function validarForma(nomeSelecionado) {
    clearTimeout(hintTimeout); 
    
    // Remove o pulsar de todas as opções
    document.querySelectorAll('.shape').forEach(el => el.classList.remove('pulsar'));

    // Busca o elemento da opção correta e o alvo central
    const elementoCorreto = document.getElementById(`opt-${formaCorreta.classe}`);
    const formaAlvo = document.getElementById('target-shape');
    
    // Busca o elemento que foi clicado agora para aplicar o tremor se estiver errado
    const elementoClicado = document.querySelector(`.shape[onclick*="${nomeSelecionado}"]`);

    if (nomeSelecionado === formaCorreta.nome) {
        // --- ACERTOU ---
        stars++;
        const displayStars = document.getElementById('star-count-formas');
        if(displayStars) displayStars.textContent = stars;
        
        falar("Excelente! Você encontrou o " + nomeSelecionado);
        createStarsEffect();

        // Ativa a explosão no alvo e na opção clicada
        if(formaAlvo) formaAlvo.classList.add('animar-explosao');
        if(elementoCorreto) elementoCorreto.classList.add('animar-explosao');

        // Reinicia o jogo após a animação (3.5s para dar tempo da explosão sumir)
        setTimeout(() => {
            if(formaAlvo) formaAlvo.classList.remove('animar-explosao');
            if(elementoCorreto) elementoCorreto.classList.remove('animar-explosao');
            carregarJogoFormas(); 
        }, 3500);

    } else {
        // --- ERROU ---
        falar("Esse é o " + nomeSelecionado + ". Tente encontrar o " + formaCorreta.nome);
        
        // Efeito de Tremer (Shake) no item errado
        if (elementoClicado) {
            elementoClicado.classList.remove('shake-erro');
            void elementoClicado.offsetWidth; // Truque para reiniciar a animação
            elementoClicado.classList.add('shake-erro');
            
            setTimeout(() => {
                elementoClicado.classList.remove('shake-erro');
            }, 500);
        }
        
        // Reinicia o timer de ajuda (8 segundos)
        hintTimeout = setTimeout(() => {
            if (elementoCorreto) {
                elementoCorreto.classList.add('pulsar');
                falar("Olha aqui, o " + formaCorreta.nome + " está pulsando.");
            }
        }, 8000); 
    }
}

function initEncaixe() {
    const slotsArea = document.getElementById('slots-area');
    const piecesArea = document.getElementById('pieces-area');
    
    // Proteção contra o erro 'null'
    if (!slotsArea || !piecesArea) {
        console.error("ERRO: Os elementos 'slots-area' ou 'pieces-area' não existem no HTML.");
        return; 
    }

    // Limpeza para a nova fase
    slotsArea.innerHTML = ''; 
    piecesArea.innerHTML = '';
    acertosNoGrupo = 0;

    // Lógica de fatiamento circular
    let inicio = (indiceGrupo * ITENS_POR_VEZ) % puzzles.length;
    let puzzlesAtuais = puzzles.slice(inicio, inicio + ITENS_POR_VEZ);

    // Criar Slots (Casas)
    puzzlesAtuais.forEach(p => {
        const slot = document.createElement('div');
        slot.className = 'slot'; 
        slot.dataset.id = p.id;
        slot.innerHTML = p.casa;
        slot.ondragover = (e) => e.preventDefault();
        slot.ondrop = (e) => lidarComDrop(e, slot);
        slotsArea.appendChild(slot);
    });

    // Criar Peças (Animais)
    [...puzzlesAtuais].sort(() => Math.random() - 0.5).forEach(p => {
        const piece = document.createElement('div');
        piece.className = 'piece';
        piece.draggable = true;
        piece.innerHTML = p.emoji;
        piece.dataset.id = p.id;
        piece.ondragstart = (e) => e.dataTransfer.setData('text', p.id);
        piecesArea.appendChild(piece);
    });
}

function lidarComDrop(e, slot) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text');
    const peca = document.querySelector(`.piece[data-id="${id}"]`);

    if (id === slot.dataset.id && peca) {
        if (slot.classList.contains('slot-filled')) return;

        slot.innerHTML = peca.innerHTML;
        slot.classList.add('slot-filled');
        peca.style.display = 'none';

        acertosNoGrupo++;
        stars++;
        
        // Atualiza o placar específico do encaixe
        const countDisplay = document.getElementById('count-encaixe');
        if (countDisplay) countDisplay.textContent = stars;
        
        falar("Muito bem!");
        createStarsEffect();

        if (acertosNoGrupo === ITENS_POR_VEZ) {
            setTimeout(() => {
                indiceGrupo++; // Avança o grupo
                initEncaixe(); // Gera a próxima fase
            }, 1200);
        }
    } else {
        falar("Tente outro lugar!");
    }
}

// LÓGICA DO TEMPORIZADOR DE CALMA
let holdTimer;
let progress = 0;
const holdBtn = document.getElementById('calm-hold-btn');

function startHold() {
    holdTimer = setInterval(() => {
        progress += 2;
        document.getElementById('progress-circle').style.borderColor = `hsl(${progress}, 70%, 70%)`;
        document.getElementById('progress-circle').style.transform = `scale(${1 + progress/200})`;
        
        if (progress >= 100) {
            clearInterval(holdTimer);
            falar("Parabéns! Você está calmo e tranquilo.");
            // document.getElementById('calm-message').textContent = "Concluído! 🌟";
            createStarsEffect();
        }
    }, 50);
}

function limparEstadoGlobal() {
   // 1. Para as vozes imediatamente
    window.speechSynthesis.cancel();

    // 2. Limpa todos os Timers de Auxílio (8 segundos)
    if (typeof hintTimeout !== 'undefined') clearTimeout(hintTimeout);
    if (typeof timerAuxilioCores !== 'undefined') clearTimeout(timerAuxilioCores);
    if (typeof timerAuxilioFormas !== 'undefined') clearTimeout(timerAuxilioFormas);

    // 3. Desativa os Modos Desafio
    modoDesafio = false;
    if (typeof modoDesafioFormas !== 'undefined') modoDesafioFormas = false;

    // 4. Remove qualquer efeito visual de pulsar que tenha sobrado
    document.querySelectorAll('.shape, .color-circle, .color-card').forEach(el => {
        el.classList.remove('pulsar', 'pulsar-forma', 'shake-erro');
    });

    console.log("Sistema limpo: Modos desativados e timers cancelados.");
}

function stopHold() {
    clearInterval(holdTimer);
    progress = 0;
    document.getElementById('progress-circle').style.transform = `scale(1)`;
    document.getElementById('progress-circle').style.borderColor = '#e1f5fe';
}

holdBtn.addEventListener('mousedown', startHold);
holdBtn.addEventListener('mouseup', stopHold);
holdBtn.addEventListener('touchstart', startHold);
holdBtn.addEventListener('touchend', stopHold);

// --- MOTOR DE VOZ ---
function falar(texto) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setTimeout(() => {
        const msg = new SpeechSynthesisUtterance(texto);
        const voices = window.speechSynthesis.getVoices();
        const ptVoice = voices.find(v => v.lang.includes('pt-BR'));
        if (ptVoice) msg.voice = ptVoice;
        msg.lang = 'pt-BR';
        msg.rate = 1.0;  // Velocidade normal
        msg.pitch = 1.1; // Tom levemente mais agudo para soar amigável (infantil)
        window.speechSynthesis.speak(msg);
    }, 50); 
}

function repetirSomAtual() { falar(itemAtual); }

// --- QUADRO DE DESENHO ---
const canvas = document.getElementById('writingCanvas');
const ctx = canvas.getContext('2d');
let drawing = false;

function ajustarConfiguracaoPincel() {
    ctx.lineWidth = 12; // Pincel levemente mais grosso facilita a validação
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#2196F3';
}
ajustarConfiguracaoPincel();

function getCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
}

function startPosition(e) {
    drawing = true;
    const coords = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
}

function draw(e) {
    if (!drawing) return;
    const coords = getCoords(e);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
}

function finishedPosition() { drawing = false; }

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mousemove', draw);
window.addEventListener('mouseup', finishedPosition);
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startPosition(e); });
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); });
canvas.addEventListener('touchend', finishedPosition);

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ajustarConfiguracaoPincel();
}

// Função para verificar se o desenho está realmente sobre a letra
function verificarSobreposicao() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tCtx = tempCanvas.getContext('2d');

    // 1. Desenhar o gabarito
    tCtx.font = "bold 220px Segoe UI";
    tCtx.textAlign = "center";
    tCtx.textBaseline = "middle";
    tCtx.fillText(itemAtual, tempCanvas.width / 2, tempCanvas.height / 2);

    const gabaritoData = tCtx.getImageData(0, 0, canvas.width, canvas.height).data;
    const desenhoData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let pixelsTotaisGabarito = 0;
    let pontosCorretos = 0;
    let pontosErrados = 0;

    // 2. Comparar pixels e calcular o tamanho real do caractere
    for (let i = 3; i < gabaritoData.length; i += 4) {
        const noGabarito = gabaritoData[i] > 0;
        const noDesenho = desenhoData[i] > 0;

        if (noGabarito) pixelsTotaisGabarito++; // Conta o tamanho total da letra/número atual

        if (noGabarito && noDesenho) {
            pontosCorretos++; 
        } else if (!noGabarito && noDesenho) {
            pontosErrados++; 
        }
    }

    // 3. Lógica Proporcional (Mais amigável)
    // Exigimos que a criança cubra apenas 20% do traçado (ideal para TEA, foca no incentivo)
    const percentualCoberto = (pontosCorretos / pixelsTotaisGabarito);
    const metaAtingida = percentualCoberto > 0.20; 

    // O limite de erro agora é mais generoso (3x o que acertou)
    // Isso permite que o traço seja tremido ou um pouco fora, mas não aceita rabiscar a tela toda
    const muitoErro = pontosErrados > (pixelsTotaisGabarito * 3);

    return metaAtingida && !muitoErro;
}

function confirmarAcerto() {
    const sucesso = verificarSobreposicao(); // Usando a lógica de pixels que criamos

    if (sucesso) {
        // 1. Atualiza a pontuação global
        stars += 1;
        
        // 2. Atualiza todos os contadores de estrelas da tela
        const displayJornada = document.getElementById('star-count');
        const displayEscrita = document.getElementById('star-count-escrita');
        if (displayJornada) displayJornada.textContent = stars;
        if (displayEscrita) displayEscrita.textContent = stars;
        
        // 3. Efeitos Visuais e Sonoros
        mostrarMensagemPopUp("Você conseguiu! ✨");
        falar("Que desenho lindo! Você conseguiu, parabéns!");
        createStarsEffect(); // As estrelas voando
        
        // 4. Limpa e prepara para a próxima (com um pequeno delay)
        // setTimeout(() => {
        //     clearCanvas();
        //     // Opcional: sorteia uma nova letra/número automaticamente?
        // }, 1500);
    } else {
        // Em vez de "Erro", usamos um incentivo para continuar
        falar("Quase lá! Vamos passar o pincel por cima da imagem?");
        mostrarMensagemPopUp("Continue pintando! ✍️✨");
    }
}

// --- LOGICA DE NAVEGAÇÃO ---
function switchTab(tab) {

    // Limpa vozes e timers da tela anterior
    limparEstadoGlobal();

    // 1. Esconder todos os painéis e remover estados ativos
    document.querySelectorAll('.tab-content').forEach(panel => panel.classList.add('hidden'));
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));

    // 2. Lógica para cada aba
    if (tab === 'jornada') {
        // --- LÓGICA DE RESET ---
        energyLevel = 4;           // Volta para o máximo (Verde)
        stars = 0;                 // Zera as estrelas da jornada
        currentScenarioIndex = 0;  // Volta para o primeiro cenário
        perigoRed = false;         // Reseta o estado de crise
        
        // Atualiza os textos e placares visualmente
        starCountDisplay.textContent = stars;
        trophyDisplay.style.display = "none";
        
        // Mostra o painel
        document.getElementById('jornada-panel').classList.remove('hidden');
        document.getElementById('btn-jornada').classList.add('active');
        
        // Renderiza o primeiro cenário e fala
        renderScenario();
    } 
    else if (tab === 'letras') {
        document.getElementById('escrita-section').classList.remove('hidden');
        document.getElementById('letras-panel').classList.remove('hidden');
        document.getElementById('numeros-panel').classList.add('hidden');
        document.getElementById('btn-letras').classList.add('active');
        selecionarItemNoQuadro('A');
    } 
    else if (tab === 'numeros') {
        document.getElementById('escrita-section').classList.remove('hidden');
        document.getElementById('numeros-panel').classList.remove('hidden');
        document.getElementById('letras-panel').classList.add('hidden');
        document.getElementById('btn-numeros').classList.add('active');
        selecionarItemNoQuadro('0');
    }
    else if (tab === 'cores') {
        // document.getElementById('cores-panel').classList.remove('hidden');
        // // Certifique-se de que o ID do botão no HTML seja 'btn-cores'
        // if(document.getElementById('btn-cores')) document.getElementById('btn-cores').classList.add('active');
        // carregarCores();
        // falar("Vamos aprender as cores!");

        document.getElementById('cores-panel').classList.remove('hidden');
        document.getElementById('btn-cores').classList.add('active');
        carregarCores();
        falar("Vamos aprender as cores! Qual cor você quer ver agora?");

    }
    else if (tab === 'formas') {
        document.getElementById('formas-panel').classList.remove('hidden');
        if(document.getElementById('btn-formas')) document.getElementById('btn-formas').classList.add('active');
        carregarJogoFormas();
    }
    else if (tab === 'encaixe') {
        // 1. Mostrar o painel de encaixe
        document.getElementById('encaixe-panel').classList.remove('hidden');
        
        // 2. Ativar a cor verde no botão do menu
        const btnEncaixe = document.getElementById('btn-encaixe');
        if (btnEncaixe) btnEncaixe.classList.add('active');

        // 3. Esconder a seção de escrita (letras/números) se estiver aberta
        const escritaSec = document.getElementById('escrita-section');
        if (escritaSec) escritaSec.classList.add('hidden');

        // 4. Iniciar o jogo
        initEncaixe();
        falar("Vamos encontrar o par de cada um?");
    }
    else if (tab === 'calma') {
        document.getElementById('calma-panel').classList.remove('hidden');
        if(document.getElementById('btn-calma')) document.getElementById('btn-calma').classList.add('active');

        // --- ADICIONE ESTA LINHA ---
        const circulo = document.getElementById('progress-circle');
        if(circulo) circulo.classList.add('pulsar-calma');
        
        stopHold(); // Garante que o timer comece zerado
        falar("Hora de respirar fundo. Segure o botão.");
    }
}

function selecionarItemNoQuadro(valor) {
    itemAtual = valor;
    document.getElementById('canvas-hint').textContent = valor;
    falar(valor.toString());
    clearCanvas();
}

// --- JORNADA DA CALMA ---
function updateEnergyMeter() {
    // Reset total
    greenZone.style.width = "0%"; 
    yellowZone.style.width = "0%"; 
    redZone.style.width = "0%";
    
    let text = "";

    // Nível 4: Verde Total
    if (energyLevel >= 4) { 
        greenZone.style.width = "100%"; 
        text = "Calmo"; 
    }
    // Nível 3: 50% Verde e 50% Amarelo
    else if (energyLevel === 3) { 
        greenZone.style.width = "50%"; 
        yellowZone.style.width = "50%"; 
        text = "Alerta"; 
    }
    // Nível 2: Amarelo Total
    else if (energyLevel === 2) { 
        yellowZone.style.width = "100%"; 
        text = "Ansioso"; 
    }
    // Nível 1: 50% Amarelo e 50% Vermelho
    else if (energyLevel === 1) { 
        yellowZone.style.width = "50%"; 
        redZone.style.width = "50%"; 
        text = "Quase perdendo a calma!"; 
    }
    // Nível 0: Vermelho Total
    else { 
        redZone.style.width = "100%"; 
        text = "Sobrecarregado!"; 
        perigoRed = true; 
    }
    
    energyMeterText.textContent = `Nível: ${text}`;
}

function renderScenario() {
    const scenario = scenarios[currentScenarioIndex];
    currentScenarioDisplay.textContent = scenario.name;
    scenarioDescription.textContent = scenario.description;
    
    falar(scenario.name + ". " + scenario.description);

    // AJUSTE: O impacto sensorial agora reduz a energia de forma suave
    // mas não permite que ela fique negativa
    energyLevel = Math.max(0, energyLevel - scenario.sensoryImpact);
    
    updateEnergyMeter();

    cardOptionsDiv.innerHTML = '';
    cardOptionsDiv.classList.remove('choice-made');

    scenario.cards.forEach(card => {
        const cardBtn = document.createElement('div');
        cardBtn.className = 'card';
        cardBtn.innerHTML = `
            <img src="${card.img}" alt="${card.text}">
            <span>${card.text}</span>
        `;
        
        cardBtn.onclick = function() {
            if (cardOptionsDiv.classList.contains('choice-made')) return;

            cardOptionsDiv.classList.add('choice-made');
            cardBtn.classList.add('selected');

            // AO SELECIONAR UM CARD: Aumentamos a energia
            // Limitamos em 4 para ser o topo (Verde)
            energyLevel = Math.min(4, energyLevel + card.impact);
            
            falar("Que boa ideia! " + card.text + " vai te ajudar.");
            
            stars++;
            starCountDisplay.textContent = stars;
            
            mostrarMensagemPopUp("Coração calmo... +1 Estrela! ✨");
            createStarsEffect();
            updateEnergyMeter(); // Atualiza a barra para refletir o ganho
            checkTrophy();
        };
        cardOptionsDiv.appendChild(cardBtn);
    });
}

function checkTrophy() {
    // Se estamos no último cenário E não houve crise E a energia está boa
    if (currentScenarioIndex === scenarios.length - 1 && !perigoRed && energyLevel >= 3) {
        
        // Verifica se o troféu já está visível para evitar repetir
        if (getComputedStyle(trophyDisplay).display === "none") {
            
            // Força a exibição
            trophyDisplay.style.display = "inline-block"; 
            
            // Adiciona uma pequena animação de brilho para chamar a atenção suavemente
            trophyDisplay.style.animation = "bounce 2s infinite";
            
            setTimeout(() => {
                falar("Parabéns! Você cuidou muito bem da sua calma e ganhou um troféu!");
                mostrarMensagemPopUp("🏆 Você é um Mestre da Calma!");
            }, 500);
            
            createStarsEffect(); 
        }
    } else {
        // Opcional: esconde o troféu se a criança voltar ao início ou perder a calma
        trophyDisplay.style.display = "none";
    }
}

function mostrarMensagemPopUp(texto) {
    const popup = document.getElementById('message-area');
    if (!popup) return;

    // Se já estiver aparecendo, reseta o tempo
    popup.style.display = "block";
    popup.style.opacity = "1";
    popup.textContent = texto;

    // Limpa timers anteriores para não bugar se clicar rápido
    if (popup.dataset.timeoutId) {
        clearTimeout(popup.dataset.timeoutId);
    }

    const timeoutId = setTimeout(() => {
        popup.style.transition = "opacity 0.5s, top 0.5s";
        popup.style.opacity = "0";
        popup.style.top = "-50px";
        
        setTimeout(() => {
            popup.style.display = "none";
            popup.style.top = "20px"; // Reseta posição para a próxima
            popup.style.transition = ""; // Limpa transição
        }, 500);
    }, 2000);

    popup.dataset.timeoutId = timeoutId;
}

function createStarsEffect() {
    // Busca o elemento dentro da função para garantir que ele existe
    const container = document.getElementById('celebration-overlay');
    if (!container) return; // Se não existir, sai da função sem dar erro

    for (let i = 0; i < 15; i++) {
        const star = document.createElement('div');
        star.className = 'star-animation';
        star.innerHTML = '⭐';
        
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = (Math.random() * 20 + 70) + 'vh'; 
        
        container.appendChild(star);
        setTimeout(() => star.remove(), 1200);
    }
}

function carregarAprendizado() {
    const alphabetGroup = document.getElementById('alphabet-group');
    const numbersGroup = document.getElementById('numbers-group');
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(letra => {
        const btn = document.createElement('button');
        btn.className = 'char-btn';
        btn.textContent = letra;
        btn.onclick = () => selecionarItemNoQuadro(letra);
        alphabetGroup.appendChild(btn);
    });
    for (let i = 0; i <= 9; i++) {
        const btn = document.createElement('button');
        btn.className = 'char-btn';
        btn.textContent = i;
        btn.onclick = () => selecionarItemNoQuadro(i);
        numbersGroup.appendChild(btn);
    }
}


function carregarCores() {
    const grid = document.getElementById('color-grid');
    grid.innerHTML = '';
    
    coresData.forEach(cor => {
        const div = document.createElement('div');
        div.className = 'color-circle';
        div.style.backgroundColor = cor.hex;
        div.style.color = cor.hex; // ESSENCIAL: define a cor da pulsação
        div.dataset.cor = cor.nome; 
        div.onclick = () => processarCliqueCor(cor.nome);
        grid.appendChild(div);  
    });
}

function processarCliqueCor(nomeCor) {
    // 1. PARA TUDO: Se clicou, para de pulsar na hora
    pararTimerAuxilio(); 

    if (!modoDesafio) {
        falar(nomeCor);
        mostrarMensagemPopUp(`Essa é a cor ${nomeCor}!`);
        setTimeout(iniciarDesafioCor, 2000);
    } else {
        if (nomeCor === corAlvo) {
            // ACERTOU
            stars++;
            atualizarPlacarEstrelas();
            
            falar("Parabéns! Você encontrou o " + nomeCor + "!");
            mostrarMensagemPopUp("Parabéns, você acertou! 🌟");
            createStarsEffect();

            // 2. DESLIGA O DESAFIO para reiniciar o ciclo
            modoDesafio = false; 

            setTimeout(() => {
                const instrucao = "Qual cor você quer ver agora?";
                document.getElementById('instrucao-cores').textContent = "Toque nas cores para aprender!";
                document.getElementById('pergunta-cores').textContent = instrucao;
                falar(instrucao);
            }, 3000);
            
        } else {
            // ERROU
            falar("Esse é o " + nomeCor + ". Onde está o " + corAlvo + "?");
            // Reinicia a contagem de 8s para ajudar novamente
            iniciarContagemAuxilio(); 
        }
    }
}

function iniciarContagemAuxilio() {
    pararTimerAuxilio(); // Limpa antes de começar um novo
    window.timerAuxilioCores = setTimeout(() => {
        if (modoDesafio) {
            const alvo = document.querySelector(`.color-circle[data-cor="${corAlvo}"]`);
            if (alvo) {
                alvo.classList.add('pulsar');
                falar("Olha o " + corAlvo + " aqui!");
            }
        }
    }, 8000);
}

function pararTimerAuxilio() {
    // 1. Limpa o cronômetro de 8 segundos
    if (typeof timerAuxilioCores !== 'undefined' && timerAuxilioCores) {
        clearTimeout(timerAuxilioCores);
        timerAuxilioCores = null;
    }
    
    // 2. Remove a classe de pulsação de TODOS os círculos/cards imediatamente
    const elementosPulsantes = document.querySelectorAll('.color-circle, .color-card');
    elementosPulsantes.forEach(el => {
        el.classList.remove('pulsar');
        el.style.boxShadow = ""; // Limpa sombras residuais
    });
}

function atualizarPlacarEstrelas() {
    const ids = ['star-count-cores', 'star-count', 'star-count-escrita'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = stars;
    });
}

function iniciarDesafioCor() {
    pararTimerAuxilio(); 
    modoDesafio = true;
    
    const sorteio = coresData[Math.floor(Math.random() * coresData.length)];
    corAlvo = sorteio.nome;
    
    document.getElementById('instrucao-cores').textContent = "Vamos brincar?";
    document.getElementById('pergunta-cores').textContent = `Onde está a cor ${corAlvo}?`;
    falar("Agora, onde está a cor " + corAlvo + "?");

    timerAuxilioCores = setTimeout(() => {
        if (modoDesafio && corAlvo) {
            // AJUSTE AQUI: Mudamos de .color-card para .color-circle
            const circulos = document.querySelectorAll('.color-circle');
            let achou = false;

            circulos.forEach(circulo => {
                const valorCard = (circulo.dataset.cor || "").trim().toLowerCase();
                const valorAlvo = (corAlvo || "").trim().toLowerCase();

                if (valorCard === valorAlvo) {
                    circulo.classList.add('pulsar');
                    achou = true;
                }
            });

            if (achou) {
                falar("Olha o " + corAlvo + " aqui!");
            } else {
                console.warn("Aviso: Nenhum círculo encontrado com data-cor='" + corAlvo + "'. Verifique se você adicionou div.dataset.cor = cor.nome na criação.");
            }
        }
    }, 8000);
}


nextScenarioBtn.onclick = () => {
    currentScenarioIndex = (currentScenarioIndex + 1) % scenarios.length;
    renderScenario();
};

// Previne zoom no toque duplo
document.addEventListener('touchstart', function (event) {
    if (event.touches.length > 1) {
        event.preventDefault(); // Bloqueia múltiplos dedos (zoom de pinça)
    }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault(); // Bloqueia o zoom do toque duplo rápido
    }
    lastTouchEnd = now;
}, false);


window.onload = () => {
    carregarAprendizado();
    
    // Pequeno truque: ao clicar em qualquer lugar da tela pela primeira vez,
    // garantimos que o áudio seja desbloqueado pelo navegador
    document.body.addEventListener('click', function() {
        if (window.speechSynthesis.state === 'suspended') {
            window.speechSynthesis.resume();
        }
    }, { once: true });

    // Inicia na jornada e força a fala do primeiro cenário
    switchTab('jornada');
    renderScenario(); 
};