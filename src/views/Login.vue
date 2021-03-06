<template>
  <v-container fluid>
    <v-layout justify-center wrap class="my-4" align-center>
      <section>
        <v-btn class="ma-2" x-large @click="loginByGoogle">
          <v-icon color="primary">{{ mdiGoogle }}</v-icon
          >Login using Google
        </v-btn>
        <v-btn
          :disabled="emailSent"
          clas="ma-2"
          x-large
          @click="loginByEmailLink"
        >
          <v-icon color="accent">{{ mdiEmail }}</v-icon
          >Login using email link
        </v-btn>
        <p>
          <strong>Note</strong>
        </p>
        <p>
          By using this application you agree to release your contributions
          under
          <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC-BY-SA</a>
          license.
        </p>
        <p>You also agree to publish your name for attribution purposes.</p>
        <p>
          Check out the
          <a href="/faq">FAQ</a> page for more details.
        </p>
        <p>
          Curated collection of speech samples collected using this tool is now
          <a href="https://blog.smc.org.in/malayalam-speech-corpus/"
            >published as Malayalam Speech Corpus</a
          >
        </p>
        <p>
          <a href="/usage">ഞാൻ എന്താണ് ചെയ്യേണ്ടത്?</a>
        </p>
      </section>
    </v-layout>
    <v-overlay :value="isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-snackbar v-model="emailSent" color="success" top
      >An email with sign-in link has been sent to your email.</v-snackbar
    >
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
import { mdiGoogle, mdiEmail } from "@mdi/js";

export default {
  name: "Login",
  data() {
    return {
      mdiGoogle,
      mdiEmail,
      emailSent: false,
      isLoading: false
    };
  },
  created: function() {
    this.isLoading = true;

    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      var email = window.localStorage.getItem("MSCEmailForSignIn");
      if (email) {
        firebase.auth().signInWithEmailLink(email, window.location.href);
        // Clear email from storage.
        window.localStorage.removeItem("MSCEmailForSignIn");
      }
    }

    firebase.auth().onAuthStateChanged(user => {
      this.isLoading = false;
      if (user) {
        this.$router.replace("/record");
      }
    });
  },
  methods: {
    loginByGoogle() {
      firebase
        .auth()
        .signInWithRedirect(new firebase.auth.GoogleAuthProvider());
    },
    loginByEmailLink() {
      let email = window.localStorage.getItem("MSCEmailForSignIn");
      const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be whitelisted in the Firebase Console.
        url: window.location.href,
        handleCodeInApp: true
      };

      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation");
      }
      window.localStorage.setItem("MSCEmailForSignIn", email);
      firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);
      this.emailSent = true;
    }
  }
};
</script>
