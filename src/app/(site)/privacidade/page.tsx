import Link from "next/link";

export default function PrivacyPage() {
  return (
    <section className="container-luxe min-h-[70vh] py-32 sm:py-40">
      <div className="mx-auto max-w-3xl">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-violet-200">
          NexuSync · Privacidade
        </p>
        <h1 className="mb-6 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
          Aviso de Privacidade
        </h1>
        <p className="mb-10 leading-relaxed text-muted-foreground">
          Este aviso explica quais dados são registrados neste site, para que
          são usados e como você pode exercer seus direitos. Última atualização:
          28 de outubro de 2026.
        </p>

        <div className="space-y-8 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-foreground">
              Solicitações de contato
            </h2>
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
            <h2 className="mb-2 font-display text-xl font-semibold text-foreground">
              Leituras e mini-game de tarot
            </h2>
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
            <h2 className="mb-2 font-display text-xl font-semibold text-foreground">
              Seguro de vida para pilotos
            </h2>
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
            <h2 className="mb-2 font-display text-xl font-semibold text-foreground">
              Pontuações dos jogos
            </h2>
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
            <h2 className="mb-2 font-display text-xl font-semibold text-foreground">
              Estatísticas
            </h2>
            <p>
              Não utilizamos serviços de estatísticas de terceiros para
              acompanhar a navegação neste site.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-foreground">
              Armazenamento e compartilhamento
            </h2>
            <p>
              Briefings, leads de tarot, leads Costi, reservas de demonstração
              e registros dos jogos são armazenados em um banco MongoDB
              privado, inacessível ao público. Os leads são removidos
              automaticamente após 180 dias. Não vendemos os dados nem os
              usamos para publicidade comportamental.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold text-foreground">
              Seus direitos e contato
            </h2>
            <p>
              Você pode solicitar acesso, correção ou exclusão das informações
              enviando um e-mail para{" "}
              <a
                href="mailto:contato@nexusync.online"
                className="font-semibold text-violet-200 underline-offset-4 hover:underline"
              >
                contato@nexusync.online
              </a>
              . Para exclusão de dados, utilize o mesmo contato.
            </p>
          </section>
        </div>

        <Link
          href="/"
          className="mt-10 inline-flex text-sm font-semibold text-violet-200 hover:text-white"
        >
          Voltar ao início
        </Link>
      </div>
    </section>
  );
}
