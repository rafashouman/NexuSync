export interface TourStep {
  target: string;
  title: string;
  text: string;
  click?: boolean;
}

const delivery: TourStep[] = [
  { target: "product", title: "Abra um produto", text: "Toque em Pedir Agora para ver as opções deste item.", click: true },
  { target: "add", title: "Monte seu pedido", text: "Escolha os adicionais e a quantidade. Depois, toque no botão destacado para colocar o item na sacola.", click: true },
  { target: "bag", title: "Confira a sacola", text: "Toque na sacola para conferir os itens e o total antes de finalizar.", click: true },
];

export const tours = {
  chronos: [
    { target: "service", title: "Escolha um serviço", text: "Toque em um cartão para selecionar o atendimento. Confira o preço e a duração antes de marcar." },
    { target: "date", title: "Encontre um horário", text: "Toque na data e escolha um dos horários disponíveis. Informe seu nome e confirme o horário." },
    { target: "dashboard", title: "Veja a agenda da equipe", text: "Toque em Ver agenda do salão para consultar os horários livres e reservados." },
  ],
  pulsemetrics: [
    { target: "period", title: "Escolha o período", text: "Toque em 7D para ver os últimos sete dias. Os indicadores acompanham sua escolha." },
    { target: "chart", title: "Compare as barras", text: "As barras mostram o tráfego e as conversões de cada período. No computador, passe o ponteiro para ver os valores." },
    { target: "lead", title: "Experimente um evento", text: "Toque em Disparar Lead para registrar um contato e veja a nova linha no histórico." },
  ],
  pulsespin: [
    { target: "prizes", title: "Conheça os prêmios", text: "Veja o que pode sair no sorteio e a chance de ganhar cada recompensa." },
    { target: "spin", title: "Gire a roleta", text: "Toque no botão destacado e aguarde a roleta parar.", click: true },
    { target: "coupon", title: "Guarde seu cupom", text: "Toque em Copiar para usar o código do prêmio.", click: true },
  ],
  memory: [
    { target: "card", title: "Vire uma carta", text: "Toque na carta destacada e depois em outra. Se os símbolos forem iguais, o par fica aberto." },
    { target: "score", title: "Acompanhe a partida", text: "Veja aqui seu tempo e quantas tentativas já fez. Continue até encontrar todos os pares." },
  ],
  "images-blend": [
    { target: "preset", title: "Experimente uma combinação", text: "Toque em um dos estilos prontos para mudar a composição." },
    { target: "opacity", title: "Ajuste a mistura", text: "Arraste este controle e observe como a imagem de cima fica mais forte ou mais transparente." },
    { target: "css", title: "Leve o resultado", text: "Toque em Copiar CSS para guardar o código dessa combinação." },
  ],
  arknoid: [
    { target: "pad", title: "Conheça o controle", text: "Arraste o dedo nesta faixa para mover a barra. No computador, você também pode usar as setas." },
    { target: "start", title: "Comece a partida", text: "Toque em Iniciar Experimento e rebata a bola para quebrar os blocos." },
  ],
  voxelvaders: [
    { target: "auto", title: "Escolha como atirar", text: "Ative Auto-Fire para a nave disparar sozinha enquanto você desvia." },
    { target: "intercept", title: "Pilote sua nave", text: "Toque em Iniciar Interceptação. Use as setas ou os controles abaixo da tela para mover a nave." },
  ],
  "pulse-arkanoid": [
    { target: "left", title: "Mova a plataforma", text: "Use as setas ao lado da faixa de toque ou arraste o dedo pela faixa." },
    { target: "launch", title: "Lance a bola", text: "Toque no botão destacado e posicione a plataforma onde a bola vai cair." },
  ],
  "cyber-tarot": [
    { target: "tarot-card", title: "Escolha suas cartas", text: "Toque no nome de uma carta para colocá-la na mesa. Toque novamente para retirar." },
    { target: "spread", title: "Confira a combinação", text: "Com suas cartas na mesa, toque em Resolver tiragem para calcular os pontos." },
  ],
  arcade: [
    { target: "cartridges", title: "Escolha um cartucho", text: "Toque no nome de um jogo. Ele será carregado na tela do gabinete logo abaixo." },
    { target: "crt", title: "Ajuste a imagem", text: "Toque em CRT para ligar ou desligar o efeito de linhas na tela do jogo." },
    { target: "sound", title: "Controle o som", text: "Toque em Áudio para ligar ou silenciar o gabinete." },
  ],
  cardapio: delivery,
  "dog-e-acai": delivery,
} satisfies Record<string, TourStep[]>;
