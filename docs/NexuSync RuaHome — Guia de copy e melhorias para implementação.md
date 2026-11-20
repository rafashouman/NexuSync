# NexuSync RuaHome — Guia de copy e melhorias para implementação

Nov 20, 2026 · @Rafael

## Como usar este documento

Este guia troca a mensagem da home (`RuaHome`) sem mexer em nenhuma interação: a rua 3D, o simulador de busca, os cards que acendem e apagam, o relógio, a furadeira, o método com etapas, o recibo, os andares dos pilares, o FAQ e a chamada final continuam iguais. Mudam textos, rótulos, links e alguns detalhes visuais pequenos indicados em cada bloco.

Instruções para a IA que vai implementar:

1. Trabalhe numa branch nova (ex.: `copy/rua-home-v2`) e faça um commit por bloco.
2. Troque só o que está indicado. Não altere CSS, animações, `RuaEffects.tsx`, `RuaWorld.tsx` nem a lógica de `world/scene.ts` (só a constante de rótulos citada no bloco 03).
3. Mantenha todos os `id` e `data-*` usados pelas animações e as quantidades fixas (ver seção de arquivos).
4. Preços, prazos e itens do plano vêm sempre de `src/data/sitePlans.ts`. Nunca escreva valor fixo no texto.
5. Não invente números, avaliações, depoimentos ou clientes. Onde houver dúvida, deixe como está e anote na lista de pendências.
6. Textos entre aspas neste guia são finais. Respeite a pontuação e as maiúsculas.
7. Ao terminar, rode `npm run lint` e `npm run build` e confira a home no celular.

## Nova direção da mensagem

A história continua na rua à noite, mas o vilão muda: antes era o concorrente que aparecia no Google; agora é a distância entre o valor do negócio e o jeito como ele aparece online. Aparecer na busca vira o começo, e ser escolhido vira o objetivo.

| Item | Antes | Agora |
| --- | --- | --- |
| Promessa | Aparecer no Google antes do concorrente | Um site sob medida e interativo que faz o cliente explorar e dar o próximo passo |
| Público principal | Negócios locais que vivem de indicação | Pequenas empresas e marcas cujo trabalho é melhor do que a presença online mostra |
| Papel do SEO | Protagonista | Base técnica, presente em todo projeto, sem prometer posição |
| Prova | Busca simulada | A própria home e as demonstrações em `/templates` |
| Ação principal | "Quero ver meu orçamento" | "Pedir minha proposta" |
| Serviços secundários | Redes sociais e tráfego como pilares | Design e motion como complemento; redes e tráfego só citados |

Tom: frases curtas e concretas, o leitor como sujeito, nenhuma promessa de resultado. Palavras a evitar por repetição: "experiência" (no máximo uma vez por bloco), "inovador", "faz a diferença", "com personalidade".

A palavra "orçamento" sai dos botões e do método. Hoje ela tem três sentidos (cotação, recibo com preço fixo e nome do método), e o hero promete orçamento em 7 dias para um plano com preço já publicado.

## Arquivos a alterar e o que não tocar

| Arquivo | O que muda |
| --- | --- |
| `src/app/(site)/page.tsx` | title, description, alt da imagem OG, `serviceType` do JSON-LD |
| `src/components/rua/content.ts` | `attempts`, `phases` (só texto), `pillars`, `faqs`, nova função de link de proposta |
| `src/components/rua/RuaHome.tsx` | textos de todos os blocos, rótulos do menu, botões, `MARQUEE` |
| `src/components/rua/SearchSimulator.tsx` | chips e conteúdo dos dois resultados |
| `src/components/rua/VideoModal.tsx` | rótulo do botão do vídeo |
| `src/components/rua/world/scene.ts` | só a constante `ATTEMPT_LABELS` |
| `src/lib/analytics.ts` | tipo `HomeSearchCategory` (novos chips) |

Não tocar (as animações dependem disso):

- IDs: `rua-hl`, `rua-timer`, `rua-chain`, `rua-drill` e filhos, `rua-track`, `rua-step`, `rua-segs`, `rua-phases`, `rua-receipt`, e os atributos `data-rua-line`, `data-key`, `data-rua-grab`, `data-rua-search`.
- Quantidades: `attempts` e `ATTEMPT_LABELS` continuam com 6 itens, na mesma ordem; `phases` com 4; a cadeia `#rua-chain` com 4 `span`; o recibo com os itens vindos de `receiptItems`.
- Classes CSS e a ordem das seções.
- Os eventos `rua:pulse` e `rua:attempt` e os eventos de analytics existentes (só amplie o tipo).

## Metadados e dados estruturados (`page.tsx`)

A busca e o compartilhamento passam a falar de sites personalizados e interativos, não de SEO local.

| Campo | Atual | Novo |
| --- | --- | --- |
| `title` | Criação de Sites e SEO Orgânico para Negócios Locais \| NexuSync | Criação de Sites Personalizados e Interativos \| NexuSync |
| `description` | Seu concorrente já aparece no Google… Orçamento completo em 7 dias. | Sites sob medida, landing pages, hotsites e catálogos digitais com interações que fazem o cliente explorar. Leves no celular e com SEO desde a base. |
| `serviceType` (JSON-LD) | Criação de sites com SEO básico | Criação de sites personalizados |
| `name` do Service | Criação de site — plano Presence | manter |

Imagem de compartilhamento: `og-rua-acesa.jpg` mostra o concorrente em 1º na busca. Enquanto não houver imagem nova, mantenha o `alt` descrevendo o que a imagem mostra. Quando trocar a imagem (sugestão: a rua à noite com várias vitrines acesas, cada uma com um tipo de site), use o alt: "Rua à noite com vitrines acesas, cada uma mostrando um tipo de site: NexuSync, sites personalizados e interativos".

O FAQ do JSON-LD se atualiza sozinho a partir de `faqs` em `content.ts`.

## Header

O menu ganha um atalho para as demonstrações e o botão deixa de falar em orçamento.

| Elemento | Atual | Novo |
| --- | --- | --- |
| Link 1 (`#tentativas`) | O que não funciona | O que você já tentou |
| Link 2 (`#metodo`) | Método | Método |
| Link 3 (`#praquem`) | Pra quem é | Pra quem é |
| Link 4 (`#entregaveis`) | Entregáveis | Planos |
| Link 5 | Pilares (`#pilares`) | Demonstrações (`/templates`, componente `Link`) |
| Botão (texto longo) | Quero ver meu orçamento | Pedir minha proposta |
| Botão (texto curto) | Orçamento | Proposta |

O destino do botão continua o mesmo (`quoteHref`). Se quiser deixar o código mais claro, renomeie `QuoteButton` para `ProposalButton`, sem mudar o link.

## Bloco 01 — Hero e simulador de busca

O hero deixa de dizer "você não aparece" e passa a dizer "aparecer não basta". O simulador continua igual na mecânica (digitar, chips, resultados, luz no título), mas os dois resultados agora comparam um site padrão com um site da NexuSync.

### Textos do hero (`RuaHome.tsx`)

| Elemento | Atual | Novo |
| --- | --- | --- |
| Eyebrow | NexuSync · sites para negócios locais | NexuSync · sites sob medida e interativos |
| H1 | O concorrente da sua rua \[já aparece no Google\] quando alguém pesquisa o seu serviço. | Seu negócio é único. \[Seu site também deveria ser.\] |
| Subtítulo | E quem não encontra você liga pra ele… Seu orçamento completo sai em 7 dias. | A NexuSync cria sites, landing pages, hotsites e catálogos digitais sob medida, com interações que fazem o cliente explorar o que você oferece. Leves até no celular e com SEO desde a base. Planos a partir de R$ {preço do Go}. |
| Bullet 1 | Quem pesquisa escolhe entre os primeiros resultados… | Quem chega pela busca, por indicação ou pelo Instagram **quer entender rápido o que você oferece.** |
| Bullet 2 | Instagram e indicação não aparecem quando alguém digita "perto de mim". | Site montado em construtor pronto **fica parecido com o de qualquer concorrente.** |
| Bullet 3 | Orçamento fechado em 7 dias, com preço, prazo e tudo o que está incluso. | Proposta com **preço, prazo e tudo o que está incluso** antes de você decidir. |
| Botão principal | Quero ver meu orçamento | Pedir minha proposta |
| Botão do vídeo (`VideoModal`) | Assista ao vídeo · 21 segundos | Veja um pedido online · 21 segundos |
| Dica de rolagem | role para acender a sua vitrine · arraste para girar a rua | manter |

Regras do hero:

- O trecho entre colchetes do H1 fica dentro de `<span id="rua-hl" className={s.hl} data-lit="false">`. "Seu site também deveria ser." acende quando o simulador mostra o resultado.
- O preço do subtítulo vem de `sitePlans.find(p => p.name === "Go").price`.
- Logo abaixo dos dois botões, adicione um link de texto: "ou experimente uma demonstração →" apontando para `/templates`. Reaproveite a classe `s.floorLink`.

### Simulador (`SearchSimulator.tsx`)

| Elemento | Atual | Novo |
| --- | --- | --- |
| Título do card | Simule uma busca na sua cidade | Simule uma busca. Qual resultado você abriria? |
| `CHIPS` | dentista, pizzaria, eletricista, barbearia | hamburgueria, loja de roupas, dentista, barbearia |
| `CYCLE` (digitação automática) | dentista, pizzaria, eletricista, advogado, pet shop, barbearia | hamburgueria, dentista, loja de roupas, advogado, pet shop, barbearia |
| Resultado de cima (`li.top`, aceso) | {Serviço} · seu concorrente / ★ 4,8 · a 300 m · aberto agora / Site, Rotas, Ligar | **Sua empresa · {Serviço}** / {recursos do segmento} / Explorar, Rotas, Ligar |
| Resultado de baixo (`li.you`, apagado) | Sua empresa / Nenhum resultado encontrado. | **{Serviço} · site padrão** / Início · Sobre · Contato. Nada para explorar. |

Recursos por segmento (crie um mapa `DEMO_BY_CATEGORY` no próprio arquivo):

| Chip | Linha de recursos | Link de "Explorar" |
| --- | --- | --- |
| hamburgueria | Monte seu pedido · cardápio com fotos | `/templates/cardapio` (Kobra Burger Fire) |
| loja de roupas | Vitrine da coleção · peças por categoria | `/templates/streetwear` (Vortex Atelier) |
| qualquer outro | Serviços explicados · agenda · WhatsApp | `/templates` |

Detalhes do simulador:

- Mantenha as classes `s.top` e `s.you`: o resultado aceso passa a ser o da "Sua empresa". Só o conteúdo troca.
- "Explorar" vira um `<a>` real para o link da tabela; "Rotas" e "Ligar" continuam decorativos.
- Em `src/lib/analytics.ts`, acrescente `"hamburgueria"` e `"loja de roupas"` ao tipo `HomeSearchCategory`. Não remova os valores antigos, para não quebrar o histórico.
- Confira na rua 3D se algum rótulo ou letreiro ainda diz "concorrente". Se disser, troque pelo nome genérico "site padrão".

## Faixa marquee

A faixa passa a listar o que a NexuSync entrega, com a interatividade em destaque.

- Atual: `["Sites marcantes", "SEO orgânico", "Motion graphics", "Redes sociais", "Landing pages", "Hotsites"]`
- Novo: `["Sites sob medida", "Landing pages", "Hotsites interativos", "Catálogos digitais", "Gamificação", "SEO desde a base"]`

## Bloco 02 — As três cenas (`#dor`)

As três cenas e seus mockups ficam; muda a dor de cada uma. A cena 1 sai de "não achou" para "achou e não gostou", a cena 2 de "alcance caindo" para "informação espalhada", e a cena 3 quase não muda.

Eyebrow da seção: manter "Você já viveu essa cena".

### Cena 1 — A indicação

| Elemento | Atual | Novo |
| --- | --- | --- |
| Rótulo | Cena 1 de 3 · A reunião | Cena 1 de 3 · A indicação |
| H2 | A reunião foi ótima. No dia seguinte, o cliente pesquisou o nome da sua empresa. | Alguém indicou você. A pessoa abriu seu site e não achou o que procurava. |
| Mock: campo | sua empresa ltda | manter |
| Mock: `mNone` | Nenhum resultado encontrado para "sua empresa ltda". | 1 resultado · sua-empresa.com.br · "Serviços: em breve" |
| Mock: `mSug` | Você quis dizer: concorrente da sua rua? | Próxima aba aberta: \<u>concorrente da sua rua\</u> |
| `aria-label` do mock | Exemplo de busca sem resultado | Exemplo de site sem as informações que o cliente procurava |

### Cena 2 — O Instagram

| Elemento | Atual | Novo |
| --- | --- | --- |
| Rótulo | Cena 2 de 3 · O Instagram | manter |
| H2 | O Instagram que trazia clientes agora mal chega aos seus próprios seguidores. | Seu negócio tem mais para mostrar do que cabe num feed. |
| Legenda do gráfico (`mCap`) | Alcance dos posts · ilustrativo | Mensagens perguntando preço e horário · ilustrativo |
| Linha do SVG | descendo | subindo: `points="10,92 70,86 130,70 190,58 250,38 310,26"` e o círculo final em `cx="310" cy="26"` |
| `aria-label` do SVG | Linha de alcance caindo ao longo de seis meses | Linha de mensagens repetidas subindo ao longo de seis meses |

### Cena 3 — O domingo

| Elemento | Atual | Novo |
| --- | --- | --- |
| Rótulo | Cena 3 de 3 · O domingo | manter |
| H2 | Num domingo, você abriu o Wix. Três horas depois, fechou a aba. | Num domingo, você abriu um construtor de sites. Três horas depois, fechou a aba. |
| Mock do editor | Editor · salvo há 3 h / Arraste um elemento aqui | manter |
| Fechamento | Não falta esforço. \[Falta estrutura.\] | Não falta esforço. \[Falta um site à altura do seu trabalho.\] |

O trecho entre colchetes do fechamento fica no `<span>` que já existe.

Não use a palavra "template" nem "modelo pronto" como vilão nesta seção: a galeria de demonstrações da NexuSync fica em `/templates`.

## Bloco 03 — O que você já tentou (`#tentativas`)

Os seis cards continuam com "Acende" e "Apaga" e com as placas da rua 3D. A mudança é o tom: cada ferramenta tem mérito real, e o fecho diz que o site junta tudo, em vez de dizer que nada funciona. Cada linha tem no máximo umas 10 palavras para caber no card.

| Elemento | Atual | Novo |
| --- | --- | --- |
| Eyebrow | O que você já tentou | manter |
| H2 | Seis jeitos de aparecer. Todos acendem por um tempo e apagam. | Seis jeitos de se apresentar online. Cada um acende só uma parte. |
| Lead | Passe o mouse em cada um e veja a luz que ele dá ao seu negócio. | Toque ou passe o mouse em cada um e veja o que ele ilumina e o que deixa no escuro. |
| Rodapé (`triesFoot`) | Cada um resolve um pedaço. Nenhum coloca você na frente de quem está procurando o seu serviço agora. | Você não precisa abandonar nenhum deles. Precisa de um lugar que junte tudo e faça o visitante querer ficar: o seu site. |

### Novo array `attempts` (`content.ts`), mesma ordem

| # | `name` | `up` (Acende) | `down` (Apaga) |
| --- | --- | --- | --- |
| 1 | Instagram | desperta curiosidade e mantém sua marca presente. | serviços, preços e detalhes se perdem no feed. |
| 2 | Perfil da Empresa no Google | mostra endereço, horário e avaliações. | não tem espaço para mostrar seu trabalho de verdade. |
| 3 | Construtor de sites | você publica uma página sozinho. | o modelo limita, e o seu tempo sai do negócio. |
| 4 | Site feito por IA | sai do zero em minutos. | fica parecido com mil outros, e o cliente percebe. |
| 5 | Cartão de visita | quem já te conheceu guarda o contato. | não mostra seu catálogo nem seus diferenciais. |
| 6 | WhatsApp | conversa direta com quem quer comprar. | você responde as mesmas perguntas o dia todo. |

### Placas da rua 3D (`world/scene.ts`)

`ATTEMPT_LABELS` passa a ser: `["INSTAGRAM", "PERFIL NO GOOGLE", "CONSTRUTOR DE SITES", "SITE POR IA", "CARTÃO DE VISITA", "WHATSAPP"]`.

Confira se "CONSTRUTOR DE SITES" cabe na placa (o canvas tem 512 px de largura e o texto é centralizado em 256). Se cortar, use "CONSTRUTOR".

"Google Meu Negócio" sai porque o Google renomeou o serviço para Perfil da Empresa no Google.

## Bloco 04 — O relógio (`#agora`)

O relógio deixa de criar urgência e vira prova: o visitante ficou na página por curiosidade, e é isso que a NexuSync vende.

| Elemento | Atual | Novo |
| --- | --- | --- |
| H2 | Você está nesta página há \[0:00\]. | manter (o `span#rua-timer` continua igual) |
| Lead | Quem pesquisa o seu serviço decide bem mais rápido que isso. E escolhe quem aparece primeiro. | Ninguém pediu para você ficar. Foi a curiosidade. É isso que o seu cliente deveria sentir no seu site. |
| Botão principal | Quero ver meu orçamento | Quero um site assim |
| Botão secundário | Falar no WhatsApp | manter |
| Linha do telefone | WhatsApp 51 99358-3936 | manter |

O botão "Quero um site assim" usa o mesmo link de proposta, com `source="sites"`.

## Bloco 05 — A furadeira e o método (`#metodo`)

A metáfora da furadeira e a animação ficam como estão. O texto amplia o resultado além do "telefone tocando", e o método perde o nome "Orçamento em 7 Dias".

| Elemento | Atual | Novo |
| --- | --- | --- |
| Eyebrow | O método | manter |
| H2 | Ninguém compra uma furadeira porque quer uma furadeira. | manter |
| Lead | …Você não precisa de um site: precisa do telefone tocando. Por isso o nosso método começa pelo resultado e termina com um orçamento fechado. | Compra porque quer o furo na parede. E quer o furo porque quer o quadro pendurado. Com site é igual: você não precisa de páginas e botões. Precisa que as pessoas entendam o seu valor e chamem você. Por isso o método começa pelo objetivo e só depois vai para a tela. |
| Cadeia `#rua-chain` | furadeira → furo → quadro → telefone tocando | manter (os 4 itens acompanham as 4 etapas da animação) |
| Nome do painel (`mname`) | Método Orçamento em 7 Dias | Método NexuSync · do objetivo à publicação |

### Etapas (`phases` em `content.ts`, continuam 4)

| # | Título | Texto novo |
| --- | --- | --- |
| 1 | Entendemos seu negócio | Conte o que sua empresa oferece, quem atende e o que quer que o visitante faça no site. Não precisa conhecer termos técnicos. |
| 2 | Definimos a proposta | manter: "Você recebe o escopo, o investimento, o prazo e os materiais necessários antes de decidir." |
| 3 | Criamos e apresentamos | Unimos design, conteúdo e interações e mostramos para sua revisão, com os ajustes previstos na proposta. |
| 4 | Publicamos e orientamos | manter: "Depois da sua aprovação, colocamos o projeto no ar e explicamos os próximos passos." |

## Bloco 06 — Pra quem é (`#praquem`)

A seção "pra quem não é" fica: ela filtra curiosos e dá confiança. As listas trocam o foco de "ser encontrado" para "ser bem apresentado".

| Elemento | Atual | Novo |
| --- | --- | --- |
| Eyebrow | Antes de pedir o orçamento | Antes de pedir sua proposta |
| H2 | Pra quem é. E pra quem não é. | manter |
| Títulos das colunas | É pra você se / Não é pra você se | manter |

"É pra você se" (4 itens, substituem os atuais):

- seu negócio é bom, mas a presença online ainda não mostra isso;
- você quer um site com a cara da sua marca, não igual ao do vizinho;
- você tem produtos, serviços ou uma novidade que merecem ser explorados;
- você prefere decidir com preço, prazo e escopo na mão.

"Não é pra você se" (3 itens):

- você procura o site mais barato possível, de qualquer jeito; *(manter)*
- você quer animação só por enfeite, sem um objetivo por trás;
- você espera posição garantida no Google ou resultado sem mudar nada no atendimento.

## Bloco 07 — O recibo (`#entregaveis`)

O recibo que se imprime na rolagem fica. Ele deixa de se chamar "orçamento" e ganha uma linha que mostra os outros planos, para quem precisa de menos ou de mais.

| Elemento | Atual | Novo |
| --- | --- | --- |
| Eyebrow | O que entra no seu orçamento | Plano recomendado |
| H2 | Sete entregas. Um preço fechado. | `{receiptItems.length} entregas. Um preço fechado.` (número calculado, não escrito à mão) |
| Cabeçalho do recibo | NEXUSYNC · ORÇAMENTO | NEXUSYNC · RECIBO |
| Linhas do plano e prazo | Plano Presence · recomendado / Entrega estimada: 5 a 10 dias úteis | manter (vêm de `sitePlans`) |
| Itens | 7 itens "incluso" | manter |
| "De R$ 599" riscado | sempre visível | manter só se o dono confirmar que esse preço foi cobrado (ver pendências) |
| Nota | Registro de domínio e hospedagem são orçados à parte. | manter |
| Rodapé do recibo | obrigado por aparecer. | obrigado por chegar até aqui. |
| Botão | Quero ver meu orçamento | Pedir minha proposta |

Acrescente, entre o recibo e o botão, um parágrafo curto (preços vindos de `sitePlans`):

> Precisa de algo mais enxuto? Plano Go por R$ {Go}. Quer mais estrutura e recursos? Plano Pulse por R$ {Pulse}. Hotsites interativos e gamificação têm proposta sob medida.

Ao lado do botão, um link de texto "Comparar os planos →" para `/criacao-de-sites`.

## Bloco 08 — Os pilares (`#pilares`)

Os quatro andares ficam, mas passam a descrever como um site da NexuSync é construído. Redes sociais e tráfego pago saem dos andares e viram uma linha abaixo deles.

| Elemento | Atual | Novo |
| --- | --- | --- |
| Eyebrow | Os pilares da NexuSync | manter |
| H2 | Primeiro a vitrine acende. Depois a rua inteira vê. | manter |
| Lead | Trabalhamos em quatro pilares, nessa ordem… o anúncio pago é o último andar, nunca o alicerce. | Todo site nosso é construído em quatro andares, nessa ordem. Cada um se apoia no anterior. |

### Novo array `pillars` (`content.ts`)

| # | `title` | `text` | `tag` | `href` / `cta` |
| --- | --- | --- | --- | --- |
| 1 | Estrutura e estratégia | Cada informação no lugar certo, para o visitante entender sua proposta e achar o que procura. | Alicerce | `/criacao-de-sites` / Como criamos sites |
| 2 | Design e identidade | Sua marca reconhecível em cada tela, e também em anúncios, motion graphics e vídeos. | — | `/design` / Ver design e motion |
| 3 | Interatividade | Cardápios que montam o pedido, vitrines, jornadas guiadas e gamificação. Sempre com um objetivo. | — | `/templates` / Experimentar as demonstrações |
| 4 | Performance e SEO | Leve até em celular com alguns anos de uso e organizado para os buscadores. Sem prometer posição no Google. | Em todos os andares | `/seo-para-negocios-locais` / Como trabalhamos o SEO |

Abaixo da lista de andares, acrescente uma linha pequena:

> Com o site de pé, também cuidamos de redes sociais e tráfego pago.

O destaque visual do primeiro andar (`s.base`) e o estilo das tags continuam como estão.

## FAQ (`#faq`)

O FAQ passa de 5 para 7 perguntas: entram preço e interatividade, que são as dúvidas mais prováveis depois da nova mensagem. As respostas sobre SEO, materiais e domínio continuam, porque são honestas e precisas.

Eyebrow "Perguntas frequentes" e H2 "Antes de decidir.": manter.

Novo array `faqs`, nesta ordem (os preços entram com template string a partir de `sitePlans`):

1. **Qual tipo de site é indicado para meu negócio?** manter a resposta atual.
2. **Quanto custa criar meu site?** *(nova)* Os planos de site vão de R$ {Go} (Go) a R$ {Pulse} (Pulse), e o que cada um inclui está descrito na página de criação de sites. Hotsites interativos, gamificação e recursos sob medida recebem proposta própria, com escopo, prazo e investimento antes de você decidir.
3. **Meu site pode ter animações, quiz ou gamificação?** *(nova)* Sim. Animações, quizzes, escolhas guiadas e gamificação podem entrar quando ajudam o visitante a entender ou escolher. O tipo de interação é definido na proposta, sempre pensando em usabilidade e no desempenho no celular.
4. **O site vai aparecer no Google?** manter a resposta atual.
5. **Preciso fornecer textos, fotos e logotipo?** manter a resposta atual.
6. **Domínio e hospedagem estão incluídos?** manter a resposta atual.
7. **O site funciona no celular?** Sim. Os sites são adaptados para celular, tablet e computador e pensados para carregar rápido mesmo em aparelhos mais simples, com atenção à leitura, à navegação e aos botões de contato.

## Chamada final e rodapé (`#final`)

O fecho repete a ideia do hero: o objetivo não é só ser encontrado, é fazer o cliente ficar.

| Elemento | Atual | Novo |
| --- | --- | --- |
| Eyebrow | A próxima busca | A próxima visita |
| H2 | Na próxima busca, quem aparece é você. | Na próxima visita, o cliente fica. |
| Botão principal | Quero ver meu orçamento | Pedir minha proposta |
| Botão secundário | Falar no WhatsApp | manter |
| Link novo, abaixo dos botões | — | ou explore as demonstrações → (`/templates`, classe `s.floorLink`) |
| Linha de contato | e-mail e WhatsApp | manter |
| Rodapé, frase do meio | Sites, design, redes sociais e tráfego pago, nessa ordem. | Sites sob medida e interativos. Design, redes e tráfego quando a base está pronta. |
| Rodapé, links | Quem somos · Privacidade | manter |

## Checklist de verificação e pendências

A IA que implementar deve conferir cada item abaixo antes de abrir o pull request.

- [ ] Nenhuma ocorrência de "orçamento" em botões, no menu ou no método (busca em `src/components/rua`). A nota "orçados à parte" do recibo pode ficar.
- [ ] Nenhuma ocorrência de "seu concorrente" no simulador nem em `scene.ts`.
- [ ] Preços do hero, do recibo, do parágrafo de planos e do FAQ vêm de `sitePlans`; nenhum valor escrito à mão.
- [ ] `attempts` e `ATTEMPT_LABELS` com 6 itens; `phases` com 4; `#rua-chain` com 4 `span`.
- [ ] O título acende ("Seu site também deveria ser.") quando o simulador mostra o resultado, nos chips e na digitação.
- [ ] "Explorar" no simulador abre `/templates/cardapio`, `/templates/streetwear` ou `/templates`, conforme o chip.
- [ ] Placas da rua 3D legíveis, sem texto cortado.
- [ ] Cards de tentativas sem quebra feia em 360 px de largura.
- [ ] Com `prefers-reduced-motion` ativo, a página continua legível e o recibo aparece completo.
- [ ] `npm run lint` e `npm run build` sem erros; home testada num celular intermediário.

Pendências que só o dono pode resolver (a IA não deve decidir):

- [ ] Confirmar se o preço "De R$ 599" do Presence foi realmente cobrado antes. Se não, remover o riscado.
- [ ] H1 definido: "Seu negócio é único. Seu site também deveria ser."
- [ ] Criar uma nova imagem de compartilhamento (`og-rua-acesa.jpg`) sem o concorrente em 1º.
- [ ] Se houver sites de clientes publicados, avaliar um bloco curto de projetos reais. Nada de depoimentos ou números inventados.
