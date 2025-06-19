let estadoDoJogo = 'introducao'; // Estados: 'introducao', 'jogando'
let sementeSelecionada = null; // Semente atual que o jogador escolheu
let parcelas = []; // Array para armazenar as parcelas de terra e suas plantas

// --- CONFIGURAÇÕES DO JOGO ---
const TEMPO_CRESCIMENTO = 6000; // Tempo em milissegundos para a planta amadurecer (6 segundos)
const NUM_PARCELAS = 5; // Quantidade de parcelas de terra para plantar (mais uma!)

// --- Variáveis para o Personagem Guia ---
let guiaMensagem = "Olá, bem-vindo(a) ao Agrinho! Plante para conectar o campo e a cidade.";
let guiaTempoMensagem = 0;
const GUIA_DURACAO_MENSAGEM = 5000; // Duração da mensagem do guia em ms

// --- Variáveis da Cidade ---
let abastecimentoCidade = 0; // Nível de abastecimento da cidade (0 a 100)
const MAX_ABASTECIMENTO_CIDADE = 100;
const PONTOS_POR_COLHEITA = 10; // Pontos de abastecimento por colheita

// Definição dos tipos de plantas e seus emojis/textos nos diferentes estágios
const tiposDePlantas = {
  'trigo': {
    semente: '🌾',
    jovem: '🌱',
    madura: '🍞', // Pão
    info: "O trigo vira farinha para pães e massas, um alimento básico na cidade!"
  },
  'batata': {
    semente: '🥔',
    jovem: '🌿',
    madura: '🍟', // Batata frita
    info: "A batata é versátil e nutritiva, fundamental para a alimentação urbana!"
  },
  'milho': {
    semente: '🌽',
    jovem: '🪴',
    madura: '🍿', // Pipoca
    info: "Do milho fazemos farinha, pipoca, ração para animais e até combustível!"
  },
  'cenoura': {
    semente: '🥕',
    jovem: '🌱',
    madura: '🥕', // Cenoura (mantém o emoji)
    info: "Rica em vitaminas, a cenoura vai para saladas, sucos e pratos saudáveis na cidade!"
  },
  'tomate': {
    semente: '🍅',
    jovem: '🌿',
    madura: '🥫', // Lata de molho
    info: "O tomate é base para molhos, saladas e pizzas, indispensável na cozinha da cidade!"
  }
};

// --- PRELOAD: Não precisamos carregar imagens nesta versão ---
function preload() {
  // Nada para carregar aqui.
}

// --- SETUP: Configurações iniciais do canvas e elementos do jogo ---
function setup() {
  createCanvas(800, 600);

  // Configurações de texto padrão para emojis
  textAlign(CENTER, CENTER);

  // Inicializa as parcelas de terra
  let parcelaLargura = 100; // Um pouco menor para caber mais
  let parcelaAltura = 100;
  let inicioX = 20; // Posição X inicial para a primeira parcela
  let inicioY = height / 2 - parcelaAltura; // Posição Y centralizada para as parcelas

  for (let i = 0; i < NUM_PARCELAS; i++) {
    let x = inicioX + (i * (parcelaLargura + 15)); // Espaçamento menor
    parcelas.push({
      id: i,
      x: x,
      y: inicioY,
      w: parcelaLargura,
      h: parcelaAltura,
      planta: null,
      estagio: 0,
      tempoPlantio: 0
    });
  }

  setGuiaMensagem(guiaMensagem); // Mensagem inicial do guia
}

// --- DRAW: O loop principal do jogo, executado continuamente ---
function draw() {
  background(220);

  if (estadoDoJogo === 'introducao') {
    desenhaIntroducao();
  } else if (estadoDoJogo === 'jogando') {
    desenhaCenario();
    desenhaParcelas();
    desenhaUI();
    atualizaPlantas();
    desenhaGuia();
    desenhaAbastecimentoCidade();

    // --- Seu nome no canto inferior direito, agora em azul! ---
    fill(0, 0, 255); // Cor do texto (azul RGB)
    textSize(10); // Tamanho da fonte bem pequeno
    textAlign(RIGHT, BOTTOM); // Alinha o texto à direita e na parte inferior
    text('@cassiocamposkloster', width - 5, height - 5); // Posição: 5 pixels da direita e 5 pixels da parte inferior
    // --- Fim da alteração ---
  }
}

// --- Funções de Desenho ---

function desenhaIntroducao() {
  fill(0);
  textSize(36);
  textAlign(CENTER, CENTER);
  text("Projeto Agrinho: Campo e Cidade", width / 2, height / 3);

  textSize(20);
  text("Plante alimentos, colha e veja o que eles viram!", width / 2, height / 2.2);
  text("Controles: Teclas 1-5 para selecionar alimentos, clique para plantar/colher.", width / 2, height / 1.8);
  text("Pressione 'R' para resetar as parcelas. Clique em qualquer lugar para começar!", width / 2, height / 1.5);
}

function desenhaCenario() {
  // Desenha o campo na metade esquerda da tela
  fill(144, 238, 144); // Verde claro (campo)
  rect(0, 0, width / 2, height);
  // Desenha a cidade na metade direita da tela
  fill(150); // Cinza (cidade)
  rect(width / 2, 0, width / 2, height);

  // Linha divisória
  stroke(100);
  strokeWeight(2);
  line(width / 2, 0, width / 2, height);

  // --- Elementos da Cidade (Emojis e Formas) ---
  // Prédio maior
  fill(90);
  rect(width * 0.65, height * 0.45, 120, 200); // Prédio 1
  rect(width * 0.68, height * 0.5, 20, 30);
  fill(200);
  rect(width * 0.72, height * 0.5, 20, 30); // Janelas
  rect(width * 0.76, height * 0.5, 20, 30);
  rect(width * 0.68, height * 0.55, 20, 30);
  fill(200);
  rect(width * 0.72, height * 0.55, 20, 30); // Janelas
  rect(width * 0.76, height * 0.55, 20, 30);

  // Prédio menor
  fill(120);
  rect(width * 0.85, height * 0.6, 80, 150); // Prédio 2
  fill(200);
  rect(width * 0.87, height * 0.65, 15, 25);
  rect(width * 0.90, height * 0.65, 15, 25);

  // Mercado / Restaurante - Principal ponto de interação
  fill(200, 100, 0); // Laranja avermelhado
  rect(width * 0.75 - 70, height * 0.75, 140, 50); // Base do mercado
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("MERCADO", width * 0.75, height * 0.77);

  // --- Elementos do Campo (Emojis e Formas) ---
  // Fazenda simples
  fill(139, 69, 19); // Marrom terra
  rect(50, height * 0.8, width / 2 - 100, 50); // Base da fazenda
  fill(200, 0, 0); // Vermelho telhado
  triangle(100, height * 0.7, 150, height * 0.6, 200, height * 0.7); // Telhado
  fill(255); // Branco parede
  rect(120, height * 0.7, 60, 80); // Parede
  fill(0); // Preto porta
  rect(140, height * 0.75, 20, 30); // Porta

  // Nuvem e Sol (emojis)
  textSize(40);
  text('☀️', width * 0.35, 50); // Sol no campo
  text('☁️', width * 0.15, 70); // Nuvem no campo
}

function desenhaParcelas() {
  for (let parcela of parcelas) {
    fill(139, 69, 19); // Cor de terra
    stroke(100);
    strokeWeight(2);
    rect(parcela.x, parcela.y, parcela.w, parcela.h, 5);

    if (parcela.planta) {
      let emojiPlanta = '';
      if (parcela.estagio === 1) {
        emojiPlanta = tiposDePlantas[parcela.planta].jovem;
      } else if (parcela.estagio === 2) {
        emojiPlanta = tiposDePlantas[parcela.planta].madura;
      }

      fill(0);
      textSize(parcela.w * 0.7); // Tamanho do emoji na parcela
      text(emojiPlanta, parcela.x + parcela.w / 2, parcela.y + parcela.h / 2);
    }
  }
}

function desenhaUI() {
  // Painel de seleção de sementes
  fill(50, 50, 50, 180);
  noStroke();
  rect(10, height - 90, 420, 80, 10); // Painel maior

  // Desenha botões/ícones para seleção de sementes (emojis)
  let btnX = 20;
  desenhaBotaoSemente(1, 'trigo', tiposDePlantas.trigo.semente, btnX, height - 75);
  btnX += 90;
  desenhaBotaoSemente(2, 'batata', tiposDePlantas.batata.semente, btnX, height - 75);
  btnX += 90;
  desenhaBotaoSemente(3, 'milho', tiposDePlantas.milho.semente, btnX, height - 75);
  btnX += 90;
  desenhaBotaoSemente(4, 'cenoura', tiposDePlantas.cenoura.semente, btnX, height - 75);
  btnX += 90;
  desenhaBotaoSemente(5, 'tomate', tiposDePlantas.tomate.semente, btnX, height - 75);


  // Indica a semente selecionada
  fill(255);
  textSize(14);
  textAlign(LEFT, CENTER);
  text(`Semente: ${sementeSelecionada ? sementeSelecionada.charAt(0).toUpperCase() + sementeSelecionada.slice(1) : 'Nenhuma'}`, 10, height - 100);

  // Destaca a semente selecionada
  stroke(255, 255, 0); // Amarelo
  strokeWeight(3);
  noFill();
  if (sementeSelecionada === 'trigo') {
    rect(20, height - 75, 60, 60, 5);
  } else if (sementeSelecionada === 'batata') {
    rect(110, height - 75, 60, 60, 5);
  } else if (sementeSelecionada === 'milho') {
    rect(200, height - 75, 60, 60, 5);
  } else if (sementeSelecionada === 'cenoura') {
    rect(290, height - 75, 60, 60, 5);
  } else if (sementeSelecionada === 'tomate') {
    rect(380, height - 75, 60, 60, 5);
  }
}

function desenhaBotaoSemente(tecla, nomeSemente, emojiSemente, x, y) {
  fill(70, 70, 70);
  stroke(90);
  strokeWeight(1);
  rect(x, y, 60, 60, 5);

  fill(255);
  textSize(40);
  textAlign(CENTER, CENTER);
  text(emojiSemente, x + 30, y + 30);

  fill(255);
  textSize(12);
  textAlign(CENTER, TOP);
  text(`${tecla}`, x + 30, y + 65);
}

function desenhaGuia() {
  if (millis() - guiaTempoMensagem < GUIA_DURACAO_MENSAGEM) {
    // Desenha o balão de fala
    fill(255, 255, 200); // Amarelo claro
    stroke(0);
    strokeWeight(1);
    rect(width * 0.7 - 120, height * 0.05, 240, 70, 10); // Balão de fala
    triangle(width * 0.7, height * 0.05 + 70, width * 0.7 + 10, height * 0.05 + 70, width * 0.7 + 20, height * 0.05 + 85); // Ponta do balão

    fill(0);
    textSize(14);
    textAlign(CENTER, CENTER);
    textWrap(WORD);
    text(guiaMensagem, width * 0.7 - 110, height * 0.05 + 10, 220, 60);

    // Desenha o personagem guia (emoji)
    textSize(60);
    text('🧑‍🌾', width * 0.7, height * 0.15 + 80); // Posição do guia
  }
}

function setGuiaMensagem(mensagem) {
  guiaMensagem = mensagem;
  guiaTempoMensagem = millis();
}

function desenhaAbastecimentoCidade() {
  // Barra de progresso do abastecimento da cidade
  fill(50, 50, 50, 180);
  noStroke();
  rect(width / 2 + 20, height - 90, width / 2 - 40, 40, 10);

  fill(0, 200, 0); // Verde para a barra
  let barraLargura = map(abastecimentoCidade, 0, MAX_ABASTECIMENTO_CIDADE, 0, width / 2 - 50);
  rect(width / 2 + 25, height - 85, barraLargura, 30, 8);

  fill(255);
  textSize(14);
  textAlign(LEFT, CENTER);
  text(`Abastecimento da Cidade: ${floor(abastecimentoCidade)}%`, width / 2 + 25, height - 100);

  // Emojis de reação da cidade/mercado
  textSize(40);
  if (abastecimentoCidade < 20) {
    text('😟', width * 0.75 + 100, height * 0.75 + 25); // Cara preocupada
  } else if (abastecimentoCidade < 70) {
    text('😊', width * 0.75 + 100, height * 0.75 + 25); // Cara feliz
  } else {
    text('🥳', width * 0.75 + 100, height * 0.75 + 25); // Cara festejando
  }
}


// --- Funções de Interação ---

function mousePressed() {
  if (estadoDoJogo === 'introducao') {
    estadoDoJogo = 'jogando';
    setGuiaMensagem("Agora, escolha uma semente e clique em uma parcela vazia para plantar!");
    return;
  }

  if (estadoDoJogo === 'jogando') {
    for (let parcela of parcelas) {
      if (mouseX > parcela.x && mouseX < parcela.x + parcela.w &&
        mouseY > parcela.y && mouseY < parcela.y + parcela.h) {

        if (sementeSelecionada && !parcela.planta) {
          parcela.planta = sementeSelecionada;
          parcela.estagio = 1;
          parcela.tempoPlantio = millis();
          setGuiaMensagem(`Você plantou ${sementeSelecionada}! Agora espere ele crescer.`);
          sementeSelecionada = null;
        } else if (parcela.planta && parcela.estagio === 2) {
          colherPlanta(parcela);
        }
        break;
      }
    }
  }
}

function keyPressed() {
  if (estadoDoJogo === 'jogando') {
    if (key === '1') {
      sementeSelecionada = 'trigo';
      setGuiaMensagem("Semente de trigo selecionada. O trigo nos dá pão e massas!");
    } else if (key === '2') {
      sementeSelecionada = 'batata';
      setGuiaMensagem("Semente de batata selecionada. Ótima para purê e batata frita!");
    } else if (key === '3') {
      sementeSelecionada = 'milho';
      setGuiaMensagem("Semente de milho selecionada. Milho vira pipoca e muito mais!");
    } else if (key === '4') {
      sementeSelecionada = 'cenoura';
      setGuiaMensagem("Semente de cenoura selecionada. Boa para a vista e sucos!");
    } else if (key === '5') {
      sementeSelecionada = 'tomate';
      setGuiaMensagem("Semente de tomate selecionada. Base para molhos e saladas!");
    }

    if (key === 'r' || key === 'R') {
      for (let parcela of parcelas) {
        parcela.planta = null;
        parcela.estagio = 0;
        parcela.tempoPlantio = 0;
      }
      sementeSelecionada = null;
      abastecimentoCidade = 0; // Reseta o abastecimento também
      setGuiaMensagem("As parcelas foram resetadas. Vamos começar de novo!");
    }
  }
}

// --- Funções de Lógica do Jogo ---

function atualizaPlantas() {
  for (let parcela of parcelas) {
    if (parcela.planta && parcela.estagio === 1) {
      if (millis() - parcela.tempoPlantio > TEMPO_CRESCIMENTO) {
        parcela.estagio = 2; // A planta amadureceu
        setGuiaMensagem(`Seu ${parcela.planta} amadureceu! Clique nele para colher.`);
      }
    }
  }
}

function colherPlanta(parcela) {
  let infoPlanta = tiposDePlantas[parcela.planta].info;
  setGuiaMensagem(`Você colheu ${parcela.planta}! ${infoPlanta}`);

  // Aumenta o abastecimento da cidade
  abastecimentoCidade += PONTOS_POR_COLHEITA;
  if (abastecimentoCidade > MAX_ABASTECIMENTO_CIDADE) {
    abastecimentoCidade = MAX_ABASTECIMENTO_CIDADE;
    setGuiaMensagem("A cidade está muito bem abastecida! Parabéns pelo seu trabalho no campo!");
  }

  parcela.planta = null;
  parcela.estagio = 0;
  parcela.tempoPlantio = 0;
}