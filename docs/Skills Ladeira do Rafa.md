#### criador-de-produtos-nexusync ###

Estou escrevendo a nova skill: um arquivo principal com o fluxo e seis referências (contexto da NexuSync, público, sites, apps, motion e copy).

Pacote da skill e o arquivo principal para você revisar.

Transformei a skill no **Criador de Produtos NexuSync**. A original continua intacta.

## O que ela faz

| Você pede | Ela entrega |
|---|---|
| "Que template faço agora?" | Pesquisa, público, 12 ideias e a ficha do produto escolhido |
| "Para quem vendo esse cardápio?" | 3 segmentos pontuados, abordagem e teste de 7 dias |
| "Que site ofereço para essa clínica?" | Uma recomendação com seções, plano e preço |
| "Tenho uma ideia de app" | Venda única, assinatura ou híbrido, versão mínima e conta do negócio |
| "Me dá um estilo de motion" | 17 estilos para escolher, roteiro, formatos e pacotes |
| "Escreve a copy desse cliente" | Texto pronto, com a voz separada por cliente |

## O que mudou em relação à original

- **Contexto da NexuSync:** inclui seus planos e preços, os 13 templates do catálogo, as personas e a direção de design. Quando o código do site está acessível, ele vale mais que essa cópia.
- **Menos volume:** são 12 ideias em vez de 30, e um pedido pequeno não dispara o fluxo inteiro.
- **Filtro refeito para agência:** avalia reuso, margem por hora e mensalidade. A original penalizava aplicativos e serviços.
- **Saiu o que era do curso:** a marca Mergulhando na IA, os 8 formatos de infoproduto e o PDF em slides. O resultado agora é uma ficha em `Produtos/{nome}/ficha.md`.
- **Mantive:** pesquisa com no mínimo 3 concorrentes, nada de dado inventado e as regras de texto (sem travessão, sem exclamação). Essas regras de texto são um padrão que você ou o cliente podem mudar.

Um bom primeiro teste, numa sessão aberta nesta pasta:

> Usa o criador de produtos: que template eu faço agora para os segmentos que ainda não têm demo?

Para usar no claude.ai, envie o arquivo `.skill` na área de Skills. Ele leva seus preços e públicos, mas não acessa o código do site por lá.

## Dois avisos

- **Arquivos sensíveis:** a pasta `D:\projetos\@NexuSync` tem `hostinger-recovery-codes.txt` e dois arquivos `client_secret_….json` soltos. Vale movê-los para um cofre de senhas.
- **Regras de outra marca:** o `Nosso repertório criativo.md` tem misturadas as instruções de um "Copy Su". Aproveitei só a lista de recursos criativos.

**O que mudou na skill:**
- **Posicionamento no topo:** você atende o Brasil todo, de profissionais liberais a empresas de médio porte. O cliente preferencial é quem não tem site nem app, ou quem precisa vender mais um produto.
- **Carro-chefe e apoio:** sites, catálogos, cardápios online e landing pages vêm sempre primeiro. Apps, design e motion entram como complemento para subir o ticket. Viram oferta principal só se o cliente pedir ou se a dor dele for de processo, como agenda ou gestão.
- **Fora do óbvio:** o filtro de ideias ganhou um 13º ponto. Ideia que é "o template genérico de sempre com outro logo" fica de fora. Na revisão do site entrou um teste: tirando o logo, ainda dá para saber de que negócio é.
- **Dor primeiro e sem jargão:** a copy abre por uma cena que o cliente vive. Entrou uma tabela de troca de termos, por exemplo "SEO" vira "aparecer quando procuram no Google".
- **Ideias:** pelo menos 8 das 12 são do carro-chefe. A tabela ganhou as colunas "Dor que resolve" e "Complemento".
- **Ficha do produto:** ganhou o campo do complemento com preço e a pergunta "o que aqui é fora do óbvio?".
- **Públicos:** entrou o nível "Produto para impulsionar", e a pesquisa local deixou de se limitar a Porto Alegre.

A cópia instalada, a cópia em `D:\projetos\@NexuSync\.claude\skills` e o pacote [criador-de-produtos-nexusync.skill](Skills/criador-de-produtos-nexusync.skill) estão iguais. Também atualizei minha memória com esse posicionamento, para valer nas próximas conversas.

A skill ainda não foi testada com um pedido real. Um bom teste numa sessão nova: "que produto eu ofereço para um advogado que não tem site?".

#### pagina-que-vende-nexusync ###

Li a skill de página inteira (1.727 linhas). Vou transformá-la numa skill nova, `pagina-que-vende-nexusync`, mantendo as 3 etapas e ajustando ao seu posicionamento. Estou escrevendo os arquivos agora.

A skill nova se chama `pagina-que-vende-nexusync` e já está instalada para todas as sessões. Também deixei uma cópia em `D:\projetos\@NexuSync\.claude\skills` e o pacote [pagina-que-vende-nexusync.skill](Skills/pagina-que-vende-nexusync.skill). Ainda não testei com um pedido real.

Diferente da anterior, ela não foi encaixada no criador de produtos. Ela trabalha junto com ele: o criador define o produto e grava a ficha, e esta skill transforma a ficha em página.

**O que ficou igual ao original:**
- As 3 etapas com aprovação: uma headline só, a copy completa e depois o design.
- A dor verdadeira, a promessa central e as 5 aberturas testadas por dentro, mostrando só a melhor.
- O teste dos 3 segundos e as headlines de seção que não serviriam para outra empresa.
- O diálogo interno em lista, os 3 passos, a virada, os bullets, as 4 objeções e o teste final.
- A regra "a imagem conta a copy da seção" e as regras de layout sem nada sobreposto.

**O que mudou para a NexuSync:**
- **Tipos de página:** landing page de oferta, página inicial de site, página "Site para {segmento}", cardápio ou catálogo, e hotsite. Cada um tem a sua ordem de seções.
- **Posicionamento:** atendimento no Brasil todo, dor primeiro e sem jargão na página. O prazo prometido é o de entrega do plano, e nunca se promete posição no Google nem vendas.
- **Depoimentos:** o original manda inventar depoimentos provisórios. Tirei isso porque bate de frente com a sua regra de nunca inventar. Entra só prova real, como avaliações do Google com autorização e trabalhos de verdade. Sem prova, a demonstração ocupa o lugar dela.
- **Ancoragem de preço:** preço "de" só se existir no código. A soma do valor usa só serviços que a NexuSync vende avulsos, pelo preço do site. Nada de "somente hoje" falso.
- **Design:** saiu o padrão fixo do original, todo off-white, só com a fonte Inter e sem movimento. Entrou uma ideia visual própria por página, como a Rua Acesa, com motion que tem função. As páginas da NexuSync usam a identidade da casa, as de cliente usam a marca dele.
- **Botão:** em site, cardápio e catálogo, o botão aparece logo na abertura, porque quem chega do Google já quer agir.
- **Onde construir:** por padrão, direto no repositório Next.js, com preços vindos de `src/data/` e sem commit nem push sem você pedir. O prompt para Lovable continua como opção, para quando o cliente vai hospedar fora.

Para testar numa sessão nova: "faz a landing do Mini Cardápio" ou "monta a página de site para dentistas".

### criativo-surreal-nexusync ###

A skill nova se chama `criativo-surreal-nexusync` e já vale em todas as sessões. Também deixei uma cópia em `D:\projetos\@NexuSync\.claude\skills` e o pacote [criativo-surreal-nexusync.skill](Skills/criativo-surreal-nexusync.skill). Ainda não testei com um pedido real.

**O que ficou igual ao original:**
- O fluxo: você conta o que quer, recebe 10 ideias, escolhe um número e recebe título, legenda e os textos prontos.
- Os três textos para colar: Feed 4:5 e Stories 9:16 no ChatGPT, e a animação sutil no Freepik.
- A estética editorial, o universo visual restrito ao nicho e o headline que sempre diz qual é o produto.
- O padrão de legenda e o padrão de personagem.

**O que mudou para a NexuSync:**
- **Dois modos:** peça da NexuSync vendendo site, cardápio, catálogo ou landing page, com a identidade da casa (azul-noite, âmbar, azul-sinal, sem roxo e sem lima). Ou peça para um cliente, com a marca e o universo visual dele.
- **Dor primeiro:** pelo menos 6 das 10 ideias mostram a dor, como a fachada apagada numa rua onde as vizinhas brilham ou o dono com oito braços respondendo o mesmo preço. As outras mostram a virada.
- **Sem jargão e sem clichê no headline:** nada de "SEO" ou "presença digital", e nada de foguete ou gráfico subindo.
- **Caminho pelo Affinity:** o ChatGPT costuma errar acento e trocar letras em português. Por isso a skill também entrega a versão da arte sem texto. Você coloca a tipografia certa no Affinity e anima no DaVinci Resolve com a skill `nexusync-motion:affinity-para-resolve`, o mesmo fluxo do "Chama no WhatsApp".
- **Cuidados novos:**
  - Nada de logotipo de Google, WhatsApp ou outras marcas na arte.
  - Seguir as regras de anúncio da Meta, sem apontar característica pessoal de quem lê.
  - Nenhum preço, prazo ou resultado que não esteja no código do site.
  - Na área da saúde, sem promessa de resultado.
- **Stories:** a margem segura ficou explícita, sem texto nos 14% de cima e nos 20% de baixo.
- **Referência por segmento:** um arquivo com dores que viram cena e com paleta e tipografia para 12 segmentos, de pizzaria a eletricista.

As três skills se conectam: o criador de produtos define a oferta, o criativo surreal faz o anúncio e a página que vende recebe quem clica.

Para testar numa sessão nova: "faz um criativo surreal pra NexuSync vender cardápio online para pizzarias".

### objetos-estranhos-nexusync ###

A skill nova se chama `objetos-estranhos-nexusync` e já vale em todas as sessões. Também deixei uma cópia em `D:\projetos\@NexuSync\.claude\skills` e o pacote [objetos-estranhos-nexusync.skill](Skills/objetos-estranhos-nexusync.skill). Ainda não testei com um pedido real.

**O que ficou igual ao original:**
- O fluxo: você conta o que quer, recebe 10 ideias e escolhe um número. Depois vêm a legenda e os três textos, para Feed, Stories e animação no Freepik.
- A regra de ouro: o objeto domina a imagem, o rosto aparece e o fundo mostra o nicho.
- O hook deixa claro o nicho logo de cara.
- As faixas de texto: mesma fonte, tamanho e peso em todos os blocos, alinhadas à esquerda e nunca por cima do objeto.
- O tom de conversa de Reels e a autoverificação antes de mostrar.

**O que mudou para a NexuSync:**
- **Dois modos:** peça da NexuSync vendendo site, cardápio, catálogo ou landing page, ou peça para o negócio de um cliente.
- **Biblioteca de objetos para as dores do dono do negócio:**
  - placa de "fechado" virada para quem não aparece no Google;
  - peneira furada para o cliente que chama e desiste;
  - comanda cheia da mesma frase para quem repete preço o dia todo;
  - cartão de visita amarelado para o site antigo ou genérico.
- **Ambientes por segmento:** fundos reconhecíveis para 13 segmentos, do forno da pizzaria à prateleira da ferragem.
- **Regra contra depoimento falso:** no original, a pessoa fala em primeira pessoa como se fosse cliente. Como a pessoa da imagem é gerada por IA, a skill não deixa o texto fingir ser cliente real nem contar resultado que não aconteceu. A voz é de quem explica o problema, ou do dono descrevendo a dor no presente.
- **Sem jargão:** nada de "SEO", "lead" ou "tráfego" no texto da imagem. O CTA traz o benefício do serviço, por exemplo "Veja como fica o cardápio da sua pizzaria →".
- **Cores:** o padrão nativo (amarelo e rosa) continua para peças de cliente. Peças da NexuSync usam âmbar e azul-sinal.
- **Música:** o original sugere música famosa de meme. Para anúncio pago, a skill indica a biblioteca de sons da Meta ou música licenciada, porque música sem licença pode derrubar o anúncio.
- **Caminho pelo Affinity:** a skill também entrega a arte sem texto, para você montar as faixas no Affinity e animar no DaVinci Resolve. Isso resolve quando o ChatGPT erra acento.

Agora são quatro skills ligadas: criador de produtos, página que vende, criativo surreal e objetos estranhos.

Para testar numa sessão nova: "faz um criativo de objetos estranhos pra NexuSync vender site para eletricistas".


### nexusync-motion ###

O editor de vídeo agora faz parte do plugin `nexusync-motion`, na versão 0.3.0, ao lado da skill do DaVinci Resolve. O pacote está em [nexusync-motion-0.3.0.zip](nexusync-motion-0.3.0.zip) e a pasta de origem em [nexusync-motion](nexusync-motion). Ainda não está ativo nas suas sessões: você precisa subir o `.zip` no claude.ai, no mesmo lugar onde subiu a 0.2.0. Eu não consigo fazer esse envio. A pasta original no OneDrive ficou intacta.

**O que mudou no editor:**
- **Visual da NexuSync:** um comando só aplica o estilo da casa nas animações. O cartão fica azul-noite, com âmbar e azul-sinal, fonte Archivo e cantos retos. A palavra falada na legenda aparece em âmbar. Para cliente, continua valendo a imagem de referência da marca dele.
- **Transcrição mais certeira:** agora dá para passar os nomes que aparecem no vídeo, como NexuSync, WhatsApp, o nome do cliente e da cidade, e a transcrição erra menos esses nomes.
- **Ícones novos:** WhatsApp, mapa, loja, cardápio e busca, desenhados de forma genérica, sem logotipo de marca.
- **Sons:** whoosh na entrada de cada animação e um toque em cada item de lista. Eles são gerados pelo mesmo gerador de sons da skill do Resolve, então não têm direitos autorais, e entram no vídeo final num volume mais baixo que a fala.
- **Regra de verdade:** número, preço ou prazo só vira animação se a pessoa falou no vídeo. Preço da NexuSync é conferido com o código do site.

**Ponte com o DaVinci Resolve (nova):**
- Gera a pasta `resolve/` com cada parte da edição numa trilha:
  - V1: o vídeo cortado com a fala;
  - V2: as animações, com fundo transparente;
  - V3: a legenda, com fundo transparente;
  - A2: os sons;
  - mais a `legenda.srt`, se você preferir editar a legenda pelo próprio Resolve.
- Cria o script `Montar_Edicao_<nome>.lua`, que segue as regras da skill do Resolve: roda por Workspace > Scripts, cria um projeto novo e não apaga nada. Nas duas skills, o mesmo cuidado: se der erro, corrige-se o gerador, nunca o script gerado.
- A skill do Resolve agora aponta para o editor quando o pedido for um vídeo falado.

**O que testei, com um vídeo de teste gerado aqui:**
- Funcionaram o corte, a legenda corrigida, a montagem final em 1080x1920 e a conferência da área segura.
- As camadas transparentes também funcionaram. A da legenda saiu sem transparência na primeira tentativa, eu corrigi e conferi de novo.

**O que não testei:**
- A transcrição, as animações e os sons, porque faltam pacotes Python neste computador. O `verificar.py --instalar` instala tudo no primeiro uso.
- O script no Resolve. Ele precisa da sua conferência: na primeira vez, rode e confira se as trilhas começam juntas. Se aparecer erro, me mande o texto do Console.

### anuncios-meta-nexusync ###

A skill nova se chama `anuncios-meta-nexusync` e já vale em todas as sessões. Também deixei uma cópia em `D:\projetos\@NexuSync\.claude\skills` e o pacote [anuncios-meta-nexusync.skill](Skills/anuncios-meta-nexusync.skill). As duas calculadoras funcionaram com dados de teste, mas a skill ainda não foi usada com um relatório real da sua conta.

**O que eu aproveitei de cada fonte:**
- **O PDF** é feito só de imagens. Li os 23 slides um por um.
  - A ideia central: CPA é o total investido dividido pelo número de vendas, e quanto menor, mais sobra.
  - As três alavancas que baixam o CPA: criativo, público e página de vendas.
  - Cerca de 30 casos reais de infoproduto, todos com prints do Gerenciador de Anúncios. Neles, o CPA ficou entre 1% e 50% do preço, e a maioria entre 15% e 35%.
  - Os prints também mostram práticas: nomes com colchetes como `[CONVERSÃO] - ADV+ ABERTO - 5 CRIATIVOS`, público aberto, vários criativos por conjunto e remarketing com orçamento pequeno.
  - Dois slides repetem os mesmos números para pessoas diferentes. Deixei esses quatro casos de fora, porque não dá para saber de quem é cada número.
  - Também não usei os nomes das pessoas, só o nicho de cada caso.
- **O site** não é um guia, é um simulador de projeção. Você informa o preço, a verba, o custo por clique e a taxa de conversão, e ele calcula cliques, vendas, CPA e lucro. Reproduzi essa conta no script de projeção.

**O que a skill faz:**
1. **Faz a conta antes do anúncio.** Calcula o CPA máximo, que é o valor de empate depois de taxas, impostos, entrega e horas, e o CPA alvo. A projeção sai em três cenários (pessimista, provável e otimista). Também faz a conta inversa: quanto investir para chegar a N vendas.
2. **Trata o caso do serviço por WhatsApp.** Quando o anúncio compra conversas e a venda acontece no atendimento, o CPA real é o custo por conversa dividido pela taxa de fechamento. Isso mostra quando quem trava a venda é o atendimento, e não o anúncio.
3. **Monta a estrutura da campanha.** Propõe objetivo, conjuntos, orçamento e nomes padronizados. Na hora dos criativos, chama as skills que já fizemos: criativo surreal, objetos estranhos, editor de vídeo e página que vende.
4. **Confere tudo antes de publicar.** O checklist cobre Pixel e API de Conversões, UTM e as políticas do Meta, inclusive a categoria especial obrigatória para imobiliária.
5. **Analisa o relatório exportado do Gerenciador.** Ele lê o CSV em português ou inglês, calcula CPA, CTR, CPM, frequência e ROAS e marca cada anúncio como escalar, manter, aguardar dados ou pausar. Também aponta qual das três alavancas está travando.

**Cuidados que coloquei:**
- Tráfego pago continua como o último pilar da NexuSync. A skill avisa quando a página ou o atendimento precisam ser arrumados antes de investir.
- Os números do PDF são de infoproduto e de casos escolhidos para mostrar bons resultados. A skill usa esses números só para calibrar, nunca como promessa a cliente.
- O PDF chama de "lucro líquido" o faturamento menos o investido. A skill desconta taxas, impostos e horas antes de chamar algo de lucro.
- Regras como "pausar depois de gastar 2 vezes o CPA alvo sem venda" estão marcadas como ponto de partida da casa, para você ajustar com dados reais.
- Publicar, ativar campanha e mudar orçamento continuam com você. A skill prepara e recomenda.

Para testar numa sessão nova: exporte um relatório do Gerenciador no nível de anúncio e peça "analisa esse relatório, meu CPA alvo é R$ X".