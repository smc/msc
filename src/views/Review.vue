<template>
  <v-container fluid class="pa-0 ma-0">
    <template v-if="showError">
      Your browser doesn’t support audio recording or you’ve blocked microphone
      access.
    </template>
    <v-flex xs12 lg12>
      <v-carousel progress show-arrows hide-delimiters v-model="speechIndex">
        <v-carousel-item
          v-for="(speech, id) in speeches"
          :key="`carousel-${id}`"
          height="60vh"
        >
          <v-sheet tile min-width="100%" min-height="100%">
            <v-row align="center" justify="center" class="py-2">
              <h2 lang="ml" class="title text-center">{{ sentence }}</h2>
            </v-row>
            <v-row align="end" justify="center" class="py-1">
              <audio :src="speech.sample" controls />
            </v-row>
            <v-row align="center" justify="center" class="py-10">
              <v-btn
                fab
                x-large
                @click="vote(-1)"
                class="mx-6"
                :disabled="voted"
              >
                <v-icon color="error">{{ mdiThumbDown }}</v-icon>
              </v-btn>
              <v-btn fab x-large @click="vote(1)" :disabled="voted">
                <v-icon color="success">{{ mdiThumbUp }}</v-icon>
              </v-btn>
            </v-row>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import { db } from "../plugins/db";
import { mdiThumbUp, mdiThumbDown } from "@mdi/js";

export default {
  name: "Review",
  data: () => ({
    mdiThumbUp,
    mdiThumbDown,
    speech: null,
    sentence: null,
    speeches: [],
    progress: 0,
    speechIndex: 0,
    voted: false,
    showError: false
  }),
  computed: {
    userId() {
      return firebase.auth().currentUser.uid;
    },
    currentSpeech() {
      return this.speeches[this.speechIndex];
    }
  },
  watch: {
    speechIndex: function() {
      console.log(`Current speech: ${this.speechIndex}`);
      this.fetchSentence();
      this.voted = false;
    }
  },
  created: function() {
    this.fetch();
  },
  methods: {
    fetch() {
      db.collection("speech")
        .where("vote", "<", 3)
        .where("vote", ">", -3)
        .limit(100)
        .get()
        .then(snapshot => {
          let speeches = [];
          snapshot.forEach(doc => {
            const speech = doc.data();
            if (speech.user === this.userId) return;
            if (speech.vote >= 3) return;
            if (speech.vote <= -3) return;
            speech["id"] = doc.id;
            speeches.push(speech);
          });
          this.speeches = speeches;
          this.speechIndex = Math.floor(Math.random() * this.speeches.length);
        });
    },
    handleError() {
      this.showError = true;
    },
    fetchSentence() {
      if (!this.currentSpeech) return;
      const sentenceDoc = db
        .collection("sentences")
        .doc(this.currentSpeech.sentence);
      sentenceDoc.get().then(snapshot => {
        this.sentence = snapshot.data().sentence;
      });
    },
    vote: function(vote) {
      console.log(`Voting ${this.currentSpeech.id} ${vote}`);
      this.voted = true;
      db.collection("speech")
        .doc(this.currentSpeech.id)
        .set(
          {
            vote: (this.currentSpeech.vote || 0) + vote
          },
          { merge: true }
        );
      this.speechIndex++;
    }
  }
};
</script>
