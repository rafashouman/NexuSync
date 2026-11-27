import { ruaFonts } from "@/components/rua/fonts";
import { RuaText } from "@/components/rua/RuaText";
import r from "@/components/rua/rua.module.css";
import { Cta } from "../parts";
import s from "../servico.module.css";
import { Calculadora } from "./Calculadora";
import c from "./calculadora.module.css";

const reading = [
  ["Custo por venda", "É o investimento dividido pelas vendas. Se você investiu R$ 100 e vendeu 2, cada venda custou R$ 50. Quanto menor, mais dinheiro sobra."],
  ["Limite", "Uma venda pode custar no máximo o que sobra dela depois dos custos. Acima disso, cada venda dá prejuízo. O alvo fica abaixo do limite, com folga."],
  ["O que baixa o custo", "Um anúncio que chama atenção, as pessoas certas vendo e uma página ou atendimento que convencem. Melhorar qualquer um dos três traz mais vendas com o mesmo dinheiro."],
] as const;

export const calculadoraFaqs = [
  ["O que é CPA?", "CPA é o custo por aquisição: quanto você gasta em anúncio, em média, para fazer uma venda. A conta é o investimento dividido pelo número de vendas. É o número que mostra se o anúncio dá lucro."],
  ["Qual é um bom custo por venda?", "Depende do preço e dos custos do seu produto. Um custo de R$ 100 por venda é ótimo para quem vende algo de R$ 2.000 e prejuízo para quem vende algo de R$ 97. Por isso a calculadora compara o custo com o limite do seu próprio produto."],
  ["De onde tiro o custo por clique e a taxa de conversão?", "Se você já anuncia, eles estão no Gerenciador de Anúncios e no seu controle de vendas. Se ainda não anuncia, use os cenários: eles mostram o que acontece se os números forem piores ou melhores do que você imagina."],
  ["Vendo pelo WhatsApp. Como calculo?", "Escolha \"Conversa no WhatsApp\". O anúncio cobra por conversa, e a venda depende do atendimento. Com a taxa de fechamento, a calculadora mostra o custo real de cada venda e quanto o atendimento pesa no resultado."],
  ["A calculadora garante esse resultado?", "Não. É uma estimativa para planejar, feita com os números que você informa. O resultado real aparece depois dos primeiros dias de anúncio e varia com o mercado, a oferta, a página e o atendimento."],
  ["Meus números ficam salvos com vocês?", "Não. O que você digita fica guardado só no seu navegador. Nada é enviado para a NexuSync."],
] as const;

const contactHref = "/contato?interest=trafego-pago&source=other#orcamento";

export default function CalculadoraPage() {
  return (
    <div className={`${r.rua} ${ruaFonts} ${s.page}`} data-rua-root="">
      <RuaText />

      <section className={`${r.sec} ${s.solid} ${c.hero}`}>
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Calculadora de anúncios · NexuSync</p>
          <h1>Quanto custa <span className={r.hi}>cada venda</span> que o anúncio traz?</h1>
          <p className={r.lead}>
            Coloque o preço do que você vende, quanto quer investir em anúncio e o que costuma acontecer depois do clique. A conta mostra quantas vendas esperar, quanto cada uma custa e se sobra dinheiro no fim.
          </p>
          <p className={c.formula} aria-label="Investimento dividido por vendas é igual ao custo por venda">
            <span>Investimento</span> ÷ <span>Vendas</span> = <span><b>Custo por venda (CPA)</b></span>
          </p>
          <Calculadora />
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.alt}`} id="como-ler">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Como ler a conta</p>
          <div className={s.split}>
            <h2 data-rua-type="">Três números <span className={r.hi} data-hi="">decidem o anúncio.</span></h2>
            <p className={r.lead}>Antes de aumentar a verba, veja quanto cada venda custa e quanto ela pode custar.</p>
          </div>
          <div className={s.cards} data-rua-stagger="">
            {reading.map(([name, text], i) => (
              <article key={name} className={s.card}>
                <span>0{i + 1}</span>
                <h3>{name}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid}`} id="antes-do-anuncio">
        <div className={`${r.wrap} ${r.pad} ${s.nots}`}>
          <div>
            <p className={r.eyebrow}>Antes de investir</p>
            <h2 data-rua-type="">Anúncio acelera <span className={r.hi} data-hi="">o que já funciona.</span></h2>
            <p className={r.lead}>Se a página não explica ou o WhatsApp demora a responder, o anúncio só deixa a venda perdida mais cara. Por isso a NexuSync começa pelo site e pela presença no Google.</p>
            <div className={r.ctas}>
              <Cta href="/criacao-de-sites">Ver criação de sites</Cta>
              <Cta href="/seo-para-negocios-locais" line>Aparecer no Google</Cta>
            </div>
          </div>
          <ul className={s.notList} data-rua-stagger="">
            <li>Custo por venda alto com muitos cliques costuma ser problema na página: promessa que não aparece, preço escondido ou falta de prova.</li>
            <li>Conversas baratas que não viram venda costumam ser problema no atendimento ou na oferta.</li>
            <li>Poucos cliques e custo por clique alto costumam ser problema no anúncio: o primeiro segundo não prende.</li>
            <li>Preço baixo com custo alto por venda pede revisão de preço, custos ou recompra antes de mais verba.</li>
          </ul>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.alt}`} id="perguntas">
        <div className={`${r.wrap} ${r.pad} ${s.faqGrid}`}>
          <div>
            <p className={r.eyebrow}>Perguntas frequentes</p>
            <h2 data-rua-type="">Antes de <span className={r.hi} data-hi="">fazer a conta.</span></h2>
            <p className={r.lead}>Se a sua dúvida não estiver aqui, pergunte pelo WhatsApp ou pelo formulário.</p>
          </div>
          <div className={r.faq}>
            {calculadoraFaqs.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.final}`}>
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Próximo passo</p>
          <h2 data-rua-type="">Quer ajuda com a página, <span className={r.hi} data-hi="">o anúncio ou a conta?</span></h2>
          <p className={`${r.lead} ${s.finalLead}`}>Conte o que você vende e para quem. Voltamos com uma proposta clara, começando pelo que mais pesa no seu custo por venda.</p>
          <div className={r.ctas}>
            <Cta href={contactHref}>Pedir uma proposta</Cta>
            <Cta href="/marketing" line>Ver os planos de marketing</Cta>
          </div>
        </div>
      </section>
    </div>
  );
}
