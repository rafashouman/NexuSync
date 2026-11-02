# NexuSync — Plano de desenvolvimento comercial e do site
Versão 1.0 • 1 de novembro de 2026 • Documento para implementação

> **Documento histórico — substituído pelo reposicionamento site-first de 2 de novembro de 2026.** A home deve priorizar criação de sites; aplicações web e pacotes de mídias digitais aparecem depois do investimento em sites; marketing recorrente permanece em `/marketing`. Não use a ordem de seções nem os novos preços propostos abaixo como orientação atual. Preserve apenas valores e condições já confirmados no projeto.

## 1. Objetivo e decisões propostas

Ampliar o posicionamento da NexuSync para desenvolvimento web, marketing digital e automação, atendendo pequenos e médios negócios. O site deverá explicar como contratar cada serviço isoladamente e apresentar três pacotes recorrentes com escopo comparável.

Este documento especifica alterações; não representa alterações já aplicadas ao site. Os preços são propostas comerciais próprias, baseadas no escopo abaixo, e não uma pesquisa de média de mercado. Validar esforço e margem antes de publicar.

## 2. Diagnóstico dos arquivos recebidos

| Arquivo | Situação observada | Alteração proposta |
|---|---|---|
| page(3).tsx | Monta Hero, SelectedWork, Services, Segments, Plans, PlansApps, PlansDG, FAQ e Contact | Inserir nova seção PlansMarketing depois de Segments e antes de Plans |
| layout(1).tsx | Metadata apresenta “Sites e Aplicações de Alta Performance”; utiliza Navbar, Footer, FloatingWA e DemoShell | Atualizar título e descrição para incluir marketing; revisar textos dos componentes compartilhados quando seus arquivos estiverem disponíveis |
| Hero.tsx | “Estúdio de desenvolvimento digital e UX/UI”; carrossel de templates interativos | Ampliar mensagem principal e CTA; identificar carrossel como demonstrações de desenvolvimento web |
| Services.tsx | Seis serviços web em bento grid; mensagem de WhatsApp ainda cita FocusPulse | Acrescentar quatro serviços e corrigir marca; revisar indicadores promocionais |
| Plans.tsx | Presence R$ 297, Pulse R$ 499 e Premium R$ 1.599, com ofertas de lançamento | Identificar preços como projetos avulsos; exibir campo scope que existe nos dados, mas não aparece na renderização dos cards analisada |
| PlansApps.tsx | Agendamentos R$ 499, Gestão Web R$ 1.599, Mini Apps R$ 349 | Explicar que desenvolvimento de aplicação e operação mensal de marketing são contratações distintas |
| PlansDG.tsx | Packs avulsos de R$ 199, R$ 650 e R$ 1.490 | Diferenciar produção pontual de peças de gestão editorial recorrente |

Os valores acima são os preços presentes nos arquivos, não novos preços sugeridos. Os nomes page(3).tsx e layout(1).tsx são os arquivos recebidos; confirmar os caminhos reais no repositório antes de editar.

Navbar, Footer, FloatingWA, FAQ, Contact, estilos globais, package.json e configuração de métricas não foram fornecidos. As alterações nesses pontos são requisitos a conferir, não conclusões sobre sua implementação atual.

### Correções prioritárias

- Substituir FocusPulse por NexuSync na mensagem gerada em Services.
- Trocar “desenvolvimento de [serviço]” por “serviço de [serviço]” no WhatsApp, para funcionar também com tráfego e redes sociais.
- Remover “+68% Leads” até existir case verificável. Substituir por “Captação de contatos”.
- Substituir “Core Web Vitals 99+” por “Otimização de desempenho”: a expressão atual mistura uma pontuação com o nome de um conjunto de métricas.
- Usar “Recomendado” em vez de “Mais escolhido” ou “Mais procurado” quando não houver dados que sustentem a popularidade.
- Manter escassez promocional apenas com controle real das vagas disponíveis.

## 3. Arquitetura da página

Ordem proposta: Hero → SelectedWork → Services → Segments → PlansMarketing → Plans → PlansApps → PlansDG → FAQ → Contact.

Na navegação de planos, oferecer atalhos para Marketing mensal, Sites, Aplicações e Design. Preservar as âncoras existentes: #planos, #planosapp e #planosdg. Criar #planos-marketing. Evitar acrescentar três grandes seções completas de preços para cada novo serviço: a home terá três pacotes integrados e uma lista compacta de contratações avulsas.

Manter fundo escuro, tipografia existente, cartões arredondados e gradientes violeta/fúcsia. Na nova seção, apresentar preço mensal, implantação e exclusões próximos ao CTA. Em celular, cartões em uma coluna, sem rolagem horizontal. Exibir até seis benefícios principais e detalhes de escopo em expansão acessível.

## 4. Textos prontos para publicação

### Hero

**Selo:** Marketing digital, sites e automações

**Título:** Sua empresa em destaque. Mais caminhos para novos clientes.

**Descrição:** Conectamos sites, anúncios, redes sociais e automações para ajudar seu negócio a atrair pessoas interessadas, organizar oportunidades e atender melhor.

**Botão principal:** Quero um plano para meu negócio

**Botão secundário:** Conhecer serviços e pacotes

**Mensagem do WhatsApp:** Olá! Quero conhecer as soluções da NexuSync. Meu negócio é [segmento] e meu principal objetivo é [objetivo].

### Seção de serviços

**Título:** Da primeira impressão ao próximo contato.

**Descrição:** Sua presença digital precisa trabalhar junto. Escolha o serviço de que precisa agora ou conecte conteúdo, anúncios e atendimento em um plano integrado.

| Novo cartão | Texto | Etiquetas | CTA |
|---|---|---|---|
| Tráfego pago | Coloque sua empresa no caminho de quem procura soluções como a sua. Planejamos, acompanhamos e ajustamos campanhas para gerar oportunidades dentro do seu orçamento. | Meta Ads • Google Ads • Acompanhamento | Quero atrair clientes |
| Gestão de redes sociais | Sua marca presente, com conteúdo que faz sentido. Organizamos o calendário, criamos publicações e mantemos uma comunicação consistente com seu público. | Planejamento • Conteúdo • Publicação | Quero fortalecer minha marca |
| Captação e gestão de leads | Cada contato merece um próximo passo. Estruturamos páginas, formulários e organização comercial para sua equipe acompanhar as oportunidades recebidas. | Landing pages • Formulários • CRM | Quero organizar meus contatos |
| Automações | Menos tarefas repetidas. Mais tempo para atender bem. Conectamos ferramentas para organizar contatos, enviar avisos e apoiar o acompanhamento comercial. | Integrações • Lembretes • Fluxos | Quero automatizar processos |

Em Services.tsx, acrescentar propriedades opcionais id e waMessage aos objetos para mensagens específicas. Para os quatro novos cards, usar lg:col-span-6. Corrigir numeração para String(idx + 1).padStart(2, "0"), evitando “010” no décimo item.

### Introdução dos pacotes

**Selo:** Planos mensais para pequenos e médios negócios

**Título:** O próximo passo da sua empresa começa com um plano.

**Descrição:** Fortaleça sua presença, atraia oportunidades ou conecte toda a operação. Entregas definidas, acompanhamento próximo e investimento transparente.

## 5. Pacotes e preços sugeridos

| Pacote | Mensalidade | Implantação única | Perfil |
|---|---:|---:|---|
| Presença Ativa | R$ 690 | R$ 290 | Empresa que precisa manter as redes organizadas |
| Aquisição Local | R$ 890 | R$ 490 | Negócio que busca contatos por campanhas |
| Crescimento Integrado | R$ 1.790 | R$ 990 | Empresa que quer combinar conteúdo, anúncios e acompanhamento de leads |

### Presença Ativa

**Texto do card:** Sua marca presente na rotina de quem pode virar cliente. Conteúdo planejado e comunicação consistente para seu negócio ser lembrado.

Inclui uma marca, Instagram e Facebook com o mesmo conteúdo adaptado; oito publicações mensais, sendo até dois carrosséis de até cinco páginas; oito adaptações dessas peças para stories; legendas; calendário; agendamento; uma rodada consolidada de ajustes e relatório mensal.

O cliente fornece identidade visual, informações, fotos e aprovações. Não inclui filmagem, edição de reels, atendimento de mensagens, respostas diárias a comentários ou anúncios. Uma adaptação para stories não é uma criação inédita.

**CTA:** Quero minha marca presente

**WhatsApp:** Olá! Tenho interesse no Presença Ativa da NexuSync, por R$ 690/mês mais R$ 290 de implantação. Quero apresentar meu negócio.

### Aquisição Local

**Texto do card:** Seu negócio diante de pessoas com potencial de compra. Campanhas acompanhadas e uma rota clara até o contato com sua equipe.

Inclui uma marca/unidade, uma plataforma — Meta Ads ou Google Ads —, até duas campanhas simultâneas, até quatro variações mensais de anúncios dentro dos formatos contratados, configuração de conversões compatíveis com o site existente, revisão semanal, relatório mensal e reunião mensal de até 30 minutos.

As quatro variações são peças estáticas/textos, sem vídeo produzido. O escopo pressupõe investimento em mídia de até R$ 3.000/mês; acima disso, reavaliar a complexidade. A verba é paga diretamente à plataforma pelo cliente. Landing page, redes sociais orgânicas e CRM não estão incluídos.

**CTA:** Quero gerar oportunidades

**WhatsApp:** Olá! Tenho interesse no Aquisição Local da NexuSync, por R$ 890/mês mais R$ 490 de implantação, com anúncios pagos à parte.

### Crescimento Integrado

**Selo:** Recomendado para integrar marketing e atendimento

**Texto do card:** Conteúdo, anúncios e contatos trabalhando juntos. Uma estrutura conectada para sua equipe aproveitar melhor cada oportunidade.

Inclui os escopos de Presença Ativa e Aquisição Local; configuração de um funil de CRM com até cinco etapas e até três usuários; conexão de uma fonte de leads; um fluxo de automação com um gatilho e até três ações; acompanhamento mensal e até uma hora mensal de ajustes nesse fluxo.

A implantação inclui uma landing page simples de até cinco seções, construída sobre modelo, com um formulário e uma rodada de ajustes. Inclui até uma hora mensal de atualização dessa página. Não inclui checkout, área de clientes ou aplicação personalizada. Licenças, hospedagem, domínio, créditos de mensagens e mídia são separados.

Fluxo inicial sugerido: formulário recebido → cadastrar contato no CRM → avisar responsável → criar tarefa de retorno. Mensagens automáticas ao consumidor dependem de canal compatível, configuração e autorização apropriada; não presumir disparos gratuitos.

**CTA:** Quero conectar meu marketing

**WhatsApp:** Olá! Tenho interesse no Crescimento Integrado da NexuSync, por R$ 1.790/mês mais R$ 990 de implantação. Quero integrar conteúdo, anúncios e leads.

### Microtexto comum aos cards

“Mensalidade referente aos serviços descritos. Implantação cobrada uma vez. Verba de anúncios, licenças e custos de terceiros são separados e apresentados na proposta. Resultados variam conforme mercado, oferta, investimento e atendimento.”

### Empresas com operação maior

**Chamada:** Mais unidades, canais ou integrações? Seu plano acompanha a operação.

**Texto:** Para empresas com múltiplas unidades, maior volume de conteúdo ou processos comerciais específicos, desenhamos um escopo próprio.

**Preço indicativo interno:** a partir de R$ 2.990/mês, implantação sob orçamento. Na home, preferir “Sob medida” enquanto esse escopo não estiver padronizado.

## 6. Serviços avulsos e adicionais

| Oferta | Preço sugerido | Limite inicial |
|---|---:|---|
| Captação e organização de leads | R$ 990 de implantação + R$ 290/mês | Uma landing page de modelo, um formulário, um funil com cinco etapas; mensalidade cobre revisão do fluxo e até uma hora de ajustes |
| Automação Essencial | A partir de R$ 790 de implantação + R$ 190/mês | Um fluxo, um gatilho, até três ações e duas ferramentas com integração disponível; mensalidade inclui revisão e até uma hora de ajustes |
| Segunda plataforma de anúncios | + R$ 590/mês e R$ 290 de configuração | Até duas campanhas adicionais; verba separada |
| Quatro publicações estáticas adicionais | + R$ 290/mês | Artes e legendas; uma rodada consolidada |
| Dois reels simples | + R$ 350/mês | Até 30 segundos cada, material enviado pelo cliente, uma revisão; sem gravação |

Contratações avulsas não devem duplicar cobranças de entregas já incluídas no pacote Integrado. Os dois serviços avulsos não incluem campanhas para gerar tráfego. Cada proposta deve nomear ferramentas e custos antes do início.

Não recomendo descontos permanentes de lançamento nas mensalidades. Se desejar incentivo inicial, oferecer implantação com desconto claramente limitado e manter a mensalidade regular. Não mostrar preço riscado fictício.

## 7. Viabilidade comercial

Premissa de planejamento: custo interno de R$ 50/hora, a substituir pelo seu custo real. Reservar aproximadamente 7 h/mês para Presença, 8 h para Aquisição e 17 h para Integrado. Com esses limites, o custo direto de trabalho seria R$ 350, R$ 400 e R$ 850; saldo antes de impostos, ferramentas, aquisição de clientes e despesas fixas: R$ 340, R$ 490 e R$ 940.

Implantações devem caber aproximadamente em 3 h, 5 h e 10 h, respectivamente. Integrações personalizadas e revisão ampla da marca exigem orçamento adicional. Medir horas dos três primeiros clientes e rever preços se o esforço exceder essas premissas.

Exemplo de orçamento, não previsão de resultado: Aquisição Local + R$ 900 de mídia custa R$ 2.280 no primeiro mês e R$ 1.790 nos seguintes. Integrado + R$ 1.200 de mídia custa R$ 3.980 no primeiro mês e R$ 2.990 nos seguintes, além de ferramentas eventualmente contratadas.

## 8. Especificação de desenvolvimento

Criar components/PlansMarketing.tsx seguindo padrões visuais existentes. Separar dados em data/marketingPlans.ts e centralizar o número de WhatsApp atual, 5551993583936, em configuração compartilhada.

Modelo sugerido: id, name, description, monthlyPriceCents, setupPriceCents, idealFor, features, exclusions, onboardingTime, highlight, badge, buttonText e waMessage. Armazenar valores numéricos em centavos e formatar em BRL. Exibir “/mês” e “implantação única” explicitamente.

Para o período de início, exibir “Início previsto em 5 a 10 dias úteis após briefing, acessos e aprovações”; no Integrado, “10 a 15 dias úteis”. São prazos propostos, sujeitos à disponibilidade confirmada na contratação.

Adicionar PlansMarketing à página principal e a âncora correspondente à navegação. Manter page e layout como componentes de servidor quando possível; usar componente de cliente apenas onde houver animação ou interação.

Usar o mesmo padrão encodeURIComponent nas mensagens de WhatsApp. Centralizar a marca NexuSync. Testar cada botão com plano, valor e mensagem corretos.

### Metadata proposta

Título: “NexuSync | Marketing Digital, Sites e Automações”

Descrição: “Sites, tráfego pago, gestão de redes sociais e automações para pequenos e médios negócios. Conheça os serviços e pacotes da NexuSync.”

Revisar Open Graph e imagem social quando a configuração completa estiver disponível.

### Formulário de orçamento

Campos: nome, empresa, segmento, WhatsApp ou e-mail, objetivo principal e serviço/pacote de interesse. Orçamento mensal como campo opcional. Objetivos: fortalecer marca, gerar contatos, organizar leads, automatizar processos ou criar site.

O clique no card deve pré-selecionar o interesse quando o destino for formulário. Exibir sucesso somente após confirmação do envio. Separar autorização para contato sobre o orçamento de eventual aceite de comunicações promocionais.

### Métricas

Propor eventos marketing_plan_click, whatsapp_click e contact_submit_success, com plan_id, section e destination, sem nome, telefone ou e-mail. Clique no WhatsApp mede intenção, não lead confirmado nem venda. Integração com analytics depende da configuração existente e deve respeitar as preferências de privacidade implementadas.

## 9. FAQ pronta para inserir

**O investimento nos anúncios está incluído?** Não. A mensalidade remunera planejamento, gestão e acompanhamento. A verba de mídia é definida com você e paga diretamente à plataforma.

**Posso contratar apenas um serviço?** Sim. Você pode contratar redes sociais, tráfego pago, captação de leads ou automações separadamente, conforme o escopo da proposta.

**Preciso ter um site para anunciar?** Depende do objetivo. Algumas campanhas levam a formulários ou canais de contato. Quando uma página for necessária, indicamos uma solução compatível.

**Vocês respondem meus clientes nas redes sociais?** Os pacotes apresentados incluem produção e publicação de conteúdo. Atendimento de mensagens e gestão diária da comunidade são avaliados separadamente.

**O que é um lead?** É um contato de alguém que demonstrou interesse no seu negócio. Esse contato ainda precisa ser atendido e qualificado pela equipe comercial.

**Vocês garantem vendas?** Trabalhamos com planejamento, testes e acompanhamento. As vendas dependem também da oferta, do mercado, do investimento e do atendimento.

**As ferramentas de automação estão incluídas?** Licenças e créditos de terceiros são apresentados separadamente. Você conhece esses custos antes de aprovar a solução.

**Como começa o trabalho?** Após o aceite da proposta, reunimos informações, acessos e materiais. Em seguida, apresentamos o planejamento e iniciamos a configuração e as entregas.

## 10. Sequência de execução e aceite

1. Confirmar preços, limites, custos de ferramentas e capacidade operacional.
2. Atualizar Hero, Services e metadata; corrigir a marca nas mensagens.
3. Criar dados e componente de planos mensais; mostrar escopo e exclusões.
4. Integrar página, navegação, formulário, WhatsApp e FAQ.
5. Validar build e checagem de tipos com os comandos definidos no projeto.
6. Revisar em telas de 360, 768 e 1440 px; testar teclado, foco visível, contraste, links e redução de movimento.
7. Conferir todos os valores, somas, cobrança única/mensal e mensagens; verificar que não há promessas numéricas sem comprovação.
8. Conferir eventos sem duplicação e envio real do formulário; não simular leads como concluídos.
9. Revisar a versão de homologação e publicar após validação comercial.

Critério de conclusão: o visitante entende em poucos segundos o que cada pacote entrega, quanto paga por mês, quanto custa começar, quais despesas são separadas e como solicitar uma proposta.
