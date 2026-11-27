# Documento de Desenvolvimento — Template Luzinete Terapeuta (TRG)

Nov 26, 2026 · @Rafael

## 1. Visão geral

Template de site de página única (one-page) para a **Luzinete Terapeuta**, especializada em **TRG — Terapia de Reprocessamento Generativo**, com agendamento online e aviso automático à terapeuta pelo WhatsApp.

| Item | Definição |
| --- | --- |
| Objetivo principal | Converter visitantes em sessões agendadas |
| Objetivo secundário | Explicar a TRG de forma simples e gerar confiança |
| Público | Adultos com ansiedade, pânico, luto, traumas, fobias ou padrões repetitivos |
| Modalidades | Presencial (consultório próprio) e Online |
| Tom de voz | Acolhedor, calmo, firme e esperançoso |
| Valores da marca | Acolhimento, autoconfiança, perdão como alívio do peso da alma |
| Ação principal (CTA) | "Agendar minha sessão" |

**Princípios de tom de voz**

- Fala na segunda pessoa ("você"), com frases curtas e sem jargão clínico.
- Reconhece a dor antes de oferecer a solução.
- Transmite urgência gentil: "Quem tem dor tem pressa."
- Transmite esperança: "No fundo do poço existe uma mola."
- Não promete cura nem resultado garantido.

## 2. Identidade visual

A paleta parte de três cores-base (verde erva-doce, marrom claro, bege claro) e ganha dois tons escuros derivados para garantir contraste de leitura (WCAG AA, mínimo 4,5:1 em texto).

### Paleta

| Token | Nome | Hex | Uso |
| --- | --- | --- | --- |
| `--erva-doce` | Verde erva-doce | `#B5C69A` | Fundos de destaque, ícones, ilustrações, horários disponíveis |
| `--erva-doce-claro` | Erva-doce névoa | `#E4EBD6` | Fundos de seção alternados, cards |
| `--erva-doce-escuro` | Verde folha | `#5E7548` | Botões primários, links, horário selecionado |
| `--marrom-claro` | Marrom claro | `#A9805F` | Detalhes, divisores, botão secundário, frases de destaque |
| `--marrom-escuro` | Marrom raíz | `#4A382B` | Texto principal e títulos |
| `--bege-claro` | Bege claro | `#F6EFE4` | Fundo geral da página |
| `--branco-quente` | Branco quente | `#FFFDF9` | Cards, formulário, modal de agendamento |

Regras de contraste:

- Texto sobre `--bege-claro` usa sempre `--marrom-escuro`.
- Botão primário: fundo `--erva-doce-escuro`, texto `--branco-quente`.
- `--erva-doce` e `--marrom-claro` não são usados como cor de texto corrido (contraste insuficiente sobre bege).

### Tipografia (Google Fonts)

| Papel | Fonte | Peso | Tamanho (desktop / mobile) |
| --- | --- | --- | --- |
| Títulos (H1–H2) | Cormorant Garamond | 500 / 600 | 56px / 36px (H1); 40px / 28px (H2) |
| Frases de destaque | Cormorant Garamond Itálico | 500 | 32px / 24px |
| Corpo e interface | Nunito Sans | 400 / 600 / 700 | 18px / 16px, altura de linha 1,7 |

A serifada elegante transmite cuidado e maturidade; a sans arredondada mantém a leitura leve e acolhedora.

### Elementos gráficos

- **Formas orgânicas:** blobs e ondas suaves como divisores de seção, nunca ângulos retos fortes.
- **Raio de borda:** 24px em cards, 999px (pílula) em botões e chips de horário.
- **Ícones:** linha fina (1,5px), estilo Lucide ou Phosphor Light, em `--erva-doce-escuro`.
- **Motivo visual:** ramos de erva-doce/folhas em traço, usados com discrição no hero e no rodapé.
- **Sombras:** suaves e quentes, `0 8px 30px rgba(74, 56, 43, 0.08)`.
- **Fotografia:** luz natural, tons quentes; consultório, plantas, mãos, xícara de chá. Retrato da Luzinete sorrindo, olhando para a câmera.
- **Animações:** fade-up de 400ms ao rolar; respeitar `prefers-reduced-motion`.

### Tokens CSS

```css
:root {
  --erva-doce: #B5C69A;
  --erva-doce-claro: #E4EBD6;
  --erva-doce-escuro: #5E7548;
  --marrom-claro: #A9805F;
  --marrom-escuro: #4A382B;
  --bege-claro: #F6EFE4;
  --branco-quente: #FFFDF9;

  --font-titulo: 'Cormorant Garamond', Georgia, serif;
  --font-corpo: 'Nunito Sans', system-ui, sans-serif;

  --raio-card: 24px;
  --raio-pilula: 999px;
  --sombra: 0 8px 30px rgba(74, 56, 43, 0.08);
  --container: 1140px;
}
```

## 3. Estrutura da página

One-page com 11 blocos na ordem abaixo; o menu rola até cada âncora e o botão "Agendar" fica fixo no topo e, no mobile, flutuante no rodapé da tela.

| # | Seção | Âncora | Fundo | Conteúdo-chave |
| --- | --- | --- | --- | --- |
| 1 | Header fixo | — | `--bege-claro` translúcido | Logo/nome, menu, botão "Agendar" |
| 2 | Hero | `#inicio` | `--bege-claro` + forma orgânica `--erva-doce` | Frase "Quem tem dor tem pressa", subtítulo, 2 CTAs, foto |
| 3 | Você se identifica? | `#dores` | `--branco-quente` | 6 cards com as indicações |
| 4 | O que é a TRG | `#trg` | `--erva-doce-claro` | Explicação curta + 3 pilares |
| 5 | Como funciona | `#como-funciona` | `--bege-claro` | 5 protocolos em linha do tempo |
| 6 | Sobre a Luzinete | `#sobre` | `--branco-quente` | Foto, história, crenças (autoconfiança, perdão) |
| 7 | Frase de impacto | — | `--marrom-escuro` (texto claro) | "No fundo do poço existe uma mola." |
| 8 | Atendimento | `#atendimento` | `--erva-doce-claro` | Cards Presencial e Online |
| 9 | Agendamento | `#agendar` | `--bege-claro` | Sistema de agendamento (seção 5 deste doc) |
| 10 | Perguntas frequentes | `#faq` | `--branco-quente` | Acordeão com 6 perguntas |
| 11 | Rodapé | — | `--marrom-escuro` | Contato, endereço, redes, aviso legal, LGPD |

**Menu:** Início · A TRG · Como funciona · Sobre · Atendimento · Dúvidas · \[Agendar\]

**Botão flutuante de WhatsApp:** canto inferior direito, abre conversa com a terapeuta para dúvidas (não substitui o agendamento).

## 4. Textos das seções

Copy pronta para inserir; trechos entre colchetes são dados que a terapeuta precisa fornecer.

### Hero

- **Sobretítulo:** Terapia de Reprocessamento Generativo (TRG)
- **Título (H1):** Quem tem dor tem pressa.
- **Subtítulo:** Uma terapia breve e acolhedora para aliviar ansiedade, traumas e dores emocionais na raiz — sem precisar contar tudo o que aconteceu.
- **CTA primário:** Agendar minha sessão
- **CTA secundário:** Conhecer a TRG
- **Selo:** Atendimento presencial e online

### Você se identifica?

- **Título:** Talvez você esteja carregando mais peso do que precisa
- **Cards:**
  - Ansiedade e estresse constantes
  - Crises de pânico
  - Traumas e bloqueios emocionais
  - Luto que não passa
  - Sintomas depressivos e dores que o corpo sente
  - Fobias e padrões que se repetem
- **Fechamento:** Você não precisa atravessar isso sozinho(a).

### O que é a TRG

- **Título:** O que é a Terapia de Reprocessamento Generativo
- **Texto:** A TRG é uma abordagem terapêutica breve, criada no Brasil por Jair Soares, que reprocessa memórias traumáticas, dores emocionais e padrões disfuncionais. Ela atua na raiz das emoções para promover alívio dos sintomas e fortalecimento emocional.
- **Pilar 1 — Estrutura guiada:** As sessões seguem um passo a passo claro, sem depender de longas interpretações.
- **Pilar 2 — Sigilo preservado:** Você não precisa contar todos os detalhes do que viveu para reprocessar uma memória.
- **Pilar 3 — Progresso medido:** Escalas de desconforto mostram, sessão a sessão, como você está evoluindo.

### Como funciona

- **Título:** Um caminho em etapas, no seu tempo
- **Linha do tempo:**
  1. **Cronológico** — revisitamos as fases da sua vida.
  2. **Psicossomático** — cuidamos das reações que o corpo guarda.
  3. **Temático** — trabalhamos padrões ou episódios específicos.
  4. **Futuro** — aliviamos medos antecipatórios.
  5. **Potencialização** — fortalecemos seus recursos e sua autoconfiança.

### Sobre a Luzinete

- **Título:** Prazer, eu sou a Luzinete
- **Texto:** Acredito que ninguém precisa carregar sozinho o peso do que viveu. No meu consultório, você encontra escuta, acolhimento e um método estruturado para transformar dor em força. \[Inserir formação, certificação em TRG e tempo de atuação.\]
- **Crença 1 — Autoconfiança:** Autoconfiança não é luxo: é fundamental e necessária para viver com leveza.
- **Crença 2 — Perdão:** O perdão — a si e ao outro — é um caminho para aliviar o peso da alma.
- **Assinatura:** Luzinete — Terapeuta TRG

### Frase de impacto

> No fundo do poço existe uma mola.

Linha de apoio: Toda queda pode virar impulso. Vamos dar o primeiro passo juntos?

### Atendimento

- **Presencial:** Em consultório próprio, um espaço tranquilo e reservado. \[Endereço, bairro, cidade.\]
- **Online:** Por videochamada, com o mesmo cuidado, de onde você estiver. Basta internet estável e um lugar reservado.
- **Duração da sessão:** \[ex.: 60 min\] · **Valor:** \[opcional exibir\]

### Agendamento

- **Título:** Escolha o melhor dia e horário para você
- **Subtítulo:** Em poucos passos sua sessão fica reservada e eu recebo o aviso na hora.
- **Sucesso:** Pronto! Sua sessão foi reservada para \[dia\] às \[hora\]. Em breve entrarei em contato pelo WhatsApp para confirmar os detalhes.

### Perguntas frequentes

1. **Preciso contar tudo o que aconteceu comigo?** Não. A TRG permite reprocessar memórias sem exigir que você conte todos os detalhes.
2. **Quantas sessões são necessárias?** A TRG é uma terapia breve, mas o número de sessões varia de pessoa para pessoa. Conversamos sobre isso na primeira sessão.
3. **O atendimento online funciona igual ao presencial?** Sim, o método é o mesmo. Você só precisa de um lugar reservado e boa conexão.
4. **A TRG substitui acompanhamento médico ou psiquiátrico?** Não. Ela pode caminhar junto com outros tratamentos; não interrompa medicações sem orientação médica.
5. **Como remarcar ou cancelar?** Pelo WhatsApp, com pelo menos \[24h\] de antecedência.
6. **Quais as formas de pagamento?** \[Pix, cartão, transferência.\]

### Rodapé

- Luzinete Terapeuta — Terapia de Reprocessamento Generativo
- &#91;WhatsApp\] · \[E-mail\] · \[Instagram\] · \[Endereço\]
- Aviso: Este site tem caráter informativo e não substitui atendimento médico ou psicológico de urgência. Em crise, ligue 188 (CVV) ou 192 (SAMU).
- Política de Privacidade · © \[ano\] Luzinete Terapeuta

## 5. Sistema de agendamento

O cliente escolhe modalidade, dia e horário livre, informa nome e WhatsApp e confirma; o sistema grava a reserva e a Luzinete recebe a mensagem no WhatsApp na hora.

&#91;embedded content: fluxo de agendamento · 4 etapas do cliente, 1 verificação, aviso no WhatsApp\]

Se duas pessoas tentarem o mesmo horário, só a primeira grava; a segunda vê o aviso e volta para os horários livres.

### Interface (componente de 4 passos)

1. **Modalidade:** dois cards selecionáveis — Presencial / Online.
2. **Dia:** calendário mensal. Dias com vaga em `--erva-doce`; sem vaga em cinza claro, desabilitados; dia selecionado em `--erva-doce-escuro`. Setas para o próximo mês, limitado à janela de 30 dias.
3. **Horário:** chips em formato pílula com os horários livres do dia (ex.: 09:00, 10:15, 14:00). Texto de apoio: "Horários de Brasília".
4. **Dados e confirmação:** nome completo, WhatsApp (máscara `(00) 00000-0000`), e-mail (opcional), "É sua primeira sessão?" (sim/não), observação (opcional, até 300 caracteres), aceite da Política de Privacidade. Resumo acima do botão: "Quinta, 3 de dezembro às 14:00 · Online". Botão: **Confirmar agendamento**.

Indicador de progresso no topo (1–2–3–4) e botão "Voltar" em cada passo.

### Regras de disponibilidade

| Regra | Valor padrão (editável) |
| --- | --- |
| Duração da sessão | 60 min |
| Intervalo entre sessões | 15 min |
| Antecedência mínima para agendar | 12 horas |
| Janela de agendamento | próximos 30 dias |
| Grade semanal | Definida pela terapeuta, por dia e modalidade |
| Bloqueios | Feriados, férias e compromissos removem horários |
| Reservas por pessoa | 1 sessão futura pendente por número de WhatsApp |

### Estados da interface

| Estado | Mensagem |
| --- | --- |
| Carregando | "Buscando horários disponíveis…" (skeleton do calendário) |
| Dia sem vagas | "Este dia está completo. Que tal outro?" |
| Mês sem vagas | "Agenda cheia neste período. Fale comigo pelo WhatsApp que encontramos um horário." + botão WhatsApp |
| Horário tomado (409) | "Esse horário acabou de ser reservado. Escolha outro, por favor." |
| Erro de conexão | "Não consegui concluir agora. Tente de novo ou me chame no WhatsApp." |
| Sucesso | Texto da seção 4 + botão "Adicionar ao calendário" (.ics) |

### Mensagem que a Luzinete recebe

```
🌿 Novo agendamento
👤 Maria Souza
📅 03/12/2026 às 14:00
📍 Online
📱 (11) 98765-4321
✨ Primeira sessão
```

No Nível 1 (sem servidor), a mesma mensagem é montada no navegador e aberta em `https://wa.me/55DDDNUMERO?text=<mensagem codificada>`; o cliente toca em "Enviar" para avisar a terapeuta.

## 6. Especificação técnica

Recomendação: front-end estático + banco Supabase + uma função serverless que grava a reserva e dispara o WhatsApp. Assim o horário fica bloqueado de verdade e o aviso chega sem depender do cliente.

### Níveis de implementação

| Nível | Como funciona | Bloqueia horário? | Aviso automático? | Custo |
| --- | --- | --- | --- | --- |
| 1 — Demo / sem servidor | Horários num `horarios.json`; ao confirmar abre `wa.me` com a mensagem pronta e o cliente toca em "Enviar" | Não | Não (depende do cliente) | Zero |
| 2 — Recomendado | Supabase (tabelas + função) + CallMeBot para avisar o número pessoal da terapeuta | Sim | Sim | Zero (CallMeBot é gratuito para uso pessoal) |
| 3 — Profissional | Supabase + WhatsApp Cloud API (Meta) com template aprovado; pode avisar também o cliente | Sim | Sim | Cobrança por conversa da Meta |

O template entregue deve vir no Nível 1 funcionando e com o Nível 2 pronto para ativar por variáveis de ambiente.

### Stack

- **Front-end:** HTML5 + CSS (tokens da seção 2) + JavaScript puro, ou Next.js/React se a página de templates já usar React.
- **Banco e back-end:** Supabase (Postgres + Edge Functions).
- **WhatsApp:** CallMeBot (Nível 2) ou WhatsApp Cloud API (Nível 3).
- **Hospedagem:** Vercel ou Netlify.
- **Fuso horário:** `America/Sao_Paulo` em todo o sistema.

### Modelo de dados

| Tabela | Campos principais | Observação |
| --- | --- | --- |
| `disponibilidade` | `dia_semana` (0–6), `hora_inicio`, `hora_fim`, `modalidade` (presencial / online / ambas), `ativo` | Grade semanal da terapeuta |
| `bloqueios` | `data`, `hora_inicio`, `hora_fim`, `motivo` | Feriados, férias, compromissos |
| `agendamentos` | `id`, `data`, `hora`, `modalidade`, `nome`, `whatsapp`, `email`, `primeira_sessao`, `observacao`, `status` (pendente / confirmado / cancelado), `criado_em` | Restrição `UNIQUE (data, hora)` onde `status <> 'cancelado'` impede reserva dupla |
| `config` | `duracao_min` (60), `intervalo_min` (15), `antecedencia_min_h` (12), `janela_dias` (30), `whatsapp_terapeuta` | Parâmetros editáveis |

### Endpoints

| Método | Rota | Função |
| --- | --- | --- |
| GET | `/api/horarios?mes=2026-12` | Dias com vaga e horários livres (grade − bloqueios − agendamentos) |
| POST | `/api/agendar` | Valida, grava (transação) e envia o WhatsApp; retorna 409 se o horário já foi ocupado |

### Função de agendamento (referência)

```ts
// supabase/functions/agendar/index.ts
import { createClient } from 'npm:@supabase/supabase-js@2';

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

Deno.serve(async (req) => {
  const b = await req.json(); // { data, hora, modalidade, nome, whatsapp, email, primeira_sessao, observacao }
  if (!b.nome || !b.whatsapp || !b.data || !b.hora || !b.consentimento) {
    return new Response('Dados incompletos', { status: 400 });
  }

  const { error } = await db.from('agendamentos').insert({ ...b, status: 'pendente' });
  if (error?.code === '23505') return new Response('Horário indisponível', { status: 409 });
  if (error) return new Response('Erro', { status: 500 });

  const msg = [
    '🌿 *Novo agendamento*',
    `👤 ${b.nome}`,
    `📅 ${b.data.split('-').reverse().join('/')} às ${b.hora}`,
    `📍 ${b.modalidade === 'online' ? 'Online' : 'Presencial'}`,
    `📱 ${b.whatsapp}`,
    b.primeira_sessao ? '✨ Primeira sessão' : '',
    b.observacao ? `📝 ${b.observacao}` : '',
  ].filter(Boolean).join('\n');

  // Nível 2 — CallMeBot
  const url = `https://api.callmebot.com/whatsapp.php?phone=${Deno.env.get('WA_TERAPEUTA')}`
    + `&text=${encodeURIComponent(msg)}&apikey=${Deno.env.get('CALLMEBOT_KEY')}`;
  await fetch(url).catch(() => {}); // falha no aviso não desfaz a reserva; registrar em log

  return Response.json({ ok: true });
});
```

No Nível 3, troque o bloco CallMeBot por um `POST` em `https://graph.facebook.com/<versão>/<PHONE_NUMBER_ID>/messages` com um template aprovado (ex.: `novo_agendamento`) e o token no cabeçalho `Authorization`.

### Variáveis de ambiente

| Variável | Uso |
| --- | --- |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Acesso ao banco (só no servidor) |
| `WA_TERAPEUTA` | Número da Luzinete no formato `55DDDNUMERO` |
| `CALLMEBOT_KEY` | Chave recebida ao ativar o CallMeBot no WhatsApp dela |
| `WA_CLOUD_TOKEN`, `WA_PHONE_ID` | Apenas Nível 3 |

### Painel da terapeuta (opcional, fase 2)

Página `/painel` com login (Supabase Auth) para ver a agenda do dia, confirmar ou cancelar sessões e criar bloqueios. Enquanto não existir, ela gerencia pelo próprio painel do Supabase.

## 7. Qualidade e entrega

### Responsividade

| Breakpoint | Largura | Ajustes |
| --- | --- | --- |
| Mobile | até 767px | 1 coluna; cards de dores empilhados; calendário em tela cheia; CTA "Agendar" flutuante no rodapé |
| Tablet | 768–1023px | 2 colunas nos cards; calendário e horários empilhados |
| Desktop | 1024px ou mais | Container de 1140px; calendário à esquerda e horários à direita |

Mobile-first: a maior parte das visitas virá do Instagram e do WhatsApp.

### Acessibilidade

- Contraste mínimo 4,5:1 (regras da seção 2).
- Calendário navegável por teclado (setas, Enter) com `aria-label` em cada dia, ex.: "Quinta, 3 de dezembro, 4 horários livres".
- Horários como `button` com `aria-pressed`; dias sem vaga com `aria-disabled`.
- Áreas de toque de no mínimo 44 × 44px.
- Mensagens de erro e sucesso em região `aria-live="polite"`.
- Imagens com `alt` descritivo; `prefers-reduced-motion` respeitado.

### SEO e performance

- **Title:** Luzinete Terapeuta | Terapia TRG presencial e online em \[cidade\]
- **Meta description:** Terapia de Reprocessamento Generativo para ansiedade, pânico, traumas e luto. Atendimento acolhedor, presencial e online. Agende sua sessão.
- Schema.org `LocalBusiness` / `HealthAndBeautyBusiness` com endereço, horário e telefone; `FAQPage` para as perguntas.
- Open Graph com imagem 1200 × 630 nas cores da marca (para compartilhar no WhatsApp).
- Imagens em WebP com `loading="lazy"`; fontes com `font-display: swap`.
- Meta: Lighthouse ≥ 90 em Performance, Acessibilidade e SEO.

### LGPD e cuidados éticos

- Checkbox obrigatório no formulário: "Li e concordo com a Política de Privacidade".
- Coletar só o necessário; o campo "observação" orienta a **não** descrever detalhes sensíveis.
- Página de Política de Privacidade explicando uso dos dados, prazo de guarda e como pedir exclusão.
- Sem promessas de cura ou resultados garantidos; sem depoimentos sem autorização por escrito.
- Aviso de crise no rodapé (CVV 188 / SAMU 192).

### Checklist de entrega

- [ ] Tokens de cor e tipografia aplicados
- [ ] 11 blocos da página implementados com a copy da seção 4
- [ ] Agendamento Nível 1 funcionando (JSON + wa.me)
- [ ] Agendamento Nível 2 pronto para ativar (Supabase + CallMeBot)
- [ ] Bloqueio de reserva dupla testado (duas abas no mesmo horário → a segunda recebe aviso)
- [ ] Mensagem de WhatsApp recebida no número de teste
- [ ] Testado em iPhone, Android e desktop (Chrome, Safari)
- [ ] Lighthouse ≥ 90
- [ ] Política de Privacidade publicada
- [ ] Placeholders `[ ]` documentados para personalização

### Dados a pedir para a terapeuta

- Foto profissional e fotos do consultório
- Formação, certificação em TRG e tempo de atuação
- Endereço do consultório e número de WhatsApp
- Grade semanal de horários, duração e valor da sessão
- Política de remarcação e formas de pagamento
- Redes sociais e e-mail
