// Moves the moov atom of an MP4 to the front so the browser can start playing before the whole file is downloaded.
// No re-encoding: only box order and chunk offsets change. Usage: node scripts/mp4-faststart.mjs <in.mp4> [out.mp4]
import { readFileSync, writeFileSync } from "node:fs";

const [input, output = input] = process.argv.slice(2);
if (!input) {
  console.error("Usage: node scripts/mp4-faststart.mjs <in.mp4> [out.mp4]");
  process.exit(1);
}

const file = readFileSync(input);

function readBoxes(buffer, start, end) {
  const boxes = [];
  let pos = start;
  while (pos + 8 <= end) {
    let size = buffer.readUInt32BE(pos);
    const type = buffer.toString("latin1", pos + 4, pos + 8);
    let header = 8;
    if (size === 1) {
      size = Number(buffer.readBigUInt64BE(pos + 8));
      header = 16;
    } else if (size === 0) {
      size = end - pos;
    }
    if (size < header || pos + size > end) throw new Error(`Corrupt box "${type}" at byte ${pos}`);
    boxes.push({ type, start: pos, size, header });
    pos += size;
  }
  return boxes;
}

const top = readBoxes(file, 0, file.length);
const types = top.map((box) => box.type);
if (types.includes("moof")) throw new Error("Fragmented MP4 (moof) is not supported");
const moovIndex = types.indexOf("moov");
const mdatIndex = types.indexOf("mdat");
if (moovIndex < 0 || mdatIndex < 0) throw new Error("Missing moov or mdat box");
if (moovIndex < mdatIndex) {
  console.log("Already faststart (moov before mdat). Nothing to do.");
  process.exit(0);
}

const moovBox = top[moovIndex];
const moov = Buffer.from(file.subarray(moovBox.start, moovBox.start + moovBox.size));
const shift = moov.length;
const containers = new Set(["moov", "trak", "mdia", "minf", "stbl"]);
let patched = 0;

function patch(buffer, start, end) {
  for (const box of readBoxes(buffer, start, end)) {
    const body = box.start + box.header;
    if (containers.has(box.type)) {
      patch(buffer, body, box.start + box.size);
    } else if (box.type === "stco" || box.type === "co64") {
      const count = buffer.readUInt32BE(body + 4);
      const wide = box.type === "co64";
      for (let i = 0; i < count; i++) {
        const at = body + 8 + i * (wide ? 8 : 4);
        if (wide) {
          buffer.writeBigUInt64BE(buffer.readBigUInt64BE(at) + BigInt(shift), at);
        } else {
          const value = buffer.readUInt32BE(at) + shift;
          if (value > 0xffffffff) throw new Error("Chunk offset exceeds 32 bits; the file needs co64");
          buffer.writeUInt32BE(value, at);
        }
        patched++;
      }
    }
  }
}
patch(moov, 8, moov.length);

const ftypEnd = top[0].type === "ftyp" ? top[0].start + top[0].size : 0;
const rest = top.filter((_, index) => index !== moovIndex && !(index === 0 && ftypEnd > 0));
const out = Buffer.concat([
  file.subarray(0, ftypEnd),
  moov,
  ...rest.map((box) => file.subarray(box.start, box.start + box.size)),
]);
if (out.length !== file.length) throw new Error("Size changed unexpectedly; aborting without writing");
writeFileSync(output, out);
console.log(`Done: moov (${shift} bytes) moved before mdat, ${patched} chunk offsets patched -> ${output}`);
