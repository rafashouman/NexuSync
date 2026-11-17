# Controlled Chaos — revisão de entrega

## Implementado

- ArcSync e VisionSync com apresentação própria, demonstrações ilustrativas interativas e textos existentes.
- Menu e rodapé compartilham o catálogo de serviços, produtos, aplicativos e exemplos.
- Privacidade com a nova identidade, preservando o conteúdo do aviso.
- Ajustes de largura no VisionSync, composição em tablet e menu móvel sem sobreposição do WhatsApp.
- Orçamento acompanha alterações de parâmetros da URL, com Suspense para a leitura de search params.
- 3D separado do bundle inicial, carregado após a apresentação inicial; renderização suspensa fora do hero e durante a pausa. Preferência de movimento reduzido evita carregar a cena. Fallback SVG preservado.
- MotionConfig respeita a preferência do usuário; rolagem do orçamento também respeita movimento reduzido.
- Build padrão com Webpack, transformação Tailwind equivalente à configuração de desenvolvimento e um worker para limitar consumo. Turbopack continua disponível em `npm run build:turbopack`.
- Workflow verifica lint, TypeScript, testes de orçamento e build antes das etapas de SSH.

## Evidência executada

- `tsc --noEmit`: passou.
- `npm run lint`: passou.
- `node scripts/test-quote-validation.cjs`: passou. Banco e notificações simulados; inclui consentimento, interesses, canais, honeypot e falhas de banco/e-mail. Não enviou e-mail.
- Navegador: ArcSync e VisionSync alternam etapas; menu móvel e menu desktop abrem; busca de templates com acentos, resultado vazio e limpeza; prévia da imobiliária carregada e modo estreito; busca/categoria de aplicativos e cópia do link.
- Formulário: seleção por URL de loja virtual e design, campos obrigatórios e rejeição no servidor de um contato inválido. Envio real de um lead válido e entrega SMTP não foram exercitados.
- Home: cena WebGL carregada, pausa e retomada verificadas; animações CSS confirmadas como pausadas. A preferência de movimento reduzido foi revisada no código, sem alterar a preferência do sistema no navegador.
- Dez páginas principais verificadas em 390 px e 820 px: um h1 por página, títulos/canonicals presentes, sem transbordamento horizontal ou parágrafos/títulos cortados. Inspeções visuais adicionais em desktop de produtos, home e privacidade.

## Bloqueio de produção ainda aberto

Turbopack falha neste ambiente Windows ao iniciar o processo de CSS. A alternativa por threads avança, mas encontra acesso negado ao criar junctions de dependências; ela não foi mantida na configuração.

Webpack compilou e verificou TypeScript com sucesso. A geração estática ainda falhou com `EPERM` ao criar diretórios `_not-found.segments` / `_global-error.segments` no ambiente Windows. Portanto, **o build completo ainda não está aprovado**. Não foi publicado nenhum deploy.

O pipeline Linux deve executar o build completo antes de liberar a publicação. Métricas Core Web Vitals de produção ainda não foram medidas.

## Publicação

1. Executar as validações do workflow no Ubuntu com Node.js 22 e `npm ci`.
2. Confirmar build completo, variáveis de MongoDB/SMTP e variáveis públicas de analytics conforme `.env.example`.
3. O fluxo existente de publicação em `main` chama `/usr/local/bin/deploy-nexusync` na VPS. Esse script remoto não foi alterado ou executado nesta revisão.
4. Após subir a versão, conferir páginas, orçamento e logs. O smoke check somente de leitura está em `node scripts/check-public-routes.cjs https://nexusync.online`; ele exige acesso HTTP ao servidor. A execução local a partir do terminal desta sessão falhou na conexão.

Para verificar o build em diretório separado do servidor de desenvolvimento, definir `NEXT_BUILD_DIR=.next-production-check` antes de `npm run build`. Não definir essa variável na VPS se o script remoto espera `.next`.
