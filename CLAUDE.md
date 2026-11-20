# NexuSync

Site da agência NexuSync (Rafael Shouman): presença online, design com motion graphics, gestão de redes sociais e tráfego pago. Stack: Next.js 16 (App Router), React 19, Tailwind 4, three + @react-three/fiber/drei, framer-motion, MongoDB, nodemailer. Deploy automático na VPS via GitHub Actions a cada push na `main` (Docker).

## Regras de trabalho (não negociáveis)

- Trabalhe sempre na `main`. Nunca crie branches sem eu pedir.
- Nunca faça `push` sem minha autorização explícita. Commit local só quando eu pedir. Como o push na `main` dispara deploy em produção, isso vale em dobro.
- Antes de apagar ou sobrescrever algo, olhe o que está lá.

## Comunicação

- Fale comigo em português do Brasil, direto e sem enrolação. Dê uma recomendação, não um cardápio de opções.
- Mensagens de commit em inglês, no imperativo, uma linha descritiva (ex.: "Fix heading order and text contrast on the home").
- Textos do site, comentários de conteúdo e docs em português.

## Next.js

Esta versão do Next tem mudanças que quebram o que você conhece. Antes de mexer em rotas, metadata, cache ou configuração, leia o guia relevante em `node_modules/next/dist/docs/`. O bloco em `AGENTS.md` é gerado pelo `next dev`; não o remova.

## Estrutura

- `src/app/(site)`: site público e páginas internas. `(demos)` e `(demos-apps)`: demos e apps de exemplo. `admin`: painel (orçamentos). `actions`: server actions.
- `src/components`, `src/data`, `src/lib`, `src/store`.
- `docs/`: plano de desenvolvimento, personas e repertório criativo. Leia antes de decidir copy, posicionamento ou design.
- `scripts/`: verificações (rotas públicas, validação de orçamento) e utilitários de mídia.

## Posicionamento e copy

- Foco em presença online e SEO orgânico. Ordem dos pilares, sempre: 1) presença online/sites, 2) design com motion graphics, 3) redes sociais, 4) tráfego pago por último.
- Nunca inventar preços, descontos, depoimentos, urgência ou resultados. Sem depoimento provisório. Detalhes em `docs/Nosso repertório criativo.md`.
- Preços vêm só de `src/data/sitePlans.ts`; nunca escreva valor à mão na página.
- Orçamento: use `QuoteLink` (`/contato?interest=…&source=…#orcamento`). WhatsApp: `waLink()` em `src/lib/site-config.ts`. Eventos: `trackAnalyticsEvent()` em `src/lib/analytics.ts`.

## Design

- Base azul-noite. Âmbar = visível/aceso/ação (CTAs). Azul-sinal/ciano do logo = busca. Sem lima e sem roxo, em lugar nenhum (incluindo ícones e logo).
- Tipografia: Archivo (títulos), Inter (texto), JetBrains Mono (rótulos). Botões retangulares com bloco de seta separado.
- Cuide de contraste, ordem de headings e acessibilidade; já foram corrigidos antes e não devem regredir.
- A home (Rua Acesa, cena 3D) não deve pesar no caminho crítico: carregue 3D e animações com `dynamic`/lazy.

## Antes de dizer que terminou

- Rode `npm run lint` e `npm run build` (usa webpack) quando a mudança tocar código.
- Mudou páginas ou rotas públicas? Rode `node scripts/check-public-routes.cjs`. Mudou orçamento? `node scripts/test-quote-validation.cjs`.
- Páginas novas precisam de metadata, Open Graph, entrada no sitemap e structured data coerente com as existentes.
- Atualize `docs/Nexusync_Plano_de_Desenvolvimento.md` quando concluir ou mudar uma etapa do plano.
