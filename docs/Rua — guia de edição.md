# Rua — guia de edição

Como mexer sozinho na cidade 3D da home (Rua Acesa): cores, prédios, câmera, objetos 3D e texturas.

## Onde fica cada coisa

| Arquivo | O que faz |
| --- | --- |
| `src/components/rua/world/scene.ts` | A cena inteira: chão, ruas, prédios, parques, postes, pinos, placas e o loop de animação. É aqui que você vai mexer quase sempre. |
| `src/components/rua/world/cameraKeys.ts` | Um enquadramento de câmera (e um "estado da história") para cada seção da página. |
| `src/components/rua/RuaWorld.tsx` | Monta o canvas, carrega o three.js só depois da página pronta e cria as etiquetas HTML que flutuam sobre a cena ("Concorrente com um site bom", "Aberto · seu negócio"). |
| `src/components/rua/rua.module.css` | Véus escuros (`.veilS`, `.veilF`) que deixam o texto legível sobre a cena, e o estilo das etiquetas (`.tag`). |
| `src/components/rua/events.ts` | Eventos que o HTML manda para a cena (busca no simulador, card de tentativa aceso). |

Para ver as mudanças: `npm run dev` na pasta do projeto e abra `http://localhost:3000`. O Next recarrega sozinho quando você salva `scene.ts`.

## Regras de cor (não quebrar)

- **Âmbar** (`#FFB547`) = negócio visível/aceso. Só vitrines, letreiros e o prédio do visitante quando acende. Nunca em poste, árvore ou prédio comum.
- **Azul-sinal** (`#5B97FF`) = ser encontrado. Só pinos, feixes e o scan do prédio do visitante.
- **Sem lima e sem roxo**, em nada.
- As cores da cena são escritas como valores **lineares** com `raw(0x......)`. Por isso parecem mais claras na tela do que o hex sugere. Ajuste olhando o resultado, não o número.

## Mudar cores, ruas e nomes

No topo de `scene.ts`, logo depois de `ATTEMPT_LABELS`:

- `BLOCK_TONES`: pares fachada + telhado. Os telhados são o que dá cara de mapa vista de cima. Adicione ou troque pares à vontade.
- `WINDOW_TINTS`: cor da luz das janelas (branco frio, ciano, branco quente).
- `PARK`, `TREE`, `PLAZA`: chão dos parques, copas das árvores e praças.
- `CROSS`: posição (eixo z) das ruas transversais. Mantenha longe de `z = 4` (prédio do visitante) e `z = -6` (concorrente).
- `STREET_NAMES`: nomes pintados no chão. `along: true` escreve ao longo da avenida; `false`, ao longo da transversal.

## Prédios

- **Fileira da frente** (os que tocam a avenida): bloco `// front-row buildings`. Largura (`w`), profundidade (`d`) e altura (`h`) são sorteadas por `R()`, um gerador com semente fixa: a cidade é sempre igual. Trocar `rng(7)` por outro número gera outra cidade.
- **Prédio do visitante e do concorrente**: `YOU` e `RIV`, e a linha `kept.push(...)` logo abaixo, que define o tamanho dos dois.
- **Cidade do fundo**: bloco `// back city`. É uma grade de lotes de 8 × 8 (`CELL`). Cada lote recebe só uma coisa (prédio, parque ou praça), por isso nada encavala. As chances estão em `if (r < 0.6)` (prédio), `< 0.72` (parque) e `< 0.78` (praça); o resto fica vazio.
- Os telhados usam um material sem janelas (grupo 1 da `buildingBox`). Não coloque `emissiveMap` neles, senão voltam as "luzes no topo".

## Câmera e história

Em `cameraKeys.ts`, cada linha de `cameraKeys` corresponde a uma seção com `data-key` na home, na mesma ordem:

- `pos`: de onde a câmera olha. `tgt`: para onde ela olha.
- `shift`/`shiftY`: empurram a cena para o lado (para o texto caber à esquerda).
- `city`: quanto a cidade está acesa (0 a 1).
- `rival`, `you`, `beam`, `scan`, `grow`: estado do concorrente e do prédio do visitante.
- `veilS`/`veilF`: força dos véus escuros sobre a cena.
- `tagR`/`tagY`: mostram ou escondem as etiquetas HTML.
- `signs`: mostra as placas das tentativas.

Dica: para achar um bom `pos`, rode a página, abra o console e mexa nos números até gostar. A câmera interpola sozinha entre uma seção e a próxima.

## Criar objetos 3D

**Do jeito mais leve (recomendado para coisas simples)**: formas do próprio three.js, como já fazemos com as árvores (`ConeGeometry`) e os postes (`CylinderGeometry`). Se o objeto se repete (árvores, bancos, carros), use **`InstancedMesh`**: um único desenho na GPU para todos. Siga o bloco das árvores como modelo.

**Com modelo do Blender**:

1. Modele com poucos polígonos (um carro ou banco: até ~1.500 triângulos). Aplique escala e rotação (Ctrl+A).
2. Exporte como **glTF binário (`.glb`)**.
3. Comprima: `npx @gltf-transform/cli optimize entrada.glb saida.glb --compress meshopt --texture-compress webp`. Mire em menos de 200 KB por modelo.
4. Salve em `public/rua/models/`.
5. Carregue dentro do bloco assíncrono de `scene.ts`, depois que a cidade já existe:

```ts
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
loader.load("/rua/models/banco.glb", (gltf) => {
  if (disposed) return;
  gltf.scene.position.set(-4.6, 0, 12); // calçada esquerda
  scene.add(gltf.scene);
});
```

O `dispose` no fim do arquivo já percorre a cena e libera geometrias e materiais de tudo o que foi adicionado com `scene.add`.

## Texturas leves

- Tamanho em potência de 2: 128, 256 ou 512 px. Para a rua, 256 px quase sempre basta.
- Formato **WebP** (ou KTX2, se quiser ir além). Evite PNG grande.
- Texturas desenhadas por código (como as janelas em `winTex` e os nomes de rua) não pesam nada no download. Prefira esse caminho para padrões simples.
- Toda textura criada à mão vai para a lista `textures` (`textures.push(t)`), para ser liberada quando a página fecha.

## Orçamento de desempenho

A home não pode pesar no carregamento. Antes de considerar pronto:

- Teste no celular (ou no modo celular do navegador). A cena roda a 30 fps no celular e cai para 15 fps quando nada se mexe.
- Prefira `InstancedMesh` a muitos `Mesh` soltos. Hoje a cena inteira fica em poucas dezenas de desenhos por quadro.
- Nada de sombras em tempo real, luzes extras ou pós-processamento: custam caro e o visual atual não depende disso.
- Teste com "reduzir movimento" ligado no sistema: a cena deve continuar bonita, só sem animação.
- Rode `npm run lint` e `npm run build`.
