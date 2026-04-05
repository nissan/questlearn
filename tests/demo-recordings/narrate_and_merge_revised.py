#!/usr/bin/env python3
"""
QuestLearn Demo — Narration + Merge Pipeline (REVISED 2026-04-04)
Generates Kokoro TTS for each persona, stretches/compresses audio to match video duration,
then merges with ffmpeg.

Usage:
  python3 narrate_and_merge_revised.py [--persona S1|S2|S3|T1|T2|all]

Output:
  tests/demo-recordings/final/<persona>-narrated.mp4

Changes from original (2026-04-04):
  - S1: Updated to reflect Topics tab flow, Cogniti tutor, Lumina OS desktop
  - S2: Updated to reflect teacher quest pinning → Ongoing Issues badge, second Socratic turn
  - S3: Updated to reflect two-LLM meme pipeline (CurricuLLM-AU + GPT-5.4-mini) and Topics tab
  - T1: Updated to reflect quest pinning flow and Lumina OS teacher view
  - T2: Updated to reflect Topics Browser in Teacher Hub and student activity view
"""

import argparse
import subprocess
import sys
import os
import numpy as np
import soundfile as sf
from pathlib import Path
from kokoro import KPipeline

VIDEOS_DIR = Path(__file__).parent / 'videos'
OUTPUT_DIR = Path(__file__).parent / 'final'
OUTPUT_DIR.mkdir(exist_ok=True)

SAMPLE_RATE = 24000

# ─────────────────────────────────────────────────────────────────────────────
# NARRATION SCRIPTS
# Each entry: list of (text, pause_after_seconds) tuples
# Pause values create natural breathing room between sentences
# Total spoken time is automatically stretched/compressed to fit the video
# ─────────────────────────────────────────────────────────────────────────────

NARRATIONS = {

    'S1': {
        'video_dir': 'personas-S1-—-Zara-Osei-·-Photosynthesis-·-Story-Demo',
        'voice': 'af_heart',   # warm female — works for Zara
        'script': [
            ("QuestLearn — personalised AI learning for every Australian high school student.", 0.5),
            ("Meet Zara Osei. Year 10, Parramatta High School. Today she's tackling photosynthesis.", 0.6),
            ("It's her first visit, so QuestLearn shows her a quick setup — name, year, and school.", 0.5),
            ("Then she's straight into Lumina OS. No detours, no menus — QuestLearn opens right on her desktop.", 0.7),
            ("She spots photosynthesis trending in the Topics tab and clicks Learn — topic and Story format pre-loaded.", 0.6),
            ("CurricuLLM generates a curriculum-aligned story in real time, matched to the Australian Curriculum v9.", 0.7),
            ("The story unfolds with characters and conflict — but every beat anchors a real science concept.", 0.6),
            ("Zara types her reflection. The Cogniti tutor reads it, then asks: what's actually happening inside the chloroplast?", 0.6),
            ("That one question turns passive reading into active thinking. That's the difference.", 0.9),
        ],
    },

    'S2': {
        'video_dir': 'personas-S2-—-Kai-Nguyen-·-Newtons-Laws-·-Game-Demo',
        'voice': 'am_michael',  # confident male — works for Kai
        'script': [
            ("Meet Kai Nguyen. Year 9, Blacktown Boys High School. Competitive, quick, and easily bored.", 0.5),
            ("When Kai logs in today, there's already something waiting in his Ongoing Issues.", 0.5),
            ("His teacher, Mr. Okafor, has pinned a quest on Newton's Laws. The badge says Assigned by Teacher.", 0.6),
            ("Kai clicks Start Quest. QuestLearn drops him straight into Game format — because Mr. Okafor knows his class.", 0.6),
            ("The scenario: a skateboarder hits a wall. What happens next? Kai has to choose — and justify his answer.", 0.6),
            ("He picks Option B, then defends it in the chat: an object in motion stays in motion unless a force acts on it.", 0.6),
            ("The tutor pushes back. What kind of force? How much? Kai fires back. And again.", 0.6),
            ("Four Socratic turns. Every one of them building real understanding.", 0.5),
            ("Mr. Okafor will see exactly this on the heatmap tomorrow morning.", 0.9),
        ],
    },

    'S3': {
        'video_dir': 'personas-S3-—-Priya-Sharma-·-Water-Cycle-·-Meme-Demo',
        'voice': 'af_sky',     # bright female — works for Priya
        'script': [
            ("Meet Priya Sharma. Year 8, Strathfield Girls High School. She communicates entirely in memes. That's a skill.", 0.5),
            ("She opens the Topics tab and sees The Water Cycle trending in her grade.", 0.5),
            ("She clicks Learn — and QuestLearn pre-selects Meme format. Because it knows her.", 0.7),
            ("Here's what's happening under the hood.", 0.3),
            ("CurricuLLM-AU generates the curriculum fact — evaporation, condensation, precipitation — anchored to the Australian Curriculum.", 0.6),
            ("Then GPT-5.4-mini reads that content, picks the perfect template from a library of one hundred classic memes, and writes the joke.", 0.7),
            ("Two AIs. One curriculum-aligned meme.", 0.5),
            ("Priya laughs. She also just learned how evaporation works.", 0.5),
            ("She switches to the Cogniti tutor and explains the full water cycle back in her own words — in Gen Z, but entirely correct.", 0.6),
            ("Five formats. Every learning style. Every student.", 0.9),
        ],
    },

    'T1': {
        'video_dir': 'personas-T1-—-Ms-Rachel-Chen-·-Teacher-Dashboard-Demo',
        'voice': 'af_nova',    # clear professional female — works for Ms Chen
        'script': [
            ("Now let's look at what QuestLearn means for the teacher.", 0.5),
            ("This is Ms. Rachel Chen. Science teacher, Parramatta High School.", 0.5),
            ("She logs in as a teacher and her Teacher Hub opens immediately — Lumina OS surfaces the right window for the right role.", 0.7),
            ("The engagement heatmap shows every topic her students explored this week, and which formats they used.", 0.6),
            ("She can see that photosynthesis has lower engagement in Story format, and much stronger engagement in Meme.", 0.6),
            ("So she creates a quest — a deeper dive on photosynthesis — and pins it to her Year 10 class.", 0.6),
            ("The moment she pins it, every student in that class sees it in their Ongoing Issues, with a badge that says Assigned by Teacher.", 0.7),
            ("This is a teacher directing learning at scale. No printouts. No emails. No chasing students up.", 0.6),
            ("Real-time insight. Instant action. That's QuestLearn for teachers.", 0.9),
        ],
    },

    'T2': {
        'video_dir': 'personas-T2-—-Mr-David-Okafor-·-Teacher-Dashboard-Demo',
        'voice': 'am_adam',    # warm authoritative male — works for Mr Okafor
        'script': [
            ("Mr. David Okafor. Mathematics teacher, Blacktown Boys High School.", 0.5),
            ("He had a strong hunch his Year 9 class responds best to game-format content. The heatmap confirms it.", 0.6),
            ("Average engagement: four-plus Socratic turns on Newton's Laws, Game format. That's deep thinking.", 0.6),
            ("He opens the Topics Browser to see what's trending across his school this week.", 0.5),
            ("Newton's Laws is at the top. He pins it as a class quest — knowing every student will see it the moment they log in.", 0.7),
            ("He can also see which students haven't started yet, and flag them for a check-in.", 0.6),
            ("This used to take a stack of quiz papers and a week to mark. Now it's live, visual, and actionable.", 0.6),
            ("QuestLearn doesn't just help students learn. It helps teachers teach smarter.", 0.9),
        ],
    },

}

# ─────────────────────────────────────────────────────────────────────────────
# TTS + MERGE
# ─────────────────────────────────────────────────────────────────────────────

def generate_narration(persona_key: str, pipeline: KPipeline) -> tuple[np.ndarray, float]:
    """Generate full narration audio for a persona. Returns (audio_array, duration_seconds)."""
    config = NARRATIONS[persona_key]
    chunks = []
    silence_sample = np.zeros(int(SAMPLE_RATE * 0.05))  # 50ms between sentences baseline

    for text, pause_after in config['script']:
        print(f"  TTS: {text[:60]}...")
        generator = pipeline(text, voice=config['voice'])
        sentence_audio = []
        for _, _, audio in generator:
            sentence_audio.append(audio)
        if sentence_audio:
            chunks.append(np.concatenate(sentence_audio))
        # Add pause after sentence
        if pause_after > 0:
            chunks.append(np.zeros(int(SAMPLE_RATE * pause_after)))
        chunks.append(silence_sample)

    full_audio = np.concatenate(chunks)
    duration = len(full_audio) / SAMPLE_RATE
    return full_audio, duration


def stretch_audio_to_fit(audio: np.ndarray, target_duration: float, audio_duration: float) -> str:
    """Write audio to temp wav, use ffmpeg atempo to stretch/compress to target duration."""
    tmp_in = '/tmp/narration_raw.wav'
    tmp_out = '/tmp/narration_stretched.wav'
    sf.write(tmp_in, audio, SAMPLE_RATE)

    ratio = audio_duration / target_duration  # >1 = need to slow down, <1 = need to speed up
    ratio = max(0.5, min(2.0, ratio))  # ffmpeg atempo clamps to 0.5–2.0

    print(f"  Stretching audio: {audio_duration:.1f}s → {target_duration:.1f}s (atempo={ratio:.3f})")

    # Chain atempo filters if ratio is outside 0.5–2.0 range (not needed here but safe)
    if ratio <= 2.0 and ratio >= 0.5:
        atempo = f"atempo={ratio:.4f}"
    elif ratio > 2.0:
        atempo = f"atempo=2.0,atempo={ratio/2.0:.4f}"
    else:
        atempo = f"atempo=0.5,atempo={ratio*2.0:.4f}"

    cmd = [
        'ffmpeg', '-y', '-i', tmp_in,
        '-filter:a', atempo,
        tmp_out
    ]
    subprocess.run(cmd, capture_output=True, check=True)
    return tmp_out


def get_video_duration(video_path: str) -> float:
    result = subprocess.run(
        ['ffprobe', '-v', 'quiet', '--show_entries', 'format=duration',
         '-of', 'csv=p=0', video_path],
        capture_output=True, text=True
    )
    return float(result.stdout.strip())


def merge_audio_video(video_path: str, audio_path: str, output_path: str, video_duration: float):
    """Merge narration audio over video. Audio is padded with silence if shorter than video."""
    print(f"  Merging → {output_path}")
    cmd = [
        'ffmpeg', '-y',
        '-i', video_path,
        '-i', audio_path,
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '22',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-shortest',           # end at shorter of video/audio
        '-t', str(video_duration),  # clamp to video duration
        output_path
    ]
    subprocess.run(cmd, capture_output=True, check=True)


def process_persona(persona_key: str, pipeline: KPipeline):
    config = NARRATIONS[persona_key]
    video_path = str(VIDEOS_DIR / config['video_dir'] / 'video.webm')
    output_path = str(OUTPUT_DIR / f'{persona_key}-narrated.mp4')

    if not Path(video_path).exists():
        print(f"  ⚠️  Video not found: {video_path}")
        return

    print(f"\n{'─'*60}")
    print(f"Processing {persona_key}...")
    print(f"  Video: {video_path}")

    video_duration = get_video_duration(video_path)
    print(f"  Video duration: {video_duration:.1f}s")

    # Generate TTS
    audio, audio_duration = generate_narration(persona_key, pipeline)
    print(f"  Narration duration: {audio_duration:.1f}s")

    # Stretch audio to fit video
    stretched_audio_path = stretch_audio_to_fit(audio, video_duration, audio_duration)

    # Merge
    merge_audio_video(video_path, stretched_audio_path, output_path, video_duration)

    size = Path(output_path).stat().st_size / 1024 / 1024
    print(f"  ✅ Done → {output_path} ({size:.1f} MB)")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--persona', default='all', choices=['S1', 'S2', 'S3', 'T1', 'T2', 'all'])
    args = parser.parse_args()

    print("Initialising Kokoro TTS pipeline...")
    pipeline = KPipeline(lang_code='a')

    personas = list(NARRATIONS.keys()) if args.persona == 'all' else [args.persona]

    for key in personas:
        try:
            process_persona(key, pipeline)
        except Exception as e:
            print(f"  ❌ {key} failed: {e}")
            import traceback; traceback.print_exc()

    print(f"\n{'─'*60}")
    print(f"All done. Final videos in: {OUTPUT_DIR}")
    for f in sorted(OUTPUT_DIR.glob('*.mp4')):
        size = f.stat().st_size / 1024 / 1024
        print(f"  {f.name} ({size:.1f} MB)")


if __name__ == '__main__':
    main()
