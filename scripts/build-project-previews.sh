#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 || $# -gt 4 ]]; then
  echo "usage: $0 <slug> <input-video-or-image> [start-seconds] [duration-seconds]" >&2
  exit 2
fi

slug=$1
input=$2
start=${3:-0}
duration=${4:-8}
root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
output_dir="$root/public/projects/previews"
mkdir -p "$output_dir"

if [[ ! -f "$input" ]]; then
  echo "input does not exist: $input" >&2
  exit 2
fi

case "$input" in
  *.png|*.jpg|*.jpeg|*.webp)
    ffmpeg -hide_banner -loglevel error -y \
      -loop 1 -i "$input" -t "$duration" \
      -vf "scale=960:540:force_original_aspect_ratio=increase,crop=960:540,zoompan=z='min(zoom+0.00045,1.055)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=960x540:fps=30,format=yuv420p" \
      -an -c:v libx264 -preset slow -crf 27 -maxrate 900k -bufsize 1800k -movflags +faststart \
      "$output_dir/$slug.mp4"
    ;;
  *)
    ffmpeg -hide_banner -loglevel error -y \
      -ss "$start" -i "$input" -t "$duration" \
      -vf "scale=960:540:force_original_aspect_ratio=decrease,pad=960:540:(ow-iw)/2:(oh-ih)/2:color=0x0f110f,fps=30,format=yuv420p" \
      -an -c:v libx264 -preset slow -crf 27 -maxrate 900k -bufsize 1800k -movflags +faststart \
      "$output_dir/$slug.mp4"
    ;;
esac

ffmpeg -hide_banner -loglevel error -y \
  -ss 0.8 -i "$output_dir/$slug.mp4" -frames:v 1 -c:v libwebp -quality 82 \
  "$output_dir/$slug.webp"

ffprobe -v error -select_streams v:0 \
  -show_entries stream=codec_name,pix_fmt,width,height,duration \
  -show_entries format=duration,size -of default=noprint_wrappers=1 \
  "$output_dir/$slug.mp4"
