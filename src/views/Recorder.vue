<template>
  <v-container fluid class="pa-0 ma-0">
    <template v-if="showError">
      Your browser doesn’t support audio recording or you’ve blocked microphone
      access.
    </template>
    <v-flex xs12 lg12>
      <v-carousel
        progress
        show-arrows
        hide-delimiters
        v-model="sentenceIndex"
        height="60vh"
      >
        <v-carousel-item
          v-for="(item, id) in sentences"
          :key="`carousel-${id}`"
        >
          <v-sheet tile class="pa-2" min-width="100%" min-height="100%">
            <v-row align="center" justify="center">
              <h2 lang="ml" class="title text-center">{{ item.sentence }}</h2>
            </v-row>
            <v-row align="center" justify="center" class="py-10">
              <vue-dictaphone @stop="onRecordComplete($event)">
                <template
                  slot-scope="{ isRecording, startRecording, stopRecording }"
                >
                  <v-row align="center" justify="center" class="py-1">
                    <v-btn
                      class="vue-audio-recorder"
                      v-if="!isRecording"
                      color="success"
                      fab
                      x-large
                      @click="startRecording"
                    >
                      <v-icon>{{ mdiMicrophone }}</v-icon>
                    </v-btn>
                    <v-btn
                      v-else
                      class="vue-audio-recorder"
                      color="error"
                      fab
                      x-large
                      @click="stopRecording"
                    >
                      <v-icon>{{ mdiStop }}</v-icon>
                    </v-btn>
                  </v-row>
                  <v-row align="center" justify="center">
                    <vue-dictaphone-spectrum-analyser
                      v-if="isRecording"
                      fillStyle="#fff"
                      :width="$vuetify.breakpoint.smAndDown ? 300 : 500"
                    />
                  </v-row>
                </template>
              </vue-dictaphone>
            </v-row>

            <v-row
              v-if="recording"
              align="end"
              justify="center"
              class="py-1 mx-2"
            >
              <v-badge left overlap v-if="recording.vote" class="mx-2">
                <template v-slot:badge>{{ recording.vote }}</template>
                <v-icon>{{ mdiThumbUp }}</v-icon>
              </v-badge>
              <audio :src="recording.sample" controls />

              <v-btn fab @click="removeRecord(index)" class="mx-2">
                <v-icon color="error">{{ mdiDelete }}</v-icon>
              </v-btn>
            </v-row>
          </v-sheet>
          <v-progress-linear v-if="uploading" :value="progress" />
        </v-carousel-item>
      </v-carousel>
      <v-row align="center" justify="center"
        ><v-col cols="12" lg="10">
          <v-select
            :items="speechCategories"
            v-model="selectedCategory"
            item-text="title"
            item-value="key"
            label="Select category"
          ></v-select></v-col
      ></v-row>
    </v-flex>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import { db, storage } from "../plugins/db";
import { mdiDelete, mdiThumbUp, mdiMicrophone, mdiStop } from "@mdi/js";

const metadata = {
  contentType: "audio/webm"
};

export default {
  data: () => ({
    mdiDelete,
    mdiThumbUp,
    mdiStop,
    mdiMicrophone,
    recording: null,
    sentenceIndex: 0,
    sentences: [],
    speech: {},
    progress: 0,
    uploading: false,
    showError: false,
    selectedCategory: false,
    speechCategories: [
      { title: "Proverbs", key: "proverb" },
      { title: "Coversations", key: "conversation" }
    ]
  }),
  firestore() {
    return {
      sentences: db.collection("sentences")
    };
  },
  computed: {
    userId() {
      return firebase.auth().currentUser.uid;
    },
    currSentenceId() {
      return (
        this.sentences[this.sentenceIndex] &&
        this.sentences[this.sentenceIndex].id
      );
    }
  },
  watch: {
    sentenceIndex: function() {
      console.log(`Current sentence: ${this.sentenceIndex}`);
      if (this.sentenceIndex >= 0) {
        this.fetchRecording();
      }
    },
    sentences: function() {
      this.sentenceIndex = Math.floor(Math.random() * this.sentences.length);
      this.fetchRecording();
    },
    selectedCategory: function() {
      db.collection("sentences")
        .where("category", "==", this.selectedCategory)
        .get()
        .then(snapshot => {
          let sentences = [];
          snapshot.forEach(doc => {
            const sentence = doc.data();
            sentence["id"] = doc.id;
            sentences.push(sentence);
          });
          this.sentences = sentences;
        });
    }
  },
  methods: {
    handleError() {
      this.showError = true;
    },
    // Remove any existing recording for this user and this sentence.
    removeRecord() {
      if (this.recording && this.recording.id) {
        const recordingRef = db.collection("speech").doc(this.recording.id);
        if (recordingRef) {
          recordingRef.delete();
        }
        const fileRef = storage.child(this.recording.fileName);
        if (fileRef) {
          fileRef.delete();
        }
      }
      this.recording = null;
    },
    fetchRecording() {
      this.recording = null;
      if (!this.currSentenceId) return;
      db.collection("speech")
        .where("sentence", "==", this.currSentenceId)
        .where("user", "==", this.userId)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.recording = doc.data();
            this.recording["id"] = doc.id;
          });
        })
        .catch(error => {
          console.log(`Error getting documents: ${error}`);
        });
    },
    onRecordComplete({ blob, src }) {
      // Remove any existing recording for this user and this sentence.
      this.removeRecord();
      this.recording = {
        sample: src
      };
      this.persistFile(this.currSentenceId, blob);
    },
    uuid() {
      let dt = new Date().getTime();
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      });
    },
    // Upload the generated wav file to cloud storage.
    // https://firebase.google.com/docs/storage/web/upload-files
    persistFile(sentenceId, blob) {
      const fileName = `audio/${this.uuid()}.webm`;
      const uploadTask = storage.child(fileName).put(blob, metadata);
      this.uploading = true;
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        // Snapshot observer
        snapshot => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          this.progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log("Upload is " + this.progress + "% done");
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING:
              console.log("Upload is running");
              break;
          }
        },
        // Error handler
        error => {
          if (error) {
            this.uploading = false;
          }
          // Handle unsuccessful uploads
          console.error(error.message);
        },
        // Success handler
        () => {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.onUploadComplete(sentenceId, downloadURL, fileName);
          });
        }
      );
    },
    onUploadComplete: function(sentenceId, downloadURL, fileName) {
      const newRecording = {
        sample: downloadURL,
        fileName,
        sentence: sentenceId,
        user: this.userId,
        time: +new Date()
      };
      this.recording = newRecording;
      db.collection("speech")
        .add(this.recording)
        .then(docRef => {
          this.recording["id"] = docRef.id;
        });
      this.uploading = false;
    }
  }
};
</script>

<style>
audio {
  width: 150px;
}
</style>
