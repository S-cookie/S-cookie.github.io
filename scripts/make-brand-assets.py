# -*- coding: utf-8 -*-
"""生成站点图标与社交分享图（无外部依赖，只依赖 Pillow）"""
import os
from PIL import Image, ImageDraw, ImageFont

BASE = r"C:\Users\27112\Desktop\claude code\weekly-site\public"
ACCENT = (166, 124, 82)
INK = (38, 38, 38)
MUTED = (122, 122, 122)
CREAM = (253, 250, 246)
PAPER = (251, 247, 242)


def font(path_list, size):
    for p in path_list:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    return ImageFont.load_default()


SONG = [r"C:\Windows\Fonts\simsun.ttc", r"C:\Windows\Fonts\STSONG.TTF", r"C:\Windows\Fonts\msyh.ttc"]
SANS = [r"C:\Windows\Fonts\msyh.ttc", r"C:\Windows\Fonts\segoeui.ttf"]

SS = 4  # 超采样，保证边缘干净


def make_mark(size):
    s = size * SS
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    pad = s * 21 / 144
    radius = s * 26 / 144
    d.rounded_rectangle([pad, pad, s - pad, s - pad], radius=radius, fill=ACCENT + (255,))
    # 右上折角
    d.polygon(
        [(86 / 144 * s, 21 / 144 * s), (123 / 144 * s, 58 / 144 * s), (98 / 144 * s, 58 / 144 * s)],
        fill=CREAM + (255,),
    )
    bars = [
        (41 / 144, 72 / 144, 103 / 144, 80 / 144, CREAM),
        (41 / 144, 88 / 144, 103 / 144, 96 / 144, (240, 228, 214)),
        (41 / 144, 104 / 144, 75 / 144, 112 / 144, (240, 228, 214)),
    ]
    for x0, y0, x1, y1, color in bars:
        d.rounded_rectangle([x0 * s, y0 * s, x1 * s, y1 * s], radius=(y1 - y0) * s / 2, fill=color + (255,))
    return img.resize((size, size), Image.LANCZOS)


# 1. 图标
for px in (32, 144, 192, 512):
    make_mark(px).save(os.path.join(BASE, f"icon-{px}.png"))
make_mark(180).save(os.path.join(BASE, "apple-touch-icon.png"))
make_mark(256).save(
    os.path.join(BASE, "favicon.ico"),
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)],
)

# 2. OG 分享图
W, H = 1200, 630
og = Image.new("RGB", (W, H), PAPER)
d = ImageDraw.Draw(og)

mark = make_mark(96)
og.paste(mark, (88, 84), mark)

d.rectangle([88, 236, 128, 242], fill=ACCENT)

title_font = font(SONG, 132)
sub_font = font(SANS, 32)
small_font = font(SANS, 26)

d.text((88, 268), "知新", font=title_font, fill=INK)
d.text((92, 440), "温故而知新", font=sub_font, fill=MUTED)
d.text((92, 492), "记录行业观察、产品方法与技术笔记", font=small_font, fill=(150, 150, 150))
d.text((88, H - 84), "Your Weekly Notes", font=small_font, fill=(178, 178, 178))

og.save(os.path.join(BASE, "og.png"), optimize=True)

# 旧的英文 OG 图不再使用
for stale in ("og-zh.png", "og-en.png"):
    p = os.path.join(BASE, stale)
    if os.path.exists(p):
        os.remove(p)

print("done")
