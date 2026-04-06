# 🎞️ QuestLearn Demo — Editing Guide
### CurricuLLM vs Cogniti Side-by-Side Demo

**Tools:** FFmpeg (installed at `/opt/homebrew/bin/ffmpeg`)

---

## File Locations

```
VOICEOVER:    /Users/loki/projects/questlearn/VOICEOVER-curricullm-vs-cogniti.mp3
SCREEN RAW:   /Users/loki/projects/questlearn/scripts/_video_work/screen-raw.mp4
WORK DIR:     /Users/loki/projects/questlearn/scripts/_video_work/
OUTPUT:       /Users/loki/projects/questlearn/public/showcase/questlearn-curricullm-vs-cogniti-demo.mp4
```

---

## Step 1 — Create Title Card (2 seconds)

```bash
ffmpeg -f lavfi -i color=c=0x1a1a2e:s=1920x1080:r=30 \
  -vf "drawtext=text='CurricuLLM vs Cogniti':fontcolor=white:fontsize=72:x=(w-text_w)/2:y=(h-text_h)/2-60:font=Arial:fontweight=bold, \
       drawtext=text='Two Socratic Tutors. One Learning Platform.':fontcolor=0xaaaaff:fontsize=36:x=(w-text_w)/2:y=(h-text_h)/2+40:font=Arial" \
  -t 2 \
  /Users/loki/projects/questlearn/scripts/_video_work/seg00_title.mp4 -y
```

---

## Step 2 — Create Closing Card (2 seconds)

```bash
ffmpeg -f lavfi -i color=c=0x1a1a2e:s=1920x1080:r=30 \
  -vf "drawtext=text='Learn more:':fontcolor=0xaaaaff:fontsize=40:x=(w-text_w)/2:y=(h-text_h)/2-50:font=Arial, \
       drawtext=text='questlearn-nu.vercel.app':fontcolor=white:fontsize=56:x=(w-text_w)/2:y=(h-text_h)/2+20:font=Arial:fontweight=bold" \
  -t 2 \
  /Users/loki/projects/questlearn/scripts/_video_work/seg99_closing.mp4 -y
```

---

## Step 3 — Normalize Voiceover Audio

```bash
ffmpeg -i /Users/loki/projects/questlearn/VOICEOVER-curricullm-vs-cogniti.mp3 \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" \
  /Users/loki/projects/questlearn/scripts/_video_work/audio/voiceover_normalized.mp3 -y
```

---

## Step 4 — (Optional) Add Background Music

Download royalty-free music from one of these sources:
- **Pixabay Music:** https://pixabay.com/music/search/upbeat%20learning/
- **Free Music Archive:** https://freemusicarchive.org (CC licensed)
- **Bensound:** https://www.bensound.com (attribution required)

Recommended tracks: "upbeat", "education", "positive", ~130 BPM

```bash
# Mix voiceover at 100% + background music at 20%
# Replace 'background.mp3' with your downloaded track
ffmpeg -i /Users/loki/projects/questlearn/scripts/_video_work/audio/voiceover_normalized.mp3 \
  -i /path/to/background.mp3 \
  -filter_complex "[1:a]volume=0.20,afade=t=in:d=2,afade=t=out:st=130:d=3[bg]; \
                   [0:a][bg]amix=inputs=2:duration=shortest[aout]" \
  -map "[aout]" \
  -c:a libmp3lame -q:a 2 \
  /Users/loki/projects/questlearn/scripts/_video_work/audio/final_audio.mp3 -y

# Without background music (use this if skipping music):
cp /Users/loki/projects/questlearn/scripts/_video_work/audio/voiceover_normalized.mp3 \
   /Users/loki/projects/questlearn/scripts/_video_work/audio/final_audio.mp3
```

---

## Step 5 — Assemble Full Video from Screen Recording

**Once you have the raw screen recording saved:**

```bash
WORKDIR="/Users/loki/projects/questlearn/scripts/_video_work"
SCREEN_RAW="$WORKDIR/screen-raw.mp4"  # your screen recording
AUDIO="$WORKDIR/audio/final_audio.mp3"  # or voiceover_normalized.mp3

# Concatenate: title card + screen recording + closing card
cat > "$WORKDIR/final_concat.txt" << 'EOF'
file 'seg00_title.mp4'
file 'screen-raw.mp4'
file 'seg99_closing.mp4'
EOF

# Concat video only first (re-encode for compatibility)
ffmpeg -f concat -safe 0 -i "$WORKDIR/final_concat.txt" \
  -c:v libx264 -preset medium -crf 20 \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
  -r 30 -an \
  "$WORKDIR/video_only.mp4" -y

# Add audio (voiceover, offset by 2s for title card)
ffmpeg -i "$WORKDIR/video_only.mp4" \
  -itsoffset 2 -i "$AUDIO" \
  -c:v copy \
  -c:a aac -b:a 192k \
  -shortest \
  /Users/loki/projects/questlearn/public/showcase/questlearn-curricullm-vs-cogniti-demo.mp4 -y
```

---

## Step 6 — Quick Sync Check (without full re-encode)

If you just need to attach the voiceover to the existing demo video:

```bash
ffmpeg \
  -i /Users/loki/projects/questlearn/public/showcase/questlearn-curricullm-vs-cogniti-demo.mp4 \
  -i /Users/loki/projects/questlearn/VOICEOVER-curricullm-vs-cogniti.mp3 \
  -c:v copy -c:a aac -b:a 192k -shortest \
  /tmp/questlearn-demo-synced.mp4 -y
# Then review and copy to showcase if happy
```

---

## Export Settings Reference

| Setting | Value |
|---------|-------|
| Video codec | H.264 (libx264) |
| Resolution | 1920×1080 |
| Frame rate | 30fps |
| CRF (quality) | 20 (high quality, ~0.5–2 MB/min) |
| Audio codec | AAC |
| Audio bitrate | 192k |
| Preset | medium |

**Quick quality check:**
```bash
ffprobe -v quiet -print_format json -show_streams \
  /Users/loki/projects/questlearn/public/showcase/questlearn-curricullm-vs-cogniti-demo.mp4 \
  | python3 -c "import sys,json; d=json.load(sys.stdin); [print(s['codec_type'],s.get('codec_name'),s.get('width',''),s.get('height','')) for s in d['streams']]"
```

---

## 🎵 Royalty-Free Music Recommendations

| Source | Track Style | License |
|--------|------------|---------|
| https://pixabay.com/music/ | Search "educational upbeat" | Free, no attribution |
| https://www.bensound.com/royalty-free-music | "Ukulele" or "Cute" | Free with attribution |
| https://freemusicarchive.org | Filter: Instrumental, Upbeat | CC licenses vary |
| https://incompetech.com | "Carefree" by Kevin MacLeod | CC-BY (free with credit) |

**Recommended:** "Life of Riley" by Kevin MacLeod (incompetech.com) — CC-BY, upbeat, educational feel.

---

*Generated by Finn (QuestLearn Video Production Agent)*
