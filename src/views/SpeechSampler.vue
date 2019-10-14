<template>
  <v-container fluid class="pa-0 ma-0">
    <v-flex xs12 lg12>
      <v-carousel show-arrows v-model="sentenceIndex">
        <v-carousel-item
          v-for="(item, id) in sentences"
          :key="`carousel-${id}`"
        >
          <v-sheet height="100%" tile>
            <v-row align="center" justify="center" class="py-10">
              <v-card-title>{{ item.sentence }}</v-card-title>
            </v-row>
            <v-row align="center" justify="center" class="py-10">
              <audio-recorder
                :mode="$vuetify.breakpoint.mdAndUp ? 'press' : 'hold'"
                @stream="onStream"
                @result="onResult"
              />
            </v-row>

            <v-row align="end" justify="center" class="py-10">
              <v-card-actions v-if="recording">
                <audio :src="recording.sample" controls />
                <v-btn icon @click="removeRecord(index)" class="button is-dark">
                  <v-icon>{{ mdiDelete }}</v-icon>
                </v-btn>
              </v-card-actions>
            </v-row>
            <v-progress-linear v-if="uploading" :value="progress" />
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import { db, storage } from "../plugins/db";
import AudioRecorder from "../components/AudioRecorder";
import { mdiDelete } from "@mdi/js";

const metadata = {
  contentType: "audio/webm"
};

export default {
  data: () => ({
    mdiDelete,
    recording: null,
    sentenceIndex: 0,
    sentences: [],
    speech: {},
    progress: 0,
    uploading: false
  }),
  components: {
    AudioRecorder
  },
  firestore: {
    sentences: db.collection("sentences")
  },
  watch: {
    sentenceIndex: function() {
      console.log("Current sentence", this.sentenceIndex);
      this.fetchRecording();
    }
  },
  methods: {
    removeRecord(index) {
      if (this.recording && this.recording.id) {
        const recordingRef = db.collection("speech").doc(this.recording.id);
        if (recordingRef) recordingRef.delete();
        const fileRef = storage.child(this.recording.fileName);
        if (fileRef) {
          fileRef.delete();
        }
      }
      this.recording = null;
    },
    fetchRecording() {
      this.recording = null;
      const currSentenceId = this.sentences[this.sentenceIndex].id;
      db.collection("speech")
        .where("sentence", "==", currSentenceId)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            console.log(doc.id, " => ", doc.data());
            this.recording = doc.data();
            this.recording["id"] = doc.id;
            console.log(this.recording);
          });
        })
        .catch(function(error) {
          console.log("Error getting documents: ", error);
        });
    },
    onStream(stream) {
      console.log("Got a stream object:", stream);
    },
    onResult(blobData) {
      this.removeRecord();
      this.recording = {
        sample: window.URL.createObjectURL(blobData)
      };
      this.persistFile(blobData);
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
    persistFile(blob) {
      const fileName = `audio/${this.uuid()}.webm`;
      const uploadTask = storage.child(fileName).put(blob, metadata);
      this.uploading = true;
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          this.progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + this.progress + "% done");
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING:
              console.log("Upload is running");
              break;
          }
        },
        error => {
          this.uploading = false;
          // Handle unsuccessful uploads
          console.error(error.message);
        },
        () => {
          this.uploading = false;
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            const newData = {
              sample: downloadURL,
              fileName,
              sentence: `${this.sentences[this.sentenceIndex].id}`,
              user: firebase.auth().currentUser.uid
            };
            this.recording = newData;
            db.collection("speech")
              .add(newData)
              .then(docRef => {
                this.recording = newData;
                this.recording["id"] = docRef.id;
              });
          });
        }
      );
    }
  }
};
</script>
