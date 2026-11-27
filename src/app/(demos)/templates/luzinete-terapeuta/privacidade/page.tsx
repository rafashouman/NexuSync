import Link from "next/link";
import { SITE, greetingUrl, privacyPath } from "@/components/luzinete/data";
import s from "@/components/luzinete/luzinete.module.css";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Política de Privacidade | Luzinete Terapeuta",
  description: "Quais dados o agendamento pede, para que servem, por quanto tempo ficam guardados e como pedir a exclusão.",
  path: privacyPath,
  noindex: true,
  image: `${SITE.images}/compartilhar.jpg`,
});

export default function LuzinetePrivacyPage() {
  return (
    <article className={`${s.container} ${s.narrow} ${s.legal}`}>
      <h1>Política de Privacidade</h1>
      <p>
        Esta página explica o que acontece com os dados informados no agendamento do site de {SITE.name}, terapeuta
        responsável pelo atendimento, conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018).
      </p>

      <h2>Quais dados pedimos</h2>
      <ul>
        <li>Modalidade, dia e horário escolhidos.</li>
        <li>Nome completo e número de WhatsApp.</li>
        <li>E-mail, se você quiser informar.</li>
        <li>Se é a sua primeira sessão.</li>
        <li>Observação, se você escrever uma. Não é preciso contar o que você viveu.</li>
      </ul>

      <h2>Para que usamos</h2>
      <p>
        Só para marcar, confirmar, remarcar ou cancelar a sua sessão e falar com você sobre ela. A base é o seu
        consentimento, marcado no formulário. Os dados não são vendidos nem usados para publicidade.
      </p>

      <h2>Quem recebe</h2>
      <ul>
        <li>A terapeuta e quem mantém o site tecnicamente.</li>
        <li>O serviço de hospedagem, onde a reserva fica guardada.</li>
        <li>O WhatsApp, quando a mensagem de agendamento é enviada.</li>
        <li>
          O serviço CallMeBot, se o aviso automático estiver ligado: ele recebe nome, WhatsApp, data, horário, modalidade e
          se é a primeira sessão. A observação não é enviada a ele.
        </li>
      </ul>

      <h2>Medição de visitas</h2>
      <p>
        Se você aceitar os cookies, o Google Analytics registra quais páginas foram visitadas. O que você digita no
        agendamento não é enviado a ele, e o Pixel da Meta não é usado nas páginas deste site.
      </p>

      <h2>Por quanto tempo</h2>
      <p>
        A reserva é apagada automaticamente {SITE.retentionDays} dias depois da data da sessão. As mensagens trocadas pelo
        WhatsApp seguem as regras do próprio aplicativo.
      </p>

      <h2>Seus direitos</h2>
      <p>
        Você pode pedir para ver, corrigir ou apagar os seus dados, e retirar o consentimento a qualquer momento. Faça o
        pedido{" "}
        {SITE.contact.whatsapp ? (
          <a href={greetingUrl}>pelo WhatsApp</a>
        ) : (
          "pelo WhatsApp da terapeuta (número a confirmar)"
        )}
        {SITE.contact.email ? (
          <>
            {" "}
            ou pelo e-mail <a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>
          </>
        ) : null}
        .
      </p>

      <p>
        <Link href={SITE.basePath} className={s.button}>
          Voltar ao site
        </Link>
      </p>
    </article>
  );
}
