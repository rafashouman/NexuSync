import s from "@/components/home/SitesExperience.module.css";
import c from "@/components/home/PrivacyExperience.module.css";
import Link from "next/link";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Aviso de Privacidade | NexuSync",
  description:
    "Saiba quais dados a NexuSync coleta neste site, como são usados, por quanto tempo ficam armazenados e como exercer seus direitos.",
  path: "/privacidade",
});

export default function PrivacyPage() {
  return (
    <div className={`${s.page} ${c.privacy}`}><section className={s.section}>
      <div className={c.layout}>
        <p className={s.kicker}>
          NexuSync · Privacidade
        </p>
        <h1>Transparência faz<br /><em>parte da conexão.</em></h1><p className={c.subtitle}>Aviso de privacidade</p>
        <p className={c.intro}>
          Este aviso explica quais dados são registrados neste site, para que
          são usados e como você pode exercer seus direitos. Última atualização:
          28 de outubro de 2026.
        </p>

        <div className={c.sections}>
          <section>
            <h2>Solicitações de contato</h2>
            <p>
              Se você enviar o briefing, armazenamos seu nome, empresa, mensagem,
              tipo de projeto, plano de referência, página de origem e registro
              do seu consentimento. Usamos essas informações apenas para
              responder ao pedido e preparar um orçamento. O WhatsApp é aberto
              separadamente; não recebemos confirmação de envio da mensagem por
              esse serviço.
            </p>
            <p className="mt-2">
              Os registros são excluídos automaticamente após 180 dias.
            </p>
          </section>

          <section>
            <h2>Leituras e mini-game de tarot</h2>
            <p>
              Se você optar por desbloquear a leitura no hotsite de tarot,
              armazenamos seu nome, WhatsApp, monte escolhido, pergunta,
              cartas sorteadas e registro do consentimento para liberar o
              conteúdo e permitir contato relacionado à leitura. Os registros
              são excluídos automaticamente após 180 dias.
            </p>
            <p className="mt-2">
              O mini-game registra de forma anônima o estágio alcançado, a
              pontuação final, os créditos e o resultado da partida. Não são
              enviados nome, WhatsApp ou pergunta do hotsite nesse registro.
            </p>
          </section>

          <section>
            <h2>Seguro de vida para pilotos</h2>
            <p>
              Se você solicitar uma cotação no hotsite Costi, armazenamos seu
              nome, WhatsApp, modalidade de voo, capital segurado solicitado e
              consentimento para contato no banco de dados MongoDB do site.
              A equipe Costi acessa esses dados em um painel protegido por
              senha; o navegador público não pode ler os registros. Os
              documentos são excluídos automaticamente após 180 dias. Não
              enviamos os dados da cotação por e-mail.
            </p>
          </section>

          <section>
            <h2>Pontuações dos jogos</h2>
            <p>
              Se você escolher um apelido e registrar sua pontuação no Memory
              Matrix ou no Voxel Vaders, armazenamos um identificador anônimo
              gerado no seu navegador, o apelido, o jogo, dados da partida, a
              pontuação e a data. Usamos esses dados para registrar resultados
              dos jogos. Você pode solicitar acesso ou exclusão pelo contato
              indicado abaixo.
            </p>
          </section>

          <section>
            <h2>Estatísticas</h2>
            <p>
              Com sua permissão, usamos o Google Analytics para registrar
              visualizações de páginas e interações de forma estatística. O
              Google pode processar dados de navegação conforme a própria
              política de privacidade. Você pode recusar o uso desses cookies
              no aviso exibido no site.
            </p>
          </section>

          <section>
            <h2>Armazenamento e compartilhamento</h2>
            <p>
              Briefings, leads de tarot, leads Costi, reservas de demonstração
              e registros dos jogos são armazenados em um banco MongoDB
              privado, inacessível ao público. Os leads são removidos
              automaticamente após 180 dias. Não vendemos os dados nem os
              usamos para publicidade comportamental.
            </p>
          </section>

          <section>
            <h2>Seus direitos e contato</h2>
            <p>
              Você pode solicitar acesso, correção ou exclusão das informações
              enviando um e-mail para{" "}
              <a
                href="mailto:contato@nexusync.online"
                className={c.email}
              >
                contato@nexusync.online
              </a>
              . Para exclusão de dados, utilize o mesmo contato.
            </p>
          </section>
        </div>

        <Link
          href="/"
          className={s.textLink}
        >
          Voltar ao início
        </Link>
      </div>
    </section></div>
  );
}
