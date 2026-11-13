# Páginas comerciais da NexuSync

Revisão de 12/11/2026. Base: estratégia fornecida no arquivo “Texto colado.txt”, documentos locais de personas, rotas existentes e código dos projetos ArcSync e VisionSync. Não houve publicação ou alteração dos aplicativos externos.

## Decisão e viabilidade

A estratégia é viável aproveitando as páginas existentes. A entrega fica com sete páginas comerciais: cinco de serviços e duas de produtos. A diferença em relação às seis páginas propostas é manter marketing e design separados, pois possuem escopos, preços, exemplos e decisões de compra distintos. Não há evidência de tráfego ou demanda de busca suficiente para afirmar ganho de SEO ou prever vendas.

| Necessidade | Página principal | Público de partida | Conversão |
| --- | --- | --- | --- |
| Apresentar a empresa e receber contatos | `/criacao-de-sites` | Marcelo | Orçamento de site |
| Organizar produtos e pedidos | `/lojas-virtuais` | Camila | Orçamento de catálogo, cardápio ou loja |
| Organizar horários e processos | `/apps` | Juliana e Renata | Orçamento de sistema sob medida |
| Planejar divulgação recorrente | `/marketing` | Marcelo e Camila | Proposta de marketing |
| Criar identidade, peças e interfaces | `/design` | Marcelo e Camila | Proposta de design |
| Planejar e agendar publicações | `/arcsync` | Lucas | Acesso ao aplicativo ou conversa |
| Acompanhar contatos e atendimento | `/visionsync` | Renata | Acesso ao aplicativo ou conversa |

As personas orientam o conteúdo; são hipóteses comerciais, não segmentos comprovados por dados de clientes.

## Consolidação de conteúdo

- Institucional, landing page, hotsite e reformulação são formatos dentro da página de criação de sites. Não foram criadas páginas repetidas para cada formato.
- Catálogo, cardápio e loja com checkout ficam juntos em `/lojas-virtuais`, explicando a diferença de funcionamento e investimento.
- Agendamentos, gestão, automações e integrações ficam em `/apps`. A URL sugerida `/sistemas-e-automacoes` redireciona permanentemente para essa página.
- A proposta de `/marketing-e-design` não foi implementada como uma terceira página concorrente. Marketing e design se conectam com links contextuais, mantendo suas ofertas próprias.
- O fliperama completo fica em `/arcade`. A reprodução embutida em `/apps` foi substituída por um convite para acessá-lo. Demonstrações individuais continuam acessíveis.
- Home, Quem Somos e Templates mantêm funções diferentes: direcionamento, apresentação da abordagem e exploração de exemplos. Não há motivo para fundi-las.
- As páginas dos produtos explicam adequação e encaminham aos aplicativos nos subdomínios informados. Não repetem login, cadastro ou funcionalidades dos próprios aplicativos.

## Conteúdo e jornada implementados

As páginas de serviço incluem situações da rotina, escolha entre formatos, limites de escopo, etapas de trabalho, exemplos, perguntas e CTAs. Os portfólios existentes de apps e design foram preservados.

A home encaminha às páginas aprofundadas. O orçamento continua centralizado na home e recebe interesse e seção de origem pela URL. Interesses de marketing recebidos de outras páginas passam a aparecer mesmo quando não fazem parte das opções iniciais da home. Planos de marketing ligam às páginas corretas de sites, apps e design, em vez de âncoras inexistentes na própria página.

Os planos comerciais e preços existentes foram reutilizados. A página de lojas exibe Pulse e Premium, evitando apresentar o plano inicial de presença digital como oferta de e-commerce.

## ArcSync e VisionSync

O posicionamento anterior de pré-lançamento indisponível foi substituído por apresentações com links para os aplicativos. A informação veio dos endereços fornecidos pelo proprietário e da inspeção dos projetos locais:

- ArcSync: rascunhos, calendário, agendamento, aprovações e acompanhamento dos envios. Compatibilidade de formatos e permissões deve ser confirmada no aplicativo.
- VisionSync: contatos, notas, etiquetas/etapas, lembretes, respostas rápidas e extensão para WhatsApp Web. Não foi prometido compartilhamento entre contas, automação irrestrita ou disparo em massa.

Os subdomínios não puderam ser inspecionados diretamente neste ambiente. O código local sustenta a descrição funcional, mas não comprova que a mesma versão esteja publicada ou que o cadastro e as integrações funcionem em produção. Não foram inventados preços, testes gratuitos, capturas de tela ou resultados comerciais.

## SEO e manutenção

As páginas têm metadados específicos e canonical próprio. Sites e produtos foram incluídos no sitemap; o noindex das páginas comerciais dos produtos foi removido. Não foram criadas páginas por cidade ou persona com textos quase idênticos.

Os novos componentes de apresentação são Server Components; a interatividade existente permanece nos limites cliente de portfólio, FAQ, planos e formulário. A retirada do fliperama embutido elimina uma renderização duplicada de uma experiência interativa pesada. Não houve medição de bundle ou Core Web Vitals para quantificar o efeito.

## Validação e critérios de continuidade

Validações executadas: TypeScript e teste existente de validação de orçamento aprovados. Lint dos arquivos alterados aprovado. O lint geral encontrou cinco erros em componentes fora desta alteração: PulseMetricsDashboard, MemoryMatrix e SpinToWin. O build de produção foi tentado e interrompido por erro interno do Turbopack ao iniciar o processo de transformação de CSS de EstateDemos.css.css. Não há build de produção aprovado nem revisão visual responsiva concluída nesta entrega.

Antes da publicação, concluir o build no ambiente habitual, revisar as páginas em 390, 768 e 1440 px e verificar os dois acessos externos sem pressupor autenticação disponível. Não foram enviados formulários reais ou criadas contas para teste.

Para validar a estratégia comercial, registrar por serviço: visitas, seleções de interesse, cliques de WhatsApp, formulários recebidos, contatos qualificados, propostas e vendas. Cliques não equivalem a conversas ou vendas. Eventos existentes de interesse e formulário são reutilizados; não foi implementada atribuição entre domínios ou telemetria específica de acesso aos produtos.

Priorizar aquisição para Sites e Lojas. Rever a necessidade de páginas adicionais após um período de observação com dados suficientes; novos segmentos devem ter uma oferta e exemplos próprios. Estudos de caso e depoimentos só entram com evidências e autorização. Condições comerciais e disponibilidade dos aplicativos devem ser atualizadas conforme a versão efetivamente publicada.
