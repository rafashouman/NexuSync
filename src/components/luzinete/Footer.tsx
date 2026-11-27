import Image from "next/image";
import Link from "next/link";
import { SITE, greetingUrl, painelPath, privacyPath } from "./data";
import { Umbel } from "./Umbel";
import s from "./luzinete.module.css";

export function Footer() {
  const { contact } = SITE;
  const items = [
    ["WhatsApp", contact.whatsappLabel, contact.whatsapp ? greetingUrl : ""],
    ["E-mail", contact.email, contact.email ? `mailto:${contact.email}` : ""],
    ["Instagram", contact.instagram, contact.instagram ? `https://instagram.com/${contact.instagram.replace("@", "")}` : ""],
    ["Endereço", contact.address, ""],
  ];

  return (
    <footer className={s.footer}>
      <Umbel className={s.footerUmbel} />
      <div className={s.container}>
        <div>
          <Image src={`${SITE.images}/logo-claro.png`} alt={`Terapeuta ${SITE.name}`} width={220} height={81} />
          <p>Terapia de Reprocessamento Generativo (TRG), presencial e online.</p>
        </div>
        <dl>
          {items.map(([label, value, href]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{href ? <a href={href}>{value}</a> : value || "a confirmar"}</dd>
            </div>
          ))}
        </dl>
        <p className={s.crisis}>
          Este site tem caráter informativo e não substitui atendimento médico ou psicológico de urgência. Em crise, ligue{" "}
          <a href="tel:188">188 (CVV)</a> ou <a href="tel:192">192 (SAMU)</a>.
        </p>
        <div className={s.footerEnd}>
          <Link href={privacyPath}>Política de Privacidade</Link>
          <Link href={painelPath} prefetch={false}>
            Área da terapeuta
          </Link>
          <p>
            © {SITE.year} {SITE.name}
          </p>
          <Link href="/templates" prefetch={false}>
            Modelo criado pela NexuSync
          </Link>
        </div>
      </div>
    </footer>
  );
}
