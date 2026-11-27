/**
 * Modelo "Luzinete Terapeuta": textos, contatos e regras da agenda.
 * Tudo o que a terapeuta precisa informar fica neste arquivo. Campo vazio aparece no site como "a confirmar".
 */

export const SITE = {
  basePath: "/templates/luzinete-terapeuta",
  name: "Luzinete Nascimento",
  role: "Terapeuta TRG",
  images: "/images/templates/luz-nascimento",
  /** `true` enquanto o site é uma prévia: avisa que os horários são de exemplo. */
  demo: true,
  year: 2026,
  /** Dados a confirmar com a terapeuta. WhatsApp com DDI e DDD, só números (ex.: 5511987654321). */
  contact: {
    whatsapp: "",
    whatsappLabel: "",
    email: "",
    instagram: "",
    address: "",
  },
  /** Formação, certificação em TRG e tempo de atuação. */
  credentials: "",
  /** Prazo mínimo para remarcar ou cancelar (ex.: "24 horas"). */
  cancelNotice: "",
  /** Formas de pagamento (ex.: "Pix, cartão e transferência"). */
  payment: "",
  /** Dias que o agendamento fica guardado depois da data da sessão. */
  retentionDays: 180,
};

export const sectionPath = (id: string) => `${SITE.basePath}#${id}`;
export const privacyPath = `${SITE.basePath}/privacidade`;
export const painelPath = `${SITE.basePath}/painel`;

/** Sem número configurado, o WhatsApp abre para a pessoa escolher o contato. */
export const whatsappUrl = (message: string) =>
  `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(message)}`;

export const greetingUrl = whatsappUrl("Olá, Luzinete! Vim pelo site e gostaria de tirar uma dúvida.");

export const MENU = [
  ["inicio", "Início"],
  ["trg", "A TRG"],
  ["como-funciona", "Como funciona"],
  ["sobre", "Sobre"],
  ["atendimento", "Atendimento"],
  ["faq", "Dúvidas"],
] as const;

export type Mode = "presencial" | "online";

export const MODE_LABEL: Record<Mode, string> = { presencial: "Presencial", online: "Online" };

export const AGENDA = {
  durationMin: 60,
  gapMin: 15,
  noticeHours: 12,
  windowDays: 30,
  /** Horário de Brasília, sem horário de verão. */
  utcOffset: "-03:00",
};

type Window = { weekdays: number[]; start: string; end: string; modes: Mode[] };

/** Grade semanal (0 = domingo). HORÁRIOS DE EXEMPLO: trocar pela grade real da terapeuta. */
export const WEEKLY: Window[] = [
  { weekdays: [1, 2, 3, 4, 5], start: "09:00", end: "11:15", modes: ["presencial", "online"] },
  { weekdays: [1, 2, 3, 4, 5], start: "14:00", end: "17:30", modes: ["presencial", "online"] },
  { weekdays: [2, 4], start: "19:00", end: "20:00", modes: ["online"] },
  { weekdays: [6], start: "09:00", end: "11:15", modes: ["presencial"] },
];

/** Feriados, férias e compromissos. Sem `start` e `end`, o dia inteiro fica bloqueado. */
export const BLOCKS: { date: string; start?: string; end?: string; reason: string }[] = [
  { date: "2026-12-25", reason: "Natal" },
  { date: "2027-01-01", reason: "Confraternização Universal" },
];

export const PAINS = [
  "Ansiedade e estresse constantes",
  "Crises de pânico",
  "Traumas e bloqueios emocionais",
  "Luto que não passa",
  "Sintomas depressivos e dores que o corpo sente",
  "Fobias e padrões que se repetem",
];

export const PILLARS = [
  {
    title: "Estrutura guiada",
    text: "As sessões seguem um passo a passo claro, sem depender de longas interpretações.",
  },
  {
    title: "Sigilo preservado",
    text: "Você não precisa contar todos os detalhes do que viveu para reprocessar uma memória.",
  },
  {
    title: "Progresso medido",
    text: "Escalas de desconforto mostram, sessão a sessão, como você está evoluindo.",
  },
];

export const STEPS = [
  { title: "Cronológico", text: "Revisitamos as fases da sua vida." },
  { title: "Psicossomático", text: "Cuidamos das reações que o corpo guarda." },
  { title: "Temático", text: "Trabalhamos padrões ou episódios específicos." },
  { title: "Futuro", text: "Aliviamos medos antecipatórios." },
  { title: "Potencialização", text: "Fortalecemos seus recursos e sua autoconfiança." },
];

/** `pending`: resposta que ainda depende de um dado da terapeuta (fica fora dos dados estruturados). */
export const FAQ: { question: string; answer: string; pending?: boolean }[] = [
  {
    question: "Preciso contar tudo o que aconteceu comigo?",
    answer: "Não. A TRG permite reprocessar memórias sem exigir que você conte todos os detalhes.",
  },
  {
    question: "Quantas sessões são necessárias?",
    answer:
      "A TRG é uma terapia breve, mas o número de sessões varia de pessoa para pessoa. Conversamos sobre isso na primeira sessão.",
  },
  {
    question: "O atendimento online funciona igual ao presencial?",
    answer: "Sim, o método é o mesmo. Você só precisa de um lugar reservado e boa conexão.",
  },
  {
    question: "A TRG substitui acompanhamento médico ou psiquiátrico?",
    answer: "Não. Ela pode caminhar junto com outros tratamentos; não interrompa medicações sem orientação médica.",
  },
  {
    question: "Como remarcar ou cancelar?",
    answer: SITE.cancelNotice
      ? `Pelo WhatsApp, com pelo menos ${SITE.cancelNotice} de antecedência.`
      : "Pelo WhatsApp, o quanto antes. O prazo mínimo será informado na confirmação.",
    pending: !SITE.cancelNotice,
  },
  {
    question: "Quais são as formas de pagamento?",
    answer: SITE.payment ? `${SITE.payment}.` : "As formas de pagamento serão informadas na confirmação.",
    pending: !SITE.payment,
  },
];
