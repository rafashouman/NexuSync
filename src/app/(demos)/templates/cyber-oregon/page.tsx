"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Lock,
  Code2,
  Server,
  Cloud,
  Smartphone,
  Cpu,
  Radar,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
  ChevronDown,
  Menu,
  X,
  Crosshair,
  Award,
  Users,
  Zap,
  Globe,
  Eye,
  FileCheck2,
} from "lucide-react";

import { trackMetaEvent } from "@/components/MetaPixel";
import { Confetti, CountUp, Reveal } from "@/components/ui/MotionKit";
import { StickyMobileCta } from "@/components/ui/StickyMobileCta";
import { useActiveSection } from "@/components/ui/useActiveSection";

// ==========================================
// CONFIGURAÇÕES GERAIS E CONSTANTES
// ==========================================
const WHATSAPP_NUMBER = "5551993583936";
const CURRENT_YEAR = 2026;
const LOGO_DARK_SRC = "/images/templates/cyber-oregon/logo-cyber-oregon-dark.png";

const DEFAULT_WA_MSG = encodeURIComponent(
  "Olá! Gostaria de falar com um especialista da CyberOregon sobre Pentest e soluções de cibersegurança para minha empresa."
);

// ==========================================
// DADOS DO ECOSSISTEMA DE SEGURANÇA (ESTILO GUARDSI)
// ==========================================
interface SolutionItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  bgImage: string;
  metrics: string;
  deliverables: string[];
  frameworks: string[];
  terminalPreview: {
    cmd: string;
    lines: { type: "info" | "warn" | "crit" | "ok"; text: string }[];
  };
}

const SOLUTIONS: SolutionItem[] = [
  {
    id: "pentest",
    tag: "SEGURANÇA OFENSIVA",
    title: "Pentest Especializado (Teste de Intrusão)",
    subtitle: "Web, APIs, Mobile, Cloud & Infraestrutura Corporativa",
    description:
      "Simulações reais e controladas de ataques cibernéticos conduzidas manualmente por especialistas certificados. Identificamos brechas lógicas de negócio e vulnerabilidades críticas que scanners automatizados jamais enxergam.",
    icon: Terminal,
    bgImage: "/images/templates/cyber-oregon/cybersecurity-scaled.jpg",
    metrics: "Redução de 94% na superfície de exposição crítica",
    deliverables: [
      "Análise manual profunda (Black Box, Grey Box ou White Box)",
      "Exploração controlada de falhas de lógica de negócio (IDOR, Race Condition, Bypass)",
      "Relatório executivo para diretoria + laudo técnico reproduzível passo a passo",
      "Sessão de Debriefing com desenvolvedores e 1 Reteste formal gratuito incluso",
    ],
    frameworks: ["OWASP Top 10", "PTES", "OSSTMM", "NIST SP 800-115"],
    terminalPreview: {
      cmd: "oregon-sec --run-pentest --target api.cliente-enterprise.com.br --mode greybox",
      lines: [
        { type: "info", text: "[*] Enumerando endpoints REST/GraphQL e políticas de autenticação..." },
        { type: "warn", text: "[!] Alerta: Falha de autorização BOLA/IDOR detectada em /v2/invoices/{uuid}" },
        { type: "crit", text: "[CRITICAL] Escalada de privilégio Horizontal -> Admin Tenant confirmada (CVSS 9.4)" },
        { type: "ok", text: "[+] Gerando PoC segura, evidências criptografadas e patch de correção..." },
      ],
    },
  },
  {
    id: "red-team",
    tag: "SIMULAÇÃO DE ADVERSÁRIO",
    title: "Operações de Red Team & Adversary Emulation",
    subtitle: "Teste de resiliência contra ataques furtivos (APTs)",
    description:
      "Operações furtivas de múltiplos vetores — combinando intrusão digital, engenharia social e movimentação lateral — para avaliar a capacidade real de detecção e resposta do seu time de defesa (Blue Team / SOC).",
    icon: Crosshair,
    bgImage: "/images/templates/cyber-oregon/dpp-ciberseguranca-solucoes-varejo-1.jpg",
    metrics: "Mapeamento completo das TTPs na matriz MITRE ATT&CK",
    deliverables: [
      "Simulação de ameaça persistente avançada (APT) sem aviso prévio à equipe técnica",
      "Tentativas de bypass de EDR, WAF, SIEM e controles de Active Directory / Entra ID",
      "Exercício de Purple Team colaborativo para calibração de regras de detecção",
      "Cronograma de Kill Chain detalhando cada etapa do avanço até o Crown Jewels",
    ],
    frameworks: ["MITRE ATT&CK", "TIBER-EU", "Cyber Kill Chain", "Red Team Ops"],
    terminalPreview: {
      cmd: "oregon-c2 --campaign apt-emulation --stealth-level high --evade-edr",
      lines: [
        { type: "info", text: "[*] Acesso inicial obtido via Spear Phishing direcionado (Payload Furtivo)..." },
        { type: "info", text: "[*] Movimentação lateral silenciosa via Kerberoasting no domínio interno..." },
        { type: "crit", text: "[CRITICAL] Domain Admin comprometido sem disparo de alerta no SIEM em 48h" },
        { type: "ok", text: "[+] Regras Sigma/YARA geradas para bloqueio imediato do vetor no SOC." },
      ],
    },
  },
  {
    id: "soc-ir",
    tag: "DEFESA & EMERGÊNCIA 24/7",
    title: "Monitoramento Contínuo, Threat Intel & Resposta a Incidentes",
    subtitle: "Contenção rápida de Ransomware, Forense Digital e Caça a Ameaças",
    description:
      "Vigilância ininterrupta de ativos críticos, monitoramento de credenciais vazadas na Dark/Deep Web e prontidão imediata para estancar incidentes cibernéticos, preservar evidências forenses e restaurar operações.",
    icon: Radar,
    bgImage: "/images/templates/cyber-oregon/preocupe-se-com-a-ciberseguranca-de-sua-empresa.png",
    metrics: "SLA de resposta emergencial em menos de 15 minutos",
    deliverables: [
      "Monitoramento de superfície externa de ataque (EASM) e vazamento de dados (Brand Protection)",
      "Playbooks de contenção imediata para ataques de Ransomware, DDoS e exfiltração",
      "Análise Forense Digital e investigação de causa-raiz (Root Cause Analysis)",
      "Apoio jurídico-técnico na comunicação com ANPD, clientes e seguradoras cibernéticas",
    ],
    frameworks: ["NIST CSF 2.0", "ISO/IEC 27035", "SANS Incident Handler", "STIX/TAXII"],
    terminalPreview: {
      cmd: "oregon-radar --watch-darkweb --domain cliente-enterprise.com.br --ir-standby",
      lines: [
        { type: "info", text: "[*] Monitorando 142 subdomínios, certificados TLS e feeds de Stealer Logs..." },
        { type: "warn", text: "[!] 3 credenciais corporativas identificadas em repositório privado na Dark Web" },
        { type: "ok", text: "[+] Revogação automática de tokens de sessão e reset MFA executados em 42s" },
        { type: "ok", text: "[+] Perímetro íntegro. Zero atividade anômala de exfiltração detectada." },
      ],
    },
  },
  {
    id: "phishing-training",
    tag: "FATOR HUMANO & CULTURA",
    title: "Simulação de Phishing & Treinamento Corporativo",
    subtitle: "Conscientização prática e DevSecOps para equipes técnicas e executivas",
    description:
      "Transforme seus colaboradores no seu firewall mais forte. Executamos campanhas realistas de engenharia social (e-mail, WhatsApp, Smishing e Vishing) aliadas a treinamentos de código seguro para desenvolvedores.",
    icon: Users,
    bgImage: "/images/templates/cyber-oregon/dpp-ciberseguranca-varejo.jpg",
    metrics: "Queda média de 82% na taxa de cliques em golpes em 90 dias",
    deliverables: [
      "Campanhas de Phishing customizadas por setor (Financeiro, RH, C-Level, TI)",
      "Microlearning imediato e gamificado no momento em que o colaborador cai na simulação",
      "Workshop de Desenvolvimento Seguro (Secure Coding) para squads de engenharia",
      "Dashboard de evolução de maturidade e índice de risco humano por departamento",
    ],
    frameworks: ["SANS Security Awareness", "OWASP SAMM", "ISO 27001 Controle A.6.3"],
    terminalPreview: {
      cmd: "oregon-aware --launch-campaign 'Fatura_Cloud_Urgente' --targets 450",
      lines: [
        { type: "info", text: "[*] Disparando campanha simulada para 450 colaboradores em 6 departamentos..." },
        { type: "warn", text: "[!] Taxa inicial de submissão de credenciais: 18.4% (Baseline de Risco)" },
        { type: "info", text: "[*] Trilha de treinamento relâmpago ativada para usuários impactados..." },
        { type: "ok", text: "[+] 3ª Rodada concluída: Taxa de falha reduzida para 2.1% • 89 reportes ao SOC!" },
      ],
    },
  },
  {
    id: "grc-compliance",
    tag: "GOVERNANÇA & AUDITORIA",
    title: "Consultoria GRC, Adequação ISO 27001, SOC 2 & LGPD",
    subtitle: "Segurança como acelerador comercial para fechar contratos Enterprise",
    description:
      "Estruturamos políticas, controles técnicos e gestão contínua de vulnerabilidades para que sua empresa passe em auditorias rigorosas de grandes clientes, bancos, órgãos reguladores (BACEN) e investidores globais.",
    icon: ShieldCheck,
    bgImage: "/images/templates/cyber-oregon/cybersecurity-lock.jpeg",
    metrics: "100% de aprovação em Due Diligence de segurança de clientes Enterprise",
    deliverables: [
      "Gap Analysis completo e plano diretor de adequação à ISO/IEC 27001 e SOC 2 Type II",
      "Gestão Contínua de Vulnerabilidades (CVM) com priorização baseada em risco real",
      "DPO as a Service e adequação técnica/documental à LGPD e normativas do BACEN",
      "Emissão de Selo e Certificado de Ambiente Auditado pela CyberOregon",
    ],
    frameworks: ["ISO/IEC 27001", "SOC 2 Type II", "LGPD / GDPR", "CIS Controls v8"],
    terminalPreview: {
      cmd: "oregon-compliance --audit iso27001 --check-controls --export-report",
      lines: [
        { type: "info", text: "[*] Validando 93 controles do Anexo A ISO/IEC 27001:2022..." },
        { type: "ok", text: "[+] Criptografia em repouso/trânsito, IAM e logs de auditoria: CONFORME (98%)" },
        { type: "ok", text: "[+] Laudo de Pentest Anual anexado para Due Diligence de parceiros bancários" },
        { type: "ok", text: "[+] Certificado de Conformidade CyberOregon emitido com hash de validação." },
      ],
    },
  },
];

const METHODOLOGY_STEPS = [
  {
    step: "01",
    title: "Scoping & Threat Modeling",
    desc: "Mapeamento da arquitetura, regras de negócio, ativos críticos (Crown Jewels) e definição conjunta das regras de engajamento seguras.",
    badge: "Alinhamento Estratégico",
  },
  {
    step: "02",
    title: "Reconhecimento & Inteligência (OSINT)",
    desc: "Varredura profunda da superfície de ataque externa, descoberta de ativos sombra (Shadow IT), APIs esquecidas e credenciais expostas.",
    badge: "Visão do Invasor",
  },
  {
    step: "03",
    title: "Exploração Manual & Pós-Exploração",
    desc: "Hackers éticos seniores testam cadeias complexas de vulnerabilidades, encadeando falhas para demonstrar o impacto real no negócio.",
    badge: "Zero Falso-Positivo",
  },
  {
    step: "04",
    title: "Relatório Acionável & Transferência",
    desc: "Entrega de relatório executivo para C-Level e guia técnico detalhado com código de correção, evidências em vídeo e CVSS contextualizado.",
    badge: "Foco em Correção",
  },
  {
    step: "05",
    title: "Reteste Validado & Certificação",
    desc: "Após a atuação da sua equipe, reexecutamos os testes sem custo adicional para atestar que todas as brechas foram eliminadas e emitimos o Certificado.",
    badge: "Selo CyberOregon",
  },
];

const FAQS = [
  {
    q: "Qual a diferença entre um Pentest da CyberOregon e um scan automatizado de vulnerabilidades?",
    a: "Scanners automatizados apenas identificam falhas conhecidas de catálogo e geram dezenas de falsos-positivos, sendo incapazes de compreender a lógica do seu negócio. Na CyberOregon, cada Pentest é conduzido manualmente por pesquisadores de segurança certificados (OSCP, OSWE, OSEP) que simulam a criatividade de um invasor real — descobrindo falhas críticas de autorização, manipulação de transações financeiras e encadeamento de brechas que ferramentas automáticas ignoram.",
  },
  {
    q: "O Pentest pode causar indisponibilidade ou queda no meu ambiente de produção?",
    a: "Não. Trabalhamos sob rígidas Regras de Engajamento (RoE) e acordos de confidencialidade (NDA). Toda exploração é controlada, evitando payloads destrutivos ou testes de negação de serviço (DoS) não solicitados. Além disso, mantemos um canal direto em tempo real com seu time técnico e reportamos imediatamente qualquer vulnerabilidade crítica (Zero-Day ou P1) assim que descoberta, sem esperar o fim do projeto.",
  },
  {
    q: "O laudo da CyberOregon é aceito em auditorias de clientes Enterprise, bancos e certificações (ISO 27001 / SOC 2)?",
    a: "Sim. Nossos relatórios seguem rigorosamente padrões internacionais (OWASP, PTES, NIST e MITRE ATT&CK) e são assinados por profissionais com certificações globais reconhecidas pela indústria. Após a validação das correções no reteste, emitimos uma Carta de Atestado (Letter of Attestation) e o Selo de Segurança Auditada para você apresentar em processos de Due Diligence comercial.",
  },
  {
    q: "Em quanto tempo recebemos uma proposta comercial e quanto dura um projeto de Pentest?",
    a: "Após um rápido alinhamento de escopo de 15 minutos (ou pelo nosso simulador abaixo), entregamos a proposta técnica detalhada em até 24 horas úteis. A execução de um Pentest varia tipicamente de 1 a 3 semanas conforme a complexidade do ativo, já incluindo o prazo de suporte à remediação e o reteste completo.",
  },
  {
    q: "Vocês atendem empresas que sofreram um incidente ou ataque de Ransomware agora?",
    a: "Sim. Contamos com um esquadrão de Resposta a Incidentes (CSIRT) 24/7. Caso sua operação esteja sob ataque neste momento, acione o botão de Emergência no topo da página ou chame diretamente no WhatsApp para contenção imediata, isolamento de ativos e preservação forense.",
  },
];

// ==========================================
// BARRA DE PROGRESSO NO TOPO (CORES CYBEROREGON)
// ==========================================
function CyberScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-[#0088CC] via-[#00D4FF] to-[#38F8FF]"
    />
  );
}

// ==========================================
// COMPONENTE DE TAG DE SEÇÃO
// ==========================================
const SectionBadge = ({
  children,
  code,
}: {
  children: React.ReactNode;
  code?: string;
}) => (
  <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/35 mb-5 backdrop-blur-sm">
    <span className="w-2 h-2 rounded-full bg-[#00EAFF] animate-pulse shadow-[0_0_8px_#00EAFF]" />
    {code && (
      <span className="font-mono text-[11px] font-bold text-[#00EAFF] tracking-widest">
        [{code}]
      </span>
    )}
    <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-100 font-semibold">
      {children}
    </span>
  </div>
);

// ==========================================
// 1. NAVBAR COM O NOVO LOGO DARK EM FUNDO #020b1f
// ==========================================
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection([
    "solucoes",
    "simulador",
    "metodologia",
    "diferenciais",
    "faq",
    "contato",
  ]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { id: "solucoes", label: "Soluções" },
    { id: "simulador", label: "Diagnóstico & Escopo" },
    { id: "metodologia", label: "Metodologia" },
    { id: "diferenciais", label: "Por que CyberOregon" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 pt-3 sm:pt-4 pointer-events-none">
      {/* Top Status Strip */}
      <div
        className={`max-w-7xl mx-auto mb-2 transition-all duration-300 pointer-events-auto hidden md:flex items-center justify-between px-4 py-1.5 rounded-xl bg-[#020b1f]/90 backdrop-blur-md border border-[#00D4FF]/25 text-[11px] font-mono text-slate-300 ${
          scrolled ? "opacity-0 -translate-y-3 pointer-events-none hidden" : "opacity-100"
        }`}
      >
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-2 text-[#00EAFF]">
            <span className="w-2 h-2 rounded-full bg-[#00EAFF] animate-ping" />
            SOC & RED TEAM OPERACIONAL 24/7
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">
            OWASP • PTES • MITRE ATT&CK • ISO/IEC 27001
          </span>
        </div>
        <div className="flex items-center gap-5">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              "URGENTE: Preciso acionar o time de Resposta a Incidentes da CyberOregon."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-semibold transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Sob Ataque? Plantão de Incidente 24h
          </a>
        </div>
      </div>

      {/* Main Dock */}
      <div
        className={`max-w-7xl mx-auto transition-all duration-500 pointer-events-auto rounded-2xl border ${
          scrolled
            ? "bg-[#020b1f]/95 backdrop-blur-xl border-[#00D4FF]/35 shadow-[0_20px_50px_rgba(0,0,0,0.85)] py-2.5 px-4 sm:px-6"
            : "bg-[#020b1f]/80 backdrop-blur-lg border-[#00D4FF]/20 py-3 px-4 sm:px-6"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Novo Logo Dark CyberOregon integrado direto no fundo escuro */}
          <a
            href="#"
            aria-label="CyberOregon — Início"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="relative flex items-center rounded-xl overflow-hidden px-2 py-1 bg-[#020b1f] border border-[#00D4FF]/30 group-hover:border-[#00EAFF] shadow-[0_0_25px_rgba(0,212,255,0.2)] transition-all duration-300">
              <Image
                src={LOGO_DARK_SRC}
                alt="CyberOregon Cybersecurity"
                width={230}
                height={44}
                priority
                className="h-8 sm:h-10 w-auto object-contain"
              />
            </div>
          </a>

          {/* Desktop Links */}
          <nav
            aria-label="Navegação CyberOregon"
            className="hidden lg:flex items-center gap-1 xl:gap-2"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-[#00D4FF]/20 text-[#00EAFF] border border-[#00D4FF]/50 font-bold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#contato"
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0088CC] via-[#00B8E6] to-[#00EAFF] text-[#020b1f] font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(0,212,255,0.45)] hover:shadow-[0_0_35px_rgba(0,234,255,0.7)] transition-all active:scale-95"
            >
              <Shield className="w-4 h-4 fill-current" />
              <span>Solicitar Pentest</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isOpen}
            className="lg:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 hover:text-[#00EAFF]"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="pt-4 pb-2 mt-3 border-t border-white/10 flex flex-col gap-2">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setIsOpen(false)}
                    className="px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-slate-200 hover:bg-[#00D4FF]/20 hover:text-[#00EAFF]"
                  >
                    {item.label}
                  </a>
                ))}
                <a
                  href="#contato"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#0088CC] to-[#00EAFF] text-[#020b1f] font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Agendar Diagnóstico de Segurança
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

// ==========================================
// 2. HERO SECTION COM BACKGROUND DE IMAGEM + CONSOLE INTERATIVO
// ==========================================
const Hero = () => {
  const [activeScanTab, setActiveScanTab] = useState<"pentest" | "surface" | "compliance">("pentest");

  return (
    <section className="relative pt-28 sm:pt-36 lg:pt-44 pb-20 lg:pb-28 overflow-hidden bg-[#020b1f]">
      {/* Imagem de Background Hero Anexada */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/images/templates/cyber-oregon/cybersecurity-scaled.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30 mix-blend-luminosity scale-105"
        />
        {/* Gradientes sobrepostos na cor #020b1f para leitura perfeita */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#020b1f] via-[#020b1f]/85 to-[#020b1f]/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020b1f]/80 via-transparent to-[#020b1f]" />
      </div>

      {/* Cyber Grid & Radial Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,212,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,212,255,0.06)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_25%,#000_65%,transparent_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-[#005580]/40 via-[#00B8E6]/20 to-[#00EAFF]/15 blur-[130px] rounded-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#061838]/80 border border-[#00D4FF]/40 mb-6 backdrop-blur-md">
              <span className="px-2 py-0.5 rounded-full bg-[#00EAFF]/20 text-[#00EAFF] font-mono text-[10px] font-bold uppercase tracking-widest">
                OFFENSIVE & DEFENSIVE CYBERSECURITY
              </span>
              <span className="text-xs text-slate-200 font-medium hidden sm:inline">
                Pentest • Red Team • Resposta a Incidentes
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.08] mb-6">
              Antecipe o ataque.{" "}
              <span className="bg-gradient-to-r from-[#00B8E6] via-[#00EAFF] to-[#70F8FF] bg-clip-text text-transparent">
                Blinde sua operação
              </span>{" "}
              antes que o invasor encontre a brecha.
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl mb-8">
              A <strong className="text-white font-semibold">CyberOregon</strong> combina{" "}
              <span className="text-[#00EAFF] font-medium">
                Hacking Ético manual de elite
              </span>{" "}
              e inteligência contínua contra ameaças para identificar falhas críticas em suas aplicações Web, APIs, Mobile e Cloud — com relatórios prontos para auditorias e{" "}
              <strong className="text-white font-semibold">zero falso-positivo</strong>.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <a
                href="#simulador"
                className="group relative inline-flex items-center justify-center gap-3 px-7 py-4 rounded-xl bg-gradient-to-r from-[#0088CC] via-[#00C4F0] to-[#00EAFF] text-[#020b1f] font-black text-sm uppercase tracking-wider shadow-[0_0_35px_rgba(0,212,255,0.45)] hover:shadow-[0_0_50px_rgba(0,234,255,0.7)] transition-all active:scale-[0.98]"
              >
                <Terminal className="w-4 h-4" />
                <span>Dimensionar Escopo de Pentest</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${DEFAULT_WA_MSG}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackMetaEvent("Contact", {
                    content_name: "Hero WhatsApp Especialista",
                    content_category: "CyberOregon Hero",
                  })
                }
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#051430]/90 hover:bg-[#09224C] border border-[#00D4FF]/40 text-white font-bold text-sm transition-all backdrop-blur-md"
              >
                <MessageCircle className="w-4 h-4 text-[#00EAFF]" />
                <span>Falar com Especialista Agora</span>
              </a>
            </div>

            {/* Trust Metrics Strip */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/15">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                  +<CountUp to={1450} />
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  Vulnerabilidades críticas neutralizadas
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#00EAFF] font-mono">
                  <CountUp to={100} suffix="%" />
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  Testes manuais validados sem falso-positivo
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                  &lt;<CountUp to={15} />
                  <span className="text-base text-[#00EAFF]">min</span>
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  SLA de resposta a incidentes críticos
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Offensive Security Command Center */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-[#04122C]/95 border border-[#00D4FF]/45 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_45px_rgba(0,212,255,0.22)] overflow-hidden backdrop-blur-xl">
              {/* Top Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#071C40] border-b border-[#00D4FF]/30">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00EAFF]" />
                  <span className="ml-2 font-mono text-[11px] text-slate-200 font-semibold">
                    cyber-oregon://offensive-ops-v4.2
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#00EAFF]/15 border border-[#00EAFF]/40 font-mono text-[10px] text-[#00EAFF] font-bold">
                  LIVE TELEMETRY
                </span>
              </div>

              {/* Console Mode Selector Tabs */}
              <div className="grid grid-cols-3 gap-1 p-2 bg-[#020b1f] border-b border-white/10 font-mono text-[11px]">
                <button
                  type="button"
                  onClick={() => setActiveScanTab("pentest")}
                  className={`py-2 px-2 rounded-lg transition-all font-semibold ${
                    activeScanTab === "pentest"
                      ? "bg-[#00D4FF]/25 text-[#00EAFF] border border-[#00D4FF]/50"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  01. Pentest API
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScanTab("surface")}
                  className={`py-2 px-2 rounded-lg transition-all font-semibold ${
                    activeScanTab === "surface"
                      ? "bg-[#00D4FF]/25 text-[#00EAFF] border border-[#00D4FF]/50"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  02. Attack Surface
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScanTab("compliance")}
                  className={`py-2 px-2 rounded-lg transition-all font-semibold ${
                    activeScanTab === "compliance"
                      ? "bg-[#00D4FF]/25 text-[#00EAFF] border border-[#00D4FF]/50"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  03. Certificação
                </button>
              </div>

              {/* Console Content Body */}
              <div className="p-5 font-mono text-xs space-y-4 min-h-[320px] flex flex-col justify-between">
                {activeScanTab === "pentest" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-white/10">
                      <span>ALVO: api.fintech-core.internal</span>
                      <span className="text-[#00EAFF]">METODOLOGIA: OWASP + PTES</span>
                    </div>
                    <div className="space-y-2 text-[11px] leading-relaxed">
                      <p className="text-slate-300">
                        <span className="text-[#00EAFF]">$</span> oregon-exploit --module auth-bypass --verify
                      </p>
                      <p className="text-slate-400">
                        [+] Inspecionando validação de assinatura JWT e escopos OAuth2...
                      </p>
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200">
                        <div className="flex items-center justify-between font-bold text-rose-400 mb-1">
                          <span>[CRÍTICO • CVSS 9.6] Broken Object Level Auth</span>
                          <span>P1</span>
                        </div>
                        <p className="text-[11px] text-rose-100/90">
                          Manipulação de cabeçalho X-Account-ID permite leitura e transferência entre contas sem validação de sessão.
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-[#00D4FF]/15 border border-[#00EAFF]/35 text-cyan-100">
                        <p className="font-bold text-[#00EAFF] mb-0.5">
                          [✓ REMEDIAÇÃO VALIDADA NO RETESTE]
                        </p>
                        <p className="text-[11px] text-slate-200">
                          Patch aplicado no middleware e validado pelo Red Team CyberOregon.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeScanTab === "surface" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-white/10">
                      <span>MÓDULO: EASM & DARK WEB RADAR</span>
                      <span className="text-amber-300">24/7 ACTIVE</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-[10px] text-slate-400 block">SUBDOMÍNIOS MAPEADOS</span>
                        <span className="text-lg font-black text-white">84 Ativos</span>
                        <span className="text-[10px] text-[#00EAFF] block mt-0.5">2 Shadow IT isolados</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-[10px] text-slate-400 block">CREDENCIAIS VAZADAS</span>
                        <span className="text-lg font-black text-amber-400">0 Expostas</span>
                        <span className="text-[10px] text-slate-300 block mt-0.5">Monitoramento contínuo</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#061A3A] border border-[#00D4FF]/40 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-200">Blindagem de Perímetro Cloud (AWS/Azure)</span>
                        <span className="text-[#00EAFF] font-bold">99.4%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full w-[99%] bg-gradient-to-r from-[#0088CC] to-[#00EAFF]" />
                      </div>
                    </div>
                  </div>
                )}

                {activeScanTab === "compliance" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-white/10">
                      <span>ATESTADO DE AUDITORIA</span>
                      <span className="text-[#00EAFF]">DUE DILIGENCE READY</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { name: "OWASP Top 10 (Web & API Security)", status: "100% Verificado" },
                        { name: "ISO/IEC 27001 & SOC 2 Type II Evidence", status: "Laudo Emitido" },
                        { name: "Conformidade Técnica LGPD & BACEN", status: "Aprovado" },
                      ].map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10"
                        >
                          <span className="text-slate-200 text-[11px]">{item.name}</span>
                          <span className="px-2 py-0.5 rounded bg-[#00EAFF]/15 text-[#00EAFF] text-[10px] font-bold">
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Mini Footer inside Console */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#00EAFF]" />
                    <span className="text-[11px] text-slate-300">
                      NDA & Sigilo Absoluto Garantidos
                    </span>
                  </div>
                  <a
                    href="#simulador"
                    className="text-[11px] font-bold text-[#00EAFF] hover:underline flex items-center gap-1"
                  >
                    Simular meu ativo <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 3. FAIXA DE FRAMEWORKS & PADRÕES GLOBAIS (MARQUEE)
// ==========================================
const FrameworksMarquee = () => {
  const items = [
    "OWASP TOP 10",
    "MITRE ATT&CK FRAMEWORK",
    "PTES (PENETRATION TESTING EXECUTION STANDARD)",
    "ISO/IEC 27001",
    "NIST CYBERSECURITY FRAMEWORK 2.0",
    "SOC 2 TYPE II COMPLIANCE",
    "OSSTMM",
    "CIS CRITICAL SECURITY CONTROLS",
    "ADEQUAÇÃO TÉCNICA LGPD & BACEN",
  ];

  return (
    <div className="border-y border-[#00D4FF]/25 bg-[#010714] py-4 overflow-hidden marquee">
      <div className="flex w-max marquee-track">
        {[0, 1, 2, 3].map((copy) => (
          <div key={copy} className="flex items-center gap-8 px-4">
            {items.map((label) => (
              <div key={`${copy}-${label}`} className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#00D4FF] shrink-0" />
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-slate-300 whitespace-nowrap">
                  {label}
                </span>
                <span className="text-[#00EAFF]/40 font-mono">•</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. PORTFÓLIO DE SOLUÇÕES E PRODUTOS COM BACKGROUNDS REAIS
// ==========================================
const SolutionsSection = () => {
  const [selectedId, setSelectedId] = useState<string>(SOLUTIONS[0].id);
  const current = SOLUTIONS.find((s) => s.id === selectedId) ?? SOLUTIONS[0];

  return (
    <section id="solucoes" className="py-24 lg:py-32 relative bg-[#020b1f] overflow-hidden">
      {/* Subtle Ambient Background Image */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/images/templates/cyber-oregon/dpp-ciberseguranca-solucoes-varejo-1.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-right opacity-15 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020b1f] via-[#020b1f]/90 to-[#020b1f]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal>
          <div className="max-w-3xl mb-14">
            <SectionBadge code="SEC-01">Portfólio de Segurança Ofensiva & Defensiva</SectionBadge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Soluções completas para blindar cada camada do seu ecossistema digital.
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Da descoberta de vulnerabilidades ocultas em código ao monitoramento contínuo na Dark Web e resposta emergencial a incidentes. Escolha o pilar para inspecionar os entregáveis técnicos:
            </p>
          </div>
        </Reveal>

        {/* Interactive Selector Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Navigation List */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {SOLUTIONS.map((item) => {
              const Icon = item.icon;
              const active = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
                    active
                      ? "bg-gradient-to-r from-[#08224A]/95 to-[#04142E]/95 border-[#00EAFF]/70 shadow-[0_10px_35px_rgba(0,212,255,0.25)]"
                      : "bg-[#04122C]/75 border-white/10 hover:border-[#00D4FF]/40 hover:bg-[#061A3D]"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl shrink-0 transition-colors ${
                      active
                        ? "bg-[#00EAFF] text-[#020b1f]"
                        : "bg-[#082552] text-[#00EAFF]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#00EAFF] font-bold block mb-1">
                      {item.tag}
                    </span>
                    <h3 className="text-base font-bold text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                      {item.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Detailed Inspection Card with Dynamic Header Background Image */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="relative rounded-3xl bg-[#04122C] border border-[#00D4FF]/40 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.75)]"
              >
                {/* Visual Banner Header with Attached Image */}
                <div className="relative h-44 sm:h-52 w-full overflow-hidden border-b border-[#00D4FF]/25">
                  <Image
                    src={current.bgImage}
                    alt={current.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-center opacity-55"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04122C] via-[#04122C]/65 to-[#020b1f]/40" />

                  <div className="absolute inset-x-0 bottom-0 p-6 sm:px-8 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full bg-[#020b1f]/85 border border-[#00EAFF]/50 font-mono text-xs text-[#00EAFF] font-bold mb-2 backdrop-blur-md">
                        {current.tag}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-white drop-shadow">
                        {current.title}
                      </h3>
                    </div>
                    <span className="font-mono text-xs text-cyan-100 bg-[#020b1f]/85 px-3 py-1.5 rounded-lg border border-[#00D4FF]/35 backdrop-blur-md">
                      ⚡ {current.metrics}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 lg:p-10">
                  <p className="text-sm font-mono text-[#00EAFF] mb-4">
                    {current.subtitle}
                  </p>

                  <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-8">
                    {current.description}
                  </p>

                  {/* Deliverables List */}
                  <div className="mb-8">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300 mb-4">
                      ENTREGÁVEIS TÉCNICOS & EXECUTIVOS INCLUSOS:
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {current.deliverables.map((deliv) => (
                        <div
                          key={deliv}
                          className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#020b1f]/90 border border-white/10"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#00EAFF] shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-slate-200 leading-snug">
                            {deliv}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live Terminal Output Simulation */}
                  <div className="rounded-2xl bg-[#010714] border border-[#00D4FF]/30 overflow-hidden mb-8">
                    <div className="px-4 py-2 bg-[#051636] border-b border-white/10 flex items-center justify-between">
                      <span className="font-mono text-[11px] text-slate-300">
                        Simulação de Execução • CyberOregon Engine
                      </span>
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#0088CC]" />
                        <span className="w-2 h-2 rounded-full bg-[#00EAFF]" />
                      </div>
                    </div>
                    <div className="p-4 font-mono text-xs space-y-2">
                      <p className="text-cyan-200">
                        <span className="text-[#00EAFF]">root@cyber-oregon:~#</span>{" "}
                        {current.terminalPreview.cmd}
                      </p>
                      {current.terminalPreview.lines.map((line, i) => (
                        <p
                          key={i}
                          className={
                            line.type === "crit"
                              ? "text-rose-400 font-bold"
                              : line.type === "warn"
                              ? "text-amber-300"
                              : line.type === "ok"
                              ? "text-[#00EAFF]"
                              : "text-slate-300"
                          }
                        >
                          {line.text}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Frameworks & Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-white/10">
                    <div className="flex flex-wrap items-center gap-2">
                      {current.frameworks.map((fw) => (
                        <span
                          key={fw}
                          className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-[11px] text-slate-200"
                        >
                          {fw}
                        </span>
                      ))}
                    </div>

                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        `Olá! Quero solicitar uma proposta da CyberOregon para a solução: ${current.title}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#0088CC] to-[#00EAFF] text-[#020b1f] font-black text-xs uppercase tracking-wider shrink-0 hover:opacity-95 transition-all"
                    >
                      <span>Solicitar Escopo deste Serviço</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 5. SUPERFÍCIES AUDITADAS COM BACKGROUND DE IMAGEM
// ==========================================
const AttackSurfacesGrid = () => {
  const surfaces = [
    {
      icon: Globe,
      title: "Aplicações Web & SaaS",
      desc: "SPAs, portais de clientes, ERPs e plataformas de e-commerce testados contra injeções, XSS, CSRF, SSRF e falhas críticas de regra de negócio.",
      tag: "OWASP WSTG",
    },
    {
      icon: Code2,
      title: "APIs REST, GraphQL & gRPC",
      desc: "Auditoria profunda de autenticação JWT/OAuth, BOLA/IDOR, Mass Assignment, Rate Limiting e vazamento de dados sensíveis entre tenants.",
      tag: "OWASP API Top 10",
    },
    {
      icon: Smartphone,
      title: "Aplicativos Mobile (iOS & Android)",
      desc: "Engenharia reversa de binários, bypass de SSL Pinning/Root Detection, armazenamento inseguro e interceptação de comunicação com backend.",
      tag: "OWASP MASVS",
    },
    {
      icon: Cloud,
      title: "Infraestrutura Cloud (AWS, Azure, GCP)",
      desc: "Revisão de políticas IAM, buckets S3 expostos, containers Kubernetes/Docker, segredos em pipelines CI/CD e isolamento de VPCs.",
      tag: "CIS Benchmarks",
    },
    {
      icon: Server,
      title: "Redes Internas & Active Directory",
      desc: "Testes de intrusão em perímetro externo e rede local, avaliação de segmentação VLAN, VPNs, Wi-Fi corporativo e escalada para Domain Admin.",
      tag: "MITRE ATT&CK",
    },
    {
      icon: Cpu,
      title: "Sistemas Financeiros, PIX & IoT",
      desc: "Testes de concorrência (Race Condition) em carteiras digitais, gateways de pagamento, mensageria bancária e dispositivos embarcados.",
      tag: "Zero-Tolerance",
    },
  ];

  return (
    <section className="relative py-24 bg-[#020b1f] border-y border-[#00D4FF]/20 overflow-hidden">
      {/* Background Image: dpp-ciberseguranca-varejo.jpg */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/images/templates/cyber-oregon/dpp-ciberseguranca-varejo.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-20 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020b1f] via-[#020b1f]/85 to-[#020b1f]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <SectionBadge code="SEC-02">Cobertura Tecnológica</SectionBadge>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Qualquer stack. Qualquer arquitetura.
              </h2>
            </div>
            <p className="text-slate-300 text-sm sm:text-base max-w-md">
              Nossos especialistas dominam as arquiteturas modernas para testar seus ativos exatamente onde os cibercriminosos tentam explorar.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {surfaces.map((s, idx) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={idx * 0.05}>
                <div className="group h-full p-6 rounded-2xl bg-[#04132D]/90 backdrop-blur-md border border-[#00D4FF]/20 hover:border-[#00EAFF]/70 transition-all duration-300 flex flex-col justify-between shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="p-3 rounded-xl bg-[#082452] border border-[#00D4FF]/40 text-[#00EAFF] group-hover:bg-[#00EAFF] group-hover:text-[#020b1f] transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded bg-white/5 text-slate-200 border border-white/10">
                        {s.tag}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#00EAFF] transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 6. SIMULADOR INTERATIVO DE ESCOPO DE PENTEST & MATURIDADE
// ==========================================
const PentestScopeCalculator = () => {
  const [selectedTargets, setSelectedTargets] = useState<string[]>(["web-app", "api"]);
  const [boxMode, setBoxMode] = useState<"black" | "grey" | "white">("grey");
  const [companySize, setCompanySize] = useState<"startup" | "mid" | "enterprise">("mid");
  const [complianceNeed, setComplianceNeed] = useState<string>("Auditoria de Clientes / Due Diligence");

  const targetOptions = [
    { id: "web-app", label: "Aplicação Web / SaaS", days: 5 },
    { id: "api", label: "APIs (REST / GraphQL)", days: 4 },
    { id: "mobile", label: "App Mobile (iOS / Android)", days: 5 },
    { id: "cloud", label: "Infraestrutura Cloud (AWS/Azure/GCP)", days: 4 },
    { id: "network", label: "Rede Corporativa / Active Directory", days: 5 },
    { id: "phishing", label: "Campanha de Phishing / Engenharia Social", days: 3 },
  ];

  const toggleTarget = (id: string) => {
    setSelectedTargets((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((item) => item !== id)
          : prev
        : [...prev, id]
    );
  };

  const baseDays = selectedTargets.reduce((acc, id) => {
    const found = targetOptions.find((t) => t.id === id);
    return acc + (found ? found.days : 0);
  }, 0);

  const sizeMultiplier = companySize === "startup" ? 0.85 : companySize === "mid" ? 1 : 1.35;
  const estimatedDays = Math.max(4, Math.round(baseDays * sizeMultiplier));
  const specialistsCount = estimatedDays > 10 ? 3 : 2;

  const boxDescriptions = {
    black: {
      title: "Black Box (Visão Externa Cega)",
      desc: "Simula um atacante externo sem nenhum conhecimento prévio ou credencial. Ideal para testar a resistência real do perímetro.",
    },
    grey: {
      title: "Grey Box (Recomendado • Maior ROI)",
      desc: "Simula um usuário autenticado ou parceiro com acesso padrão. Permite focar 100% na descoberta de falhas profundas de permissão e regra de negócio.",
    },
    white: {
      title: "White Box (Acesso Total + Código-Fonte)",
      desc: "Auditoria exaustiva com acesso à documentação, arquitetura e repositórios Git para máxima cobertura antes de grandes lançamentos.",
    },
  };

  const handleSendScopeWhatsApp = () => {
    const targetNames = selectedTargets
      .map((id) => targetOptions.find((t) => t.id === id)?.label)
      .filter(Boolean)
      .join(", ");

    const msg = `Olá! Usei o Simulador de Escopo da CyberOregon e gostaria de receber uma proposta comercial:\n\n• *Ativos a testar:* ${targetNames}\n• *Abordagem:* ${boxDescriptions[boxMode].title}\n• *Porte da Operação:* ${companySize.toUpperCase()}\n• *Objetivo Principal:* ${complianceNeed}\n• *Estimativa prévia:* ~${estimatedDays} dias úteis (${specialistsCount} especialistas OSCP/OSWE + 1 Reteste incluso).`;

    trackMetaEvent("Lead", {
      content_name: "Simulador de Escopo Pentest CyberOregon",
      content_category: boxMode,
    });

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section id="simulador" className="py-24 lg:py-32 relative bg-[#020b1f] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <SectionBadge code="SEC-03">Dimensionador Interativo de Pentest</SectionBadge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
              Monte o escopo técnico da sua operação em 30 segundos.
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Selecione os ativos que você precisa blindar e a modalidade do teste para visualizar a recomendação de engenharia da CyberOregon.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Configuration Panel */}
          <div className="lg:col-span-7 rounded-3xl bg-[#04122C] border border-[#00D4FF]/25 p-6 sm:p-8 space-y-8">
            {/* Step 1: Select Targets */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-[#00EAFF] font-bold mb-3">
                1. SELECIONE OS ATIVOS DIGITAIS NO ESCOPO (MÚLTIPLA ESCOLHA)
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {targetOptions.map((target) => {
                  const active = selectedTargets.includes(target.id);
                  return (
                    <button
                      key={target.id}
                      type="button"
                      onClick={() => toggleTarget(target.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                        active
                          ? "bg-[#00D4FF]/20 border-[#00EAFF] text-white shadow-[0_0_20px_rgba(0,234,255,0.18)]"
                          : "bg-[#020b1f] border-white/10 text-slate-300 hover:border-white/25"
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-semibold">
                        {target.label}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                          active
                            ? "bg-[#00EAFF] text-[#020b1f]"
                            : "border border-slate-600"
                        }`}
                      >
                        {active && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Box Mode */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-[#00EAFF] font-bold mb-3">
                2. MODALIDADE DE TESTE DE INTRUSÃO
              </label>
              <div className="grid sm:grid-cols-3 gap-3 mb-3">
                {(["black", "grey", "white"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setBoxMode(mode)}
                    className={`py-3 px-4 rounded-xl border font-mono text-xs uppercase tracking-wider font-bold transition-all ${
                      boxMode === mode
                        ? "bg-[#00EAFF] text-[#020b1f] border-[#00EAFF]"
                        : "bg-[#020b1f] text-slate-300 border-white/10 hover:border-white/25"
                    }`}
                  >
                    {mode} Box
                  </button>
                ))}
              </div>
              <div className="p-3.5 rounded-xl bg-[#020b1f] border border-white/10 text-xs text-slate-300">
                <strong className="text-white block mb-0.5">
                  {boxDescriptions[boxMode].title}
                </strong>
                {boxDescriptions[boxMode].desc}
              </div>
            </div>

            {/* Step 3: Size & Objective */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-slate-300 mb-2">
                  3. COMPLEXIDADE DO AMBIENTE
                </label>
                <select
                  value={companySize}
                  onChange={(e) =>
                    setCompanySize(e.target.value as "startup" | "mid" | "enterprise")
                  }
                  className="w-full px-4 py-3 rounded-xl bg-[#020b1f] border border-white/15 text-white text-sm focus:border-[#00EAFF] focus:outline-none"
                >
                  <option value="startup">Ágil / SaaS em Crescimento</option>
                  <option value="mid">Médio Porte / Múltiplos Módulos</option>
                  <option value="enterprise">Enterprise / Missão Crítica</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-widest text-slate-300 mb-2">
                  4. MOTIVAÇÃO PRINCIPAL
                </label>
                <select
                  value={complianceNeed}
                  onChange={(e) => setComplianceNeed(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#020b1f] border border-white/15 text-white text-sm focus:border-[#00EAFF] focus:outline-none"
                >
                  <option value="Auditoria de Clientes / Due Diligence">
                    Requisito de Cliente / Due Diligence
                  </option>
                  <option value="Prevenção Proativa contra Ataques">
                    Prevenção Proativa & Redução de Risco
                  </option>
                  <option value="Conformidade ISO 27001 / SOC 2 / LGPD">
                    Certificação ISO 27001 / SOC 2 / LGPD
                  </option>
                  <option value="Validação antes de Go-Live / Lançamento">
                    Validação Pré-Lançamento (Go-Live)
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Output Summary Blueprint */}
          <div className="lg:col-span-5 relative rounded-3xl bg-gradient-to-b from-[#071F46] to-[#031026] border border-[#00EAFF]/50 p-6 sm:p-8 flex flex-col justify-between shadow-[0_20px_60px_rgba(0,212,255,0.22)] overflow-hidden">
            {/* Subtle background image inside blueprint card */}
            <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
              <Image
                src="/images/templates/cyber-oregon/cybersecurity-lock.jpeg"
                alt=""
                fill
                sizes="40vw"
                className="object-cover object-center opacity-15 mix-blend-screen"
              />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <span className="font-mono text-xs uppercase tracking-widest text-[#00EAFF] font-bold">
                  BLUEPRINT TÉCNICO RECOMENDADO
                </span>
                <span className="px-2.5 py-0.5 rounded bg-[#00EAFF]/20 text-[#00EAFF] font-mono text-[11px] font-bold">
                  NDA INCLUSO
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-[#020b1f]/90 border border-white/10">
                  <span className="font-mono text-[10px] text-slate-400 uppercase block">
                    JANELA ESTIMADA
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                    {estimatedDays} dias
                  </span>
                  <span className="text-[11px] text-[#00EAFF] block mt-0.5">
                    Execução + Laudo Técnico
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[#020b1f]/90 border border-white/10">
                  <span className="font-mono text-[10px] text-slate-400 uppercase block">
                    SQUAD ALOCADO
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-[#00EAFF] font-mono">
                    {specialistsCount} Pentesters
                  </span>
                  <span className="text-[11px] text-slate-300 block mt-0.5">
                    Seniores Certificados
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 mb-8 text-xs sm:text-sm text-slate-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00EAFF] shrink-0" />
                  <span>Exploração 100% manual + testes de lógica de negócio</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00EAFF] shrink-0" />
                  <span>Notificação em tempo real de falhas críticas (Zero-Day/P1)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00EAFF] shrink-0" />
                  <span>Relatório Executivo (C-Level) + Técnico para Devs</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00EAFF] shrink-0" />
                  <span>1 Reteste completo gratuito em até 60 dias</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00EAFF] shrink-0" />
                  <span>Carta de Atestado & Certificado CyberOregon</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 space-y-3">
              <button
                type="button"
                onClick={handleSendScopeWhatsApp}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#0088CC] via-[#00C4F0] to-[#00EAFF] text-[#020b1f] font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(0,234,255,0.4)] hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Receber Cotação deste Escopo no WhatsApp</span>
              </button>
              <p className="text-[11px] font-mono text-center text-slate-300">
                Atendimento direto por Engenheiro de Segurança • Sem robôs
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 7. METODOLOGIA DE 5 ETAPAS (PTES + OWASP + MITRE)
// ==========================================
const MethodologySection = () => {
  return (
    <section
      id="metodologia"
      className="relative py-24 lg:py-32 bg-[#020b1f] border-y border-[#00D4FF]/20 overflow-hidden"
    >
      {/* Background Image: preocupe-se-com-a-ciberseguranca-de-sua-empresa.png */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <Image
          src="/images/templates/cyber-oregon/preocupe-se-com-a-ciberseguranca-de-sua-empresa.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-20 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020b1f] via-[#020b1f]/85 to-[#020b1f]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal>
          <div className="max-w-3xl mb-16">
            <SectionBadge code="SEC-04">Engenharia & Rigor Metodológico</SectionBadge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
              Como conduzimos um teste de intrusão de padrão internacional.
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              Processos auditáveis, seguros e orientados a resultados para que sua equipe técnica saiba exatamente como reproduzir e corrigir cada vulnerabilidade.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-5 gap-5">
          {METHODOLOGY_STEPS.map((item, idx) => (
            <Reveal key={item.step} delay={idx * 0.06}>
              <div className="h-full p-6 rounded-2xl bg-[#04132D]/90 backdrop-blur-md border border-white/10 hover:border-[#00EAFF]/60 transition-all flex flex-col justify-between relative overflow-hidden group">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-3xl font-black text-[#0088CC] group-hover:text-[#00EAFF] transition-colors">
                      {item.step}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[10px] text-slate-200">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#00EAFF]">
                  <span>FASE {item.step}/05</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 8. POR QUE CYBEROREGON + GALERIA VISUAL DE OPERAÇÕES
// ==========================================
const WhyCyberOregon = () => {
  const credentials = [
    { code: "OSCP", name: "Offensive Security Certified Professional" },
    { code: "OSWE", name: "Offensive Security Web Expert" },
    { code: "OSEP", name: "Experienced Penetration Tester" },
    { code: "CRTO", name: "Certified Red Team Operator" },
    { code: "CISSP", name: "Certified Information Systems Security Professional" },
    { code: "ISO 27001", name: "Lead Implementer & Lead Auditor" },
  ];

  const visualShowcase = [
    {
      src: "/images/templates/cyber-oregon/cybersecurity-scaled.jpg",
      tag: "AI & THREAT TELEMETRY",
      title: "Inspeção Profunda de Código e APIs",
    },
    {
      src: "/images/templates/cyber-oregon/preocupe-se-com-a-ciberseguranca-de-sua-empresa.png",
      tag: "ZERO-TRUST ARCHITECTURE",
      title: "Proteção de Dados Críticos & Governança",
    },
    {
      src: "/images/templates/cyber-oregon/dpp-ciberseguranca-varejo.jpg",
      tag: "MULTI-LAYER DEFENSE",
      title: "Blindagem de Perímetro, Cloud e Endpoints",
    },
  ];

  return (
    <section id="diferenciais" className="py-24 lg:py-32 relative bg-[#020b1f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6">
            <SectionBadge code="SEC-05">Autoridade Técnica</SectionBadge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-6">
              Por que líderes de tecnologia confiam na{" "}
              <span className="text-[#00EAFF]">CyberOregon</span>?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
              Não entregamos PDFs genéricos gerados por ferramentas automáticas. Nossos projetos são liderados por pesquisadores de segurança que atuam na linha de frente contra ameaças reais no Brasil e no exterior.
            </p>

            <div className="space-y-4">
              {[
                {
                  title: "Comunicação Direta com os Pentesters",
                  desc: "Canal exclusivo no Slack, Teams ou WhatsApp direto com os especialistas que estão testando seu ambiente — sem intermediários comerciais.",
                },
                {
                  title: "Relatórios Duplos: C-Level & Engenharia",
                  desc: "Visão executiva de risco financeiro e regulatório para a diretoria, acompanhada de PoCs detalhadas em código para os desenvolvedores.",
                },
                {
                  title: "Selo de Ambiente Auditado CyberOregon",
                  desc: "Acelere o fechamento de contratos B2B comprovando para seus clientes e parceiros que sua plataforma passou por auditoria ofensiva rigorosa.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-4 rounded-2xl bg-[#04122C] border border-white/10 flex items-start gap-3.5"
                >
                  <div className="p-2 rounded-lg bg-[#00D4FF]/20 text-[#00EAFF] shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Certifications & Visual Seal with Dark Logo */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#071F46] via-[#04122C] to-[#020b1f] border border-[#00D4FF]/50 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
                <div className="inline-flex items-center rounded-xl bg-[#020b1f] px-4 py-2 w-fit border border-[#00D4FF]/40 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
                  <Image
                    src={LOGO_DARK_SRC}
                    alt="CyberOregon"
                    width={210}
                    height={40}
                    className="h-8 w-auto object-contain"
                  />
                </div>
                <span className="font-mono text-xs text-[#00EAFF] font-bold uppercase tracking-widest">
                  ✓ CERTIFICAÇÃO DE SEGURANÇA
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Corpo Técnico Altamente Certificado
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-6">
                Nossos operadores detêm as certificações práticas mais exigentes do mercado mundial de segurança ofensiva e governança:
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {credentials.map((cred) => (
                  <div
                    key={cred.code}
                    className="p-3.5 rounded-xl bg-[#020b1f]/90 border border-white/10 flex items-center gap-3"
                  >
                    <span className="px-2.5 py-1 rounded-lg bg-[#00D4FF]/20 border border-[#00EAFF]/40 font-mono text-xs font-black text-[#00EAFF]">
                      {cred.code}
                    </span>
                    <span className="text-xs text-slate-200 font-medium leading-tight">
                      {cred.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Visual Showcase Cards using the attached Cyber Images */}
        <div className="grid md:grid-cols-3 gap-6">
          {visualShowcase.map((card) => (
            <div
              key={card.title}
              className="group relative h-64 rounded-2xl overflow-hidden border border-[#00D4FF]/30 shadow-xl"
            >
              <Image
                src={card.src}
                alt={card.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020b1f] via-[#020b1f]/55 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#00EAFF] font-bold block mb-1">
                  {card.tag}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {card.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 9. PERGUNTAS FREQUENTES (FAQ)
// ==========================================
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-[#020b1f] border-t border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-14">
            <SectionBadge code="SEC-06">Dúvidas Técnicas & Comerciais</SectionBadge>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Perguntas Frequentes sobre Pentest e Segurança
            </h2>
          </div>
        </Reveal>

        <div className="space-y-3.5">
          {FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.q}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? "bg-[#04122C] border-[#00EAFF]/60"
                    : "bg-[#030F24] border-white/10 hover:border-white/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="text-sm sm:text-base font-bold text-white">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#00EAFF] shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-sm text-slate-300 leading-relaxed border-t border-white/5">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 10. SEÇÃO DE CONTATO & AGENDAMENTO COM BACKGROUND DE IMAGEM
// ==========================================
const ContactSection = () => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("Pentest (Web / API / Mobile / Cloud)");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return;

    const text = `Olá! Me chamo *${name.trim()}*${
      company.trim() ? ` da empresa *${company.trim()}*` : ""
    }.\nE-mail corporativo: ${
      email.trim() || "Não informado"
    }\nInteresse principal: *${service}*\n\nGostaria de agendar uma conversa com um especialista da CyberOregon.`;

    trackMetaEvent("Lead", {
      content_name: "Formulário de Diagnóstico CyberOregon",
      content_category: service,
    });

    setSubmitted(true);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section id="contato" className="py-24 lg:py-32 relative overflow-hidden bg-[#020b1f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl bg-[#04122C] border border-[#00D4FF]/50 p-6 sm:p-10 lg:p-14 shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden">
          {/* Background Image inside CTA Container */}
          <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
            <Image
              src="/images/templates/cyber-oregon/preocupe-se-com-a-ciberseguranca-de-sua-empresa.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center opacity-25 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#020b1f] via-[#020b1f]/90 to-[#04122C]/85" />
          </div>

          <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Callout */}
            <div className="lg:col-span-6 space-y-6">
              <SectionBadge code="SEC-07">Canal Direto com Especialistas</SectionBadge>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Proteja a reputação e a continuidade do seu negócio hoje.
              </h2>
              <p className="text-slate-200 text-base leading-relaxed">
                Agende uma reunião técnica de alinhamento sob NDA. Nossos engenheiros avaliam sua arquitetura e entregam um plano de ação sob medida em até 24h.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-[#00D4FF]/20 border border-[#00EAFF]/40 flex items-center justify-center text-[#00EAFF]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <span>Assinatura de NDA (Acordo de Confidencialidade) antes do briefing</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-[#00D4FF]/20 border border-[#00EAFF]/40 flex items-center justify-center text-[#00EAFF]">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span>Atendimento ágil diretamente com líder de Segurança Ofensiva</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-[#00D4FF]/20 border border-[#00EAFF]/40 flex items-center justify-center text-[#00EAFF]">
                    <Award className="w-4 h-4" />
                  </div>
                  <span>Relatórios válidos para auditorias ISO 27001, SOC 2, LGPD e BACEN</span>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl bg-[#020b1f]/95 border border-[#00D4FF]/30 p-6 sm:p-8 backdrop-blur-xl">
                {submitted ? (
                  <div className="text-center py-8 space-y-4">
                    <Confetti />
                    <div className="w-14 h-14 rounded-2xl bg-[#00EAFF]/20 border border-[#00EAFF] text-[#00EAFF] flex items-center justify-center mx-auto">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-black text-white">
                      Solicitação Criptografada Enviada!
                    </h3>
                    <p className="text-sm text-slate-300 max-w-md mx-auto">
                      Abrimos o canal direto com a equipe da CyberOregon no seu WhatsApp. Caso deseje enviar outra solicitação, clique abaixo.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-2.5 rounded-xl bg-white/10 text-xs font-mono uppercase tracking-wider text-white hover:bg-white/15"
                    >
                      Enviar novo escopo
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <span className="font-mono text-xs uppercase tracking-widest text-[#00EAFF] font-bold">
                        SOLICITAR PROPOSTA / BRIEFING TÉCNICO
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        TLS 1.3 SECURE
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="co-name"
                          className="block font-mono text-[11px] uppercase tracking-wider text-slate-300 mb-1.5"
                        >
                          Seu Nome *
                        </label>
                        <input
                          id="co-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ex: Rodrigo Almeida"
                          className="w-full px-4 py-3 rounded-xl bg-[#04122C] border border-white/15 text-white text-sm placeholder:text-slate-500 focus:border-[#00EAFF] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="co-company"
                          className="block font-mono text-[11px] uppercase tracking-wider text-slate-300 mb-1.5"
                        >
                          Empresa / Organização
                        </label>
                        <input
                          id="co-company"
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Ex: FinTech Brasil S.A."
                          className="w-full px-4 py-3 rounded-xl bg-[#04122C] border border-white/15 text-white text-sm placeholder:text-slate-500 focus:border-[#00EAFF] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="co-email"
                        className="block font-mono text-[11px] uppercase tracking-wider text-slate-300 mb-1.5"
                      >
                        E-mail Corporativo
                      </label>
                      <input
                        id="co-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rodrigo@suaempresa.com.br"
                        className="w-full px-4 py-3 rounded-xl bg-[#04122C] border border-white/15 text-white text-sm placeholder:text-slate-500 focus:border-[#00EAFF] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="co-service"
                        className="block font-mono text-[11px] uppercase tracking-wider text-slate-300 mb-1.5"
                      >
                        Solução Desejada
                      </label>
                      <select
                        id="co-service"
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#04122C] border border-white/15 text-white text-sm focus:border-[#00EAFF] focus:outline-none"
                      >
                        <option value="Pentest (Web / API / Mobile / Cloud)">
                          Pentest (Web / API / Mobile / Cloud)
                        </option>
                        <option value="Red Team & Simulação de Adversários">
                          Red Team & Simulação de Adversários
                        </option>
                        <option value="Resposta a Incidentes & Monitoramento SOC">
                          Resposta a Incidentes & Monitoramento SOC
                        </option>
                        <option value="Simulação de Phishing & Treinamento">
                          Simulação de Phishing & Treinamento
                        </option>
                        <option value="Consultoria GRC / ISO 27001 / LGPD">
                          Consultoria GRC / ISO 27001 / LGPD
                        </option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#0088CC] via-[#00C4F0] to-[#00EAFF] text-[#020b1f] font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(0,234,255,0.4)] hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Iniciar Briefing Seguro via WhatsApp</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 11. RODAPÉ CORPORATIVO CYBEROREGON (SEM NEW DATE() BLOCKING WARNING)
// ==========================================
const Footer = () => {
  return (
    <footer className="bg-[#010714] border-t border-[#00D4FF]/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-white/10">
          <div className="space-y-3">
            <div className="inline-flex items-center rounded-xl bg-[#020b1f] px-3 py-1.5 border border-[#00D4FF]/30">
              <Image
                src={LOGO_DARK_SRC}
                alt="CyberOregon Cybersecurity"
                width={200}
                height={38}
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              Segurança Ofensiva, Testes de Intrusão (Pentest), Red Team, Threat Intelligence e Governança Cibernética para empresas de alta criticidade.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-xs font-mono uppercase tracking-wider text-slate-300">
            <a href="#solucoes" className="hover:text-[#00EAFF] transition-colors">
              Soluções
            </a>
            <a href="#simulador" className="hover:text-[#00EAFF] transition-colors">
              Simulador de Escopo
            </a>
            <a href="#metodologia" className="hover:text-[#00EAFF] transition-colors">
              Metodologia
            </a>
            <a href="#faq" className="hover:text-[#00EAFF] transition-colors">
              FAQ
            </a>
            <Link href="/templates" className="text-[#00EAFF] hover:underline">
              ← Catálogo NexuSync
            </Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <p>
            © {CURRENT_YEAR} CYBEROREGON CYBERSECURITY. TODOS OS DIREITOS RESERVADOS.
          </p>
          <p className="text-slate-500">
            OWASP • PTES • MITRE ATT&CK • ISO/IEC 27001
          </p>
        </div>
      </div>
    </footer>
  );
};

// ==========================================
// EXPORT PRINCIPAL DA PÁGINA
// ==========================================
export default function CyberOregonLandingPage() {
  return (
    <div className="demo-dark min-h-screen bg-[#020b1f] text-slate-100 selection:bg-[#00EAFF] selection:text-[#020b1f] font-sans antialiased overflow-x-hidden">
      <CyberScrollProgress />
      <Navbar />
      <main id="conteudo">
        <Hero />
        <FrameworksMarquee />
        <SolutionsSection />
        <AttackSurfacesGrid />
        <PentestScopeCalculator />
        <MethodologySection />
        <WhyCyberOregon />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <StickyMobileCta
        label="Solicitar Pentest / Especialista"
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${DEFAULT_WA_MSG}`}
        hideWhenVisibleId="contato"
        className="bg-gradient-to-r from-[#0088CC] to-[#00EAFF] text-[#020b1f] shadow-[0_0_30px_rgba(0,234,255,0.45)]"
        onClick={() =>
          trackMetaEvent("Lead", {
            content_name: "Sticky Mobile CTA CyberOregon",
            content_category: "CyberOregon Sticky Bar",
          })
        }
      />
    </div>
  );
}
