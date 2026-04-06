#!/usr/bin/env python3
"""
QuestLearn Demo Video Generator
Finn — Video Production Agent
Produces: questlearn-curricullm-vs-cogniti-demo.mp4 (1080p H.264, ~4 min)
"""

import os
import sys
import json
import shutil
import subprocess
import textwrap
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# ─── Paths ────────────────────────────────────────────────────────────────────
PROJECT = Path("/Users/loki/projects/questlearn")
PUBLIC  = PROJECT / "public"
SHOWCASE = PUBLIC / "showcase"
WORK    = PROJECT / "scripts" / "_video_work"
AUDIO   = WORK / "audio"
FRAMES  = WORK / "frames"
OUTPUT  = SHOWCASE / "questlearn-curricullm-vs-cogniti-demo.mp4"

for d in [SHOWCASE, WORK, AUDIO, FRAMES]:
    d.mkdir(parents=True, exist_ok=True)

W, H = 1920, 1080
FPS  = 30

# ─── Fonts ────────────────────────────────────────────────────────────────────
FONT_DIR = Path("/System/Library/Fonts")
FONT_BOLD_PATH       = str(FONT_DIR / "Supplemental" / "Arial Bold.ttf")
FONT_REGULAR_PATH    = str(FONT_DIR / "Supplemental" / "Arial.ttf")
FONT_ITALIC_PATH     = str(FONT_DIR / "Supplemental" / "Arial Italic.ttf")

def font(size, bold=False, italic=False):
    try:
        path = FONT_BOLD_PATH if bold else (FONT_ITALIC_PATH if italic else FONT_REGULAR_PATH)
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

# ─── Colour Palette ───────────────────────────────────────────────────────────
BG_DARK   = (15, 23, 42)       # slate-900
BG_MID    = (30, 41, 59)       # slate-800
ORANGE    = (249, 115, 22)     # QuestLearn brand orange
WHITE     = (255, 255, 255)
GREY_LIGHT= (148, 163, 184)    # slate-400
GREY_MED  = (71, 85, 105)      # slate-600
GREEN     = (34, 197, 94)      # curricuLLM green
PURPLE    = (168, 85, 247)     # cogniti purple
BOTH_BLUE = (59, 130, 246)     # both blue
CARD_BG   = (30, 41, 59)       # card background

# ─── Helper: draw wrapped text ────────────────────────────────────────────────
def draw_text_wrapped(draw, text, x, y, max_width, fnt, fill, align="left", line_spacing=1.3):
    words = text.split()
    lines = []
    current = []
    for word in words:
        test = " ".join(current + [word])
        bbox = draw.textbbox((0, 0), test, font=fnt)
        if bbox[2] - bbox[0] <= max_width or not current:
            current.append(word)
        else:
            lines.append(" ".join(current))
            current = [word]
    if current:
        lines.append(" ".join(current))
    
    lh = int((draw.textbbox((0,0), "A", font=fnt)[3] - draw.textbbox((0,0), "A", font=fnt)[1]) * line_spacing)
    for i, line in enumerate(lines):
        lx = x
        if align == "center":
            bbox = draw.textbbox((0, 0), line, font=fnt)
            lw = bbox[2] - bbox[0]
            lx = x + (max_width - lw) // 2
        draw.text((lx, y + i * lh), line, font=fnt, fill=fill)
    return y + len(lines) * lh

# ─── Helper: draw rounded rectangle ──────────────────────────────────────────
def draw_rounded_rect(draw, xy, radius, fill, outline=None, outline_width=2):
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle([x1, y1, x2, y2], radius=radius, fill=fill, 
                           outline=outline, width=outline_width)

# ─── Base screenshot loader ───────────────────────────────────────────────────
def load_screen(name):
    path = PUBLIC / f"{name}.png"
    if path.exists():
        img = Image.open(path).convert("RGB")
        if img.size != (W, H):
            img = img.resize((W, H), Image.LANCZOS)
        return img
    return None

def new_frame(bg_color=BG_DARK):
    return Image.new("RGB", (W, H), bg_color)

# ─── Overlay helpers ──────────────────────────────────────────────────────────
def add_overlay(img, alpha=120):
    """Add dark overlay to existing screenshot for text readability."""
    overlay = Image.new("RGBA", img.size, (0, 0, 0, alpha))
    base = img.convert("RGBA")
    result = Image.alpha_composite(base, overlay)
    return result.convert("RGB")

def add_label_bar(img, text, color=ORANGE):
    """Add a bottom label bar to a screenshot."""
    draw = ImageDraw.Draw(img)
    bar_h = 64
    draw.rectangle([(0, H - bar_h), (W, H)], fill=(0, 0, 0, 200))
    f = font(32, bold=True)
    bbox = draw.textbbox((0, 0), text, font=f)
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw) // 2, H - bar_h + 14), text, font=f, fill=color)
    return img

# ─── SCENE GENERATORS ─────────────────────────────────────────────────────────

def make_title_card():
    """Scene intro: 'CurricuLLM vs Cogniti' title card."""
    img = new_frame(BG_DARK)
    draw = ImageDraw.Draw(img)
    
    # Background gradient effect (simple horizontal bands)
    for y in range(H):
        ratio = y / H
        r = int(BG_DARK[0] * (1 - ratio * 0.3))
        g = int(BG_DARK[1] * (1 - ratio * 0.3))
        b = int(15 + 40 * ratio)
        draw.line([(0, y), (W, y)], fill=(r, g, b))
    
    # QuestLearn brand logo area
    draw.rectangle([(W//2 - 4, H//2 - 160), (W//2 + 4, H//2 - 20)], fill=ORANGE)
    
    f_brand = font(28, bold=True)
    brand_text = "QUESTLEARN"
    bbox = draw.textbbox((0,0), brand_text, font=f_brand)
    bw = bbox[2] - bbox[0]
    draw.text(((W - bw)//2, H//2 - 200), brand_text, font=f_brand, fill=GREY_LIGHT)
    
    # Main title
    f_main = font(96, bold=True)
    title1 = "CurricuLLM"
    bbox1 = draw.textbbox((0,0), title1, font=f_main)
    tw1 = bbox1[2] - bbox1[0]
    draw.text(((W - tw1)//2, H//2 - 100), title1, font=f_main, fill=GREEN)
    
    f_vs = font(48, bold=False)
    vs_text = "vs"
    bbox_vs = draw.textbbox((0,0), vs_text, font=f_vs)
    tw_vs = bbox_vs[2] - bbox_vs[0]
    draw.text(((W - tw_vs)//2, H//2 + 20), vs_text, font=f_vs, fill=GREY_LIGHT)
    
    title2 = "Cogniti"
    bbox2 = draw.textbbox((0,0), title2, font=f_main)
    tw2 = bbox2[2] - bbox2[0]
    draw.text(((W - tw2)//2, H//2 + 70), title2, font=f_main, fill=PURPLE)
    
    # Tagline
    f_tag = font(28)
    tag = "Two Socratic tutors. One learning experience."
    bbox_tag = draw.textbbox((0,0), tag, font=f_tag)
    tw_tag = bbox_tag[2] - bbox_tag[0]
    draw.text(((W - tw_tag)//2, H//2 + 200), tag, font=f_tag, fill=GREY_LIGHT)
    
    # EduX badge
    f_badge = font(22, bold=True)
    badge_text = "  EduX Hackathon Demo  "
    bbox_b = draw.textbbox((0,0), badge_text, font=f_badge)
    bw = bbox_b[2] - bbox_b[0]
    bh = bbox_b[3] - bbox_b[1]
    bx = (W - bw) // 2
    by = H//2 + 270
    draw_rounded_rect(draw, [bx - 10, by - 8, bx + bw + 10, by + bh + 8], 
                      radius=16, fill=ORANGE)
    draw.text((bx, by), badge_text, font=f_badge, fill=WHITE)
    
    return img

def make_closing_card():
    """Scene 6 closing card."""
    img = new_frame(BG_DARK)
    draw = ImageDraw.Draw(img)
    
    # Dark gradient
    for y in range(H):
        ratio = y / H
        b = int(42 * (1 + ratio * 0.5))
        draw.line([(0, y), (W, y)], fill=(15, 23, int(42 + b * 0.3)))
    
    # QuestLearn logo
    f_logo = font(72, bold=True)
    logo = "QuestLearn"
    bbox = draw.textbbox((0,0), logo, font=f_logo)
    lw = bbox[2] - bbox[0]
    draw.text(((W - lw)//2, H//2 - 220), logo, font=f_logo, fill=ORANGE)
    
    # Tagline
    f_tag = font(32)
    tag = "Multiple learning formats. Multiple AI tutors."
    bbox_t = draw.textbbox((0,0), tag, font=f_tag)
    tw = bbox_t[2] - bbox_t[0]
    draw.text(((W - tw)//2, H//2 - 120), tag, font=f_tag, fill=WHITE)
    
    # Three pillars
    pillars = [
        ("🎭 Meme", "Visual · Engaging · Memorable", GREEN),
        ("🤖 CurricuLLM", "In-house · Claude-powered · Real-time tracking", ORANGE),
        ("✨ Cogniti", "Cloud-native · Laurillard-powered · Always optimised", PURPLE),
    ]
    
    col_w = 500
    start_x = (W - col_w * 3 - 60) // 2
    for i, (title, sub, color) in enumerate(pillars):
        cx = start_x + i * (col_w + 30)
        draw_rounded_rect(draw, [cx, H//2 - 30, cx + col_w, H//2 + 140], 
                         radius=12, fill=BG_MID, outline=color, outline_width=2)
        f_pt = font(28, bold=True)
        draw.text((cx + 20, H//2 - 10), title, font=f_pt, fill=color)
        draw_text_wrapped(draw, sub, cx + 20, H//2 + 40, col_w - 40, font(22), GREY_LIGHT)
    
    # URL
    f_url = font(36, bold=True)
    url = "questlearn-nu.vercel.app"
    bbox_u = draw.textbbox((0,0), url, font=f_url)
    uw = bbox_u[2] - bbox_u[0]
    draw.text(((W - uw)//2, H//2 + 200), url, font=f_url, fill=ORANGE)
    
    f_learn = font(24)
    learn_text = "Learn more →"
    bbox_l = draw.textbbox((0,0), learn_text, font=f_learn)
    lw = bbox_l[2] - bbox_l[0]
    draw.text(((W - lw)//2, H//2 + 255), learn_text, font=f_learn, fill=GREY_LIGHT)
    
    return img

def make_dashboard_frame(highlight_topic=False, highlight_format=False, topic_text="photosynthesis"):
    """Student dashboard with optional highlights."""
    base = load_screen("home") or new_frame((245, 245, 245))
    img = base.copy()
    
    if highlight_topic or highlight_format:
        draw = ImageDraw.Draw(img)
        # Pulsing highlight box (simplified: just a tinted overlay)
        if highlight_topic:
            # Highlight around topic area (approximate position)
            draw.rectangle([(W//2 - 300, H//2 - 80), (W//2 + 300, H//2 + 40)], 
                          outline=ORANGE, width=4)
        if highlight_format:
            draw.rectangle([(W//2 - 300, H//2 + 60), (W//2 + 300, H//2 + 180)], 
                          outline=GREEN, width=4)
    return img

def make_meme_loaded_frame_with_tutor_buttons():
    """learn-meme-loaded screenshot with CurricuLLM/Cogniti/Both button panel overlaid."""
    base = load_screen("learn-meme-loaded") or new_frame()
    img = base.copy()
    draw = ImageDraw.Draw(img)
    
    # The Socratic dialogue panel is on the right (~1250px to right edge)
    # We'll add three glowing buttons above the chat input in the right panel
    panel_x = 1260
    panel_w = W - panel_x - 20
    
    # Semi-transparent background to highlight button area
    btn_area_y = 120
    btn_area_h = 110
    draw_rounded_rect(draw, [panel_x - 10, btn_area_y, W - 10, btn_area_y + btn_area_h],
                     radius=10, fill=(15, 23, 42, 200), outline=GREY_MED, outline_width=1)
    
    f_lbl = font(20, bold=True)
    draw.text((panel_x, btn_area_y + 12), "Choose your AI tutor:", font=f_lbl, fill=GREY_LIGHT)
    
    # Three buttons
    btn_w = int(panel_w * 0.28)
    btn_h = 44
    btn_y = btn_area_y + 50
    gap = 12
    btn_x1 = panel_x
    btn_x2 = btn_x1 + btn_w + gap
    btn_x3 = btn_x2 + btn_w + gap
    
    buttons = [
        (btn_x1, "CurricuLLM", GREEN),
        (btn_x2, "Cogniti",    PURPLE),
        (btn_x3, "Both",       BOTH_BLUE),
    ]
    
    f_btn = font(22, bold=True)
    for bx, label, color in buttons:
        draw_rounded_rect(draw, [bx, btn_y, bx + btn_w, btn_y + btn_h],
                         radius=8, fill=color)
        bbox = draw.textbbox((0,0), label, font=f_btn)
        tw = bbox[2] - bbox[0]
        tx = bx + (btn_w - tw) // 2
        ty = btn_y + (btn_h - (bbox[3] - bbox[1])) // 2
        draw.text((tx, ty), label, font=f_btn, fill=WHITE)
    
    # Arrow pointing to buttons
    draw.text((panel_x + 20, btn_area_y + btn_area_h + 8), 
              "↑  Pick how you want to learn deeper", font=font(18, italic=True), fill=ORANGE)
    
    return img

def make_curricullm_active_frame(state="question_typed"):
    """CurricuLLM active state with green active button and conversation."""
    base = load_screen("learn-meme-loaded") or new_frame()
    img = base.copy()
    draw = ImageDraw.Draw(img)
    
    panel_x = 1260
    panel_w = W - panel_x - 20
    
    # Active button row
    btn_w = int(panel_w * 0.28)
    btn_h = 40
    btn_y = 120
    gap = 12
    
    # CurricuLLM = active (glowing), others = dim
    buttons = [
        (panel_x,               "CurricuLLM", GREEN,    True),
        (panel_x + btn_w + gap, "Cogniti",    BG_MID,   False),
        (panel_x + (btn_w + gap)*2, "Both",   BG_MID,   False),
    ]
    
    f_lbl = font(20, bold=True)
    draw.text((panel_x, 98), "AI Tutor:", font=f_lbl, fill=GREY_LIGHT)
    
    f_btn = font(22, bold=True)
    for bx, label, color, active in buttons:
        outline = GREEN if active else GREY_MED
        draw_rounded_rect(draw, [bx, btn_y, bx + btn_w, btn_y + btn_h],
                         radius=8, fill=color, outline=outline, outline_width=2 if active else 1)
        bbox = draw.textbbox((0,0), label, font=f_btn)
        tw = bbox[2] - bbox[0]
        tx = bx + (btn_w - tw) // 2
        ty = btn_y + (btn_h - (bbox[3] - bbox[1])) // 2
        draw.text((tx, ty), label, font=f_btn, fill=WHITE if active else GREY_MED)
    
    # Chat area - cover with realistic chat UI
    chat_x = panel_x - 10
    chat_y = 175
    chat_h = H - chat_y - 130
    draw_rounded_rect(draw, [chat_x, chat_y, W - 8, chat_y + chat_h],
                     radius=8, fill=(20, 30, 50))
    
    # CurricuLLM badge
    f_badge = font(18, bold=True)
    draw_rounded_rect(draw, [chat_x + 10, chat_y + 10, chat_x + 180, chat_y + 40],
                     radius=6, fill=GREEN)
    draw.text((chat_x + 20, chat_y + 14), "🤖 CurricuLLM", font=f_badge, fill=WHITE)
    
    draw.text((chat_x + 195, chat_y + 14), "Claude-powered · Socratic", 
              font=font(16), fill=GREY_LIGHT)
    
    # Question bubble (student)
    q_y = chat_y + 60
    question = "What happens to sunlight when a plant captures it?"
    q_lines = textwrap.wrap(question, width=32)
    q_h = len(q_lines) * 28 + 20
    q_x = W - 8 - 380
    draw_rounded_rect(draw, [q_x, q_y, W - 20, q_y + q_h],
                     radius=10, fill=(51, 65, 85))
    f_q = font(20)
    for li, line in enumerate(q_lines):
        draw.text((q_x + 14, q_y + 10 + li * 28), line, font=f_q, fill=WHITE)
    draw.text((q_x - 60, q_y + q_h - 20), "You", font=font(14), fill=GREY_LIGHT)
    
    if state in ("response", "followup"):
        # AI response bubble
        r_y = q_y + q_h + 18
        responses = [
            "Interesting! Before I answer,",
            "let me ask you this: What do",
            "you think a plant needs in order",
            "to store energy for later use?",
            "",
            "Hint: think about what happens",
            "when you charge a battery. 🔋",
        ]
        r_h = len(responses) * 26 + 20
        draw_rounded_rect(draw, [chat_x + 10, r_y, chat_x + 400, r_y + r_h],
                         radius=10, fill=(30, 60, 50))
        draw_rounded_rect(draw, [chat_x + 10, r_y, chat_x + 10 + 6, r_y + r_h],
                         radius=3, fill=GREEN)
        f_r = font(20)
        for li, line in enumerate(responses):
            draw.text((chat_x + 26, r_y + 10 + li * 26), line, font=f_r, fill=WHITE)
        draw.text((chat_x + 26, r_y + r_h + 4), "CurricuLLM · Socratic scaffold", 
                  font=font(14), fill=GREEN)
    
    if state == "followup":
        # Follow-up question bubble
        fu_y = q_y + q_h + 180 + 18 + 30
        fu_text = "It converts light energy into chemical energy!"
        fu_lines = textwrap.wrap(fu_text, width=30)
        fu_h = len(fu_lines) * 28 + 20
        fu_x = W - 8 - 350
        draw_rounded_rect(draw, [fu_x, fu_y, W - 20, fu_y + fu_h],
                         radius=10, fill=(51, 65, 85))
        for li, line in enumerate(fu_lines):
            draw.text((fu_x + 14, fu_y + 10 + li * 28), line, font=font(20), fill=WHITE)
        draw.text((fu_x - 60, fu_y + fu_h - 20), "You", font=font(14), fill=GREY_LIGHT)
        
        # Second AI response
        fa_y = fu_y + fu_h + 16
        fa_lines = ["Exactly! 🌟 Now — WHERE exactly", "does that energy go? Into which", "molecule?"]
        fa_h = len(fa_lines) * 26 + 20
        draw_rounded_rect(draw, [chat_x + 10, fa_y, chat_x + 360, fa_y + fa_h],
                         radius=10, fill=(30, 60, 50))
        draw_rounded_rect(draw, [chat_x + 10, fa_y, chat_x + 16, fa_y + fa_h],
                         radius=3, fill=GREEN)
        for li, line in enumerate(fa_lines):
            draw.text((chat_x + 26, fa_y + 10 + li * 26), line, font=font(20), fill=WHITE)
    
    # Input bar
    inp_y = H - 120
    draw_rounded_rect(draw, [chat_x + 10, inp_y, W - 20, inp_y + 50],
                     radius=8, fill=BG_MID, outline=GREY_MED, outline_width=1)
    draw.text((chat_x + 26, inp_y + 14), "Type your response…", 
              font=font(20), fill=GREY_MED)
    draw_rounded_rect(draw, [W - 130, inp_y + 6, W - 22, inp_y + 44],
                     radius=8, fill=GREEN)
    draw.text((W - 120, inp_y + 14), "Send →", font=font(18, bold=True), fill=WHITE)
    
    return img

def make_cogniti_active_frame(state="question_typed"):
    """Cogniti active state with purple active button and conversation."""
    base = load_screen("learn-meme-loaded") or new_frame()
    img = base.copy()
    draw = ImageDraw.Draw(img)
    
    panel_x = 1260
    panel_w = W - panel_x - 20
    
    btn_w = int(panel_w * 0.28)
    btn_h = 40
    btn_y = 120
    gap = 12
    
    buttons = [
        (panel_x,               "CurricuLLM", BG_MID,  False),
        (panel_x + btn_w + gap, "Cogniti",    PURPLE,  True),
        (panel_x + (btn_w + gap)*2, "Both",   BG_MID,  False),
    ]
    
    f_lbl = font(20, bold=True)
    draw.text((panel_x, 98), "AI Tutor:", font=f_lbl, fill=GREY_LIGHT)
    
    f_btn = font(22, bold=True)
    for bx, label, color, active in buttons:
        outline = PURPLE if active else GREY_MED
        draw_rounded_rect(draw, [bx, btn_y, bx + btn_w, btn_y + btn_h],
                         radius=8, fill=color, outline=outline, outline_width=2 if active else 1)
        bbox = draw.textbbox((0,0), label, font=f_btn)
        tw = bbox[2] - bbox[0]
        tx = bx + (btn_w - tw) // 2
        ty = btn_y + (btn_h - (bbox[3] - bbox[1])) // 2
        draw.text((tx, ty), label, font=f_btn, fill=WHITE if active else GREY_MED)
    
    chat_x = panel_x - 10
    chat_y = 175
    chat_h = H - chat_y - 130
    draw_rounded_rect(draw, [chat_x, chat_y, W - 8, chat_y + chat_h],
                     radius=8, fill=(20, 15, 40))
    
    f_badge = font(18, bold=True)
    draw_rounded_rect(draw, [chat_x + 10, chat_y + 10, chat_x + 160, chat_y + 40],
                     radius=6, fill=PURPLE)
    draw.text((chat_x + 20, chat_y + 14), "✨ Cogniti", font=f_badge, fill=WHITE)
    draw.text((chat_x + 175, chat_y + 14), "Laurillard Framework · Cloud", 
              font=font(16), fill=GREY_LIGHT)
    
    q_y = chat_y + 60
    question = "What happens to sunlight when a plant captures it?"
    q_lines = textwrap.wrap(question, width=32)
    q_h = len(q_lines) * 28 + 20
    q_x = W - 8 - 380
    draw_rounded_rect(draw, [q_x, q_y, W - 20, q_y + q_h],
                     radius=10, fill=(51, 65, 85))
    f_q = font(20)
    for li, line in enumerate(q_lines):
        draw.text((q_x + 14, q_y + 10 + li * 28), line, font=f_q, fill=WHITE)
    draw.text((q_x - 60, q_y + q_h - 20), "You", font=font(14), fill=GREY_LIGHT)
    
    if state in ("response", "followup"):
        r_y = q_y + q_h + 18
        responses = [
            "Great question! Here's something",
            "to consider — think about the",
            "last time you turned on a torch.",
            "The battery stores energy. Plants",
            "do something similar with light.",
            "",
            "What do you think that storage",
            "process might be called? 🌿",
        ]
        r_h = len(responses) * 25 + 20
        draw_rounded_rect(draw, [chat_x + 10, r_y, chat_x + 420, r_y + r_h],
                         radius=10, fill=(40, 20, 60))
        draw_rounded_rect(draw, [chat_x + 10, r_y, chat_x + 16, r_y + r_h],
                         radius=3, fill=PURPLE)
        f_r = font(20)
        for li, line in enumerate(responses):
            draw.text((chat_x + 26, r_y + 10 + li * 25), line, font=f_r, fill=WHITE)
        draw.text((chat_x + 26, r_y + r_h + 4), "Cogniti · Laurillard dialogue", 
                  font=font(14), fill=PURPLE)
    
    if state == "followup":
        fu_y = q_y + q_h + 220 + 18
        fu_text = "Photosynthesis! Converting light to sugar?"
        fu_lines = textwrap.wrap(fu_text, width=30)
        fu_h = len(fu_lines) * 28 + 20
        fu_x = W - 8 - 360
        draw_rounded_rect(draw, [fu_x, fu_y, W - 20, fu_y + fu_h],
                         radius=10, fill=(51, 65, 85))
        for li, line in enumerate(fu_lines):
            draw.text((fu_x + 14, fu_y + 10 + li * 28), line, font=font(20), fill=WHITE)
        
        fa_y = fu_y + fu_h + 16
        fa_lines = ["You're on the right track! 🎯", "The molecule is called glucose.", "What's the chemical formula?"]
        fa_h = len(fa_lines) * 26 + 20
        draw_rounded_rect(draw, [chat_x + 10, fa_y, chat_x + 380, fa_y + fa_h],
                         radius=10, fill=(40, 20, 60))
        draw_rounded_rect(draw, [chat_x + 10, fa_y, chat_x + 16, fa_y + fa_h],
                         radius=3, fill=PURPLE)
        for li, line in enumerate(fa_lines):
            draw.text((chat_x + 26, fa_y + 10 + li * 26), line, font=font(20), fill=WHITE)
    
    inp_y = H - 120
    draw_rounded_rect(draw, [chat_x + 10, inp_y, W - 20, inp_y + 50],
                     radius=8, fill=BG_MID, outline=GREY_MED, outline_width=1)
    draw.text((chat_x + 26, inp_y + 14), "Type your response…", 
              font=font(20), fill=GREY_MED)
    draw_rounded_rect(draw, [W - 130, inp_y + 6, W - 22, inp_y + 44],
                     radius=8, fill=PURPLE)
    draw.text((W - 120, inp_y + 14), "Send →", font=font(18, bold=True), fill=WHITE)
    
    return img

def make_both_active_frame(state="question", show_responses=False):
    """Side-by-side CurricuLLM + Cogniti view."""
    base = load_screen("learn-meme-loaded") or new_frame()
    img = base.copy()
    draw = ImageDraw.Draw(img)
    
    # Content area takes ~60% left, both panels share right 40%
    # Actually: use the entire screen differently - 
    # Left 48%: content + CurricuLLM
    # Right 48%: Cogniti
    # With 4% center divider
    
    # But the base image has the meme on the left ~900px wide
    # Let's overlay two chat panels side by side on the right

    panel_x = 1260
    panel_w = W - panel_x - 20
    
    # Active button row
    btn_w = int(panel_w * 0.28)
    btn_h = 40
    btn_y = 120
    gap = 12
    
    buttons = [
        (panel_x,               "CurricuLLM", BG_MID,  False),
        (panel_x + btn_w + gap, "Cogniti",    BG_MID,  False),
        (panel_x + (btn_w + gap)*2, "Both",   BOTH_BLUE, True),
    ]
    
    draw.text((panel_x, 98), "AI Tutor:", font=font(20, bold=True), fill=GREY_LIGHT)
    
    for bx, label, color, active in buttons:
        outline = BOTH_BLUE if active else GREY_MED
        draw_rounded_rect(draw, [bx, btn_y, bx + btn_w, btn_y + btn_h],
                         radius=8, fill=color, outline=outline, outline_width=2 if active else 1)
        bbox = draw.textbbox((0,0), label, font=font(22, bold=True))
        tw = bbox[2] - bbox[0]
        tx = bx + (btn_w - tw) // 2
        ty = btn_y + (btn_h - (bbox[3] - bbox[1])) // 2
        draw.text((tx, ty), label, font=font(22, bold=True), fill=WHITE if active else GREY_MED)
    
    # Side-by-side panels — use FULL width, override the base screenshot layout
    # Panel for both: from x=1260 to edge, we split vertically
    chat_x = panel_x - 10
    chat_y = 175
    chat_h = H - chat_y - 130
    panel_mid = chat_x + (W - 8 - chat_x) // 2 - 2
    
    # Left mini-panel: CurricuLLM
    draw_rounded_rect(draw, [chat_x, chat_y, panel_mid, chat_y + chat_h],
                     radius=8, fill=(18, 28, 48))
    draw_rounded_rect(draw, [chat_x, chat_y, chat_x + 4, chat_y + chat_h],
                     radius=0, fill=GREEN)
    draw.text((chat_x + 14, chat_y + 12), "🤖 CurricuLLM", 
              font=font(17, bold=True), fill=GREEN)
    
    # Right mini-panel: Cogniti
    draw_rounded_rect(draw, [panel_mid + 4, chat_y, W - 8, chat_y + chat_h],
                     radius=8, fill=(18, 12, 36))
    draw_rounded_rect(draw, [W - 12, chat_y, W - 8, chat_y + chat_h],
                     radius=0, fill=PURPLE)
    draw.text((panel_mid + 18, chat_y + 12), "✨ Cogniti", 
              font=font(17, bold=True), fill=PURPLE)
    
    # Question shown in both
    q_text = "Why do plants need CO2?"
    q_lines = textwrap.wrap(q_text, width=20)
    q_h = len(q_lines) * 22 + 16
    
    # CurricuLLM question
    qx_l = chat_x + 10
    qy = chat_y + 50
    draw_rounded_rect(draw, [qx_l, qy, panel_mid - 10, qy + q_h],
                     radius=6, fill=(51, 65, 85))
    draw.text((qx_l + 8, qy + 8), "Student:", font=font(13), fill=GREY_LIGHT)
    for li, line in enumerate(q_lines):
        draw.text((qx_l + 8, qy + 26 + li * 22), line, font=font(17), fill=WHITE)
    
    # Cogniti question
    qx_r = panel_mid + 14
    draw_rounded_rect(draw, [qx_r, qy, W - 20, qy + q_h],
                     radius=6, fill=(51, 65, 85))
    draw.text((qx_r + 8, qy + 8), "Student:", font=font(13), fill=GREY_LIGHT)
    for li, line in enumerate(q_lines):
        draw.text((qx_r + 8, qy + 26 + li * 22), line, font=font(17), fill=WHITE)
    
    if show_responses:
        r_y = qy + q_h + 12
        
        # CurricuLLM response
        cl_lines = ["Think about what cells", "are made of… what role", "does carbon play in", "building organic", "molecules? 🔬"]
        cl_h = len(cl_lines) * 22 + 16
        draw_rounded_rect(draw, [qx_l, r_y, panel_mid - 10, r_y + cl_h],
                         radius=6, fill=(25, 55, 40))
        draw_rounded_rect(draw, [qx_l, r_y, qx_l + 3, r_y + cl_h], radius=0, fill=GREEN)
        for li, line in enumerate(cl_lines):
            draw.text((qx_l + 10, r_y + 8 + li * 22), line, font=font(17), fill=WHITE)
        draw.text((qx_l, r_y + cl_h + 4), "→ Scaffolding", font=font(13), fill=GREEN)
        
        # Cogniti response
        cg_lines = ["Imagine you're cooking", "and you need flour and", "water. Plants 'cook' with", "CO2 and water. What", "do they make? 🍃"]
        cg_h = len(cg_lines) * 22 + 16
        draw_rounded_rect(draw, [qx_r, r_y, W - 20, r_y + cg_h],
                         radius=6, fill=(35, 15, 55))
        draw_rounded_rect(draw, [W - 23, r_y, W - 20, r_y + cg_h], radius=0, fill=PURPLE)
        for li, line in enumerate(cg_lines):
            draw.text((qx_r + 10, r_y + 8 + li * 22), line, font=font(17), fill=WHITE)
        draw.text((qx_r, r_y + cg_h + 4), "→ Australian context", font=font(13), fill=PURPLE)
        
        # Compare label at bottom
        comp_y = H - 116
        draw_rounded_rect(draw, [chat_x, comp_y, W - 8, comp_y + 36],
                         radius=6, fill=BOTH_BLUE)
        comp_text = "Same question → two Socratic approaches → teacher compares engagement"
        bbox = draw.textbbox((0,0), comp_text, font=font(18, bold=True))
        tw = bbox[2] - bbox[0]
        draw.text(((W + chat_x - tw) // 2, comp_y + 8), comp_text, 
                  font=font(18, bold=True), fill=WHITE)
    
    inp_y = H - 76
    draw_rounded_rect(draw, [chat_x + 10, inp_y, W - 20, inp_y + 44],
                     radius=8, fill=BG_MID, outline=GREY_MED, outline_width=1)
    draw.text((chat_x + 26, inp_y + 12), "Type your response…", 
              font=font(18), fill=GREY_MED)
    draw_rounded_rect(draw, [W - 120, inp_y + 4, W - 22, inp_y + 40],
                     radius=8, fill=BOTH_BLUE)
    draw.text((W - 112, inp_y + 10), "Send →", font=font(17, bold=True), fill=WHITE)
    
    return img

def make_teacher_dashboard_frame():
    """Teacher dashboard with annotation."""
    base = load_screen("teacher-dashboard") or new_frame()
    img = base.copy()
    draw = ImageDraw.Draw(img)
    
    # Add annotation overlay
    overlay_h = 80
    draw.rectangle([(0, H - overlay_h), (W, H)], fill=(0, 0, 0, 200))
    info_text = "Teacher Dashboard — Tracks tutor usage, time-on-task, and comprehension progression per student"
    bbox = draw.textbbox((0,0), info_text, font=font(26))
    tw = bbox[2] - bbox[0]
    draw.text(((W - tw)//2, H - overlay_h + 24), info_text, font=font(26), fill=WHITE)
    
    return img

# ─── TTS VOICEOVER ────────────────────────────────────────────────────────────

VOICEOVERS = {
    "scene1": (
        "Today, we're showing you two different Socratic tutors in QuestLearn, "
        "and how they work together to help students learn. This is the student "
        "dashboard. Pick a topic, pick a format — today we're choosing Photosynthesis "
        "and Meme format."
    ),
    "scene2": (
        "The meme loads — it's visual, it's memorable, and it makes learning fun. "
        "But here's where it gets interesting. Once the student has seen the meme, "
        "they can choose which Socratic tutor guides their deeper learning. "
        "See the buttons on the right? CurricuLLM, Cogniti, or Both."
    ),
    "scene3": (
        "Let's start with CurricuLLM. This is our in-house Claude-powered Socratic "
        "tutor. It asks questions, guides students through active recall, and tracks "
        "comprehension in real-time. Watch as we ask a question about photosynthesis. "
        "Notice: no direct answers. Just scaffolding questions. The agent guides the "
        "student to discover the answer themselves. This is the Socratic method at scale."
    ),
    "scene4": (
        "Now let's switch to Cogniti — our new AI tutor powered by the Laurillard "
        "Conversational Framework. We just optimised this agent with a sharper system "
        "prompt, better misconception diagnosis, varied encouragement without generic "
        "praise, and Australian examples and context. Same pedagogical approach, "
        "different implementation. Cogniti runs entirely in the cloud — you can use "
        "it standalone, or integrate it with QuestLearn like we're doing here."
    ),
    "scene5": (
        "But here's the real power. Teachers and students can compare both tutors "
        "side-by-side. Let's click the Both button. Same question, two different "
        "Socratic approaches. Students can see how different tutors scaffold the same "
        "concept. Teachers can compare engagement metrics and adjust their teaching. "
        "In the teacher dashboard, we track which tutor each student used, how long "
        "they spent, and how their understanding progressed."
    ),
    "scene6": (
        "This is QuestLearn: multiple learning formats, multiple AI tutors, one unified "
        "learning experience. Meme — visual, engaging, memorable. CurricuLLM — in-house, "
        "real-time comprehension tracking. Cogniti — cloud-native, Laurillard-powered, "
        "continuously optimised. All integrated. All telemetry tracked. All data visible "
        "to teachers."
    ),
}

def generate_audio():
    """Generate all voiceover audio using macOS TTS."""
    print("🎙  Generating voiceover audio...")
    for scene, text in VOICEOVERS.items():
        aiff_path = AUDIO / f"{scene}.aiff"
        mp3_path  = AUDIO / f"{scene}.mp3"
        if mp3_path.exists():
            print(f"   ✓ {scene}.mp3 already exists, skipping")
            continue
        print(f"   → {scene}...")
        # Generate with Karen (Australian English) voice
        subprocess.run([
            "say", "-v", "Karen", "-r", "175",  # 175 wpm ≈ good demo pace
            "-o", str(aiff_path), text
        ], check=True)
        # Convert AIFF → MP3 for easier handling
        subprocess.run([
            "ffmpeg", "-y", "-i", str(aiff_path),
            "-codec:a", "libmp3lame", "-qscale:a", "4",
            str(mp3_path)
        ], check=True, capture_output=True)
        print(f"   ✓ {scene}.mp3")
    print("   ✅ All audio generated")

def get_audio_duration(path):
    """Get audio file duration in seconds."""
    result = subprocess.run([
        "ffprobe", "-v", "quiet", "-print_format", "json",
        "-show_streams", str(path)
    ], capture_output=True, text=True)
    data = json.loads(result.stdout)
    for stream in data.get("streams", []):
        if stream.get("duration"):
            return float(stream["duration"])
    return 10.0

# ─── FRAME GENERATION ─────────────────────────────────────────────────────────

def save_frame(img, name):
    path = FRAMES / f"{name}.png"
    img.save(path)
    return path

def generate_frames():
    """Generate all still frames needed for the video."""
    print("🖼  Generating frames...")
    
    save_frame(make_title_card(), "00_title")
    save_frame(make_closing_card(), "99_closing")
    
    # Scene 1 frames
    home = load_screen("home") or new_frame((240, 240, 240))
    save_frame(home, "01_home")
    
    onboard = load_screen("onboarding") or new_frame((240, 240, 240))
    save_frame(onboard, "01b_onboard")
    
    topic = load_screen("learn-topic-entered") or new_frame()
    save_frame(topic, "01c_topic")
    
    fmts = load_screen("format-selector") or new_frame()
    save_frame(fmts, "01d_format")
    
    # Scene 2 frames
    meme = load_screen("learn-meme-loaded") or new_frame()
    save_frame(meme, "02_meme_loaded")
    save_frame(make_meme_loaded_frame_with_tutor_buttons(), "02b_tutor_buttons")
    
    # Scene 3 frames
    save_frame(make_curricullm_active_frame("question_typed"), "03a_cl_question")
    save_frame(make_curricullm_active_frame("response"), "03b_cl_response")
    save_frame(make_curricullm_active_frame("followup"), "03c_cl_followup")
    
    # Scene 4 frames
    save_frame(make_cogniti_active_frame("question_typed"), "04a_cg_question")
    save_frame(make_cogniti_active_frame("response"), "04b_cg_response")
    save_frame(make_cogniti_active_frame("followup"), "04c_cg_followup")
    
    # Scene 5 frames
    save_frame(make_both_active_frame("question", False), "05a_both_question")
    save_frame(make_both_active_frame("question", True), "05b_both_responses")
    save_frame(make_teacher_dashboard_frame(), "05c_teacher")
    
    print("   ✅ All frames generated")

# ─── VIDEO ASSEMBLY ───────────────────────────────────────────────────────────

def image_to_video(img_path, duration, out_path, fade_in=0.5, fade_out=0.5):
    """Convert a still image to a video clip with optional fade."""
    vf_parts = []
    if fade_in > 0:
        vf_parts.append(f"fade=t=in:st=0:d={fade_in}")
    if fade_out > 0 and duration > fade_out:
        vf_parts.append(f"fade=t=out:st={duration - fade_out}:d={fade_out}")
    vf = ",".join(vf_parts) if vf_parts else "null"
    
    subprocess.run([
        "ffmpeg", "-y",
        "-loop", "1", "-i", str(img_path),
        "-t", str(duration),
        "-vf", f"scale={W}:{H},{vf}",
        "-r", str(FPS),
        "-c:v", "libx264", "-preset", "fast", "-crf", "20",
        "-pix_fmt", "yuv420p",
        str(out_path)
    ], check=True, capture_output=True)

def image_with_audio_to_video(img_path, audio_path, out_path, extra_seconds=0.5, 
                               fade_in=0.3, fade_out=0.5, loop_image=True):
    """Combine still image + audio into a video segment."""
    audio_dur = get_audio_duration(audio_path)
    total_dur = audio_dur + extra_seconds
    
    vf_parts = [f"scale={W}:{H}"]
    if fade_in > 0:
        vf_parts.append(f"fade=t=in:st=0:d={fade_in}")
    if fade_out > 0:
        vf_parts.append(f"fade=t=out:st={total_dur - fade_out}:d={fade_out}")
    vf = ",".join(vf_parts)
    
    subprocess.run([
        "ffmpeg", "-y",
        "-loop", "1", "-i", str(img_path),
        "-i", str(audio_path),
        "-t", str(total_dur),
        "-vf", vf,
        "-r", str(FPS),
        "-c:v", "libx264", "-preset", "fast", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k",
        "-pix_fmt", "yuv420p",
        "-shortest",
        str(out_path)
    ], check=True, capture_output=True)
    return total_dur

def multi_image_slideshow_with_audio(img_paths_and_durations, audio_path, out_path,
                                      fade_in=0.3, fade_out=0.5):
    """Create a multi-image slideshow with single audio track."""
    audio_dur = get_audio_duration(audio_path)
    total_dur = audio_dur + 0.5
    
    # Create a concat list
    concat_file = WORK / "concat_tmp.txt"
    clips = []
    remaining = total_dur
    
    for i, (img_path, dur) in enumerate(img_paths_and_durations):
        clip_path = WORK / f"clip_tmp_{i:03d}.mp4"
        actual_dur = min(dur, remaining)
        if actual_dur <= 0:
            break
        
        vf = f"scale={W}:{H}"
        if i == 0 and fade_in > 0:
            vf += f",fade=t=in:st=0:d={fade_in}"
        is_last = (i == len(img_paths_and_durations) - 1) or (remaining - dur <= 0)
        if is_last and fade_out > 0:
            vf += f",fade=t=out:st={max(0, actual_dur - fade_out)}:d={fade_out}"
        
        subprocess.run([
            "ffmpeg", "-y",
            "-loop", "1", "-i", str(img_path),
            "-t", str(actual_dur),
            "-vf", vf,
            "-r", str(FPS),
            "-c:v", "libx264", "-preset", "fast", "-crf", "20",
            "-pix_fmt", "yuv420p",
            str(clip_path)
        ], check=True, capture_output=True)
        clips.append(clip_path)
        remaining -= dur
    
    # Write concat file
    with open(concat_file, "w") as f:
        for cp in clips:
            f.write(f"file '{cp}'\n")
    
    # Concat video + mux with audio
    video_only = WORK / "video_only_tmp.mp4"
    subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_file),
        "-c:v", "libx264", "-preset", "fast", "-crf", "20",
        "-pix_fmt", "yuv420p",
        str(video_only)
    ], check=True, capture_output=True)
    
    subprocess.run([
        "ffmpeg", "-y",
        "-i", str(video_only),
        "-i", str(audio_path),
        "-c:v", "copy",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest",
        str(out_path)
    ], check=True, capture_output=True)
    
    return total_dur

def assemble_video():
    """Assemble all segments into the final video."""
    print("🎬  Assembling video segments...")
    
    segs = []
    
    # Segment 0: Title card (2s, no audio)
    s0 = WORK / "seg00_title.mp4"
    image_to_video(FRAMES / "00_title.png", 2.0, s0, fade_in=0.5, fade_out=0.3)
    segs.append(s0)
    print("   ✓ Segment 0: Title card")
    
    # Segment 1: Scene 1 — Dashboard + topic selection (voice ~19s)
    s1 = WORK / "seg01_scene1.mp4"
    scene1_imgs = [
        (FRAMES / "01_home.png", 5.0),
        (FRAMES / "01c_topic.png", 6.0),
        (FRAMES / "01d_format.png", 8.0),
        (FRAMES / "02_meme_loaded.png", 6.0),
    ]
    multi_image_slideshow_with_audio(scene1_imgs, AUDIO / "scene1.mp3", s1)
    segs.append(s1)
    print("   ✓ Segment 1: Scene 1")
    
    # Segment 2: Scene 2 — Meme + tutor buttons (voice ~20s)
    s2 = WORK / "seg02_scene2.mp4"
    scene2_imgs = [
        (FRAMES / "02_meme_loaded.png", 8.0),
        (FRAMES / "02b_tutor_buttons.png", 16.0),
    ]
    multi_image_slideshow_with_audio(scene2_imgs, AUDIO / "scene2.mp3", s2)
    segs.append(s2)
    print("   ✓ Segment 2: Scene 2")
    
    # Segment 3: Scene 3 — CurricuLLM (voice ~38s)
    s3 = WORK / "seg03_scene3.mp4"
    scene3_imgs = [
        (FRAMES / "03a_cl_question.png", 8.0),
        (FRAMES / "03b_cl_response.png", 20.0),
        (FRAMES / "03c_cl_followup.png", 20.0),
    ]
    multi_image_slideshow_with_audio(scene3_imgs, AUDIO / "scene3.mp3", s3)
    segs.append(s3)
    print("   ✓ Segment 3: Scene 3")
    
    # Segment 4: Scene 4 — Cogniti (voice ~45s)
    s4 = WORK / "seg04_scene4.mp4"
    scene4_imgs = [
        (FRAMES / "04a_cg_question.png", 8.0),
        (FRAMES / "04b_cg_response.png", 22.0),
        (FRAMES / "04c_cg_followup.png", 22.0),
    ]
    multi_image_slideshow_with_audio(scene4_imgs, AUDIO / "scene4.mp3", s4)
    segs.append(s4)
    print("   ✓ Segment 4: Scene 4")
    
    # Segment 5: Scene 5 — Both side-by-side (voice ~42s)
    s5 = WORK / "seg05_scene5.mp4"
    scene5_imgs = [
        (FRAMES / "05a_both_question.png", 8.0),
        (FRAMES / "05b_both_responses.png", 20.0),
        (FRAMES / "05c_teacher.png", 20.0),
    ]
    multi_image_slideshow_with_audio(scene5_imgs, AUDIO / "scene5.mp3", s5)
    segs.append(s5)
    print("   ✓ Segment 5: Scene 5")
    
    # Segment 6: Scene 6 — Closing voiceover (voice ~30s) + closing card (2s)
    s6a = WORK / "seg06a_scene6.mp4"
    home_img = load_screen("title-card") or new_frame()  # reuse title-card as bg
    home_img_path = FRAMES / "06_outro_bg.png"
    home_img.save(home_img_path)
    image_with_audio_to_video(home_img_path, AUDIO / "scene6.mp3", s6a, extra_seconds=0.3)
    segs.append(s6a)
    
    s6b = WORK / "seg06b_closing.mp4"
    image_to_video(FRAMES / "99_closing.png", 3.0, s6b, fade_in=0.3, fade_out=0.8)
    segs.append(s6b)
    print("   ✓ Segment 6: Closing")
    
    # ── Concatenate all segments ──────────────────────────────────────────────
    print("   🔗 Concatenating all segments...")
    concat_file = WORK / "final_concat.txt"
    with open(concat_file, "w") as f:
        for s in segs:
            f.write(f"file '{s}'\n")
    
    # Re-encode everything for clean concat
    temp_output = WORK / "final_raw.mp4"
    subprocess.run([
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", str(concat_file),
        "-c:v", "libx264", "-preset", "medium", "-crf", "18",
        "-c:a", "aac", "-b:a", "192k",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        str(temp_output)
    ], check=True, capture_output=True)
    
    # Copy to final destination
    shutil.copy(temp_output, OUTPUT)
    print(f"   ✅ Final video: {OUTPUT}")
    
    # Report duration
    result = subprocess.run([
        "ffprobe", "-v", "quiet", "-print_format", "json",
        "-show_format", str(OUTPUT)
    ], capture_output=True, text=True)
    data = json.loads(result.stdout)
    duration = float(data.get("format", {}).get("duration", 0))
    size_mb = int(data.get("format", {}).get("size", 0)) / 1_000_000
    print(f"\n   📊 Duration: {duration:.1f}s ({duration/60:.1f} min)")
    print(f"   📦 File size: {size_mb:.1f} MB")
    print(f"   📍 Output: {OUTPUT}")

# ─── RECORDING INSTRUCTIONS ───────────────────────────────────────────────────

def write_recording_instructions():
    """Write human-readable recording instructions for Nissan."""
    path = PROJECT / "scripts" / "RECORDING_INSTRUCTIONS.md"
    content = """# 🎬 QuestLearn Demo Recording Instructions
## CurricuLLM vs Cogniti Side-by-Side Demo
### For: EduX Hackathon Judges

---

## Prerequisites
- [ ] Browser: Chrome or Safari, 1920×1080 (or use Cmd+Shift+P → "Set device dimensions" in DevTools)
- [ ] URL: https://questlearn-nu.vercel.app/student-dashboard
- [ ] Screen recorder: QuickTime or OBS
- [ ] Microphone: off (voiceover added in post)
- [ ] Browser zoom: 100%
- [ ] Extensions: hide all (Presentation Mode recommended)

---

## Recording Setup (before you press record)
1. Open Chrome → Go to `https://questlearn-nu.vercel.app/student-dashboard`
2. Sign in with your account
3. Set window to fullscreen (F11 or Cmd+Ctrl+F)
4. Start QuickTime → File → New Screen Recording → select full screen
5. Press Record

---

## Scene-by-Scene Instructions

### Scene 1 (0:00–0:20) — Student Dashboard
**Target:** Show home screen → topic entry → format selection

| Time | Action |
|------|--------|
| 0:00 | HOLD on home screen for 3 seconds |
| 0:03 | CLICK on "New Quest" or topic input |
| 0:06 | TYPE "Photosynthesis" slowly (let text appear) |
| 0:11 | CLICK "Meme" format button |
| 0:14 | WAIT for meme to load (stay on screen) |
| 0:18 | PAUSE briefly on loaded meme |

**Screen region to show:** Full screen. No scrolling needed.

---

### Scene 2 (0:20–0:45) — Meme + Tutor Buttons
**Target:** Show the loaded meme + CurricuLLM/Cogniti/Both buttons

| Time | Action |
|------|--------|
| 0:20 | HOVER over the meme (don't click) |
| 0:28 | SLOWLY move cursor to right panel |
| 0:32 | HOVER over "CurricuLLM" button (don't click yet) |
| 0:36 | HOVER over "Cogniti" button |
| 0:40 | HOVER over "Both" button |
| 0:43 | PAUSE — leave cursor on "CurricuLLM" button |

**Screen region:** Show full width, especially the right sidebar.

---

### Scene 3 (0:45–1:45) — CurricuLLM Active
**Target:** CurricuLLM selected, question typed, AI responds, follow-up

| Time | Action |
|------|--------|
| 0:45 | CLICK "CurricuLLM" button |
| 0:48 | WAIT for CurricuLLM chat panel to activate |
| 0:52 | CLICK in the chat input field |
| 0:55 | TYPE: "What happens to sunlight when a plant captures it?" |
| 1:05 | CLICK "Send" button |
| 1:06 | WAIT for response to stream in (10–15 seconds) |
| 1:25 | PAUSE on response for 10 seconds |
| 1:35 | TYPE follow-up: "It converts light energy into chemical energy!" |
| 1:40 | CLICK "Send" |
| 1:43 | WAIT for second response (2 seconds) |

**Screen region:** Focus on right panel (chat UI). Left meme panel can be visible.

---

### Scene 4 (1:45–2:45) — Cogniti Active
**Target:** Switch to Cogniti, same question, different response

| Time | Action |
|------|--------|
| 1:45 | CLICK "Cogniti" button |
| 1:48 | WAIT for Cogniti chat panel to activate |
| 1:52 | CLICK in chat input field |
| 1:55 | TYPE: "What happens to sunlight when a plant captures it?" |
| 2:05 | CLICK "Send" |
| 2:06 | WAIT for response to stream in |
| 2:28 | PAUSE on response |
| 2:35 | TYPE follow-up: "Photosynthesis — converting light to sugar?" |
| 2:40 | CLICK "Send" |
| 2:43 | WAIT for response |

**Screen region:** Same as Scene 3. Cogniti should look visually distinct (purple vs green).

---

### Scene 5 (2:45–3:30) — Both Side-by-Side
**Target:** Click Both, ask same question, both respond simultaneously

| Time | Action |
|------|--------|
| 2:45 | CLICK "Both" button |
| 2:48 | WAIT for both panels to appear side-by-side |
| 2:54 | CLICK in the unified input (bottom) |
| 2:56 | TYPE: "Why do plants need CO2?" |
| 3:02 | CLICK "Send" |
| 3:03 | WAIT — both tutors stream responses simultaneously |
| 3:18 | PAUSE on both responses visible |
| 3:22 | NAVIGATE to teacher dashboard (new tab or menu) |
| 3:26 | SHOW teacher dashboard briefly |
| 3:30 | PAUSE |

**Screen region:** Show both panels clearly. Try to capture the side-by-side comparison.

---

### Scene 6 (3:30–4:00) — Closing
**Target:** Return to home screen, hold on QuestLearn branding

| Time | Action |
|------|--------|
| 3:30 | NAVIGATE to home: `https://questlearn-nu.vercel.app` |
| 3:34 | HOLD on home screen |
| 3:50 | STOP RECORDING |

---

## Post-Production (FFmpeg)

Once you have the raw screen recording (`raw-recording.mp4`), run these commands:

### 1. Trim and resize to 1080p
```bash
ffmpeg -i raw-recording.mp4 -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -crf 18 trimmed.mp4
```

### 2. Add voiceover (pre-generated audio)
```bash
# First, strip existing audio from screen recording
ffmpeg -i trimmed.mp4 -c:v copy -an video-only.mp4

# Then mux with voiceover
ffmpeg -i video-only.mp4 -i voiceover.mp3 -c:v copy -c:a aac -b:a 192k -shortest final.mp4
```

### 3. Add title card (2s) at the beginning
```bash
ffmpeg -i title-card.mp4 -i final.mp4 -filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1" with-title.mp4
```

### 4. Add background music at 20% volume
```bash
# Download royalty-free background music (see below), then:
ffmpeg -i with-title.mp4 -i background-music.mp3 \
  -filter_complex "[1:a]volume=0.2[music];[0:a][music]amix=inputs=2:duration=first" \
  -c:v copy -c:a aac -b:a 192k final-with-music.mp4
```

---

## Background Music Recommendations (Royalty-Free)

1. **"Digital Horizons" — Bensound** (bensound.com)
   - Genre: Upbeat corporate tech
   - URL: https://www.bensound.com/royalty-free-music/track/digital-horizons
   - License: Attribution required OR pay $49 for commercial

2. **"Happy Background" — Pixabay** (pixabay.com/music)
   - Genre: Upbeat educational, positive energy
   - URL: https://pixabay.com/music/search/educational%20upbeat/
   - License: Pixabay license (free for commercial use, no attribution needed)

3. **"Upbeat Corporate" — Mixkit** (mixkit.co)
   - Genre: Corporate tech demo feel
   - URL: https://mixkit.co/free-stock-music/upbeat/
   - License: Free (Mixkit License — no attribution needed)

**Recommendation:** Mixkit — no attribution needed, perfect for hackathon demos.

---

## Notes
- Keep the demo pace calm and deliberate — judges are watching carefully
- Don't rush typing — let each word appear naturally
- Wait for AI responses to fully load before continuing
- The side-by-side (Both) view is the hero moment — linger on it
"""
    with open(path, "w") as f:
        f.write(content)
    print(f"📋 Recording instructions: {path}")

# ─── MAIN ─────────────────────────────────────────────────────────────────────

def main():
    print("🎬 QuestLearn Demo Video Generator — Finn")
    print("=" * 60)
    
    write_recording_instructions()
    generate_audio()
    generate_frames()
    assemble_video()
    
    print("\n" + "=" * 60)
    print("✅ DONE!")
    print(f"📹 Video: {OUTPUT}")
    print(f"📋 Instructions: {PROJECT}/scripts/RECORDING_INSTRUCTIONS.md")
    print()
    print("Next: Create PR with 'feat: Add CurricuLLM vs Cogniti side-by-side demo video'")

if __name__ == "__main__":
    main()
