import { DesignPageContent } from "@/components/PortfolioPages";
import { PlansDG } from "@/components/PlansDG";
import { FAQ } from "@/components/FAQ";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Identidade Visual e Design para Empresas | NexuSync",
  description:
    "Apresente sua marca com identidade visual, peças digitais e interfaces coerentes. Conheça os serviços de design da NexuSync.",
  path: "/design",
});

const designFaqs = [
  {
    q: "Qual é a diferença entre identidade visual e peças para redes sociais?",
    a: "Peças digitais aplicam uma linguagem visual a conteúdos e campanhas. Um projeto de identidade visual define elementos da marca, como logotipo, cores e tipografia, conforme o escopo contratado.",
  },
  {
    q: "Todos os pacotes incluem a criação de um logotipo?",
    a: "Não. O Design Starter parte de uma identidade existente e não inclui a criação de marca do zero. O pacote Design Profissional inclui criação de logotipo e manual de identidade visual.",
  },
  {
    q: "Quais arquivos são entregues?",
    a: "Os formatos dependem do pacote. O Starter prevê arquivos finais em PNG ou JPG; o Profissional inclui arquivos vetoriais em SVG, PDF e EPS, além de PNG. A proposta confirma os entregáveis.",
  },
  {
    q: "Quantas rodadas de ajustes estão incluídas?",
    a: "O Design Starter inclui uma rodada de ajustes. Os pacotes Design Profissional e UI/UX Premium incluem duas, conforme o escopo apresentado na proposta.",
  },
];

export default function DesignPage() {
  return (
    <>
      <DesignPageContent />
      <PlansDG />
      <FAQ
        items={designFaqs}
        heading="Dúvidas sobre identidade visual e design"
        description="Confira o que cada formato pode incluir e como os arquivos finais são definidos."
      />
    </>
  );
}
