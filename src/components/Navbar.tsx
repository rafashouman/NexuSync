"use client"; // Necessário pois usamos hooks (useState, useEffect) no Next.js App Router

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail, Menu, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { QuoteLink } from "@/components/QuoteLink";
import { waLink } from "@/lib/site-config";

const EMAIL = "contato@nexusync.online";
const WA_DISPLAY = "(51) 99358-3936";
const WA_HREF = waLink("Olá! Vim pelo site da NexuSync e gostaria de falar sobre um projeto.");

const contactItem = { label: "Contato", href: "/#orcamento" };

const links = [
  { label: "Criação de sites", href: "/criacao-de-sites" },
  { label: "Sistemas web", href: "/apps" },
  { label: "Marketing", href: "/marketing" },
  { label: "Privacidade", href: "/privacidade" },
  { label: "Planos e Pacotes", href: "/criacao-de-sites#planos" },
];

const products = [
  { label: "ArcSync", href: "/arcsync" },
  { label: "VisionSync", href: "/visionsync" },
  { label: "Arcade", href: "/arcade" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    if (!productsOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-products-menu]")) setProductsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setProductsOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [productsOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled
        ? "backdrop-blur-2xl bg-background/55 border-b border-violet-200/10 shadow-elegant"
        : "bg-transparent"
        }`}
    >
      <div className={`border-b border-violet-200/10 bg-background/70 text-xs transition-all duration-500 ${scrolled ? "hidden" : ""}`}>
        <div className="container-luxe flex h-8 items-center justify-end gap-5">
          <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-violet-200 transition-colors">
            <Mail className="h-3.5 w-3.5" aria-hidden /> {EMAIL}
          </a>
          <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-violet-200 transition-colors">
            <MessageCircle className="h-3.5 w-3.5" aria-hidden /> WhatsApp {WA_DISPLAY}
          </a>
        </div>
      </div>
      <div className="container-luxe flex h-20 items-center justify-between gap-6">
        <Link href="/" aria-label="NexuSync — início" className="logo-pulse flex items-center gap-2 group">
          <Image
            src="/images/logo-text.png"
            alt="NexuSync"
            width={300}
            height={99}
            sizes="(min-width: 640px) 220px, 180px"
            style={{ height: "auto" }}
            className="w-[180px] sm:w-[220px] transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <nav aria-label="Navegação principal" className="hidden xl:flex items-center gap-5">
          {[contactItem, ...links].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-violet-200 transition-colors duration-300"
            >
              {l.label}
            </a>
          ))}
          <div className="relative" data-products-menu>
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={productsOpen}
              onClick={() => setProductsOpen((v) => !v)}
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-violet-200 transition-colors duration-300"
            >
              Produtos
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${productsOpen ? "rotate-180" : ""}`} aria-hidden />
            </button>
            {productsOpen && (
              <ul className="absolute right-0 top-full mt-3 w-56 rounded-2xl border border-violet-200/15 bg-background/95 p-2 shadow-elegant backdrop-blur-2xl">
                {products.map((product) => (
                  <li key={product.href}>
                    <Link
                      href={product.href}
                      onClick={() => setProductsOpen(false)}
                      className="block rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-violet-200 transition-colors"
                    >
                      {product.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>

        <QuoteLink
          section="header"
          className="hidden xl:inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-white/[0.025] px-5 py-2.5 text-sm font-semibold text-violet-200 hover:bg-violet-gradient hover:text-white hover:border-transparent hover:shadow-violet-glow transition-all duration-300"
        >
          Pedir orçamento
        </QuoteLink>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          className="xl:hidden grid h-10 w-10 place-items-center rounded-full border border-border text-foreground"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="xl:hidden overflow-hidden bg-background/75 backdrop-blur-2xl border-t border-violet-200/10"
            id="mobile-navigation"
          >
            <nav aria-label="Navegação móvel" className="container-luxe flex flex-col gap-1 py-6">
              {[contactItem, ...links].map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-3 border-b border-border/50 text-foreground/90 font-medium"
                >
                  {l.label}
                </a>
              ))}
              <p className="pt-4 pb-1 text-xs font-bold uppercase tracking-widest text-violet-200">Produtos</p>
              {products.map((product) => (
                <Link
                  key={product.href}
                  href={product.href}
                  onClick={() => setOpen(false)}
                  className="py-2.5 pl-3 border-b border-border/50 text-foreground/80 text-sm"
                >
                  {product.label}
                </Link>
              ))}
              <a href={`mailto:${EMAIL}`} className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" aria-hidden /> {EMAIL}
              </a>
              <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp {WA_DISPLAY}
              </a>
              <QuoteLink
                section="header"
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex justify-center rounded-full bg-violet-gradient px-6 py-3 text-white text-sm font-bold shadow-violet-glow"
              >
                Pedir orçamento
              </QuoteLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
