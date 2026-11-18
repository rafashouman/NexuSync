import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Flame, MessageCircle } from "lucide-react";
import styles from "./mini-cardapio.module.css";

export const metadata: Metadata = {
  title: "Cardápio | Restaurante Shalon",
  description:
    "Confira os assados e marmitex do Restaurante Shalon e faça seu pedido pelo WhatsApp.",
  alternates: { canonical: "/templates/mini-cardapio" },
};

const whatsappNumber = "554888064774";

const sections = [
  {
    id: "assados",
    number: "01",
    title: "Assados no espeto",
    days: "Sábados, domingos e feriados",
    image: "/images/mini-cardapio/assados.webp",
    imageAlt: "Frango assado e carnes na brasa",
    products: [
      { name: "Espeto de Frango", price: "R$ 35,00", image: "/images/mini-cardapio/espeto-frango.webp" },
      { name: "Espeto de Galeto", price: "R$ 55,00", image: "/images/mini-cardapio/espeto-galeto.webp" },
      { name: "Espeto de Costela", price: "R$ 65,00", image: "/images/mini-cardapio/espeto-costela.webp" },
      { name: "Espeto de Vazio", price: "R$ 65,00", image: "/images/mini-cardapio/espeto-vazio.webp" },
      { name: "Espeto de Salsichão", price: "R$ 65,00", image: "/images/mini-cardapio/espeto-salsichao.webp" },
      { name: "Espeto de Xixo", price: "R$ 65,00", image: "/images/mini-cardapio/espeto-xixo.webp" },
    ],
  },
  {
    id: "marmitex",
    number: "02",
    title: "Marmitex",
    days: "De segunda a sábado",
    image: "/images/mini-cardapio/marmitex.webp",
    imageAlt: "Marmitex com carne, arroz, feijão e acompanhamentos",
    products: [
      { name: "Marmitex uma carne", price: "R$ 15,00", image: "/images/mini-cardapio/marmitex-uma-carne.webp" },
      { name: "Marmitex duas carnes", price: "R$ 20,00", image: "/images/mini-cardapio/marmitex-duas-carnes.webp" },
    ],
  },
] as const;

function whatsappLink(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function ShalonMark() {
  return (
    <div className={styles.mark} aria-label="Restaurante Shalon, frango assado e churrasco">
      <span className={styles.markTop}>Restaurante</span>
      <span className={styles.markName}>Shalon</span>
      <span className={styles.markRule} aria-hidden="true">
        <span />
        <Flame size={19} strokeWidth={2} />
        <span />
      </span>
      <span className={styles.markBottom}>Frango assado & churrasco</span>
    </div>
  );
}

export default function MiniCardapioPage() {
  return (
    <main id="conteudo" className={styles.page}>
      <header className={styles.header}>
        <a href="#inicio" className={styles.brand} aria-label="Restaurante Shalon, início">
          <Flame size={21} aria-hidden="true" />
          <span>Shalon</span>
        </a>
        <a
          href={whatsappLink("Olá! Gostaria de fazer um pedido.")}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.headerContact}
        >
          <MessageCircle size={17} aria-hidden="true" />
          Fale conosco
        </a>
      </header>

      <section id="inicio" className={styles.hero}>
        <div className={styles.heroInner}>
          <ShalonMark />
          <div className={styles.heroCopy}>
            <h1>Um bom assado.<br /><em>Um bom almoço.</em></h1>
            <p className={styles.eyebrow}>Feito no capricho, pra você</p>
            <a href="#cardapio" className={styles.heroLink}>
              Ver nosso cardápio <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className={styles.heroBottom} aria-hidden="true">
          <span>Frango assado</span><span>✦</span><span>Churrasco</span><span>✦</span><span>Marmitex</span>
        </div>
      </section>

      <section id="cardapio" className={styles.menu}>
        <div className={styles.menuHeader}>
          <div>
            <p className={styles.eyebrow}>Da nossa cozinha para sua mesa</p>
            <h2>Nosso cardápio</h2>
          </div>
          <p>Escolha o que deu vontade e peça pelo WhatsApp.</p>
        </div>

        <div className={styles.menuGrid}>
          {sections.map((section) => (
            <section key={section.id} className={styles.menuSection} aria-labelledby={`${section.id}-title`}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionNumber}>{section.number} /</span>
                <div>
                  <h3 id={`${section.id}-title`}>{section.title}</h3>
                  <p>{section.days}</p>
                </div>
              </div>
              <figure className={styles.foodPhoto}>
                <Image
                  src={section.image}
                  alt={section.imageAlt}
                  fill
                  sizes="(max-width: 680px) calc(100vw - 40px), (max-width: 1120px) 50vw, 510px"
                />
                <figcaption>Imagem ilustrativa</figcaption>
              </figure>
              <ul className={styles.products}>
                {section.products.map((product) => (
                  <li key={product.name} className={styles.product}>
                    <div className={styles.productPhoto}>
                      <Image src={product.image} alt="" fill sizes="112px" />
                    </div>
                    <div className={styles.productDetails}>
                      <div className={styles.productName}>
                        <span>{product.name}</span>
                        <span className={styles.dots} aria-hidden="true" />
                        <strong>{product.price}</strong>
                      </div>
                      <a
                        href={whatsappLink(`Olá! Gostaria de pedir ${product.name}${section.id === "assados" ? ` - ${product.price}` : ""}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Pedir ${product.name} pelo WhatsApp`}
                      >
                        Pedir <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section className={styles.contact}>
        <div>
          <p className={styles.eyebrow}>Deu vontade?</p>
          <h2>Chama a gente!</h2>
          <p>Entre em contato para fazer seu pedido.</p>
        </div>
        <a
          href={whatsappLink("Olá! Gostaria de fazer um pedido.")}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.whatsapp}
        >
          <MessageCircle size={22} aria-hidden="true" />
          <span><small>Peça pelo WhatsApp</small>+55 48 8806-4774</span>
          <ArrowUpRight size={20} aria-hidden="true" />
        </a>
      </section>

      <footer className={styles.footer}>
        <span>Restaurante Shalon</span>
        <span>Frango assado & churrasco</span>
      </footer>
    </main>
  );
}