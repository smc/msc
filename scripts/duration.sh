#!/usr/bin/env bash
AUDIO_DIR=${1:-'audio'}

find $AUDIO_DIR -maxdepth 1 -iname '*.webm' -exec ffprobe -v quiet -of csv=p=0 -show_entries format=duration {} \; | grep -w '\d*' | paste -sd+ -| bc
