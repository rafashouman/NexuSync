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

## Montar a cidade com os seus modelos (kit + mapa)

A ideia: **um arquivo com cada peça uma vez** (o kit) e **uma lista de onde cada cópia vai** (o mapa). O site baixa a peça uma vez e repete pelas posições da lista. Cem árvores custam o download de uma árvore e um único desenho na placa de vídeo.

| Arquivo | O que é |
| --- | --- |
| `tools/rua-blender/rua-mapa.blend` | Onde você monta tudo. Tem três coleções: `ref`, `kit` e `mapa`. |
| `tools/rua-blender/exportar_rua.py` | O botão de exportar (também vem dentro do `.blend`, aba Scripting). |
| `tools/rua-blender/criar_mapa.py` | Recria o `.blend` do zero com a rua nas posições exatas. **Sobrescreve** o arquivo. |
| `public/rua/models/rua-kit.glb` | O kit exportado (gerado). |
| `public/rua/city.json` | O mapa exportado (gerado), mais as chaves do que continua sendo desenhado por código. |
| `src/components/rua/world/kit.ts` | O código que lê os dois e cria um `InstancedMesh` por peça. |

### No Blender

1. Abra `tools/rua-blender/rua-mapa.blend`.
2. **`ref`** (travada, não exporta): avenida, calçadas, transversais, a grade de lotes (8 × 8), a faixa da fileira da frente, `ref_SEU_PREDIO` (âmbar) e `ref_CONCORRENTE` (azul). Esses dois continuam sendo do código, porque acendem com a história. Não construa em cima deles.
3. **`kit`**: uma peça de cada. Regras:
   - Um objeto por peça (se a peça tem várias partes, junte com Ctrl+J).
   - **Origem na base** do objeto, no centro de baixo (é o ponto que encosta no chão).
   - O nome do objeto é o nome da peça (`predio_a`, `arvore`, `banco`…).
   - Todas usando o mesmo material e a mesma textura.
   - Onde a peça fica dentro do kit não importa: ela está longe da cidade só para não atrapalhar.
4. **`mapa`**: selecione uma peça do kit, **Alt+D** (cópia ligada) e leve para o lugar. Pode girar no eixo Z e escalar. Não use Shift+D: a cópia solta não é reconhecida como peça.
5. Cor por cópia (opcional): selecione a cópia, Object Properties › Custom Properties › adicione `tint` como texto, por exemplo `#9fb3ff`. A cor multiplica a textura.
6. Aba **Scripting** › texto `exportar_rua.py` › **Run Script** (Alt+P). O console mostra quantas cópias de cada peça saíram e o peso do kit.

O script já comprime o kit com o gltf-transform (meshopt + WebP). Ele desliga as opções que juntariam as peças num bloco só (`--join false --flatten false --instance false`); sem isso, o código não acharia cada peça pelo nome. Se a compressão falhar, o console mostra o comando para rodar no terminal.

### No `city.json`

```json
{
 "kit": "/rua/models/rua-kit.glb",
 "procedural": {"front": true, "back": true, "parks": true, "lamps": true},
 "items": [
  {"asset": "arvore", "p": [-16, 0, 32], "s": 0.8},
  {"asset": "predio_a", "p": [32, 0, -24], "r": [0, 1.571, 0], "tint": "#9fb3ff"}
 ]
}
```

- `procedural` desliga partes da cidade feita por código quando o seu kit as substitui. O export mantém o que você escreveu aqui.
  - `front`: a fileira da frente (o seu prédio e o do concorrente ficam sempre).
  - `back`: os prédios do fundo.
  - `parks`: os parques, as praças e as árvores.
  - `lamps`: os postes.
  - A avenida, as transversais, as faixas e os nomes no chão ficam sempre.
- `p` = posição, `r` = rotação em radianos, `s` = escala. Os eixos são os do three.js (Y para cima); o script já converte do Blender.
- Com `"items": []` nada é baixado e a cidade é 100% código (o estado atual).

### Peso e luz

- O kit carrega depois que a cena já está na tela e só se houver itens: não pesa no carregamento da página. Mesmo assim, mire em **até 1–1,5 MB** de kit; para a cidade toda, as cópias não somam nada.
- Se o kit crescer, divida em `kit-perto` e `kit-fundo` (dois `city.json` ou um campo novo). Peça ajuda para ligar isso no `kit.ts`.
- Materiais do kit viram `MeshLambertMaterial` (o mesmo tipo de luz da cena). Se a peça tem **emissive** (janelas acesas na textura), ela acende e apaga junto com a cidade conforme a rolagem.
- Para recriar a referência depois de mudar `CROSS` ou o tamanho da rua:
  `& "C:\Program Files\Blender Foundation\Blender 5.0\blender.exe" --background --factory-startup --python tools/rua-blender/criar_mapa.py`
  (faça uma cópia do seu `rua-mapa.blend` antes, porque ele é sobrescrito).

## Criar objetos 3D por código

Para coisas simples, as formas do próprio three.js bastam, como já fazemos com as árvores (`ConeGeometry`) e os postes (`CylinderGeometry`). Se o objeto se repete, use **`InstancedMesh`** e siga o bloco das árvores em `scene.ts` como modelo.

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
