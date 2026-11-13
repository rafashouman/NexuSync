import { MessageCircle, Sparkles } from "lucide-react";
import { waLink } from "@/lib/site-config";

type PrelaunchProductPageProps = {
  name: string;
  audience: string;
  whatsappMessage: string;
};

export function PrelaunchProductPage({
  name,
  audience,
  whatsappMessage,
}: PrelaunchProductPageProps) {
  return (
    <div className="container-luxe pb-24 pt-32 sm:pt-40">
      <section className="mx-auto max-w-4xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/[0.06] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-200">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Produto em pré-lançamento
        </div>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-6xl">
          {name}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
          {audience}
        </p>

        <div className="mt-10 rounded-3xl border border-white/[0.09] bg-white/[0.025] p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold">
            Ainda estamos definindo os próximos passos
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            O {name} está em desenvolvimento e sua proposta ainda está sendo
            validada. Recursos, forma de acesso e data de lançamento não estão
            confirmados. Por isso, o produto ainda não está disponível para
            contratação ou teste.
          </p>
        </div>

        <a
          href={waLink(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-gradient px-6 py-3.5 font-semibold text-white shadow-violet-glow transition-transform hover:scale-[1.02]"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Conversar sobre o pré-lançamento
        </a>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
          Falar com a NexuSync não garante acesso antecipado nem uma data de
          lançamento. Vamos compartilhar informações quando estiverem
          confirmadas.
        </p>
      </section>
    </div>
  );
}
