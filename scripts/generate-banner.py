"""Gera o minibanner 1080x566 da Nexusync.

Uso (na raiz do projeto, requer Pillow):
    python scripts/generate-banner.py [raiz-do-projeto] [arquivo-de-saida]
Padrão: public/images/banner-1080x566.png
"""
import math, random, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = sys.argv[1] if len(sys.argv) > 1 else str(Path(__file__).resolve().parent.parent)
OUT = sys.argv[2] if len(sys.argv) > 2 else f"{ROOT}/public/images/banner-1080x566.png"
S = 2
W, H = 1080 * S, 566 * S
CYAN = (14, 230, 255)
LIME = (190, 245, 10)
random.seed(7)

# --- base gradient
bg = Image.new("RGB", (W, H))
px = bg.load()
for y in range(H):
    for x in range(0, W):
        t = y / H
        u = x / W
        r = int(6 + 6 * t)
        g = int(14 + 14 * (1 - abs(u - 0.5) * 2) * 0.6 + 8 * t)
        b = int(26 + 20 * (1 - t) + 10 * (1 - abs(u - 0.5) * 2))
        px[x, y] = (r, g, b)
bg = bg.convert("RGBA")

def glow(color, center, radius, alpha):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    cx, cy = center
    d.ellipse((cx - radius, cy - radius * 0.6, cx + radius, cy + radius * 0.6), fill=color + (alpha,))
    return layer.filter(ImageFilter.GaussianBlur(radius * 0.45))

for g in [
    glow(CYAN, (W * 0.18, H * 0.95), 520, 70),
    glow(LIME, (W * 0.62, H * 1.0), 480, 45),
    glow(CYAN, (W * 0.85, H * 0.05), 420, 50),
    glow((20, 90, 140), (W * 0.5, H * 0.42), 700, 60),
]:
    bg = Image.alpha_composite(bg, g)

# --- angled panels in corners
panels = Image.new("RGBA", (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(panels)
def slab(x0, y0, w, h, skew, fill):
    d.polygon([(x0 + skew, y0), (x0 + skew + w, y0), (x0 + w, y0 + h), (x0, y0 + h)], fill=fill)
slab(W - 560, H - 300, 300, 340, 180, (18, 70, 110, 120))
slab(W - 330, H - 260, 380, 300, 170, (20, 90, 120, 110))
slab(-260, -40, 420, 180, 160, (18, 70, 110, 90))
panels = panels.filter(ImageFilter.GaussianBlur(3))
bg = Image.alpha_composite(bg, panels)

# lime slab accent bottom-right
acc = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ad = ImageDraw.Draw(acc)
ad.polygon([(W - 150, H - 170), (W + 40, H - 230), (W + 40, H), (W - 250, H)], fill=LIME + (200,))
acc = acc.filter(ImageFilter.GaussianBlur(2))
fade = Image.new("L", (W, H), 0)
fd = ImageDraw.Draw(fade)
for i in range(300):
    fd.line([(W - 300 + i, 0), (W - 300 + i, H)], fill=int(255 * i / 300))
acc.putalpha(Image.composite(acc.getchannel("A"), Image.new("L", (W, H), 0), fade))
bg = Image.alpha_composite(bg, acc)

# --- neon rounded circuit lines
lines = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ld = ImageDraw.Draw(lines)
ld.line([(0, H - 210), (300, H - 240), (390, H - 150), (330, H + 20)], fill=LIME + (230,), width=4, joint="curve")
ld.line([(0, H - 120), (220, H - 150), (270, H - 90), (220, H + 20)], fill=CYAN + (230,), width=4, joint="curve")
ld.line([(W - 520, -10), (W - 460, 140), (W + 10, 70)], fill=CYAN + (200,), width=3, joint="curve")
ld.line([(W - 330, -10), (W - 270, 180), (W + 10, 120)], fill=LIME + (210,), width=4, joint="curve")
blur = lines.filter(ImageFilter.GaussianBlur(10))
bg = Image.alpha_composite(bg, blur)
bg = Image.alpha_composite(bg, lines)

# --- network nodes
net = Image.new("RGBA", (W, H), (0, 0, 0, 0))
nd = ImageDraw.Draw(net)
nodes = [(260, 860), (470, 930), (650, 1010), (900, 940), (1250, 980), (1500, 900), (1780, 960),
         (1500, 160), (1700, 90), (1900, 220), (400, 90)]
for i in range(len(nodes) - 1):
    a, b = nodes[i], nodes[i + 1]
    if math.dist(a, b) < 520:
        nd.line([a, b], fill=(120, 200, 230, 70), width=2)
nd.line([nodes[2], nodes[4]], fill=(120, 200, 230, 50), width=2)
for i, (x, y) in enumerate(nodes):
    c = LIME if i % 2 else CYAN
    r = 7 if i % 3 else 10
    nd.ellipse((x - r * 2, y - r * 2, x + r * 2, y + r * 2), fill=c + (45,))
nglow = net.filter(ImageFilter.GaussianBlur(8))
for i, (x, y) in enumerate(nodes):
    c = LIME if i % 2 else CYAN
    r = 6 if i % 3 else 8
    nd.ellipse((x - r, y - r, x + r, y + r), fill=c + (255,))
bg = Image.alpha_composite(bg, nglow)
bg = Image.alpha_composite(bg, net)

# --- center vignette so text reads cleanly
vig = Image.new("RGBA", (W, H), (0, 0, 0, 0))
vd = ImageDraw.Draw(vig)
vd.ellipse((W * 0.12, H * 0.12, W * 0.88, H * 0.86), fill=(4, 10, 22, 150))
bg = Image.alpha_composite(bg, vig.filter(ImageFilter.GaussianBlur(120)))

# --- logo
logo = Image.open(f"{ROOT}/public/images/logo-big.png").convert("RGBA")
lw = int(W * 0.78)
lh = int(logo.height * lw / logo.width)
logo = logo.resize((lw, lh), Image.LANCZOS)
lx, ly = (W - lw) // 2, int(H * 0.2)
shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sa = logo.getchannel("A").point(lambda a: int(a * 0.55))
tint = Image.new("RGBA", logo.size, CYAN + (0,))
tint.putalpha(sa)
shadow.paste(tint, (lx, ly), tint)
bg = Image.alpha_composite(bg, shadow.filter(ImageFilter.GaussianBlur(28)))
bg.alpha_composite(logo, (lx, ly))

# --- text
d = ImageDraw.Draw(bg)
fonts = "C:/Windows/Fonts"
tag_font = ImageFont.truetype(f"{fonts}/CascadiaMono.ttf", 21 * S)
url_font = ImageFont.truetype(f"{fonts}/consolab.ttf", 40 * S)

tag_y = ly + lh + 48 * S
parts = ["Sites", "Aplicativos", "Design", "Gestão de Redes"]
sep = "  •  "
full = sep.join(parts)
tw = d.textlength(full, font=tag_font)
x = (W - tw) / 2
for i, p in enumerate(parts):
    d.text((x, tag_y), p, font=tag_font, fill=(236, 240, 232))
    x += d.textlength(p, font=tag_font)
    if i < len(parts) - 1:
        d.text((x, tag_y), sep, font=tag_font, fill=CYAN)
        x += d.textlength(sep, font=tag_font)

url = "nexusync.online"
uw = d.textlength(url, font=url_font)
uy = tag_y + 58 * S
ux = (W - uw) / 2
uglow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ImageDraw.Draw(uglow).text((ux, uy), url, font=url_font, fill=LIME + (170,))
bg = Image.alpha_composite(bg, uglow.filter(ImageFilter.GaussianBlur(14)))
ImageDraw.Draw(bg).text((ux, uy), url, font=url_font, fill=LIME)

# thin divider line under tagline
dd = ImageDraw.Draw(bg)
cy = tag_y + 40 * S
dd.line([(W / 2 - 60 * S, cy), (W / 2 + 60 * S, cy)], fill=CYAN + (120,), width=2)

bg.convert("RGB").resize((1080, 566), Image.LANCZOS).save(OUT, optimize=True)
print("saved", OUT)
