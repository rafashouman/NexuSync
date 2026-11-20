# NexuSync RuaHome — Alterações revisadas (v2)

Nov 20, 2026 · @Rafael

## Regra geral

A história é sobre presença online (negócio sem site, com site lento ou com um site que não mostra o trabalho), não sobre aparecer em buscas. Todo título fala com uma pessoa e nunca dá instrução.

- Nada de Google, ranking ou "ficar em primeiro" como argumento.
- Nada de metáforas que um cliente leigo não entende ("acender a vitrine", a cadeia da furadeira).
- Nada de linguagem de vendedor de curso ("método").
- Nada de tráfego pago na home.
- Instruções de interação ("toque", "passe o mouse") ficam em legendas pequenas, nunca em títulos ou leads.
- A estrutura interativa da home continua a mesma; mudam textos, mockups e a ordem dos pilares.

## Hero e menu

O card destacado do simulador passa a ser o concorrente com um site como os que a NexuSync faz. O card apagado é o negócio do visitante, sem site ou com site ruim.

### 1. Simulador

| Elemento | Novo |
| --- | --- |
| Título do card | Digite o seu ramo e compare |
| Selo "perto de mim" no campo | remover (é linguagem de busca) |
| Card aceso | **{Ramo} · concorrente** / Cardápio com fotos · pedido pelo WhatsApp · abre rápido no celular / botão "Ver um exemplo", que leva à demo do ramo |
| Card apagado | **Seu negócio**, alternando a cada busca entre os três estados abaixo |

Estados do card apagado:

- Sem site · só um perfil no Instagram
- Site lento · ainda carregando…
- Site antigo · informações desatualizadas

### 2. Bullets do hero

- Sem site, quem ouve falar de você **não tem onde conhecer o seu trabalho.**
- Site lento ou desatualizado **faz o cliente desistir antes de chamar você.**
- Proposta com **preço, prazo e tudo o que está incluso** antes de você decidir. *(mantém)*

### 3. Preço do subtítulo

O texto publicado diz R$ 299,00, mas `sitePlans.ts` tem o Go a R$ 297,00. O valor certo é R$ 297,00. Corrigir o texto para que o número venha sempre do arquivo, nunca digitado.

### 4. Dica de rolagem

"role para acender a sua vitrine · arraste para girar a rua" → **"Role para ver como isso acontece ↓"** (ou remover).

### 5. Menu

| Atual | Novo |
| --- | --- |
| Método | Como funciona |
| Demonstrações | Exemplos |

## As três cenas

A abertura da seção ganha destaque e os três mockups trocam busca, gráfico e editor por situações que um cliente leigo reconhece na hora.

### 6. Abertura da seção

- "Você já viveu essa cena" deixa de ser eyebrow e vira H2 grande: **"Talvez você já tenha vivido uma destas situações."**
- Em cada cena, o título vem primeiro e o rótulo "1 de 3" fica pequeno abaixo dele (ou some e vira pontinhos de progresso).

### 7. Cena 1 — sem o mock de busca

| Elemento | Novo |
| --- | --- |
| Título | Um cliente indicou você. Quando a pessoa foi conhecer seu trabalho, não tinha nada para ver. |
| Mock | barra de navegador "sua-empresa.com.br" → "Página em construção · volte em breve" → rodapé "A pessoa fechou e foi falar com outro." |

### 8. Cena 2 — sem o gráfico

| Elemento | Novo |
| --- | --- |
| Título | Seu Instagram é bonito. Mas o cliente ainda precisa perguntar tudo por mensagem. |
| Mock | três balões de conversa ("Qual o preço?", "Vocês abrem sábado?", "Tem catálogo?") e embaixo "…e as mesmas perguntas, todo dia." |

### 9. Cena 3 — sem o editor

| Elemento | Novo |
| --- | --- |
| Título | Você tentou fazer o site sozinho. Ficou pela metade. |
| Mock | barra "Seu site · 30% pronto" e a lista ✓ Escolher modelo · ✕ Textos · ✕ Fotos · ✕ Publicar |
| Fechamento | mantém: "Não falta esforço. Falta um site à altura do seu trabalho." |

## Tentativas e relógio

O título e o lead das tentativas param de dar instrução e passam a falar com o cliente. No relógio, sai o texto solto.

### 10. Tentativas

| Elemento | Novo |
| --- | --- |
| H2 | Você já tentou de tudo. Cada solução resolve só um pedaço. |
| Lead | Instagram, WhatsApp, cartão, perfil no Google: todos ajudam. Mas nenhum mostra tudo o que seu negócio faz, num lugar só. |
| "Toque ou passe o mouse…" | vira uma legenda pequena, no estilo do eyebrow |
| Placa 3D "CONSTRUTOR DE SITES" (está cortada) | CONSTRUTOR |

### 11. Relógio

Remover o texto solto "WhatsApp 51 99358-3936" abaixo dos botões. O botão do WhatsApp já cumpre esse papel.

## Como funciona e Pra quem é

A analogia da furadeira fica, mas a cadeia passa a falar de site. A coluna que afastava clientes vira a lista do que eles recebem.

### 12. Cadeia da furadeira (mantém os 4 itens da animação)

- Atual: furadeira → furo → quadro → telefone tocando
- Novo: **site novo → cliente entra → entende o que você faz → chama você**

### 13. Nome do painel

"Método NexuSync · do objetivo à publicação" → **"Como criamos o seu site"**

### 14. Pra quem é

H2: **"Pra quem é. E o que você recebe."** A coluna "Não é pra você se" sai e vira "O que você recebe". A estrutura de duas colunas continua.

| Pra quem é | O que você recebe |
| --- | --- |
| você ainda não tem site e depende do Instagram ou do WhatsApp | preço, prazo e escopo antes de começar |
| seu site está lento, antigo ou não mostra o que você faz hoje | um site que abre rápido até em celular simples |
| você quer um site com a cara da sua marca | ajustes previstos na proposta |
| você tem produtos ou serviços que merecem ser vistos com calma | orientação para atualizar depois |

## Planos e pilares

O título dos planos para de prometer o que não acontece, e os pilares passam a ter uma ordem e um nome que o cliente entende.

### 15. Planos

"Escolha o plano. O recibo sai na hora." → **"Escolha um plano e veja o que vem incluso."**

### 16. Título dos pilares

| Elemento | Atual | Novo |
| --- | --- | --- |
| H2 | Primeiro a vitrine acende. Depois a rua inteira vê. | O que todo site da NexuSync tem. |
| Lead | — | Quatro cuidados, do primeiro rascunho à publicação. |

### 17. Ordem dos pilares

- Exibir de 01 a 04, de cima para baixo, aparecendo nessa sequência conforme a rolagem.
- Remover as tags "Alicerce" e "Em todos os andares".

### 18. Redes sociais e tráfego pago

- Remover a linha "Com o site de pé, também cuidamos de redes sociais e tráfego pago", aqui e no rodapé.
- Opcional no lugar: **"Também criamos design, motion graphics e vídeos para a sua marca → Ver design"** (link para `/design`).

## Fechamento

O final retoma o H1 ("Seu negócio é único. Seu site também deveria ser.") e fecha a história da rua com uma placa que todo mundo entende.

### 19. Chamada final

| Elemento | Atual | Novo |
| --- | --- | --- |
| Eyebrow | A próxima visita | Vamos começar? |
| H2 | Na próxima visita, o cliente fica. | Seu negócio já é único. Está na hora de o seu site mostrar isso. |
| Linha abaixo do H2 | — | Conte o que você faz. Você recebe preço, prazo e tudo o que entra no projeto antes de decidir. |
| Placa 3D | SEU SITE · O CLIENTE FICA | ABERTO · SEU NEGÓCIO |
| Botões e link "ou explore…" | — | manter |
