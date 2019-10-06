<template>
  <v-btn
    v-if="isSupported"
    class="vue-audio-recorder"
    :color="isRecording?'error':'success'"
    fab
    x-large
    @mousedown="startRecording"
    @mouseleave="stopRecording"
    @mouseup="stopRecording"
    @touchstart="startRecording"
    @touchend="stopRecording"
    @touchcancel="stopRecording"
  >
    <v-icon>mdi-microphone</v-icon>
  </v-btn>
</template>

<script>
import ElementMixin from "./mixins/ElementMixin";

const supportedTypes = ["audio/aac", "audio/ogg", "audio/wav", "audio/webm"];
export default {
  name: "VueRecordAudio",
  mixins: [ElementMixin],
  props: {
    mimeType: {
      type: String,
      default: "audio/webm",
      validator: v => supportedTypes.includes(v)
    }
  },
  data() {
    return {
      constraints: {
        audio: true,
        video: false
      }
    };
  }
};
</script>