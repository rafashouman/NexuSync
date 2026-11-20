# NexuSync — Plano de desenvolvimento: Rua Acesa

Data: 19/11/2026
Projeto: `C:\@sites\nexusync` (Next.js 16.4.6 · React 19 · Tailwind 4 · three 0.182 + @react-three/fiber/drei)
Protótipo aprovado: https://claude.ai/artifact/VCTqcHAP4JxE79tMtqC3LK

---

## 1. Objetivo

Substituir a home atual (`ControlledChaos`) pela experiência **Rua Acesa**, aprovada no protótipo: uma rua 3D à noite que fica atrás de todo o conteúdo e conta uma história. O negócio do visitante começa apagado e invisível na busca, e termina aceso e primeiro no mapa. A interação é a própria história: o mouse acende vitrines e a rolagem move a câmera por cada bloco do copy.

A home precisa deixar claro o posicionamento da agência:

- **Foco em presença online e SEO orgânico.** Tráfego pago não é o argumento de venda da home.
- **Pilares, nesta ordem:** 1) Presença online, com sites marcantes; 2) Design, com foco em motion graphics; 3) Gestão de redes sociais; 4) Tráfego pago, sempre por último.

Esta fase cobre só a home. As rotas de demos, apps, templates, admin e as páginas internas continuam funcionando sem mudança (ver seção 10).

---

## 2. Decisões já tomadas

| Tema | Decisão |
| --- | --- |
| Conceito | "A Rua Acesa": quem tem site e aparece no Google está com a vitrine acesa e um feixe de busca no telhado. |
| Paleta | Base azul-noite. Âmbar = a luz de estar visível, usada também nos CTAs. Azul-sinal = a busca. Branco frio = iluminação pública. Sem lima e sem roxo. |
| Regra de cor | Âmbar só para "visível, aceso, ação". Azul-sinal só para "busca, Google, pin". Nada de cor decorativa. |
| Tipografia | Archivo (variável, eixo de largura, para títulos e números), Inter (texto) e JetBrains Mono (rótulos, busca, recibo). |
| Botões | Mantém o formato atual: retangular, com bloco de seta separado. |
| Oferta da página | Plano Presence: de R$ 599,00 por R$ 499,00, entrega estimada de 5 a 10 dias úteis. Os dados vêm de `src/data/sitePlans.ts`. |
| Método | O nome "Método Orçamento em 7 Dias" fica. O contador mostra as 4 etapas reais do processo (Entendemos seu negócio → Definimos a proposta → Criamos e apresentamos → Publicamos e orientamos), não "Dia 1–7". |
| Depoimentos | Fora até existirem depoimentos reais. Nada de texto provisório no ar. |
| Vídeo | "Pedido online - 21 segundos" (vertical, 720×1280, H.264/AAC), num modal vertical. |
| Regras de copy | As de `docs/Nosso repertório criativo.md`: não inventar preços, descontos, depoimentos, urgência ou resultados. |

---

## 3. Diagnóstico do projeto atual

### 3.1 Home e componentes

| Item | Situação | Impacto no plano |
| --- | --- | --- |
| `src/app/(site)/page.tsx` | Renderiza só `<ControlledChaos />` e tem a metadata da home. | Passa a renderizar `<RuaHome />`, com metadata nova. |
| `src/components/home/ControlledChaos.tsx` | 670 linhas: hero com carrossel 3D, serviços, manifesto, "como funciona", FAQ e contato. | Sai da home. O código fica no repositório até o lançamento estabilizar, depois é removido. |
| `src/components/home/ChaosScene.tsx` | Cena R3F carregada com `dynamic(..., { ssr: false })`. | É o padrão a seguir para o mundo 3D. |
| `ChaosHeader` / `ChaosFooter` / `StudioCursor` / `FloatingWA` | Cabeçalho, rodapé, cursor e WhatsApp flutuante da home. | Cabeçalho e rodapé ganham versão Rua Acesa. O cursor customizado sai (a rua já reage ao mouse). |
| `src/app/(site)/layout.tsx` | O título da metadata é "NexuSync \| Tráfego Pago e SEO, Sites e Automações". | **Contraria os pilares.** Precisa ser reescrito. |
| `src/data/siteNavigation.ts` | Menu "Soluções" termina com "Marketing, tráfego e SEO". | Reorganizar o menu pelos pilares, na ordem. |
| `src/app/globals.css` | Tokens globais com lima (`--color-champagne: #d4ff38`, `--primary`, seleção e foco). | A nova paleta entra primeiro escopada na home (`.rua`), para não quebrar as outras páginas. |
| `src/app/layout.tsx` | Carrega Geist e Montserrat por `<link>` do Google Fonts. | As fontes novas entram com `next/font/google` só na home. |

### 3.2 O que já existe e será reaproveitado

- **Orçamento:** `QuoteLink` leva para `/contato?interest=…&source=…#orcamento`, com interesses em `src/lib/quote.ts`, gravação em `src/app/actions/quotes.ts` e painel em `/admin/orcamentos`. Todos os CTAs "Quero ver meu orçamento" usam esse fluxo.
- **WhatsApp:** `waLink()` em `src/lib/site-config.ts`. A mensagem do Presence já existe em `sitePlans.ts` (`waMessage`).
- **Analytics:** `trackAnalyticsEvent()` em `src/lib/analytics.ts`, com eventos tipados, mais o `MetaPixel`.
- **Preços:** `src/data/sitePlans.ts` é a única fonte. A home não pode ter preço escrito à mão.
- **FAQ:** a home atual tem perguntas úteis para SEO, como tipos de site e o que o cliente precisa fornecer. Elas são revisadas e entram na nova home.

### 3.3 Riscos encontrados

1. **Deploy automático.** Todo push na `main` dispara `.github/workflows/deploy.yml`: `npm ci` → `lint` → `tsc --noEmit` → `scripts/test-quote-validation.cjs` → `build` → `deploy-nexusync` na VPS.
2. **Arquivos de deploy apagados na cópia local.** `Dockerfile`, `docker-compose.yml` e `.dockerignore` estão apagados, mas não commitados. O script da VPS provavelmente usa esses arquivos. **Commitar essas exclusões e dar push pode derrubar o deploy.** A limpeza de docs e previews é segura.
3. **Next 16 tem mudanças incompatíveis** (aviso em `AGENTS.md`). Antes de escrever código, ler os guias em `node_modules/next/dist/docs/` sobre App Router, `cacheComponents` (ativo no `next.config.ts`), `dynamic` e metadata.
4. **Peso da cena 3D.** Uma cena WebGL que cobre a página toda pode piorar LCP e INP no celular. Por isso existe o orçamento de performance da seção 6.4.

---

## 4. Arquitetura proposta

### 4.1 Estrutura de arquivos

```
src/components/rua/
  RuaHome.tsx              # server component: monta as seções; todo o texto sai no HTML (SEO)
  RuaHome.module.css       # tokens e estilos da home, escopados em .rua
  RuaChrome.tsx            # cabeçalho (com pilares) e rodapé da home
  world/
    RuaWorld.tsx           # client: <Canvas> fixo, carregado com dynamic(ssr:false)
    Street.tsx             # chão, grade, rua, calçadas, postes
    Buildings.tsx          # fileiras de prédios, vitrines, poças de luz, hover
    SearchBeam.tsx         # feixe de busca (shader) + pin
    AttemptSigns.tsx       # as 6 placas das tentativas
    CityBlocks.tsx         # quarteirões de fundo (InstancedMesh)
    cameraKeys.ts          # enquadramentos por seção + chave do método
    useStoryScroll.ts      # mapeia a rolagem para (seção, progresso, transição)
    WorldTags.tsx          # etiquetas "Seu concorrente" / "Você" projetadas na tela
  sections/
    HeroSection.tsx        # + SearchSimulator.tsx (client)
    DorSection.tsx
    TentativasSection.tsx  # client só nos cards (hover acende a placa)
    AgoraSection.tsx       # + PageTimer.tsx (client)
    MetodoSection.tsx      # furadeira (SVG, client) + painel fixo das 4 etapas
    ParaQuemSection.tsx
    EntregaveisSection.tsx # recibo gerado a partir de sitePlans.ts
    PilaresSection.tsx
    FaqSection.tsx
    FinalSection.tsx
  VideoModal.tsx           # vídeo vertical, carregado só ao abrir
src/store/useRuaStore.ts   # zustand: seção atual, progresso, etapa do método, tentativa ativa, pulso da busca
```

### 4.2 Como as peças conversam

- **O texto é sempre HTML do servidor.** O 3D é decoração (`aria-hidden`). Sem WebGL, com JavaScript lento ou para o Google, a página continua completa e legível.
- **Uma fonte de verdade para a história.** `useStoryScroll` mede as seções (com `ResizeObserver`) e grava em `useRuaStore` a seção atual, o progresso e a etapa do método. O mundo 3D e os componentes de UI leem o mesmo estado.
- **Câmera.** Um enquadramento fixo por seção em `cameraKeys.ts`, com transição suave entre eles. A seção do método tem uma órbita própria, guiada pelo progresso das 4 etapas. Esse é o mesmo modelo do protótipo, portado para `useFrame` do R3F.
- **Reações ao visitante:**
  - mouse em cima de um prédio → a vitrine acende e o prédio sobe um pouco;
  - arrastar no hero e no final → gira a rua;
  - busca simulada → o feixe do concorrente pulsa;
  - card de tentativa → a placa acende e depois apaga.
- **Rolagem suave.** Adicionar `lenis` (a mesma biblioteca usada pela BOA Labs). Os links de âncora usam `lenis.scrollTo`. Com movimento reduzido, a rolagem nativa é mantida.

### 4.3 Portar do protótipo (o que muda)

| Protótipo (HTML único) | Projeto |
| --- | --- |
| three r128 global, `THREE.*` | three 0.182 via R3F/drei. Trocar `outputEncoding` por `outputColorSpace` / `SRGBColorSpace`. |
| `convertSRGBToLinear` manual | Usar o gerenciamento de cor nativo do three 0.182 (`ColorManagement`). Conferir as cores lado a lado com o protótipo. |
| Lenis por CDN | Pacote `lenis` no `package.json`. |
| Fontes do Google por `<link>` | `next/font/google` (Archivo com eixo `wdth`, Inter, JetBrains Mono). |
| Recibo com itens escritos à mão | Itens e preços lidos de `sitePlans.ts` (ver 5.3). |
| Vídeo publicado junto ao artefato | `public/videos/pedido-online.mp4` + pôster `public/videos/pedido-online.jpg`. |

### 4.4 Regras do Next 16 que afetam o código (lidas em `node_modules/next/dist/docs/`)

- **`ssr: false` só funciona dentro de Client Components.** O `RuaWorld` é importado por um componente `"use client"` com `dynamic(() => import(...), { ssr: false })`. Dentro de um Server Component dá erro (guia `lazy-loading`).
- **`cacheComponents` está ativo, e isso faz a rota ficar oculta, não desmontada, ao navegar.** O Next guarda a página anterior em `<Activity mode="hidden">`: os efeitos são limpos ao sair e recriados ao voltar. Então o canvas WebGL, a instância do Lenis, os listeners de rolagem, ponteiro e resize e os `IntersectionObserver` precisam de cleanup completo no `useEffect`, senão vazam ou duplicam ao ir e voltar da home.
- **Rolagem suave.** O `<html>` tem `data-scroll-behavior="smooth"` e a classe `scroll-smooth`. Com o Lenis ativo na home, o CSS precisa forçar `scroll-behavior: auto` enquanto `html.lenis` existir (regras do `lenis.css`), senão os dois brigam.
- **Fontes:** `next/font/google` aceita `axes` em fontes variáveis. Usar `Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-rua-display' })`, mais Inter e JetBrains Mono com `variable`, aplicadas só no container da home.
- **JSON-LD:** `<script type="application/ld+json">` nativo, no `page.tsx`, com `JSON.stringify(...).replace(/</g, '\\u003c')`, o mesmo padrão já usado em `(site)/layout.tsx`.
- **Build do projeto:** `npm run build` usa webpack (`next build --webpack`). O CI roda `lint`, `tsc --noEmit`, `scripts/test-quote-validation.cjs` e `build`, e tudo isso precisa passar na branch antes do merge.

---

## 5. Conteúdo da home (ordem final)

| # | Seção | Conteúdo | Cena 3D |
| --- | --- | --- | --- |
| 1 | Hero | Headline "O concorrente da sua rua já aparece no Google quando alguém pesquisa o seu serviço.", subtítulo com "site marcante e SEO orgânico, sem depender de anúncio", 3 bullets, CTA e vídeo. Simulador de busca à direita. | Rua vista de cima; concorrente aceso com feixe; "Você · invisível na busca". |
| — | Faixa animada | Sites marcantes · SEO orgânico · Motion graphics · Redes sociais · Landing pages · Hotsites | — |
| 2 | Dor | 3 cenas: a reunião (busca sem resultado), o Instagram (alcance caindo, ilustrativo), o domingo no Wix. Fecha com "Não falta esforço. Falta estrutura." | Câmera na rua, em frente à vitrine apagada do visitante. |
| 3 | Tentativas | 6 cards com "Acende / Apaga": Instagram, Google Meu Negócio sem site, Wix/Hostinger, site por IA, cartão, grupo de WhatsApp. | 6 placas em volta do prédio que acendem e apagam. |
| 4 | Agora | "Você está nesta página há 0:00." + CTA e WhatsApp. | Vista aberta da cidade. |
| 5 | Método | Furadeira (furo → quadro → telefone tocando) + painel fixo "Etapa 1–4 / 4". | Órbita: linhas de diagnóstico → prédio cresce → vitrine acende → pin e feixe sobem. |
| 6 | Pra quem é / não é | Duas colunas. | Vista alta com os dois feixes (concorrente e visitante). |
| 7 | Entregáveis | Recibo do Presence que "imprime" na rolagem. | Prédio do visitante aceso, com pin. |
| 8 | Pilares | "Primeiro a vitrine acende. Depois a rua inteira vê." O prédio dos 4 pilares: 01 Presença online (alicerce) → 04 Tráfego pago (último andar). | Cidade mais iluminada. |
| 9 | FAQ | Perguntas revisadas da home atual (SEO orgânico). | — |
| 10 | Final | "Na próxima busca, quem aparece é você." + CTAs. | Mapa visto de cima com "Você · primeiro na busca". |

### 5.1 Texto

O texto aprovado está no protótipo e é a referência. Nenhum texto novo entra sem passar pelas regras de `docs/Nosso repertório criativo.md`.

### 5.2 CTAs

| CTA | Destino | Origem (`QuoteSection`) |
| --- | --- | --- |
| "Quero ver meu orçamento" (cabeçalho) | `QuoteLink` → `/contato#orcamento`, interesse `institucional` | `header` |
| "Quero ver meu orçamento" (hero) | idem | `hero` |
| "Quero ver meu orçamento" (agora, recibo, final) | idem | `sites` |
| "Falar no WhatsApp" | `waLink(sitePlans[Presence].waMessage)` | registrado como `quote_whatsapp_click` |

### 5.3 Recibo (Entregáveis)

Proposta de 7 itens, todos vindos de `features` do Presence em `sitePlans.ts`:

1. Site com múltiplas páginas
2. Layout personalizado para sua marca
3. Catálogo de produtos ou serviços
4. Pedidos de delivery via WhatsApp
5. SEO básico para mecanismos de busca
6. Configuração de domínio próprio
7. Orientação para atualização do conteúdo

Totais: "De R$ 599,00" (riscado) e "Seu investimento R$ 499,00", lidos de `originalPrice` e `price`. A nota de rodapé usa o campo `scope` do plano. A nota sobre domínio fica: "Registro de domínio e hospedagem são orçados à parte."

> Ponto a confirmar: essa lista substitui a do protótipo, que tinha itens escritos por mim. O item 5 reforça o argumento de SEO orgânico com algo que o plano realmente inclui.

---

## 6. SEO orgânico, acessibilidade e performance

### 6.1 Metadata

- **Home (`(site)/page.tsx`):**
  - título: "Criação de Sites e SEO Orgânico para Negócios Locais | NexuSync";
  - descrição sobre ser encontrado no Google com um site marcante, citando o Presence e o prazo real.
- **Layout `(site)`:** trocar "Tráfego Pago e SEO, Sites e Automações" por um título na ordem dos pilares, por exemplo "NexuSync | Sites, Design e Presença Online".
- **Open Graph:** imagem nova com a rua acesa (1200×630), gerada a partir da cena.

### 6.2 Dados estruturados

- Manter `Organization` e `WebSite`.
- Adicionar `FAQPage` com as perguntas que aparecem na página, nem mais nem menos.
- Adicionar `Service` + `Offer` do Presence (499,00 BRL), com o mesmo preço mostrado na página.
- Validar no Rich Results Test antes do lançamento.

### 6.3 Acessibilidade

- O 3D é `aria-hidden`; toda informação existe em texto.
- Hierarquia de títulos: um `h1` (hero), `h2` por seção e `h3` nos cards.
- Cards de tentativa focáveis. Foco visível no azul-sinal.
- `prefers-reduced-motion`: sem rolagem suave, sem órbita automática, sem animação do letreiro, sem ciclo automático das tentativas. A câmera troca de enquadramento sem animar.
- Contraste mínimo de 4,5:1. O botão âmbar leva texto escuro.
- O modal de vídeo prende o foco (usar `useFocusTrap`, que já existe em `src/components/ui/`) e fecha com Esc.

### 6.4 Orçamento de performance

| Métrica (celular, 4G) | Meta |
| --- | --- |
| LCP | < 2,5 s. O LCP deve ser o `h1` (texto), nunca o canvas. |
| CLS | < 0,1 |
| INP | < 200 ms |
| JS da home (gzip) | Medir o atual no build e não piorar mais de 30%. |

Como chegar lá:

- carregar o `RuaWorld` com `dynamic(ssr:false)` depois da primeira pintura;
- limitar o DPR a 1,5 no celular;
- usar menos prédios no celular e `InstancedMesh` nos quarteirões;
- pausar a renderização quando a aba está oculta;
- sem WebGL, mostrar um fundo estático com as luzes em CSS;
- vídeo com `preload="none"`, `faststart` e pôster.

### 6.5 Vídeo

Reexportar o .mov como MP4 web (H.264, AAC, `-movflags +faststart`) e criar um pôster JPG. Não há ffmpeg nesta máquina: exportar pelo DaVinci com a opção web ou instalar o ffmpeg.

---

## 7. Analytics

| Evento | Quando |
| --- | --- |
| `quote_interest_select` / `quote_whatsapp_click` (já existem) | Cliques nos CTAs, com `section`. |
| `home_search_simulated` (novo) | O visitante usa o simulador. Registra o serviço digitado só como categoria (dentista, pizzaria…); texto livre não vai para o analytics. |
| `home_video_play` (novo) | O vídeo começa a tocar. |
| `home_method_complete` (novo) | O visitante chega à Etapa 4 do método. Mede se a história é assistida até o fim. |

Os eventos novos entram no tipo `AnalyticsEvent` em `src/lib/analytics.ts`.

---

## 8. Fases de execução

Todo o trabalho acontece numa branch (`feat/rua-acesa`). **Nada vai para a `main` sem a sua aprovação, porque a `main` publica direto em produção.**

### Fase 0 — Preparação
- [x] Arquivos de deploy (`Dockerfile`, `docker-compose.yml`, `.dockerignore`) restaurados do último commit (seção 3.3, risco 2).
- [x] Branch `feat/rua-acesa` criada a partir da `main` (19/11/2026), levando junto a limpeza local de docs, que segue sem commit.
- [x] Guias do Next 16 lidos; as regras que afetam o código estão na seção 4.4.
- [x] Checagens do CI na branch, antes de qualquer mudança: `lint` ✓, `tsc --noEmit` ✓, `test-quote-validation` ✓, `build` ✓ (45 rotas; home estática). O aviso `MONGODB_URI is not configured` no build local é esperado, porque não há banco local.
- [x] Linha de base da home atual (`ControlledChaos`), medida abaixo.

**Linha de base (19/11/2026).** Build de produção local (`next start`), Chrome headless via DevTools Protocol, cache desligado, mediana de 3 rodadas. Celular: 375×812, 4G lento (150 ms, 1,6 Mbps), CPU 4×. Desktop: 1440×900, sem limitação de CPU.

| Métrica | Celular | Desktop |
| --- | --- | --- |
| FCP | 1,31 s | 0,52 s |
| LCP | 1,31 s (imagem de fundo do hero) | 0,52 s (idem) |
| CLS | 0,002 | 0,003 |
| TBT (aprox., via long tasks) | 21 ms | 38 ms |
| JS transferido | 508 KB · 26 arquivos | 536 KB · 34 arquivos |
| Total transferido | 1.220 KB · 56 requisições | 1.279 KB · 80 requisições |
| Evento `load` | 3,2 s | 0,74 s |

Leitura: a home atual já carrega cerca de 0,5 MB de JS, boa parte do three.js do hero. A meta da seção 6.4 ("não piorar mais de 30%") fica em **até ~660 KB de JS no celular**, com LCP vindo do `h1` em texto, que deve ser mais rápido que a imagem de hoje.

**Aceite:** ✓ concluída.

### Fase 1 — Fundação sem 3D ✓ (19/11/2026)
- [x] `RuaHome` (Server Component) com todas as seções em HTML do servidor, estilos escopados em `.rua` (`rua.module.css`) e fontes via `next/font` (Archivo com eixo `wdth`, Inter e JetBrains Mono).
- [x] CTAs "Quero ver meu orçamento" → `/contato?interest=institucional&source=…#orcamento`. Usam link direto, não `QuoteLink`, porque o `QuoteLink` intercepta o clique na rota `/` e procuraria um `#orcamento` na própria home. WhatsApp via `waLink(presence.waMessage)`.
- [x] Recibo gerado a partir de `sitePlans.ts`: preço, preço "de", prazo, selo e os 7 itens validados contra `features`.
- [x] Metadata da home (título "Criação de Sites e SEO Orgânico para Negócios Locais") e do layout `(site)` ("Sites, Design e Presença Online"). JSON-LD `FAQPage` e `Service`/`Offer` no `page.tsx`.
- [x] `SiteChrome` deixou de montar o `StudioCursor` na home.

**Aceite:** ✓ texto completo no HTML; `lint`, `tsc`, `test-quote-validation` e `build` passam.

### Fase 2 — O mundo 3D ✓ (19/11/2026)
- [x] Cena portada para three 0.182 em `src/components/rua/world/scene.ts`: rua, prédios, vitrines, feixes, pins, quarteirões instanciados, linhas de diagnóstico e placas.
- [x] `cameraKeys.ts`: um enquadramento por seção e a órbita do método.
- [x] Hover que acende vitrines, arrastar para girar (hero e final), etiquetas projetadas.
- [x] Rolagem suave com `lenis` 1.3.27 (`autoRaf`, `anchors`) em `RuaEffects.tsx`. `globals.css` força `scroll-behavior: auto` com `html.lenis`.

**Decisões de implementação (diferentes da seção 4.1):**
- three imperativo em vez de R3F: porta 1:1 da cena aprovada, com controle total do descarte exigido pelo `cacheComponents`.
- Eventos de `window` (`rua:pulse`, `rua:attempt` em `events.ts`) em vez de zustand: menos código, e a UI não importa o three.

**Compatibilidade r128 → 0.182:**
- cores lidas como lineares (`setHex(hex, LinearSRGBColorSpace)`) para manter o visual aprovado;
- luzes × π (novo modelo físico);
- o three é baixado por `import()` só no cliente, depois da primeira pintura.

### Fase 3 — Interações das seções ✓ (19/11/2026)
- [x] Simulador de busca (`SearchSimulator.tsx`).
- [x] Placas das tentativas (`AttemptCards.tsx`): hover, foco por teclado e ciclo automático.
- [x] Método: furadeira em SVG guiada pela rolagem e painel fixo das 4 etapas.
- [x] Recibo imprimindo na rolagem.
- [x] Cronômetro.
- [x] Modal de vídeo (`VideoModal.tsx`, `<dialog>` nativo, vídeo em `public/videos/pedido-online.mp4`).

### Fase 4 — Pilares, FAQ e navegação (parcial)
- [x] Seções Pilares, FAQ (com `FAQPage`) e Final.
- [x] Menu reorganizado pelos pilares (19/11/2026). `siteNavigation.ts` ganhou `solutionPillars`:
  1. Presença online: criação de sites, lojas virtuais, aplicativos e "SEO e presença no Google" (`/marketing#marketing-seo-local`).
  2. Design: design e motion graphics.
  3. Redes sociais: gestão de redes sociais (`/marketing#marketing-presenca-ativa`).
  4. Tráfego pago (`/marketing#marketing-aquisicao-local`).

  O dropdown "Soluções" do cabeçalho mostra os rótulos "01 · Presença online" a "04 · Tráfego pago". O menu móvel e o rodapé seguem a mesma ordem. O link "Como funciona" foi corrigido de `/#como-funciona` (âncora da home antiga) para `/#metodo`.
- [x] Banner de cookies sem lima (20/11/2026): fundo navy `#0c1428`, **Aceitar** em âmbar `#ffb547` com texto escuro, link em azul-sinal `#5b97ff` e anel de foco azul-sinal. Fica em `MetaPixel.tsx` e vale para o site todo. Os tokens globais do lima (`--color-champagne`, `--primary`, seleção de texto, anel de foco em `.nexusync-site`) seguem nas páginas internas e entram na fase de identidade nova delas (seção 10).

**Aceite:** a ordem dos pilares aparece igual na home, no menu e na metadata.

### Medição após as fases 1–3 (19/11/2026, mesmo método da linha de base)

| Métrica | Celular antes → agora | Desktop antes → agora |
| --- | --- | --- |
| LCP | 1,31 s (imagem) → 1,43 s (texto) | 0,52 s → 0,61 s (`h1`) |
| CLS | 0,002 → 0,002 | 0,003 → **0,093** (era 0,201; corrigido com o hero alinhado ao topo e Inter/Mono em `display: optional`) |
| JS transferido | 508 KB → **442 KB** (−13%) | 536 KB → **442 KB** |
| Total transferido | 1.220 KB → **736 KB** (−40%) | 1.279 KB → **731 KB** |
| Requisições | 56 → 40 | 80 → 39 |
| TBT (aprox.) | 21 ms → **1.096 ms** ⚠ | 38 ms → **346 ms** ⚠ |

**Prioridade da Fase 5: o TBT.** A cena renderiza todo quadro, com cerca de 300 objetos e materiais PBR, e no Chrome com GPU emulada isso gera tarefas longas. Ações previstas:

- renderizar sob demanda, só quando a câmera ou a cena mudam;
- limitar a 30 fps no celular;
- juntar a geometria fixa (traços da rua, postes, poças) em poucos draw calls;
- trocar PBR por materiais mais leves onde não há diferença visual;
- `renderer.compileAsync` antes do primeiro quadro.

### Otimização da cena 3D (19/11/2026)

O que mudou em `world/scene.ts`, sem diferença visual (conferido por screenshots antes/depois):

- **Draw calls de ~650 para ~170.**
  - Vitrines, placas, poças de luz, traços da rua, postes e poças dos postes viraram `InstancedMesh`, com cor por instância.
  - As luzes dos postes viraram um único `Points`.
  - Cada prédio passou de 6 grupos de material para 2 (fachadas + teto).
- **`MeshLambertMaterial`** no lugar do PBR (`MeshStandardMaterial`).
- **Renderização sob demanda.** Taxa cheia só quando algo se mexe: rolagem, mouse, câmera em transição, pulso da busca, placas ou hover. Parada, a cena anima a 30 fps no desktop e 15 fps no celular. No celular, o teto é 30 fps.
- **Construção em etapas,** cedendo o processador entre elas.
- **`compileAsync`** quando o navegador tem `KHR_parallel_shader_compile`.
- **Canvas mais leve:** resolução até 1,5× no desktop e 1,25× no celular, e sem antialias no celular.
- **Raycast do hover** só quando o ponteiro se move.

| Métrica | Celular antes → depois | Desktop antes → depois |
| --- | --- | --- |
| TBT (aprox.) | 1.096 ms → **321 ms** | 346 ms → **271 ms** |
| LCP | 1,43 s → **1,35 s** | 0,61 s → **0,42 s** |
| CLS | 0,002 → 0,002 | 0,093 → 0,093 |
| JS | 442 KB → 443 KB | 442 KB → 443 KB |

O TBT que sobra vem sobretudo da compilação de shaders no primeiro quadro: o Chrome de teste usa GPU emulada (SwiftShader), sem compilação paralela. Em navegadores com GPU real, o `compileAsync` remove essa trava. Falta medir num aparelho real.

### Fase 5 — Qualidade
- [ ] Celular (375 px), tablet e desktop sem rolagem horizontal.
- [ ] Movimento reduzido e fallback sem WebGL.
- [ ] Acessibilidade (teclado, leitor de tela, contraste).
- [ ] Orçamento de performance (seção 6.4).
- [ ] Dados estruturados validados.
- [ ] Eventos de analytics conferidos.
- [ ] `scripts/check-public-routes.cjs` e `scripts/test-quote-validation.cjs` passando.

**Aceite:** todas as metas da seção 6 atingidas.

### Preparação do merge (19/11/2026)

**Estado verificado:**

| Item | Resultado |
| --- | --- |
| `main` remota vs. base da branch | Iguais (`e1af5a2`). O merge é um fast-forward, sem conflitos. |
| Commits que entram | `ff8a843` (home Rua Acesa), `ef0c045` (otimização 3D), `4d4b95e` (menu pelos pilares) |
| Arquivos | 23 arquivos e nenhuma exclusão. A limpeza local de docs **não** entra. |
| Deploy | `Dockerfile`, `docker-compose.yml`, `.dockerignore` e `deploy.yml` intactos na branch. O `.dockerignore` deixa `public/videos/` entrar. `npm ci` resolve o `lenis` pelo lockfile. |
| CI (mesma sequência do `deploy.yml`) | `npm ci` ✓ · `lint` ✓ · `tsc --noEmit` ✓ · `test-quote-validation` ✓ · `build` ✓ (45 rotas) |
| `scripts/check-public-routes.cjs` no build de produção | 39 de 40 destinos OK, incluindo `/`, `/#metodo` e as âncoras novas do `/marketing`. **Falha anterior à branch:** `/templates/seguro-piloto` dá 404 porque a página foi removida no commit `43f5f11`, mas continua listada em `src/data/appCatalog.ts`. Já acontece hoje em produção. |

**Como publicar (escolha uma):**

- **A. Pull request:** push da branch `feat/rua-acesa` e PR para a `main` no GitHub. Revisão no GitHub, e o merge dispara o deploy.
- **B. Direto:**
  ```
  git switch main
  git merge --ff-only feat/rua-acesa
  git push origin main
  ```
  O push dispara o deploy.

**Como desfazer:** `git revert --no-edit e1af5a2..4d4b95e` na `main` e push. O deploy volta à home anterior.

**Pendências que não bloqueiam o merge:**

- ~~Banner de cookies global ainda em lima (`#d4ff38`).~~ Resolvido na branch `fix/cookie-banner-palette`.
- ~~Revisar a pergunta nova do FAQ "O site ajuda a aparecer no Google?".~~ Revisada (20/11/2026) na branch `fix/faq-google`. A primeira versão descrevia entregas de SEO (títulos, descrições, páginas organizadas) que só estão documentadas no serviço mensal "SEO e presença local", e citava só o Presence. A resposta nova usa a pergunta e a base do texto já aprovado em `/criacao-de-sites`, diz que Go, Presence e Pulse incluem SEO básico, não garante posição e separa o acompanhamento contínuo (serviço à parte). O texto visível e o JSON-LD `FAQPage` são idênticos.
- ~~Subtítulo do hero com "coloca o seu negócio no mapa".~~ Trocado (20/11/2026) por "acende a vitrine do seu negócio com um site marcante e SEO básico". O "mapa" podia ser lido como Google Maps, e o Perfil da Empresa no Google só vem no serviço mensal de SEO; também contradizia o card "Google Meu Negócio sem site".
- Testar num celular real (o TBT foi medido com GPU emulada).
- ~~Eventos novos de analytics (seção 7).~~ Feitos (20/11/2026): `home_search_simulated` (`category` + `input` chip/typed; texto livre vira "outro", nada digitado é enviado), `home_video_play` e `home_method_complete`, uma vez por visita. Os botões de WhatsApp da home ganharam `data-analytics-section`/`-interest`, senão só o Pixel contava o clique. Cadastrar os três como eventos/conversões no GA4 é manual.
- ~~Vídeo sem `faststart`.~~ Feito (20/11/2026): o `moov` foi para o início, o logo roxo foi trocado pelo símbolo atual e o arquivo caiu de 5,4 MB para 3,7 MB (ffmpeg instalado pelo winget). `scripts/mp4-faststart.mjs` faz só o `faststart`, sem recodificar.
- ~~Imagem de Open Graph nova.~~ Feita: `public/images/og-rua-acesa.jpg` (1200×630, 69 KB), gerada da cena real, usada só pela home (as páginas internas herdam `site-preview-desktop.webp`).
- ~~Lima das páginas internas.~~ Trocado por âmbar (20/11/2026): lima `#d4ff38` → `#ffb547`, `#bce82c` e variantes de hover → `#e89b2f`, `#e4ff8b` → `#ffd28a`, em tokens globais, CSS modules e componentes. Ficaram de fora as paletas de demos (`templateCatalog.ts`, acento do template academias). Os verdes turquoise/ice das páginas internas (`#10b981`, `#8be7c5`) foram trocados em 20/11/2026 pelo ciano do logo (`#05e5f6`, com `#8ff3fb` de apoio), tokens inclusos, depois de uma primeira passada pelo azul-sinal da home; paletas de demos, o verde do WhatsApp e verdes de sucesso ficaram. O azul `#1f38c0` dos painéis saturados e o azul do banner de cookies continuam.
- ~~O 404 de `/templates/seguro-piloto`.~~ Decisão (19/11/2026): a página é a landing da Costi Seguros, que grava leads reais, e **não volta ao ar**. A entrada saiu do catálogo, do sitemap, do diretório de apps e do CSS de preview (`check-public-routes.cjs`: 39 de 39). A landing (`PilotosLanding.tsx`), a ação `savePilotLead` e o painel `/admin/pilotos` ficaram no código. Para republicar: restaurar a rota com `git show 43f5f11^:"src/app/(demos)/templates/seguro-piloto/page.tsx"` e a entrada em `appCatalog.ts`.

### Depois do lançamento: SEO, pilares e limpeza (20/11/2026)
- **SEO orgânico:** nova `/seo-para-negocios-locais` (SEO básico dos planos de site e serviço de SEO e presença local, sem prometer posição) e 6 páginas `/sites-para/[segmento]` (dentistas, pizzarias, eletricistas, advogados, pet shops, barbearias), com recursos filtrados contra `sitePlans.ts`. Schema `Service`, `FAQPage` e `BreadcrumbList` nas páginas de serviço (`src/lib/seo.ts`), `Organization` com descrição e Instagram, sitemap com prioridades por pilar. Registro DNS do Google Search Console criado na Hostinger; falta verificar o domínio e enviar o sitemap.
- **Pilar 2, `/design`:** motion graphics em primeiro lugar, com o vídeo real (lazy, com poster), portfólio filtrável de 12 trabalhos (`src/data/designPortfolio.ts`), faixa de prazos por pacote e bloco de motion sob medida.
- **Pilar 3, `/redes-sociais`:** plano Presença Ativa, complementos, exclusões e FAQ, tudo dos dados de `marketingPlans.ts`.
- **Acessibilidade:** home e páginas internas medidas com script próprio (contraste mínimo de 4,5:1 e ordem dos títulos); `/contato` tinha dois `h1`. Contraste de textos opacos em mocks (labels de 7 px de demos) e estados desabilitados não foi tratado.
- **Performance da home:** framer-motion e o chrome animado saíram do JS inicial (cerca de 216 KB para 161 KB gzip) e a cena 3D começa em idle depois do `load`. Lighthouse oficial a rodar depois do deploy.
- **Limpeza:** 30 componentes sem rota removidos (`PilotosLanding` ficou), dependência `@heroicons/react` removida.

### Fase 6 — Lançamento
- [ ] Revisão final com você na branch.
- [ ] Merge na `main` (dispara o deploy).
- [ ] Conferir o site no ar e o Search Console.
- [ ] Plano de volta: revert do merge.
- [x] Depois de estável: remover `ControlledChaos` e os componentes que só ele usava (20/11/2026, 30 arquivos).

---

## 9. Pendências e decisões abertas

| # | Pendência | Quem decide |
| --- | --- | --- |
| 1 | ~~A limpeza local apagou os arquivos de deploy (Docker).~~ Resolvido em 19/11/2026: `Dockerfile`, `docker-compose.yml` e `.dockerignore` restaurados do último commit. | — |
| 2 | Confirmar os 7 itens do recibo (seção 5.3). | Você |
| 3 | Interesse do CTA no formulário: usar `institucional` ou criar um interesse `presence`. | Você |
| 4 | Aprovar a dependência `lenis`. | Você |
| 5 | ~~Reexportar o vídeo em MP4 web com pôster.~~ Feito em 20/11/2026 (faststart, logo atual e poster). | — |
| 6 | ~~Imagem de Open Graph nova a partir da cena.~~ Feita. | — |
| 8 | Verificar o domínio no Search Console e enviar `sitemap.xml`; cadastrar os eventos `home_search_simulated`, `home_video_play`, `home_method_complete` e `design_video_play` no GA4. | Você |
| 9 | URL da página do Facebook para o `sameAs` do schema. | Você |
| 10 | Confirmar que os 12 clientes do portfólio de `/design` podem aparecer. | Você |
| 7 | Depoimentos reais, quando existirem, voltam como bloco próprio. | Você |

---

## 10. Fora desta fase (próximas)

- **Identidade nova nas páginas internas:** `/criacao-de-sites`, `/lojas-virtuais`, `/design`, `/marketing`, `/apps`, `/quem-somos`, `/contato`. Depois disso, trocar os tokens globais (lima → âmbar/azul-noite) em `globals.css`.
- ~~Renomear e reposicionar `/marketing`~~ para separar "Redes sociais" de "Tráfego pago": feito em parte. `/redes-sociais` e `/seo-para-negocios-locais` existem e o título de `/marketing` segue a ordem dos pilares; a página `/marketing` ainda reúne SEO, redes e tráfego.
- **SEO local**, retomando o "Plano de crescimento orgânico" (backup): as páginas por segmento estão feitas. Faltam as páginas por cidade ("Criação de sites em Porto Alegre"…) e conteúdos como "Como saber se sua empresa precisa de um site ou só melhorar o Google".
- **Versão da Rua Acesa para as páginas de serviço:** cada pilar com sua própria cena curta, na mesma linguagem visual.
