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
    falar(`Onde está o ${formaCorreta.nome}?`);

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
    
    // Remove o pulsar de todas
    document.querySelectorAll('.shape').forEach(el => el.classList.remove('pulsar'));

    const elementoCorreto = document.getElementById(`opt-${formaCorreta.classe}`);
    const formaAlvo = document.getElementById('target-shape');

    if (nomeSelecionado === formaCorreta.nome) {
        createStarsEffect(); // Reutiliza suas estrelas subindo
        stars++;
        const displayStars = document.getElementById('star-count-formas');
        if(displayStars) displayStars.textContent = stars;
        
        falar("Excelente! Você encontrou o " + nomeSelecionado);
        createStarsEffect();

        // ATIVA A EXPLOSÃO
        if(formaAlvo) formaAlvo.classList.add('animar-explosao');
        if(elementoCorreto) elementoCorreto.classList.add('animar-explosao');

        // GERA NOVA PARTIDA MAIS RÁPIDO (1.5 segundos é o ideal)
        setTimeout(() => {
            if(formaAlvo) formaAlvo.classList.remove('animar-explosao');
            carregarJogoFormas(); 
        }, 4500);

    } else {
        falar("Esse é o " + nomeSelecionado + ". Tente encontrar o " + formaCorreta.nome);
        
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
            document.getElementById('calm-message').textContent = "Concluído! 🌟";
            createStarsEffect();
        }
    }, 50);
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
        msg.rate = 0.9;
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
/*function verificarSobreposicao() {
    // 1. Criar um canvas temporário para desenhar a letra "gabarito"
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tCtx = tempCanvas.getContext('2d');

    // 2. Desenhar a letra exatamente como ela aparece no fundo do jogo
    tCtx.font = "bold 220px Segoe UI";
    tCtx.textAlign = "center";
    tCtx.textBaseline = "middle";
    tCtx.fillText(itemAtual, tempCanvas.width / 2, tempCanvas.height / 2);

    // 3. Pegar os dados de pixels (Gabarito vs Desenho da Criança)
    const gabaritoData = tCtx.getImageData(0, 0, canvas.width, canvas.height).data;
    const desenhoData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let pontosCorretos = 0;
    let pontosErrados = 0;

    // 4. Comparar pixel por pixel
    for (let i = 3; i < gabaritoData.length; i += 4) {
        const pixelNoGabarito = gabaritoData[i] > 0;
        const pixelNoDesenho = desenhoData[i] > 0;

        if (pixelNoGabarito && pixelNoDesenho) {
            pontosCorretos++; // Criança pintou onde devia
        } else if (!pixelNoGabarito && pixelNoDesenho) {
            pontosErrados++; // Criança pintou fora da letra
        }
    }

    // 5. Lógica de decisão:
    // A criança precisa ter coberto pelo menos 30% da letra
    // E não pode ter rabiscado demais fora dela (limite de "sujeira")
    const metaAtingida = pontosCorretos > 1500; 
    const muitoErro = pontosErrados > (pontosCorretos * 1.5); // Se rabiscar a tela toda, falha

    if (metaAtingida && !muitoErro) {
        return true;
    }
    return false;
}
*/

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
        stars += 1;
        starCountDisplay.textContent = stars;
        
        // Mensagem mais carinhosa e clara
        mostrarMensagemPopUp("Você conseguiu! 🌟");
        falar("Que desenho lindo! Você conseguiu! Parabéns!");
        
        createStarsEffect();
        setTimeout(clearCanvas, 1200);
    } else {
        // Em vez de "Erro", usamos um incentivo para continuar
        falar("Quase lá! Vamos passar o pincel por cima da letra cinza?");
        mostrarMensagemPopUp("Continue pintando a letrinha! ✍️✨");
    }
}

// --- LOGICA DE NAVEGAÇÃO ---
/*function switchTab(tab) {
    // 1. Esconder todos os painéis
    document.querySelectorAll('.tab-content').forEach(panel => {
        panel.classList.add('hidden');
    });

    // 2. Remover a classe 'active' de TODOS os botões do menu
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.querySelectorAll('.tab-content').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));


    // 3. Mostrar o painel correto e ativar o botão correspondente
    if (tab === 'jornada') {
        document.getElementById('jornada-panel').classList.remove('hidden');
        document.getElementById('btn-jornada').classList.add('active');
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

    if (tab === 'cores') {
        document.getElementById('cores-panel').classList.remove('hidden');
        document.getElementById('btn-cores').classList.add('active');
        carregarCores();
        falar("Vamos aprender as cores! Qual cor você quer ver agora?");
    }
}
*/

function switchTab(tab) {
    // 1. Esconder todos os painéis e remover estados ativos
    document.querySelectorAll('.tab-content').forEach(panel => panel.classList.add('hidden'));
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));

    // 2. Lógica para cada aba
    if (tab === 'jornada') {
        document.getElementById('jornada-panel').classList.remove('hidden');
        document.getElementById('btn-jornada').classList.add('active');
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
        document.getElementById('cores-panel').classList.remove('hidden');
        // Certifique-se de que o ID do botão no HTML seja 'btn-cores'
        if(document.getElementById('btn-cores')) document.getElementById('btn-cores').classList.add('active');
        carregarCores();
        falar("Vamos aprender as cores!");
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
    greenZone.style.width = "0%"; yellowZone.style.width = "0%"; redZone.style.width = "0%";
    let text = "";
    if (energyLevel >= 4) { greenZone.style.width = "100%"; text = "Calmo"; }
    else if (energyLevel === 3) { yellowZone.style.width = "50%"; greenZone.style.width = "50%"; text = "Alerta"; }
    else if (energyLevel === 2) { yellowZone.style.width = "100%"; text = "Ansioso"; }
    else if (energyLevel === 1) { redZone.style.width = "50%"; yellowZone.style.width = "50%"; text = "Quase perdendo a calma!"; }
    else { redZone.style.width = "100%"; text = "Sobrecarregado!"; perigoRed = true; }
    energyMeterText.textContent = `Nível: ${text}`;
}

function renderScenario() {
    const scenario = scenarios[currentScenarioIndex];
    currentScenarioDisplay.textContent = scenario.name;
    scenarioDescription.textContent = scenario.description;
    falar(scenario.name + ". " + scenario.description);

    energyLevel = Math.max(0, energyLevel - scenario.sensoryImpact);
    updateEnergyMeter();

    cardOptionsDiv.innerHTML = '';
    // Remove a classe de escolha feita ao carregar novo cenário
    cardOptionsDiv.classList.remove('choice-made');

    scenario.cards.forEach(card => {
        const cardBtn = document.createElement('div');
        cardBtn.className = 'card';
        cardBtn.innerHTML = `
            <img src="${card.img}" alt="${card.text}" onerror="this.src='https://via.placeholder.com/50?text=Icone'">
            <span>${card.text}</span>
        `;
        
        cardBtn.onclick = function() {
            // Se já escolheu, não faz nada (evita múltiplos cliques)
            if (cardOptionsDiv.classList.contains('choice-made')) return;

            // 1. Marca visualmente o card escolhido
            cardOptionsDiv.classList.add('choice-made');
            cardBtn.classList.add('selected');

            // 2. Lógica de energia e estrelas
            energyLevel = Math.min(4, energyLevel + card.impact);
            falar("Que boa ideia! " + card.text + " vai te ajudar.");
            
            stars++;
            starCountDisplay.textContent = stars;
            
            mostrarMensagemPopUp("Coração calmo... +1 Estrela! ✨");
            createStarsEffect();
            updateEnergyMeter();
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
    messageArea.textContent = texto;
    messageArea.style.display = "block";
    setTimeout(() => { messageArea.style.display = "none"; }, 3000);
}

function createStarsEffect() {
    for (let i = 0; i < 10; i++) {
        const star = document.createElement('div');
        star.className = 'star-animation';
        star.innerHTML = '⭐';
        star.style.left = Math.random() * 100 + 'vw';
        star.style.top = '80vh';
        // celebrationOverlay.appendChild(star);
        setTimeout(() => star.remove(), 1000);
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
        div.onclick = () => processarCliqueCor(cor.nome);
        grid.appendChild(div);
    });
}

function processarCliqueCor(nomeCor) {
    if (!modoDesafio) {
        // Modo Aprendizado
        falar(nomeCor);
        mostrarMensagemPopUp(`Essa é a cor ${nomeCor}!`);
        
        // Após 2 segundos de aprendizado, inicia um desafio
        setTimeout(iniciarDesafioCor, 2000);
    } else {
        // Modo Desafio
        if (nomeCor === corAlvo) {
            stars++;
            document.getElementById('star-count-cores').textContent = stars;
            falar("Parabéns! Você encontrou o " + nomeCor + "!");
            mostrarMensagemPopUp("Isso mesmo! 🌟");
            createStarsEffect();
            modoDesafio = false;
            document.getElementById('instrucao-cores').textContent = "Toque nas cores para aprender!";
            document.getElementById('pergunta-cores').textContent = "Qual cor você quer ver agora?";
            
        } else {
            falar("Esse é o " + nomeCor + ". Onde está o " + corAlvo + "?");
        }
    }
}

function iniciarDesafioCor() {
    modoDesafio = true;
    const sorteio = coresData[Math.floor(Math.random() * coresData.length)];
    corAlvo = sorteio.nome;
    
    document.getElementById('instrucao-cores').textContent = "Vamos brincar?";
    document.getElementById('pergunta-cores').textContent = `Onde está a cor ${corAlvo}?`;
    falar("Agora, onde está a cor " + corAlvo + "?");
}

nextScenarioBtn.onclick = () => {
    currentScenarioIndex = (currentScenarioIndex + 1) % scenarios.length;
    renderScenario();
};

window.onload = () => {
    carregarAprendizado();
    switchTab('jornada');
};
