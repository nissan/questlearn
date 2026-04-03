#!/usr/bin/env python3
"""
QuestLearn Demo — Narration + Merge Pipeline
Generates Kokoro TTS for each persona, stretches/compresses audio to match video duration,
then merges with ffmpeg.

Usage:
  python3 narrate_and_merge.py [--persona S1|S2|S3|T1|T2|all]

Output:
  tests/demo-recordings/final/<persona>-narrated.mp4
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
            ("QuestLearn. AI-powered learning designed for Australian high school students.", 0.6),
            ("Meet Zara. She's in Year 10 at Parramatta High School, and today she wants to understand photosynthesis.", 0.5),
            ("She opens QuestLearn and enters the desktop in seconds — no email, no password, no friction.", 0.6),
            ("From the desktop, she launches the QuestLearn app and picks her topic.", 0.5),
            ("She chooses Story format — because she learns best when ideas come alive through narrative.", 0.6),
            ("CurricuLLM generates a curriculum-aligned story in real time, matched to the Australian Curriculum v9.", 0.7),
            ("Then the Socratic tutor kicks in. It doesn't give her the answer — it asks the right question.", 0.6),
            ("Zara types her response. The AI reads it, encourages her, then pushes her thinking one step further.", 0.6),
            ("This is what deep engagement looks like. Not passive reading — active thinking.", 0.8),
        ],
    },

    'S2': {
        'video_dir': 'personas-S2-—-Kai-Nguyen-·-Newtons-Laws-·-Game-Demo',
        'voice': 'am_michael',  # confident male — works for Kai
        'script': [
            ("Meet Kai. Year 9, Blacktown Boys High School. He's competitive, he's fast, and he hates being bored.", 0.5),
            ("He picks Game format for Newton's Laws of Motion — because if there's a challenge, he's in.", 0.6),
            ("QuestLearn generates a choose-your-path scenario. Kai has to make a decision that depends on actually understanding the physics.", 0.6),
            ("He picks Option B. He's right — and he knows why.", 0.5),
            ("The Socratic tutor asks him to defend his answer. He does, in his own words.", 0.6),
            ("That's the moment. When a student explains a concept back — they've learned it.", 0.8),
        ],
    },

    'S3': {
        'video_dir': 'personas-S3-—-Priya-Sharma-·-Water-Cycle-·-Meme-Demo',
        'voice': 'af_sky',     # bright female — works for Priya
        'script': [
            ("Meet Priya. Year 8, Strathfield Girls High School.", 0.4),
            ("She picks Meme format for the Water Cycle — because she speaks in memes and that is completely valid.", 0.6),
            ("CurricuLLM generates a title line, a punchline, and a caption that explains exactly why the joke works.", 0.6),
            ("The concept is embedded in something she'll actually remember.", 0.5),
            ("When the tutor asks her to explain the water cycle in her own words, she nails it — in Gen Z.", 0.6),
            ("Five formats. Every learning style. Every student.", 0.9),
        ],
    },

    'T1': {
        'video_dir': 'personas-T1-—-Ms-Rachel-Chen-·-Teacher-Dashboard-Demo',
        'voice': 'af_nova',    # clear professional female — works for Ms Chen
        'script': [
            ("Now meet Ms. Rachel Chen. Science teacher, Parramatta High School.", 0.5),
            ("She logs into QuestLearn as a teacher and opens the Teacher Hub.", 0.6),
            ("What she sees is a real-time engagement heatmap. Every topic her students explored, every format they used — visualised.", 0.7),
            ("She can see immediately which topics have low engagement, and which formats her students actually connect with.", 0.6),
            ("This is insight a teacher usually has to wait until exam time to discover.", 0.6),
            ("With QuestLearn, she knows today.", 0.9),
        ],
    },

    'T2': {
        'video_dir': 'personas-T2-—-Mr-David-Okafor-·-Teacher-Dashboard-Demo',
        'voice': 'am_adam',    # warm authoritative male — works for Mr Okafor
        'script': [
            ("Mr. David Okafor teaches Mathematics at Blacktown Boys High School.", 0.5),
            ("He suspected his Year 9s respond best to game-format content. The heatmap confirms it.", 0.6),
            ("Deep engagement — students averaging more than four Socratic turns on Newton's Laws. Game format.", 0.6),
            ("He can use this to plan next week's lessons. Real data. Real decisions.", 0.7),
            ("QuestLearn doesn't just help students learn. It helps teachers teach.", 0.9),
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
        ['ffprobe', '-v', 'quiet', '-show_entries', 'format=duration',
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
