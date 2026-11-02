"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

// Perguntas baseadas no seu briefing, com foco em profissionalismo e transparência
const faqs = [
  {
    "q": "Qual tipo de site é indicado para meu negócio?",
    "a": "Uma landing page concentra uma oferta e facilita o contato. Um site institucional apresenta a empresa e seus serviços. Um hotsite atende uma campanha, evento ou lançamento. Ajudamos a escolher conforme seu objetivo."
  },
  {
    "q": "Quanto custa e o que está incluído?",
    "a": "Os planos Presence e Pulse têm os valores e as entregas apresentados nesta página. Hotsites com recursos específicos recebem orçamento próprio. A proposta confirma páginas, funcionalidades, revisões e custos adicionais antes do início."
  },
  {
    "q": "Quanto tempo leva para ficar pronto?",
    "a": "O Presence tem entrega estimada de 3 a 5 dias úteis e o Pulse, de 5 a 10 dias úteis. O prazo depende do escopo, do envio dos materiais e das aprovações. Hotsites sob medida têm cronograma definido na proposta."
  },
  {
    "q": "Preciso fornecer textos, fotos e logotipo?",
    "a": "Reunimos as informações e os materiais disponíveis no início do projeto. A proposta define o que você fornece e se será necessário contratar produção de textos, imagens ou identidade visual."
  },
  {
    "q": "Domínio e hospedagem estão incluídos?",
    "a": "O registro do domínio e a hospedagem precisam ser confirmados no orçamento. Configurar um domínio não inclui automaticamente pagar seu registro ou suas renovações. O Pulse inclui a configuração de domínio próprio."
  },
  {
    "q": "O site funciona no celular?",
    "a": "Sim. Os sites são adaptados para celular, tablet e computador, com atenção à leitura, à navegação e aos botões de contato."
  },
  {
    "q": "Posso solicitar alterações?",
    "a": "Sim. O Presence inclui uma rodada de ajustes e o Pulse inclui duas. A proposta define as etapas de revisão; mudanças além do escopo são avaliadas separadamente."
  },
  {
    "q": "Como funciona a manutenção depois da entrega?",
    "a": "Oferecemos manutenção mensal contratada separadamente. A proposta informa o que está incluído no suporte, quais atualizações são cobertas e os custos recorrentes."
  },
  {
    "q": "O site garante novos clientes?",
    "a": "O site ajuda a apresentar sua oferta e facilitar contatos. Os resultados também dependem de divulgação, mercado, preço e atendimento. Não há garantia de volume de contatos ou vendas."
  },
  {
    "q": "Como funciona o pagamento?",
    "a": "Trabalhamos com um sinal para iniciar o projeto e saldo na aprovação e publicação final. Os valores, as etapas e as condições são apresentados na proposta."
  }
];

export function FAQ() {
  // Estado para controlar qual pergunta está aberta (null = nenhuma)
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 sm:py-32 bg-background border-t border-border">
      <div className="container-luxe">
        <div className="grid min-w-0 grid-cols-1 items-start gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">

          {/* Coluna da Esquerda: Textos de ancoragem */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
            className="min-w-0 lg:sticky lg:top-32"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-violet-300/20 bg-violet-400/[0.06] text-xs font-bold uppercase tracking-widest text-violet-200">
              Perguntas Frequentes
            </div>
            <h2 className="mb-6 font-display text-[clamp(1.5rem,7.5vw,3.125rem)] uppercase tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Dúvidas sobre a<br />
              <span className="text-violet-gradient">criação do seu site.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              <span className="font-medium text-violet-100">Transparência do início ao fim.</span> Respostas diretas sobre prazos, investimento e o nosso processo de criação. Garantimos alinhamento e previsibilidade antes mesmo de iniciar o seu projeto.
            </p>
          </motion.div>

          {/* Coluna da Direita: Accordion */}
          <div className="flex min-w-0 flex-col gap-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" as const }}
                  className={`border rounded-2xl overflow-hidden backdrop-blur-xl transition-colors duration-300 ${isOpen ? "border-violet-300/30 bg-violet-300/[0.07] shadow-violet-glow" : "border-white/[0.09] bg-white/[0.025] hover:bg-white/[0.05] hover:border-violet-300/20"
                    }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-trigger-${index}`}
                    className="flex items-center justify-between w-full p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 rounded-2xl"
                  >
                    <span className="font-bold font-display text-foreground pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-violet-200" : "text-muted-foreground"
                        }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${index}`}
                        role="region"
                        aria-labelledby={`faq-trigger-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" as const }}
                      >
                        <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-4 mt-2">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}