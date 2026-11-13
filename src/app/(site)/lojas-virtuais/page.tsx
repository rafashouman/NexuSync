import { Plans } from "@/components/Plans";
import { Contact } from "@/components/Contact";
import { FAQ } from "@/components/FAQ";
import { nexuSyncMetadata } from "@/lib/site-metadata";

export const metadata = nexuSyncMetadata({
  title: "Loja Virtual e Catálogo Digital para seu Negócio | NexuSync",
  description:
    "Venda pela internet com uma loja virtual ou catálogo digital organizado. Mostre produtos, preços e formas de pedido em um só lugar. Solicite um orçamento.",
  path: "/lojas-virtuais",
});

const shopFaqs = [
  {
    q: "Qual é a diferença entre catálogo digital e loja virtual?",
    a: "O catálogo reúne produtos e informações para o cliente consultar e fazer um pedido, por exemplo, pelo WhatsApp. A loja virtual pode incluir carrinho e pagamento online, conforme o escopo e a plataforma definidos para o projeto.",
  },
  {
    q: "Um catálogo digital já inclui estoque e pagamento online?",
    a: "Não automaticamente. Catálogos e menus digitais podem organizar produtos e direcionar pedidos pelo WhatsApp. Estoque, checkout e pagamentos online são avaliados e descritos separadamente na proposta.",
  },
  {
    q: "Quem cadastra os produtos?",
    a: "O cadastro inicial e a quantidade de produtos incluídos são definidos no orçamento. Nos projetos de loja virtual, também explicamos como administrar produtos e pedidos após a entrega.",
  },
  {
    q: "Como escolho o formato ideal para minha empresa?",
    a: "Conte como seus clientes consultam os produtos e concluem a compra. A NexuSync ajuda a definir se um catálogo, um cardápio digital ou uma loja virtual atende melhor essa rotina.",
  },
];

export default function ShopsPage() {
  return (
    <div className="pt-28">
      <section className="container-luxe pb-8">
        <h1 className="font-display text-4xl">
          Loja virtual e catálogo digital para facilitar suas vendas
        </h1>
        <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
          Apresente produtos, preços e formas de pedido em um só lugar. A
          NexuSync cria catálogos digitais e lojas virtuais de acordo com a
          operação da sua empresa.
        </p>
      </section>
      <Plans />
      <FAQ
        items={shopFaqs}
        heading="Dúvidas sobre lojas virtuais e catálogos digitais"
        description="Entenda o que muda entre os formatos e quais recursos precisam estar previstos na proposta."
      />
      <Contact />
    </div>
  );
}
