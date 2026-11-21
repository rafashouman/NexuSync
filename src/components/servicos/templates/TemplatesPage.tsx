import { ruaFonts } from "@/components/rua/fonts";
import { RuaText } from "@/components/rua/RuaText";
import r from "@/components/rua/rua.module.css";
import { templateCatalog } from "@/data/templateCatalog";
import { Cta } from "../parts";
import s from "../servico.module.css";
import { TemplatesGallery } from "./TemplatesGallery";

const quote = "/contato?interest=institucional&source=sites#orcamento";

export default function TemplatesPage() {
  return (
    <div className={`${r.rua} ${ruaFonts} ${s.page}`} data-rua-root="">
      <RuaText />

      <section className={s.heroPlain}>
        <div className={`${r.wrap} ${r.pad} ${s.heroPlainGrid}`}>
          <div>
            <p className={r.eyebrow}>{templateCatalog.length} exemplos · diferentes tipos de negócio</p>
            <h1>Ideias para ver. <span className={r.hi}>Experiências para testar.</span></h1>
            <p className={r.lead}>Veja exemplos interativos de sites, lojas virtuais e soluções digitais criados pela NexuSync para diferentes tipos de negócio.</p>
            <div className={r.ctas}>
              <Cta href="#galeria">Encontrar uma referência</Cta>
              <Cta href={quote} line>Quero criar meu projeto</Cta>
            </div>
          </div>
          <div className={s.stack} aria-hidden="true">
            {["Design", "Interação", "Sua marca"].map((word, i) => (
              <div key={word} data-i={i}><small>0{i + 1} · experiência digital</small><b>{word}</b></div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${r.sec} ${s.solid}`} id="galeria">
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>Todos os exemplos em um só lugar</p>
          <div className={s.split}>
            <h2 data-rua-type="">Seu segmento. <span className={r.hi} data-hi="">Novas possibilidades.</span></h2>
            <p className={r.lead}>Busque uma referência, visualize aqui ou abra a demonstração completa. São exemplos para explorar; o escopo do seu projeto é definido na proposta.</p>
          </div>
          <TemplatesGallery />
        </div>
      </section>

      <section className={`${r.sec} ${s.solid} ${s.final}`}>
        <div className={`${r.wrap} ${r.pad}`}>
          <p className={r.eyebrow}>O exemplo é só o começo</p>
          <h2 data-rua-type="">Agora imagine <span className={r.hi} data-hi="">a sua marca aqui.</span></h2>
          <p className={`${r.lead} ${s.finalLead}`}>Conte o que chamou sua atenção e o que seu negócio precisa apresentar.</p>
          <div className={r.ctas}>
            <Cta href={quote}>Pedir minha proposta</Cta>
            <Cta href="/criacao-de-sites#planos" line>Ver os planos de sites</Cta>
          </div>
        </div>
      </section>
    </div>
  );
}
