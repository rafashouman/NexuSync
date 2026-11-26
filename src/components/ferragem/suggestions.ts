/**
 * Sugestões de produtos.
 *
 * Ainda não há dados de visitas nem de vendas, então as listas são escolhidas à mão e os títulos da
 * página não afirmam o que outros clientes viram ou compraram. Quando houver dados, troque o conteúdo
 * de `goesWith()` pelo resultado medido; só então use títulos como "Quem viu isto também viu".
 */
import { PRODUCTS, getProduct, type Product } from "./catalog-data";

/** O que costuma ser necessário junto, do mais para o menos importante. */
const GOES_WITH: Record<string, string[]> = {
  // ——— Ferramentas manuais
  "martelo-unha-27mm": ["trena-5m", "kit-parafusos-buchas-200", "nivel-aluminio-40cm", "caixa-ferramentas-16"],
  "jogo-chaves-combinadas-8-pecas": ["alicate-universal-8", "jogo-chaves-fenda-philips-6", "caixa-ferramentas-16", "martelo-unha-27mm"],
  "alicate-universal-8": ["jogo-chaves-fenda-philips-6", "fita-isolante-20m", "caixa-ferramentas-16", "trena-5m"],
  "trena-5m": ["nivel-aluminio-40cm", "martelo-unha-27mm", "serrote-16", "caixa-ferramentas-16"],
  "nivel-aluminio-40cm": ["trena-5m", "furadeira-impacto-650w", "kit-parafusos-buchas-200", "colher-pedreiro-8"],
  "jogo-chaves-fenda-philips-6": ["alicate-universal-8", "kit-parafusos-buchas-200", "parafusadeira-bateria-12v", "caixa-ferramentas-16"],
  "serrote-16": ["trena-5m", "martelo-unha-27mm", "lixadeira-orbital-200w", "adesivo-epoxi-23g"],

  // ——— Ferramentas elétricas
  "furadeira-impacto-650w": ["kit-parafusos-buchas-200", "extensao-5m-3-tomadas", "trena-5m", "nivel-aluminio-40cm"],
  "parafusadeira-bateria-12v": ["kit-parafusos-buchas-200", "dobradica-3-kit-3", "nivel-aluminio-40cm", "caixa-ferramentas-16"],
  "esmerilhadeira-angular-850w": ["extensao-5m-3-tomadas", "esmalte-sintetico-900ml", "spray-multiuso-400ml", "trena-5m"],
  "serra-tico-tico-500w": ["lixadeira-orbital-200w", "trena-5m", "extensao-5m-3-tomadas", "adesivo-epoxi-23g"],
  "lixadeira-orbital-200w": ["massa-corrida-25kg", "esmalte-sintetico-900ml", "kit-pinceis-3-pecas", "extensao-5m-3-tomadas"],
  "soprador-termico-2000w": ["extensao-5m-3-tomadas", "lixadeira-orbital-200w", "esmalte-sintetico-900ml", "kit-pinceis-3-pecas"],

  // ——— Material elétrico (sem cruzar disjuntor, chuveiro e bitola de cabo: isso depende do circuito)
  "cabo-flexivel-2-5mm-100m": ["tomada-2p-t-10a", "fita-isolante-20m", "alicate-universal-8", "jogo-chaves-fenda-philips-6"],
  "disjuntor-bipolar-32a": ["jogo-chaves-fenda-philips-6", "alicate-universal-8", "fita-isolante-20m", "caixa-ferramentas-16"],
  "tomada-2p-t-10a": ["jogo-chaves-fenda-philips-6", "fita-isolante-20m", "alicate-universal-8", "cabo-flexivel-2-5mm-100m"],
  "lampada-led-9w-kit-10": ["plafon-led-18w", "escada-aluminio-5-degraus", "extensao-5m-3-tomadas", "fita-isolante-20m"],
  "extensao-5m-3-tomadas": ["furadeira-impacto-650w", "lampada-led-9w-kit-10", "fita-isolante-20m", "tomada-2p-t-10a"],
  "fita-isolante-20m": ["alicate-universal-8", "tomada-2p-t-10a", "jogo-chaves-fenda-philips-6", "extensao-5m-3-tomadas"],
  "plafon-led-18w": ["escada-aluminio-5-degraus", "fita-isolante-20m", "jogo-chaves-fenda-philips-6", "furadeira-impacto-650w"],

  // ——— Hidráulica
  "torneira-cozinha-bica-alta": ["fita-veda-rosca-18mm", "silicone-acetico-280g", "jogo-chaves-combinadas-8-pecas", "registro-gaveta-3-4"],
  "chuveiro-eletrico-5500w": ["fita-veda-rosca-18mm", "fita-isolante-20m", "alicate-universal-8", "escada-aluminio-5-degraus"],
  "registro-gaveta-3-4": ["fita-veda-rosca-18mm", "tubo-pvc-soldavel-25mm-6m", "jogo-chaves-combinadas-8-pecas", "silicone-acetico-280g"],
  "tubo-pvc-soldavel-25mm-6m": ["registro-gaveta-3-4", "fita-veda-rosca-18mm", "serrote-16", "trena-5m"],
  "caixa-dagua-500l": ["tubo-pvc-soldavel-25mm-6m", "registro-gaveta-3-4", "fita-veda-rosca-18mm", "impermeabilizante-18kg"],
  "mangueira-jardim-15m": ["regador-10l", "tesoura-de-poda", "kit-jardinagem-3-pecas", "fita-veda-rosca-18mm"],
  "fita-veda-rosca-18mm": ["registro-gaveta-3-4", "torneira-cozinha-bica-alta", "silicone-acetico-280g", "jogo-chaves-combinadas-8-pecas"],

  // ——— Tintas
  "tinta-acrilica-fosca-18l": ["rolo-la-23cm", "fita-crepe-48mm", "kit-pinceis-3-pecas", "massa-corrida-25kg"],
  "esmalte-sintetico-900ml": ["kit-pinceis-3-pecas", "fita-crepe-48mm", "lixadeira-orbital-200w", "spray-multiuso-400ml"],
  "rolo-la-23cm": ["tinta-acrilica-fosca-18l", "fita-crepe-48mm", "kit-pinceis-3-pecas", "escada-aluminio-5-degraus"],
  "kit-pinceis-3-pecas": ["esmalte-sintetico-900ml", "fita-crepe-48mm", "rolo-la-23cm", "tinta-acrilica-fosca-18l"],
  "massa-corrida-25kg": ["lixadeira-orbital-200w", "tinta-acrilica-fosca-18l", "rolo-la-23cm", "colher-pedreiro-8"],
  "fita-crepe-48mm": ["rolo-la-23cm", "kit-pinceis-3-pecas", "tinta-acrilica-fosca-18l", "spray-multiuso-400ml"],
  "spray-multiuso-400ml": ["fita-crepe-48mm", "esmalte-sintetico-900ml", "kit-pinceis-3-pecas", "lixadeira-orbital-200w"],

  // ——— Construção
  "cimento-cp-ii-50kg": ["colher-pedreiro-8", "carrinho-de-mao-60l", "pa-de-bico", "impermeabilizante-18kg"],
  "argamassa-ac2-20kg": ["rejunte-flexivel-1kg", "colher-pedreiro-8", "nivel-aluminio-40cm", "trena-5m"],
  "carrinho-de-mao-60l": ["pa-de-bico", "cimento-cp-ii-50kg", "colher-pedreiro-8", "regador-10l"],
  "pa-de-bico": ["carrinho-de-mao-60l", "cimento-cp-ii-50kg", "colher-pedreiro-8", "kit-jardinagem-3-pecas"],
  "colher-pedreiro-8": ["cimento-cp-ii-50kg", "argamassa-ac2-20kg", "nivel-aluminio-40cm", "carrinho-de-mao-60l"],
  "rejunte-flexivel-1kg": ["argamassa-ac2-20kg", "colher-pedreiro-8", "silicone-acetico-280g", "nivel-aluminio-40cm"],
  "impermeabilizante-18kg": ["rolo-la-23cm", "kit-pinceis-3-pecas", "escada-aluminio-5-degraus", "silicone-acetico-280g"],

  // ——— Fixação e ferragens
  "kit-parafusos-buchas-200": ["furadeira-impacto-650w", "parafusadeira-bateria-12v", "jogo-chaves-fenda-philips-6", "nivel-aluminio-40cm"],
  "fechadura-externa-cromada": ["dobradica-3-kit-3", "jogo-chaves-fenda-philips-6", "parafusadeira-bateria-12v", "cadeado-40mm"],
  "cadeado-40mm": ["fechadura-externa-cromada", "dobradica-3-kit-3", "caixa-ferramentas-16", "adesivo-epoxi-23g"],
  "dobradica-3-kit-3": ["parafusadeira-bateria-12v", "fechadura-externa-cromada", "jogo-chaves-fenda-philips-6", "trena-5m"],
  "silicone-acetico-280g": ["fita-veda-rosca-18mm", "torneira-cozinha-bica-alta", "adesivo-epoxi-23g", "rejunte-flexivel-1kg"],
  "adesivo-epoxi-23g": ["silicone-acetico-280g", "fita-isolante-20m", "kit-parafusos-buchas-200", "alicate-universal-8"],

  // ——— Jardim e casa
  "tesoura-de-poda": ["kit-jardinagem-3-pecas", "regador-10l", "mangueira-jardim-15m", "escada-aluminio-5-degraus"],
  "regador-10l": ["kit-jardinagem-3-pecas", "tesoura-de-poda", "mangueira-jardim-15m", "carrinho-de-mao-60l"],
  "kit-jardinagem-3-pecas": ["regador-10l", "tesoura-de-poda", "mangueira-jardim-15m", "pa-de-bico"],
  "escada-aluminio-5-degraus": ["caixa-ferramentas-16", "lampada-led-9w-kit-10", "rolo-la-23cm", "extensao-5m-3-tomadas"],
  "caixa-ferramentas-16": ["martelo-unha-27mm", "jogo-chaves-fenda-philips-6", "alicate-universal-8", "trena-5m"],
};

const found = (slugs: string[]) => slugs.map(getProduct).filter((product): product is Product => Boolean(product));

/** Produtos que completam o serviço de quem está vendo `slug`. */
export function goesWith(slug: string) {
  return found(GOES_WITH[slug] ?? []).slice(0, 4);
}

/** Outros da mesma categoria, a partir do seguinte na lista, sem repetir o que já está em `skip`. */
export function similarTo(product: Product, skip: Product[] = []) {
  const category = PRODUCTS.filter((item) => item.category === product.category);
  const start = category.findIndex((item) => item.slug === product.slug);
  return [...category.slice(start + 1), ...category.slice(0, start)].filter((item) => !skip.includes(item)).slice(0, 4);
}

/** Complementos do carrinho inteiro: o que combina com mais itens (e vem antes em cada lista) aparece primeiro. */
export function forCart(slugs: string[]) {
  const score = new Map<string, number>();
  for (const slug of slugs) {
    (GOES_WITH[slug] ?? []).forEach((other, index) => {
      if (!slugs.includes(other)) score.set(other, (score.get(other) ?? 0) + 10 - index);
    });
  }
  return found([...score].sort((a, b) => b[1] - a[1]).map(([slug]) => slug)).slice(0, 4);
}
