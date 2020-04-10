## Script to find the total audio duration in the speech corpus

webm format in ./audio does not have headers with duration information
Run the following script to copy the stored audio to a format with duration information and find the total duration in HH:MM:SS format.

```
mkdir newaudio/
cd audio/
for f in *; do  ffmpeg -i $f  -acodec copy ../newaudio/$f ; done
cd ../newaudio/
for f in *; do  ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1  $f ; done | awk '{SUM += $1} END { printf "%d:%d:%d\n",SUM/3600,SUM%3600/60,SUM%60}'
```
